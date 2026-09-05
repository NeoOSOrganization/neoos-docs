---
sidebar_position: 5
title: API Reference
---

# API Reference

NeoOS documents its extensions and Linux/POSIX divergences here; it
does not re-document the parts of musl or libneoos that behave exactly
as their upstream/POSIX contract says. Full API detail lives beside
the code it describes, to avoid drifting out of sync:

- **[neoos-kernel/docs/stdlib.md](https://github.com/NeoOSOrganization/neoos-kernel/blob/main/docs/stdlib.md)**
  — every header musl or libneoos exposes on NeoOS, and every point
  where NeoOS's behavior diverges from POSIX/Linux, with the reason.
  This is the source of truth for "does function X work, and if not
  exactly like Linux, how."
- **[neoos-kernel/docs/abi-compatibility.md](https://github.com/NeoOSOrganization/neoos-kernel/blob/main/docs/abi-compatibility.md)**
  — refreshed at the end of each milestone: what Linux ABI surface is
  implemented, what's stubbed, what diverges and why, and what a real
  ported application would still hit. See also this site's
  [ABI Compatibility](./abi-compatibility) page.

## Syscall numbers

NeoOS's syscall numbers are its own — never Linux's — and the shim in
`neoos-kernel/third_party/shim` is the ONE place that translates
between musl's Linux-numbered calls and NeoOS's. libneoos calls NeoOS's
numbers directly (no translation needed).

The numbers themselves are `#define`d in
[neoos-libneoos/src/syscall.c](https://github.com/NeoOSOrganization/neoos-libneoos/blob/main/src/syscall.c) —
linked here rather than copied, since that file *is* the definition,
and any table reproduced here would eventually drift from it.

## Two libc choices

| | [neoos-musl](https://github.com/NeoOSOrganization/neoos-musl) | [neoos-libneoos](https://github.com/NeoOSOrganization/neoos-libneoos) |
|---|---|---|
| Syscall numbers | Linux's, translated by the shim | NeoOS's own, direct |
| Surface | Full musl (most of POSIX) | Only what has no POSIX analogue, or is worth avoiding musl's overhead for |
| Used by | `login` (needs `crypt()`), BusyBox, the 3D ASCII viewer, most of the regression suite | `init`, `term`, `nsh` (boot-critical apps with no need for musl's surface) |
| ABI notes | Struct layouts/flag values match Linux exactly where observable | Its own ABI — internal to NeoOS, not required to match Linux |

Pick musl if your program needs real POSIX surface (`printf`, threads,
`crypt()`, anything from `string.h`); pick libneoos if you're writing
something NeoOS-native with no POSIX dependency and want a smaller,
simpler link.
