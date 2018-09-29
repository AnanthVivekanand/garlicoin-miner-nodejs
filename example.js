const client = require('./stratum-client/index.js');
const BTCMiner = require('.');
const crypto = require('crypto');
var testBlocks = [];
let merkle = require("./merkleroot.js");
const Client = client({
  server: "grlcgang.com",
  port: 3333,
  worker: "KorkyMonster.testing",
  password: "x",
  autoReconnectOnError: true,
  onConnect: () => console.log('Connected to server'),
  onClose: () => console.log('Connection closed'),
  onError: (error) => console.log('Error', error.message),
//  onAuthorizeSuccess: () => Client.submit("KorkyMonster.testing", "cb06", "00000000", "gf$
  onAuthorizeFail: () => console.log('WORKER FAILED TO AUTHORIZE OH NOOOOOO'),
  //onNewDifficulty: (newDiff) => setDiff(newDiff),
  onSubscribe: (subscribeData) => console.log('[Subscribe]', subscribeData),
  onNewMiningWork: (newWork) => buildBlock(newWork),
  onSubmitWorkSuccess: (error, result) => console.log("Yay! Our work was accepted!"),
  onSubmitWorkFail: (error, result) => console.log("Oh no! Our work was refused because: "),
});
/*
function buildBlock(newWork) {
console.log(newWork);
testBlocks = [
	// Example Version 1 block:
	// Web Explorer:  https://insight.bitpay.com/block/0000000000000000e067a478024addfecdc93628978aa52d91fabd4292982a50
	// JSON download: https://insight.bitpay.com/api/block/0000000000000000e067a478024addfecdc93628978aa52d91fabd4292982a50
	{
		block: {
			version: 536870912,
			previousblockhash: 'dc2eafec687085e93e217fb95c11337dfa0a06e7f5b026213067db670e71cde2',
			merkleroot: 'cc8bf1939c6227d4c30a46582862e673d866953f5fba7eaa7923ab838c38a4dc',
			time: 1531846386,
			bits: '1c03afd3',
			diff: 0.5,
		},
		initialNonce: 1717644815 // Correct nonce will be:  1717644825
	},
	// Example Version 02000000 block
	// Web Explorer:  https://insight.bitpay.com/block/00000000000000000020cf2bdc6563fb25c424af588d5fb7223461e72715e4a9
	// JSON download: https://insight.bitpay.com/api/block/00000000000000000020cf2bdc6563fb25c424af588d5fb7223461e72715e4a9
	{
		block: {
			version: 536870912,
			previousblockhash: '2aa5118b0fa0aa84949deb435bb65f916c14bda3f935c7e1661e9beb65e16541',
			merkleroot: '4620b31ee72d041fd059f9f37deb58430c09a58dd80a2dd27435a86fac19acd4',
			time: 1533244673,
			bits: '1c04066f',
			diff: 0.5,
		},
		initialNonce: 744242297  // Correct nonce will be: 744242306
	},
        {
                block: {
                        version: 536870912,
                        previousblockhash: 'dc2eafec687085e93e217fb95c11337dfa0a06e7f5b026213067db670e71cde2',
                        merkleroot: 'cc8bf1939c6227d4c30a46582862e673d866953f5fba7eaa7923ab838c38a4dc',
                        time: 1531846386,
                        bits: '1c03afd3',
                        diff: 0.5,
                },
                initialNonce: 1717644815 // Correct nonce will be:  1717644825
        }

];
}
*/


const changeEndianness = (string) => {
        const result = [];
        let len = string.length - 2;
        while (len >= 0) {
          result.push(string.substr(len, 2));
          len -= 2;
        }
        return result.join('');
}


const changePrevhashEndianness = (string) => {
        pieces = string.match(/.{1,8}/g);
        for (let i = 0; i < pieces.length; i++) {
                pieces[i] = changeEndianness(pieces[i]);
        }
        pieces = pieces.join('');
        return pieces;
}


function buildBlock(newWork) {
console.log(newWork);
/*
coinbase = "01000000010000000000000000000000000000000000000000000000000000000000000000ffffffff270362f401062f503253482f049b8f175308";
coinbase += "f8002c90";
coinbase += "00000002";
coinbase += "0d2f7374726174756d506f6f6c2f000000000100868591052100001976a91431482118f1d7504daf1c001cbfaf91ad580d176d88ac00000000";
*/
coinbase = newWork.coinb1 + newWork.extraNonce1 + "00000000" + newWork.coinb2;
/*
merkle_branches = [ 
    "57351e8569cb9d036187a79fd1844fd930c1309efcd16c46af9bb9713b6ee734", 
    "936ab9c33420f187acae660fcdb07ffdffa081273674f0f41e6ecc1347451d23",
];
*/
merkle_branches = newWork.merkle_branch;
console.log("This is our coinbase: " + coinbase);

//DOUBLEHASH COINBASE

    let a1 = (new Buffer(coinbase, "hex"));  //.reverse();
    let firstHash = crypto.createHash('sha256').update(a1).digest();
    let hashOfHash =  crypto.createHash('sha256').update(firstHash).digest();
    //hashOfHash.reverse();   
console.log("FInal coinbase transaction: " + hashOfHash.toString('hex'));
console.log("Final merkle branches: " + merkle_branches);
//MERKLE ROOT UTILS

const changeEndianness = (string) => {
        const result = [];
        let len = string.length - 2;
        while (len >= 0) {
          result.push(string.substr(len, 2));
          len -= 2;
        }
        return result.join('');
}


const changePrevhashEndianness = (string) => {
	pieces = string.match(/.{1,8}/g);
	for (let i = 0; i < pieces.length; i++) {
		pieces[i] = changeEndianness(pieces[i]);
	}
	pieces = pieces.join('');
	return pieces;
}



//BUILD MERKLE ROOT
//console.log(merkle_branches);
/*
for (var i = 0; i < merkle_branches.length; i++) {
  merkle_branches[i] = changeEndianness(merkle_branches[i]);
}
*/
//merkle_branches.unshift(hashOfHash.toString('hex'));
//console.log(merkle_branches);
//console.log("Final merkle root: " + merkle.BitcoinMerkleRoot(merkle_branches));
merkle_root = hashOfHash.toString('hex');

for (let i = 0; i < merkle_branches.length; i++) {
    let a1 = (new Buffer(merkle_root, "hex"));
    let b1 = (new Buffer(merkle_branches[i], "hex"));  
    let c = (Buffer.concat([a1,b1]));    
    let firstHash = crypto.createHash('sha256').update(c).digest();
    let hashOfHash =  crypto.createHash('sha256').update(firstHash).digest();
    // hashOfHash.reverse();   
    merkle_root =  (hashOfHash.toString('hex'));

}

console.log("Final merkle root: " + merkle_root);


//PROCESS DATA

//1) Swap version 2) Swap prevhash weirdly 3) Swap ntime and nbits
/*
version = changeEndianness(version);
ntime = changeEndianness(ntime)
*/

console.log("Final prevhash: " + changePrevhashEndianness(newWork.prevhash));
testBlocks = [
        // Example Version 1 block:
        // Web Explorer:  https://insight.bitpay.com/block/0000000000000000e067a478024addfecdc93628978aa52d91fabd4292982a50
        // JSON download: https://insight.bitpay.com/api/block/0000000000000000e067a478024addfecdc93628978aa52d91fabd4292982a50
        {
                block: {
                        version: 536870912,
                        previousblockhash: changePrevhashEndianness(newWork.prevhash),
                        merkleroot: merkle_root,
                        time: changeEndianness(newWork.ntime),
                        bits: changeEndianness(newWork.nbits),
                        diff: 0.5,
			jobId: newWork.jobId,
                },
                initialNonce: 1717644815 // Correct nonce will be:  1717644825
        },
];
miner = null;

}
 setTimeout(function(){ startMining() }, 3000);

function startMining() {
const selectedBlock = 0; // CHANGE THIS TO 1 to use the second testBlock
const {block} = testBlocks[selectedBlock];
let nonce = testBlocks[selectedBlock].initialNonce;

let miner = new BTCMiner(block);

// Calculate the target based on current dificulty for this block (block.bits)
const target = miner.getTarget();
console.log('The target for this block is:');
console.log(target.toString(16));

let hash;
let found = false;

console.log('\n[Start Mining with initial nonce:', nonce, ']');
while (nonce < 8561950000 && !found) {
	hash = miner.getHash(nonce);
	found = miner.checkHash(hash);
	console.log(hash.toString('hex'), nonce, found ? '<- nonce FOUND!!' : '');
	if (found & miner) {
		miner.verifyNonce(block, nonce);
		Client.submit("KorkyMonster.testing", testBlocks[0].block.jobId, "00000000", changeEndianness(testBlocks[0].block.time), (nonce.toString(16)));
	}
	nonce++;
}
}


//UTILITY FUNCTIONS
function sha256(buf) {
        return crypto.createHash('sha256').update(buf).digest();
}

function doublesha(buf) {
        return sha256(sha256(buf));
}


/*
function buildMerkle(coinbase, branches) {
    merkle_root = doublesha(coinbase);
//    console.log(merkle_root);
    console.log("This is double hashed coinbase:" + merkle_root);
    for (var i = 0; i < branches.length; i++) {
        merkle_root = merkle_root + branches[i];
        merkle_root = doublesha(merkle_root);
//	console.log(merkle_root);
    }

    return merkle_root.toString('hex');
}
*/




