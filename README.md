# garlicoinhash

Garlicoinhash is a Node.js native module for Garlicoin proof of work functions. It provides methods for Lyra2RE, Lyra2REv2 and Scrypt-N(2048).

## Usage

    var garlicoinhash = require('garlicoinhash');

    var buf = Buffer.from('700000005d385ba114d079971b29a9418fd0549e7d68a95c7f168621a314201000000000578586d149fd07b22f3a8a347c516de7052f034d2b76ff68e0d6ecff9b77a45489e3fd511732011df0731000', 'hex');

    console.log(garlicoinhash.SumLyra2REv2(buf));
    console.log(garlicoinhash.SumLyra2RE(buf));
    console.log(garlicoinhash.SumScryptN(buf));
