var merkle = require('bitcoin-merkle-root');
var tx = ['de7451162e689d2b8ade6cb67b4de288eb884261fb5c830da40adff73773b5e3', 'bad860d72434f20eefd02da0e12d411d96bf4ccb6556e917d5e51e6d9a3f3b22'];
console.log(merkle.BitcoinMerkleRoot(tx));
