---
sidebar_position: 6
title: Port Catalog
---

# Port Catalog

| Port | Repo | Build | Compatibility notes |
|---|---|---|---|
| BusyBox (ash + coreutils) | [neoos-busybox](https://github.com/NeoOSOrganization/neoos-busybox) | `make MUSL_DIR=../neoos-musl/build-output` | Static, musl-linked. Part of the default regression suite (`bbspike`/`nshtest`/`bbsh`) when embedded. |
| 3D ASCII Viewer | [neoos-3d-ascii-viewer](https://github.com/NeoOSOrganization/neoos-3d-ascii-viewer) | `make MUSL_DIR=../neoos-musl/build-output` | Static, musl-linked, built **unmodified** against a 17-function ncurses replacement (`ncurses-shim/`), not a ported ncurses. Interactive — not part of the default gauntlet. |

Build status: each repo's own Actions tab is the source of truth —
badges here would drift. See
[neoos-busybox/actions](https://github.com/NeoOSOrganization/neoos-busybox/actions) and
[neoos-3d-ascii-viewer/actions](https://github.com/NeoOSOrganization/neoos-3d-ascii-viewer/actions).

Want to add a port? See the [Porting Guide](./porting-guide) — both of
the ports above are worked examples, including the mistakes made
migrating them.
