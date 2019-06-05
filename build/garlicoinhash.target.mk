# This file is generated by gyp; do not edit.

TOOLSET := target
TARGET := garlicoinhash
DEFS_Debug := \
	'-DNODE_GYP_MODULE_NAME=garlicoinhash' \
	'-DUSING_UV_SHARED=1' \
	'-DUSING_V8_SHARED=1' \
	'-DV8_DEPRECATION_WARNINGS=1' \
	'-D_LARGEFILE_SOURCE' \
	'-D_FILE_OFFSET_BITS=64' \
	'-DBUILDING_NODE_EXTENSION' \
	'-DDEBUG' \
	'-D_DEBUG' \
	'-DV8_ENABLE_CHECKS'

# Flags passed to all source files.
CFLAGS_Debug := \
	-fPIC \
	-pthread \
	-Wall \
	-Wextra \
	-Wno-unused-parameter \
	-m64 \
	-g \
	-O0

# Flags passed to only C files.
CFLAGS_C_Debug :=

# Flags passed to only C++ files.
CFLAGS_CC_Debug := \
	-fno-rtti \
	-fno-exceptions \
	-std=gnu++1y

INCS_Debug := \
	-I/home/raptor/.node-gyp/11.9.0/include/node \
	-I/home/raptor/.node-gyp/11.9.0/src \
	-I/home/raptor/.node-gyp/11.9.0/deps/openssl/config \
	-I/home/raptor/.node-gyp/11.9.0/deps/openssl/openssl/include \
	-I/home/raptor/.node-gyp/11.9.0/deps/uv/include \
	-I/home/raptor/.node-gyp/11.9.0/deps/zlib \
	-I/home/raptor/.node-gyp/11.9.0/deps/v8/include \
	-I$(srcdir)/node_modules/nan

DEFS_Release := \
	'-DNODE_GYP_MODULE_NAME=garlicoinhash' \
	'-DUSING_UV_SHARED=1' \
	'-DUSING_V8_SHARED=1' \
	'-DV8_DEPRECATION_WARNINGS=1' \
	'-D_LARGEFILE_SOURCE' \
	'-D_FILE_OFFSET_BITS=64' \
	'-DBUILDING_NODE_EXTENSION'

# Flags passed to all source files.
CFLAGS_Release := \
	-fPIC \
	-pthread \
	-Wall \
	-Wextra \
	-Wno-unused-parameter \
	-m64 \
	-O3 \
	-fno-omit-frame-pointer

# Flags passed to only C files.
CFLAGS_C_Release :=

# Flags passed to only C++ files.
CFLAGS_CC_Release := \
	-fno-rtti \
	-fno-exceptions \
	-std=gnu++1y

INCS_Release := \
	-I/home/raptor/.node-gyp/11.9.0/include/node \
	-I/home/raptor/.node-gyp/11.9.0/src \
	-I/home/raptor/.node-gyp/11.9.0/deps/openssl/config \
	-I/home/raptor/.node-gyp/11.9.0/deps/openssl/openssl/include \
	-I/home/raptor/.node-gyp/11.9.0/deps/uv/include \
	-I/home/raptor/.node-gyp/11.9.0/deps/zlib \
	-I/home/raptor/.node-gyp/11.9.0/deps/v8/include \
	-I$(srcdir)/node_modules/nan

OBJS := \
	$(obj).target/$(TARGET)/Lyra2RE.o \
	$(obj).target/$(TARGET)/Lyra2.o \
	$(obj).target/$(TARGET)/Sponge.o \
	$(obj).target/$(TARGET)/sha3/blake.o \
	$(obj).target/$(TARGET)/sha3/bmw.o \
	$(obj).target/$(TARGET)/sha3/cubehash.o \
	$(obj).target/$(TARGET)/sha3/groestl.o \
	$(obj).target/$(TARGET)/sha3/keccak.o \
	$(obj).target/$(TARGET)/sha3/skein.o \
	$(obj).target/$(TARGET)/scryptn.o \
	$(obj).target/$(TARGET)/garlicoin-hash.o

# Add to the list of files we specially track dependencies for.
all_deps += $(OBJS)

# CFLAGS et al overrides must be target-local.
# See "Target-specific Variable Values" in the GNU Make manual.
$(OBJS): TOOLSET := $(TOOLSET)
$(OBJS): GYP_CFLAGS := $(DEFS_$(BUILDTYPE)) $(INCS_$(BUILDTYPE))  $(CFLAGS_$(BUILDTYPE)) $(CFLAGS_C_$(BUILDTYPE))
$(OBJS): GYP_CXXFLAGS := $(DEFS_$(BUILDTYPE)) $(INCS_$(BUILDTYPE))  $(CFLAGS_$(BUILDTYPE)) $(CFLAGS_CC_$(BUILDTYPE))

# Suffix rules, putting all outputs into $(obj).

$(obj).$(TOOLSET)/$(TARGET)/%.o: $(srcdir)/%.cc FORCE_DO_CMD
	@$(call do_cmd,cxx,1)

$(obj).$(TOOLSET)/$(TARGET)/%.o: $(srcdir)/%.c FORCE_DO_CMD
	@$(call do_cmd,cc,1)

# Try building from generated source, too.

$(obj).$(TOOLSET)/$(TARGET)/%.o: $(obj).$(TOOLSET)/%.cc FORCE_DO_CMD
	@$(call do_cmd,cxx,1)

$(obj).$(TOOLSET)/$(TARGET)/%.o: $(obj).$(TOOLSET)/%.c FORCE_DO_CMD
	@$(call do_cmd,cc,1)

$(obj).$(TOOLSET)/$(TARGET)/%.o: $(obj)/%.cc FORCE_DO_CMD
	@$(call do_cmd,cxx,1)

$(obj).$(TOOLSET)/$(TARGET)/%.o: $(obj)/%.c FORCE_DO_CMD
	@$(call do_cmd,cc,1)

# End of this set of suffix rules
### Rules for final target.
LDFLAGS_Debug := \
	-pthread \
	-rdynamic \
	-m64

LDFLAGS_Release := \
	-pthread \
	-rdynamic \
	-m64

LIBS :=

$(obj).target/garlicoinhash.node: GYP_LDFLAGS := $(LDFLAGS_$(BUILDTYPE))
$(obj).target/garlicoinhash.node: LIBS := $(LIBS)
$(obj).target/garlicoinhash.node: TOOLSET := $(TOOLSET)
$(obj).target/garlicoinhash.node: $(OBJS) FORCE_DO_CMD
	$(call do_cmd,solink_module)

all_deps += $(obj).target/garlicoinhash.node
# Add target alias
.PHONY: garlicoinhash
garlicoinhash: $(builddir)/garlicoinhash.node

# Copy this to the executable output path.
$(builddir)/garlicoinhash.node: TOOLSET := $(TOOLSET)
$(builddir)/garlicoinhash.node: $(obj).target/garlicoinhash.node FORCE_DO_CMD
	$(call do_cmd,copy)

all_deps += $(builddir)/garlicoinhash.node
# Short alias for building this executable.
.PHONY: garlicoinhash.node
garlicoinhash.node: $(obj).target/garlicoinhash.node $(builddir)/garlicoinhash.node

# Add executable to "all" target.
.PHONY: all
all: $(builddir)/garlicoinhash.node

