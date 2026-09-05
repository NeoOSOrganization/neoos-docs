---
sidebar_position: 1
title: Scheduler
---

# Scheduler

Per-CPU runqueues with work stealing: each CPU runs its own queue, and
an idle CPU steals a runnable thread from a busier one rather than
NeoOS keeping one global lock-protected queue. This is what lets
`kernel/smp/smp_selftest.c`'s own selftest verify that a **user**
thread — carrying an address space, an fd table, and signal state, not
just a kernel thread — can safely migrate across CPUs.

Design documents (in
[neoos-kernel/docs/superpowers/specs/](https://github.com/NeoOSOrganization/neoos-kernel/tree/main/docs/superpowers/specs)):

- `2026-08-30-smp-milestone-design.md` — the initial SMP bring-up
- `2026-08-30-work-stealing-problem.md` / `2026-08-30-work-stealing-resolution.md` —
  why a naive work-stealing implementation isn't safe, and what fixed it
- `2026-08-31-smp-hardening-handoff.md`, `2026-08-31-smp-lifetime-and-lock-detangle-design.md` —
  hardening work after the first version shipped
- `2026-08-31-post-smp-roadmap.md` — what came after (ASLR, BusyBox, concurrency stress testing)

The regression suite's `[smp] steal selftest passed` marker is
deliberately **not** a kernel-only guarantee — see the
[Kernel Development](../kernel-development) page and
`neoos-kernel-tests-common/tests.manifest.json` for why it needs the
full test suite present, not just the kernel, to reliably complete.
