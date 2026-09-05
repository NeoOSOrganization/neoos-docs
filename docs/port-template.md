# Port Template for NeoOS

This guide explains how to port a new application to NeoOS.

## Directory Structure

```
neoos-application/
├── upstream/                   ← Original source (submodule)
├── Makefile                    ← Build glue
├── smoke-test.sh               ← Validation tests
├── docs/
│   └── BUILD.md                ← Build documentation
└── (any NeoOS-specific patches)
```

## Prerequisites

### Required
- x86_64-elf cross-compiler toolchain
- musl libc from neoos-musl repository
- Standard build tools (make, autoconf, etc.)

### Optional
- Custom shimmed libraries (like ncurses-shim)
- Build patches for NeoOS compatibility

## Build Contract

Every port must:
1. **Accept MUSL_DIR parameter**
   ```makefile
   MUSL_DIR ?= ../neoos-musl/build-output
   CFLAGS += -I$(MUSL_DIR)/include
   LDFLAGS += -L$(MUSL_DIR)/lib -lc
   ```

2. **Produce static binary**
   ```bash
   make
   file build/app.nex
   # Output: ELF 64-bit, statically linked
   ```

3. **Include smoke tests**
   ```bash
   make smoke-test
   # Validates binary is present, static, and executable
   ```

4. **Clean artifacts**
   ```bash
   make clean
   ```

## Porting Checklist

- [ ] Fork or submodule upstream source
- [ ] Create Makefile wrapping upstream build
- [ ] Test builds against external musl
- [ ] Identify missing syscalls (look for ENOSYS)
- [ ] Add patches if needed (keep upstream pristine)
- [ ] Create smoke-test.sh
- [ ] Document build process in docs/BUILD.md
- [ ] Add cross-links to other repos in README.md
- [ ] Test full integration with OS builder

## Common Patterns

### Pattern 1: autotools (configure + make)
```makefile
all:
	cd upstream && ./configure --prefix=$(PREFIX) \
	  --host=x86_64-elf CC=x86_64-elf-gcc
	cd upstream && make
	cp upstream/src/app build/app.nex
```

### Pattern 2: custom Makefile
```makefile
all:
	cd upstream && make CFLAGS="-I$(MUSL_DIR)/include" \
	  LDFLAGS="-L$(MUSL_DIR)/lib -lc"
	cp upstream/app build/app.nex
```

### Pattern 3: with shimmed libraries
```makefile
all:
	cd upstream && make CPPFLAGS="-I../ncurses-shim" \
	  LDFLAGS="-L$(MUSL_DIR)/lib -lc"
```

## Testing

### Local testing
```bash
cd neoos-application
git submodule update --init
make MUSL_DIR=../neoos-musl/build-output
make smoke-test
```

### In OS builder
```bash
cd neoos-os-builder
make APP_DIR=../neoos-application/build
```

### In QEMU
```bash
qemu-system-x86_64 -cdrom build/neoos.iso -nographic
# Boot NeoOS with port included
```

## Debugging

### Build fails with "undefined reference"
Likely missing syscall. Check kernel log:
```bash
grep ENOSYS /tmp/neoos.log
```

Then add syscall to kernel if needed.

### Binary too large
Try menuconfig to disable features:
```bash
cd upstream
make menuconfig
```

### Smoke tests fail
Verify binary format:
```bash
file build/app.nex
# Should be: ELF 64-bit LSB executable, statically linked
```

## Getting Help

- **Build issues:** See upstream project docs + musl compatibility
- **NeoOS syscalls:** Check kernel/syscall/ directory
- **Cross-compilation:** Consult x86_64-elf-gcc documentation
