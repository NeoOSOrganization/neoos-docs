---
sidebar_position: 4
title: Porting Guide
---

# Porting Guide

Worked from the two ports that actually exist —
[neoos-busybox](https://github.com/NeoOSOrganization/neoos-busybox) and
[neoos-3d-ascii-viewer](https://github.com/NeoOSOrganization/neoos-3d-ascii-viewer)
— including the mistakes made migrating them, so the next port doesn't
repeat them.

## Directory shape

```
neoos-myport/
├── upstream/           # pristine submodule, pinned to a specific commit
├── config/             # NeoOS-specific patches/config (or top-level, for a single file)
│   └── myport.test.json
├── Makefile
├── smoke-test.sh
└── README.md
```

`upstream/` is **never edited in place** — mirrors
`neoos-kernel/third_party/shim`'s pattern. Anything NeoOS-specific
(build flags, a config fragment, patches) lives beside it and is
applied at build time by an idempotent script.

## The build contract

```makefile
MUSL_DIR ?= ../neoos-musl/build-output

build/myport.nex: upstream/... user.ld
	@[ -f "$(MUSL_DIR)/lib/libc.a" ] || { echo "musl not found; build neoos-musl first" >&2; exit 1; }
	$(CC) -static -nostdlib -nostdinc -ffreestanding \
	    -mcmodel=large -fno-pic -mno-red-zone -fno-stack-protector -O2 \
	    -isystem $(MUSL_DIR)/include \
	    -T user.ld -z noexecstack \
	    -o $@ $(MUSL_DIR)/lib/crt1.o <your sources> \
	    -L$(MUSL_DIR)/lib -lc -lgcc
```

- `make` produces exactly one static `.nex` binary at
  `build/<portname>.nex`.
- `MUSL_DIR` points at an **installed** musl layout: `include/` (one
  flat directory — not the monorepo's uninstalled source tree, which
  needs separate `arch/x86_64`/`arch/generic`/`obj/include` search
  paths), `lib/libc.a`, `lib/crt1.o`.
- `-mcmodel=large -fno-pic -mno-red-zone` are not optional — every
  NeoOS program links at `0x200000000000`.
- You need your own copy of `user.ld` (the userland linker script) —
  don't assume a sibling kernel checkout exists.

## The manifest: `<name>.test.json`

Copied into `build/` alongside the binary at build time. This is how a
port's binary gets embedded into `neoos-kernel`'s image (`embedfs`) and,
if it participates in the boot-time regression suite, how its inittab
line and pass/fail marker get wired up — without `neoos-kernel` ever
needing to know your port by name.

```json
{
  "category": "bin",
  "boot_entries": [
    {"after": "thrdmany", "line": "wait /usr/tests/mytest.nex"}
  ],
  "required_markers": [
    "[mytest] ALL PASSED"
  ]
}
```

- `category`: `"bin"`, `"sbin"`, or `"tests"` — which `embedfs` mount
  (`/bin`, `/sbin`, `/usr/tests`) the binary lands under.
- `boot_entries` (optional): each has `line` (the literal inittab line)
  and `after` (the name — without `.nex` — of an already-placed
  inittab entry to insert immediately after). Entries in one manifest
  apply in array order, so a later entry can anchor onto an earlier one
  in the *same* manifest. Omit entirely for a port with no boot-time
  role (e.g. an interactive program like the 3D ASCII viewer).
- `required_markers` (optional): exact strings `grep -F`'d against the
  serial log. Omit if the port has no automated pass/fail check.

Then, to actually exercise it:

```bash
cd neoos-kernel
make EMBED_DIRS=../neoos-myport/build test
```

## Common pitfalls (found migrating BusyBox and the 3D ASCII viewer)

1. **Missing ABI flags.** An early draft of `neoos-musl`'s build script
   dropped `-mcmodel=large -fno-pic -mno-red-zone` entirely — it built
   without error but would have produced a libc no NeoOS binary could
   actually run against. If your port builds clean but crashes
   immediately on boot, check your flags against the ones above before
   anything else.
2. **Object-name collisions across `EMBED_DIRS`.** If two different
   `EMBED_DIRS` directories happen to contain a file with the same
   basename (this happened with `looper.nex`, needed both as a
   kernel-selftest dependency and as regression-suite background load),
   the embedding step must key its intermediate objects by the full
   source path, not just the filename — otherwise one silently
   clobbers the other's linked object, producing a confusing
   multiple-definition/undefined-reference error. `neoos-kernel`'s
   `tools/gen-embedfs.py` already handles this; if you're writing your
   own embed tooling, don't reintroduce the bug.
3. **Manifest anchors need something to anchor to.** `after` must name
   an inittab line that will actually exist when your manifest is
   applied — either a boot-critical entry (`term`, always present) or
   another manifest's entry, applied in the right `EMBED_DIRS` order
   (test-suite manifests before a port's, if the port anchors into the
   suite, the way BusyBox's `bbspike` anchors onto `thrdmany`).
4. **A kernel-internal selftest can hardcode a path to your binary.**
   `kernel/smp/smp_selftest.c` spawns `/usr/tests/looper.nex` directly,
   with no inittab involved — that marker fails with a confusing
   "MISSING" (not "FAILED") result if `looper.nex` isn't embedded,
   because the check function itself never runs to completion before
   boot powers off. If a `CORE_REQUIRED_MARKERS` entry needs a specific
   binary, that binary has to be boot-critical (always embedded), not
   optional test-suite content.

## Smoke testing

`make smoke-test` should be runnable on the **host**, with no NeoOS to
boot — verify the artifact's shape (a statically-linked ELF64
executable), not its behavior:

```bash
#!/bin/bash
set -e
BIN="${1:-build/myport.nex}"
python3 - "$BIN" <<'EOF'
import sys
with open(sys.argv[1], "rb") as f:
    data = f.read(20)
assert data[1:4] == b"ELF" and data[4] == 2
assert int.from_bytes(data[16:18], "little") == 2
print("smoke-test: OK")
EOF
```

Full interactive/behavioral validation happens inside a real NeoOS
boot, via `neoos-kernel`'s regression harness (`make test` with your
`EMBED_DIRS` and a `required_markers` entry) — this repo has no NeoOS
to boot on its own.
