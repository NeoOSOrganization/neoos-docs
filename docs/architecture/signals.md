---
sidebar_position: 4
title: Signals
---

# Signals

Full POSIX signal delivery, including job control (`setpgid`,
`tcsetpgrp`-equivalent behavior via the PTY layer) and signal delivery
that survives a fault occurring **inside** a signal handler — a case
that's easy to get subtly wrong (the handler's own stack frame has to
be distinguishable from a genuine re-entrant fault).

Design document: `2026-08-27-signals-milestone-design.md` in
[neoos-kernel/docs/superpowers/specs/](https://github.com/NeoOSOrganization/neoos-kernel/tree/main/docs/superpowers/specs).

See [API Reference](../api-reference) and
[neoos-kernel/docs/stdlib.md](https://github.com/NeoOSOrganization/neoos-kernel/blob/main/docs/stdlib.md#signalh)
for `<signal.h>`'s exact surface and any divergence from Linux's
`sigaction`/`sigprocmask` semantics.
