cmd_Release/obj.target/garlicoinhash/sha3/skein.o := cc '-DNODE_GYP_MODULE_NAME=garlicoinhash' '-DUSING_UV_SHARED=1' '-DUSING_V8_SHARED=1' '-DV8_DEPRECATION_WARNINGS=1' '-D_LARGEFILE_SOURCE' '-D_FILE_OFFSET_BITS=64' '-DBUILDING_NODE_EXTENSION' -I/home/raptor/.node-gyp/11.14.0/include/node -I/home/raptor/.node-gyp/11.14.0/src -I/home/raptor/.node-gyp/11.14.0/deps/openssl/config -I/home/raptor/.node-gyp/11.14.0/deps/openssl/openssl/include -I/home/raptor/.node-gyp/11.14.0/deps/uv/include -I/home/raptor/.node-gyp/11.14.0/deps/zlib -I/home/raptor/.node-gyp/11.14.0/deps/v8/include -I../node_modules/nan  -fPIC -pthread -Wall -Wextra -Wno-unused-parameter -m64 -O3 -fno-omit-frame-pointer  -MMD -MF ./Release/.deps/Release/obj.target/garlicoinhash/sha3/skein.o.d.raw   -c -o Release/obj.target/garlicoinhash/sha3/skein.o ../sha3/skein.c
Release/obj.target/garlicoinhash/sha3/skein.o: ../sha3/skein.c \
 ../sha3/sph_skein.h ../sha3/sph_types.h
../sha3/skein.c:
../sha3/sph_skein.h:
../sha3/sph_types.h:
