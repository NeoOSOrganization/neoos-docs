---
sidebar_position: 3
title: VFS & Filesystems
---

# VFS & Filesystems

One `struct vfs_ops` (`kernel/fs/vfs.h`) every filesystem driver
implements — `mount`, `lookup`, `read`, `write`, `create`, `readdir`,
and so on — so the rest of the kernel never branches on which specific
filesystem it's talking to. No op pointer is ever `NULL`: a driver that
can't perform an operation supplies a stub returning the correct errno
(`-EROFS`, `-ENOTDIR`, `-EPERM`) rather than leaving callers to guard
against a missing function pointer.

Five filesystems currently exist:

| Filesystem | Mounted at | Role |
|---|---|---|
| FAT16/32 | `/`, `/mnt` | Real, persistent storage — VFAT long names supported |
| devfs | `/dev` | Device nodes |
| ramfs | `/tmp` | In-memory scratch space (16KiB/file cap — see `RAMFS_MAX_PAGES`) |
| procfs | `/proc` | Synthetic, read-only process info |
| `embedfs` | `/bin`, `/sbin`, `/usr/tests` | Executables linked directly into the kernel image at build time — no real storage |

`embedfs` is the newest: it replaced FAT-disk delivery of every
executable, specifically so a test exercising the VFS/FAT layer itself
doesn't depend on that layer just to be *loaded*. See
`docs/superpowers/specs/2026-09-05-embedded-test-and-app-architecture.md`
in the kernel repo for the full design, and the
[Porting Guide](../porting-guide) for how a port or test gets embedded.

Design document for the original VFS milestone:
`2026-08-27-vfs-milestone-design.md` in
[neoos-kernel/docs/superpowers/specs/](https://github.com/NeoOSOrganization/neoos-kernel/tree/main/docs/superpowers/specs).
