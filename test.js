var garlicoinhash = require('bindings')('garlicoinhash');

var buf = Buffer.alloc(80);

console.log(garlicoinhash.SumLyra2REv2(buf));
console.log(garlicoinhash.SumLyra2RE(buf));
console.log(garlicoinhash.SumScryptN(buf));
console.log(garlicoinhash.SumAllium(buf));

