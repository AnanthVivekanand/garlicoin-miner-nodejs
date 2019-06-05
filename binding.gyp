{
    "targets": [
        {
            "target_name": "garlicoinhash",
            "sources": ["crypto/Lyra2RE.c", "crypto/Lyra2.c", "crypto/Sponge.c",
                        "crypto/sha3/blake.c", "crypto/sha3/bmw.c", 
                        "crypto/sha3/cubehash.c", "crypto/sha3/groestl.c", 
                        "crypto/sha3/keccak.c", "crypto/sha3/skein.c", "crypto/scryptn.c",
                        "crypto/garlicoin-hash.cc"],
            "include_dirs" : [ 
                "<!(node -e \"require('nan')\")"
            ]
        }
    ]
}
