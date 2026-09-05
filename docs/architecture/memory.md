---
sidebar_position: 2
title: Memory Management
---

# Memory Management

A physical frame allocator, x86_64 paging, per-process VMAs (virtual
memory areas) for `mmap`/`munmap`/`mprotect`, and a kernel heap —
built in that order, because an address-space manager has to exist
before anything can `malloc`.

W^X (write-xor-execute) is enforced: a mapping is never simultaneously
writable and executable. `kernel/mm/wxorx_selftest.c`'s
`[wxorx] kernel selftest passed` marker verifies this holds.

Design document: `2026-08-26-memory-management-design.md` in
[neoos-kernel/docs/superpowers/specs/](https://github.com/NeoOSOrganization/neoos-kernel/tree/main/docs/superpowers/specs).

See also [ABI Compatibility](../abi-compatibility) for `mmap`/`mprotect`
flag values and where NeoOS's memory-management ABI diverges from Linux.
