---
sidebar_position: 1
---

# NeoOS Documentation

Welcome to the NeoOS operating system documentation.

## What is NeoOS?

A 64-bit x86_64 operating system kernel built from scratch in C and assembly.

- **Multicore capable** — SMP scheduling with work stealing
- **Real libc** — musl libc runs unmodified, linked statically
- **POSIX signals** — Full signal delivery and job control
- **Filesystems** — FAT16/32 with VFAT long names, ramfs, devfs
- **Network** — Loopback IPv4/UDP stack with AF_INET sockets
- **Thoroughly tested** — Every feature boots and logs results

## Quick Links

- [Getting Started](./getting-started) — Build and run NeoOS locally
- [Kernel Repository](https://github.com/NeoOSOrganization/neoos-kernel) — Source code
- [OS Builder](https://github.com/NeoOSOrganization/neoos-os-builder) — Assemble custom images
- [Porting Guide](./porting) — Add new applications

## Current Status

Fourteen milestones completed. Next: concurrency hardening, ASLR, BusyBox shell.

See the Roadmap for full details.