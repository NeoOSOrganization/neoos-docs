---
sidebar_position: 2
title: Getting Started
---

# Getting Started with NeoOS

## Prerequisites

Install the cross-compiler toolchain and QEMU.

### Linux (Debian/Ubuntu)

```bash
sudo apt-get install nasm grub-common grub-mkrescue mtools qemu-system-x86_64 xorriso
```

### macOS

```bash
brew install nasm grub mtools qemu
```

## Building the Kernel

Clone the kernel repo and build:

```bash
git clone https://github.com/NeoOSOrganization/neoos-kernel
cd neoos-kernel

# Build the cross-compiler
./toolchain/build.sh

# Build and test
make
make test        # Full regression suite
make run         # Interactive boot
```

See [Kernel Build Guide](../kernel-build) for detailed instructions.

## Building a Custom OS Image

Use the OS builder to assemble a custom image with selected ports:

```bash
git clone https://github.com/NeoOSOrganization/neoos-os-builder
cd neoos-os-builder

# Interactive mode
neoos-builder

# Or config-driven
neoos-builder build config.yaml
```

Output ISO boots with `./build/qemu-run.sh`.

See [OS Builder Usage](../os-builder-usage) for details.

## Next Steps

- [Kernel Architecture](../architecture) — Understand the design
- [Adding a Syscall](../kernel-development/adding-syscalls) — Extend the kernel
- [Porting an Application](../porting) — Bring a new app to NeoOS