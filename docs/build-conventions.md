---
sidebar_position: 8
title: Build Conventions
---

# Build Conventions

Every repo in the organization follows the same shape, so
`neoos-os-builder` (or a developer) can orchestrate them without
special-casing any one of them.

## Kernel (`neoos-kernel`)

```makefile
make                                # build/kernel.elf
make iso                            # build/neoos.iso
make disk-image                     # build/disk.img, build/disk2.img
make test                           # regression suite, headless QEMU
make run                            # interactive QEMU boot
make clean-kernel                   # remove build/*.o (NOT build/embedfs-obj/)
```

Environment variables: `LIBNEOOS_DIR`, `MUSL_DIR` (both default to
`../neoos-libneoos/build-output` / `../neoos-musl/build-output`),
`EMBED_DIRS` (space-separated list of directories to embed — optional,
empty by default).

## musl / libneoos build-output contract

Both produce an installed layout other repos link against:

```
build-output/
├── include/       # flat -- no separate arch subdirectories
└── lib/
    ├── libc.a      (musl) or libneoos.a (libneoos)
    └── crt1.o      (musl only -- libneoos uses crt0.o instead)
```

`neoos-musl` additionally needs `KERNEL_SHIM_DIR` pointing at
`neoos-kernel/third_party/shim` (the translation-only shim between
musl's Linux syscall numbers and NeoOS's own). `neoos-libneoos` needs
nothing from the kernel repo — its syscall numbers are NeoOS's own,
`#define`d directly in its own source.

## Port / test-suite repo contract

```makefile
make MUSL_DIR=../neoos-musl/build-output       # -> build/<name>.nex
make clean
make smoke-test                                 # host-side shape check
```

- Exactly one static `.nex` binary per port, statically linked.
- A `<name>.test.json` manifest copied into `build/` alongside it (see
  the [Porting Guide](./porting-guide) for its format) — this is how
  `neoos-kernel`'s `EMBED_DIRS` mechanism discovers what to embed and
  how to wire it into the boot-time regression suite.
- `neoos-kernel-tests-common` follows the same output contract, just
  with ~65 binaries instead of one, plus one shared
  `tests.manifest.json` bundle instead of many individual manifests.

## CI pattern

Every repo's CI clones its dependencies at a pinned/`main` ref, builds
them in order, then builds and (for the kernel) tests itself — mirroring
exactly the manual sequence in [Getting Started](./getting-started).
GitHub-hosted runners have no KVM, so `neoos-kernel`'s CI runs QEMU
under TCG emulation and takes noticeably longer than a local `KVM=1`
run.
