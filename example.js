const BTCMiner = require('.');

const testBlocks = [
	// Example Version 1 block:
	// Web Explorer:  https://insight.bitpay.com/block/0000000000000000e067a478024addfecdc93628978aa52d91fabd4292982a50
	// JSON download: https://insight.bitpay.com/api/block/0000000000000000e067a478024addfecdc93628978aa52d91fabd4292982a50
	{
		block: {
			version: 536870912,
			previousblockhash: 'dc2eafec687085e93e217fb95c11337dfa0a06e7f5b026213067db670e71cde2',
			merkleroot: 'cc8bf1939c6227d4c30a46582862e673d866953f5fba7eaa7923ab838c38a4dc',
			time: 1531846386,
			bits: '1c03afd3'
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
			bits: '1c04066f'
		},
		initialNonce: 744242297  // Correct nonce will be: 744242306
	}
];

const selectedBlock = 1; // CHANGE THIS TO 1 to use the second testBlock
const {block} = testBlocks[selectedBlock];
let nonce = testBlocks[selectedBlock].initialNonce;

const miner = new BTCMiner(block);

// Calculate the target based on current dificulty for this block (block.bits)
const target = miner.getTarget();
console.log('The target for this block is:');
console.log(target.toString('hex'));

let hash;
let found = false;

console.log('\n[Start Mining with initial nonce:', nonce, ']');
while (nonce < 8561950000 && !found) {
	hash = miner.getHash(nonce);
	found = miner.checkHash(hash);
	console.log(hash.toString('hex'), nonce, found ? '<- nonce FOUND!!' : '');
	if (found) {
		miner.verifyNonce(block, nonce);
	}
	nonce++;
}
