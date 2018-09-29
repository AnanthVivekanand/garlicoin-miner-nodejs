const crypto = require('crypto');

exports.help = () => {
  console.log("The BitcoinMerkle method will calculate the Merkel root tree of a list of transaction hashes placed in an array");

}

let btm_recursive = (hashList) => {
  while(true)
  {
    if (hashList.length === 1) return hashList[0];
    let newHashList = [];
    let len = (hashList.length % 2 !== 0) ? hashList.length -1 : hashList.length;
    for(let i = 0; i < len; i += 2 ) newHashList.push(hash2(hashList[i], hashList[i+1]));
    if(len < hashList.length)  newHashList.push(hash2(hashList[hashList.length-1], hashList[hashList.length-1]));  
    hashList = newHashList;
  }
}

function hash2 (a,b) { 
    let a1 = (new Buffer(a, "hex"));
    let b1 = (new Buffer(b, "hex"));  
    let c = (Buffer.concat([a1,b1]));    
    let firstHash = crypto.createHash('sha256').update(c).digest();
    let hashOfHash =  crypto.createHash('sha256').update(firstHash).digest();
    // hashOfHash.reverse();   
    return (hashOfHash.toString('hex'));
}

exports.BitcoinMerkleRoot = btm_recursive;
