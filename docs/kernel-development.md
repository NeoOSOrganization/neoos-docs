---
sidebar_position: 3
title: Kernel Development
---

# Kernel Development

## Subsystem overview

| Directory | Subsystem |
|---|---|
| `kernel/sched/` | Scheduler — per-CPU runqueues, work stealing, thread/process tables |
| `kernel/mm/` | Memory management — physical frame allocator, paging, VMAs, heap |
| `kernel/fs/` | Filesystems — VFS, FAT16/32, devfs, ramfs, procfs, `embedfs` |
| `kernel/net/` | Network stack — Ethernet, ARP, ICMP, DHCP, DNS, TCP, sockets |
| `kernel/smp/` | Multi-core bring-up, per-CPU state, work-stealing selftest |
| `kernel/sync/` | Locking primitives, lock-rank checking, wait queues, poll |
| `kernel/ipc/` | Pipes, signals, futexes |
| `kernel/syscall/` | The syscall table and per-domain syscall implementations |
| `kernel/drivers/` | Video, input, block, char, IRQ, ACPI, PCI, virtio |
| `kernel/tty/` | Console, VT switching, PTY, the framebuffer terminal |
| `kernel/arch/` | CPU/GDT/IDT/TSS setup, per-CPU locals |

Each subsystem's design rationale lives in
`docs/superpowers/specs/` (dated design documents) and
`docs/superpowers/plans/` (the implementation plans that followed
them) in the kernel repo — read the spec for a subsystem before
changing it; the trade-offs it rejected are usually recorded there.

## Adding a syscall

1. Add the number to the shared header both musl's shim and libneoos
   agree on the number for — NeoOS's syscall numbers are its own, not
   Linux's (see [API Reference](./api-reference)).
2. Implement it in the relevant `kernel/syscall/sys_*.c` file and wire
   it into the syscall table (`kernel/syscall/syscall.c`).
3. Add a musl-visible path (a shim entry in
   `neoos-kernel/third_party/shim/`) or a `neoos-libneoos` wrapper —
   never leave a new syscall reachable only by raw number.
4. Update `neoos-kernel/docs/stdlib.md` — either documenting the new
   function, or, if it diverges from POSIX/Linux behavior, recording
   the divergence explicitly.
5. Add a regression test in
   [neoos-kernel-tests-common](https://github.com/NeoOSOrganization/neoos-kernel-tests-common)
   that exercises it from userland, and a manifest entry if it needs
   an inittab line and a pass/fail marker (see the
   [Porting Guide](./porting-guide) for the manifest format — the same
   mechanism ports use).

If the syscall is observable from user-mode at all (a struct crossing
the boundary, a new flag value), it must be Linux-shaped: field order,
sizes, and padding matching Linux's x86_64 layout, and flag/constant
values matching Linux's numbers — even though NeoOS's syscall
*numbers* are its own. The long-term goal is running real Linux
binaries unmodified; a struct layout a compiled application depends on
can't be retrofitted by a shim later.

## Adding a driver

Drivers live under `kernel/drivers/<category>/`. Follow the existing
pattern for your category (e.g. `kernel/drivers/net/virtio_net.c` for
a network device) — most drivers register against a small ops struct
(see `kernel/fs/vfs.h`'s `struct vfs_ops` for the filesystem
equivalent) so the rest of the kernel never branches on which specific
driver it's talking to.

## Running and debugging the regression suite

```bash
make test                                    # reduced, kernel-only
make EMBED_DIRS="../neoos-kernel-tests-common/build ../neoos-busybox/build" test  # full coverage
./tools/gauntlet.sh [N] [CONC]                # N runs, CONC concurrent, default 15/3
```

`gauntlet.sh` classifies a failing run as either **HARD** (a real bug —
lock-rank panic, fault, a known-bad signature — fails immediately, no
retry) or **FLAKY** (host-contention artifacts: emulated-ATA timeouts,
guest clock starvation under load — retried once, solo). A run that's
still failing after a solo retry is a real failure.

Useful when a run fails:

- The serial log (`build/serial.log` for a single `make test`,
  `build/gauntlet/pgauntlet.serial.run<N>` for a gauntlet run) has
  every subsystem's own diagnostic output.
- `KVM=1 make test` (or `KVM=1 ./tools/gauntlet.sh`) swaps TCG for
  hardware virtualization — 2x+ faster and gives true parallelism
  where TCG round-robins vCPUs, useful for reproducing scheduler races,
  but the gauntlet's flake signatures are tuned for the TCG default —
  use KVM to iterate, sign off against TCG.
- `DEBUG_HEAP=1 make test` builds a poisoned/redzone heap for chasing
  use-after-free and double-free.
