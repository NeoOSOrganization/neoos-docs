---
sidebar_position: 1
---

# NeoOS Documentation

Welcome to the NeoOS operating system documentation.

## What is NeoOS?

A 64-bit x86_64 operating system kernel built from scratch in C and assembly.

- **Multicore capable** — SMP scheduling with work stealing
- **Two libc choices** — [musl](https://musl.libc.org/) runs unmodified via a translation-only syscall shim, or link [libneoos](https://github.com/NeoOSOrganization/neoos-libneoos) for NeoOS's own native ABI
- **POSIX signals** — Full signal delivery and job control
- **Filesystems** — FAT16/32 with VFAT long names, ramfs, devfs, procfs, and `embedfs` (executables linked directly into the kernel image)
- **Network** — Ethernet/ARP/ICMP/DHCP/DNS/TCP stack, verified against a real host
- **Thoroughly tested** — ~65 regression tests and BusyBox boot every change, verified by booting in QEMU and reading the serial log

## Organization

NeoOS is split across 8 repositories, each independently buildable:

| Repo | Role |
|---|---|
| [neoos-kernel](https://github.com/NeoOSOrganization/neoos-kernel) | The kernel, plus boot-critical apps (init/login/term/nsh) |
| [neoos-musl](https://github.com/NeoOSOrganization/neoos-musl) | musl libc with the NeoOS syscall shim |
| [neoos-libneoos](https://github.com/NeoOSOrganization/neoos-libneoos) | NeoOS-native libc alternative to musl |
| [neoos-kernel-tests-common](https://github.com/NeoOSOrganization/neoos-kernel-tests-common) | The ~65-program regression suite |
| [neoos-busybox](https://github.com/NeoOSOrganization/neoos-busybox) | BusyBox port |
| [neoos-3d-ascii-viewer](https://github.com/NeoOSOrganization/neoos-3d-ascii-viewer) | 3D ASCII viewer port |
| [neoos-os-builder](https://github.com/NeoOSOrganization/neoos-os-builder) | Assembles a bootable image from the above |
| neoos-docs | This site |

See the [Port Catalog](./port-catalog) for what's built and the
[Build Conventions](./build-conventions) page for the contract every
repo follows.

## Quick Links

- [Getting Started](./getting-started) — Build and run NeoOS locally
- [Porting Guide](./porting-guide) — Add a new application, worked from the BusyBox and 3D ASCII viewer ports
- [Kernel Development](./kernel-development) — Subsystem overview, adding a syscall, running the regression suite
- [Architecture](./architecture/scheduler) — Scheduler, memory, VFS, signals
- [ABI Compatibility](./abi-compatibility) — What Linux ABI surface is implemented, stubbed, or diverges

## Current Status

The kernel has SMP, a full network stack (Ethernet through TCP), and
boots BusyBox and a ~65-program regression suite from binaries linked
directly into the kernel image (`embedfs`) rather than a FAT disk. The
project recently finished splitting from a single monorepo into this
8-repository organization — see each repo's README for its standalone
build contract.
