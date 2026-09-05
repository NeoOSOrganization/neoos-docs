---
sidebar_position: 7
title: ABI Compatibility
---

# ABI Compatibility

NeoOS's internals (data structures, calling conventions, syscall
*numbers*) are its own and free to change. Anything a user-mode program
can observe — struct layouts crossing the syscall boundary, flag and
constant values, semantics where an application could tell the
difference — is Linux-shaped, because the long-term goal is running
real Linux applications unmodified.

The authoritative, continuously-updated version of this document lives
in the kernel repo and is refreshed at the end of every milestone:

**[neoos-kernel/docs/abi-compatibility.md](https://github.com/NeoOSOrganization/neoos-kernel/blob/main/docs/abi-compatibility.md)**

It covers, as of the last refresh: what Linux ABI surface is
implemented, what's stubbed (present but not functional), what
deliberately diverges and why, and what a real ported application
would still hit.

Every deliberate divergence is also recorded, with its reason, in
[neoos-kernel/docs/stdlib.md](https://github.com/NeoOSOrganization/neoos-kernel/blob/main/docs/stdlib.md) —
an unrecorded divergence is treated as a bug, not a design choice.
