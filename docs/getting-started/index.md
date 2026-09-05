---
sidebar_position: 2
title: Getting Started
---

# Getting Started with NeoOS

## Prerequisites

```bash
# Debian/Ubuntu
sudo apt-get install nasm grub-common grub-mkrescue mtools qemu-system-x86_64 xorriso

# macOS
brew install nasm grub mtools qemu
```

You also need an `x86_64-elf` cross-compiler toolchain (`x86_64-elf-gcc`,
`x86_64-elf-ld`, `x86_64-elf-ar`, `x86_64-elf-ranlib`) on your `PATH`.

## Building the Kernel

The kernel links two things directly into its image at build time: a
libc for the boot-critical apps (init/login/term/nsh), and, optionally,
a regression suite and/or ports. Build those first:

```bash
# musl (used by login) and libneoos (used by init/term/nsh) are both
# independent repos -- build them once, reuse the output.
git clone https://github.com/NeoOSOrganization/neoos-kernel
git clone https://github.com/NeoOSOrganization/neoos-musl
git clone https://github.com/NeoOSOrganization/neoos-libneoos

cd neoos-musl && make KERNEL_SHIM_DIR=../neoos-kernel/third_party/shim && cd ..
cd neoos-libneoos && make && cd ..

cd neoos-kernel
make LIBNEOOS_DIR=../neoos-libneoos/build-output MUSL_DIR=../neoos-musl/build-output test
```

`make test` alone (as above) runs a **reduced** regression set — just
the kernel-internal selftests, no test-suite or port dependency. For
the full suite BusyBox exercises at boot:

```bash
git clone https://github.com/NeoOSOrganization/neoos-kernel-tests-common
cd neoos-kernel-tests-common
make LIBNEOOS_DIR=../neoos-libneoos/build-output MUSL_DIR=../neoos-musl/build-output
cd ..

git clone https://github.com/NeoOSOrganization/neoos-busybox
cd neoos-busybox
git submodule update --init upstream
make MUSL_DIR=../neoos-musl/build-output
cd ..

cd neoos-kernel
make LIBNEOOS_DIR=../neoos-libneoos/build-output MUSL_DIR=../neoos-musl/build-output \
    EMBED_DIRS="../neoos-kernel-tests-common/build ../neoos-busybox/build" test
```

`EMBED_DIRS` takes any number of directories, each holding `<name>.nex`
+ `<name>.test.json` pairs — the kernel links every binary it finds
directly into its own image (`embedfs`) and wires up the inittab
entries and pass/fail markers each manifest declares. See the
[Porting Guide](../porting-guide) for the manifest format.

Other useful targets:

```bash
make            # Just the kernel binary
make iso        # build/neoos.iso
make run        # Boot interactively in QEMU with a display
```

## Building a Custom OS Image

`neoos-os-builder` orchestrates the whole chain above from one config
file — see [its README](https://github.com/NeoOSOrganization/neoos-os-builder)
for the config format.

## Next Steps

- [Kernel Development](../kernel-development) — Subsystems, adding a syscall, the regression harness
- [Architecture](../architecture/scheduler) — Scheduler, memory, VFS, signals
- [Porting Guide](../porting-guide) — Bring a new application to NeoOS
