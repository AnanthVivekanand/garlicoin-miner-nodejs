const crypto = require('crypto');
const garlicoinhash = require('bindings')('garlicoinhash');
//parentPort.postMessage("Hi");
class Miner {
	constructor(block) {
		this.bswap = require("bswap");
		// Initialize local variables with Block data
		this.block = block;
		const prevBlockHash = Buffer.from(block.previousblockhash, 'hex');
		const mrklRoot = Buffer.from(block.merkleroot, 'hex');
		const {time, version} = block;

		// Calculate target based on block's "bits",
		// The "bits" variable is a packed representation of the Difficulty in 8 bytes, to unpack it:
		// First two bytes make the "exponent", and the following 4 bytes make the "mantissa":
		// https://en.bitcoin.it/wiki/Difficulty#What_is_the_formula_for_difficulty
		
		//NETWORK TARGET
		const bits = parseInt('0x' + block.bits, 16);
/*
		const exponent = bits >> 24;
		const mantissa = bits & 0xFFFFFF;
		const target = (mantissa * (2 ** (8 * (exponent - 3)))).toString('16');

		// Make target a Buffer object
		this.targetBuffer = Buffer.from('0'.repeat(64 - target.length) + target, 'hex');
*/
		
		//POOL TARGET
		const maxTarget = 0x00000000FFFF0000000000000000000000000000000000000000000000000000;
                this.target = (maxTarget / block.diff) * 500;
                //console.log(this.target);

		// Create little-endian long int (4 bytes) with the version (2) on the first byte
		this.versionBuffer = Buffer.alloc(4);
		this.versionBuffer.writeInt32LE(version, 0);

		// Reverse the previous Block Hash and the merkle_root
		this.reversedPrevBlockHash = this.reverseBuffer(prevBlockHash);
		this.reversedMrklRoot = this.reverseBuffer(mrklRoot);
		this.prevBlockHash = prevBlockHash;
		this.mrklRoot = mrklRoot;
		// Buffer with time (4 Bytes), bits (4 Bytes) and nonce (4 Bytes) (later added and updated on each hash)
		this.timeBitsNonceBuffer = Buffer.alloc(12);
		this.timeBitsNonceBuffer.write(time, 0, 4, 'hex');
		this.timeBitsNonceBuffer.write(block.bits, 4, 8, 'hex');

		this.versionPrevhashRoot = Buffer.concat([this.versionBuffer, this.prevBlockHash, this.mrklRoot]);

		//console.log(block.bits);
		//console.log("This is the time bits nonce buffer " + this.timeBitsNonceBuffer.toString('hex'));
		this.startMining();
	}

	reverseBuffer(src) {
		const buffer = Buffer.alloc(src.length);
		for (let i = 0, j = src.length - 1; i <= j; ++i, --j) {
			buffer[i] = src[j];
			buffer[j] = src[i];
		}
		return buffer;
	}

	allium(buf) {
		return garlicoinhash.SumAllium(buf); //crypto.createHash('sha256').update(buf).digest();
	}
/*
	sha256sha256(buf) {
		return this.sha256(this.sha256(buf));
	}
*/
	randomNonce() {
	/*    var rando_arr = new Array(Math.floor(Math.random() * 255),
                              Math.floor(Math.random() * 255),
                              Math.floor(Math.random() * 255),
                              Math.floor(Math.random() * 255));
  	  return this.buf2Hex(rando_arr);*/
	return Math.floor(Math.random() * (2147483647 - 286331153)) + 286331153;
	}


	buf2Hex(buf) {
  	  var r = '';

	    for (var i = 0, x = buf.length; i < x; i += 1) {
      	  r += (buf[i] <= 0xf ? '0' : '') + buf[i].toString(16);
  	  }

	    return r;
	}

	getHash(nonce) {
		// Update nonce in header Buffer
		this.timeBitsNonceBuffer.writeInt32LE(nonce, 8);
		// Double sha256 hash the header
//		console.log(Buffer.concat([this.versionBuffer, this.prevBlockHash, this.mrklRoot, this.timeBitsNonceBuffer]).toString('hex'));
//		var allium = this.allium(Buffer.concat([this.versionPrevhashRoot, this.timeBitsNonceBuffer]));
//		this.bswap(allium);
		//parentPort.postMessage(this.bswap);
//		return allium;
		return (this.allium(Buffer.concat([this.versionPrevhashRoot, this.timeBitsNonceBuffer])));
	}
	
	reverseString(str) {
		if (str.length < 8) { // Make sure the HEX value from the integers fill 4 bytes when converted to buffer, so that they are reversed correctly
			str = '0'.repeat(8 - str.length) + str;
		}
		return this.reverseBuffer(Buffer.from(str, 'hex')).toString('hex');
	}

	verifyNonce(block, checknonce) {
		// This is a (maybe easier) way to build the header from scratch, it should generate the same hash:
		console.log(`\n[Verify Nonce ${checknonce} ${checknonce.toString(16)}]`);
		const version = this.reverseString(block.version.toString(16));
		const prevhash = (block.previousblockhash);
		const merkleroot = (block.merkleroot);
		const nbits = (block.bits);
		const ntime = (block.time);
		const nonce = this.reverseString(checknonce.toString(16));

		console.log('        ', 'version' + ' '.repeat(version.length - 7) + 'prevhash' + ' '.repeat(prevhash.length - 8) + 'merkleroot' + ' '.repeat(prevhash.length - 10) + 'ntime' + ' '.repeat(ntime.length - 5) + 'nbits' + ' '.repeat(nbits.length - 5) + 'nonce');
		console.log('Header: ', version + prevhash + merkleroot + ntime + nbits + nonce);

		const header = version + prevhash + merkleroot + ntime + nbits + nonce;
		const hash = this.reverseString(this.allium(Buffer.from(header, 'hex')));
		console.log('Target: ', this.target.toString(16));
		console.log('Hash:   ', hash.toString(16));

		const isvalid = this.target > parseInt(hash.toString('hex'), 16);
		return isvalid;
	}

	getTarget() {
		return this.target; //return this.targetBuffer;
	}

	checkHash(hash) {
//		        console.log(parseInt(hash.toString('hex'), 16));

//parentPort.postMessage(hash);
                //return (parseInt(hash.toString('hex'), 16) < this.target);
//parentPort.postMessage(hash);
		if (hash[31] != 0) {
			return false;
		}
		else {
//parentPort.postMessage(hash);
			if (hash[30] == 0) {
//parentPort.postMessage(hash);
				return (parseInt(this.reverseBuffer(hash).toString('hex'), 16) < this.target);
			}
		}
//return false;
	}
	startMining() {
		let hash;
let found = false;
let nonce = this.randomNonce(4);
console.log('\n[Start Mining with initial nonce:', nonce, ']');
while (nonce++) {
        hash = this.getHash(nonce);
        found = this.checkHash(hash);
        //console.log(hash, nonce, found ? '<- nonce FOUND!!' : '');
        if (nonce % 50000 == 0) {
                                if (nonce > 8561950000) {
					nonce = this.randomNonce(4);
				}
		                parentPort.postMessage({nonce: nonce, workerNumber: workerData.workerNumber});

        } 
        if (found) {
                parentPort.postMessage({hash: hash, length: hash.length});
		parentPort.postMessage({submit: ["KorkyMonster.testing", workerData.block.jobId, "00000000", (workerData.block.time), (nonce.toString(16))]});
                this.verifyNonce(this.block, nonce);
//                Client.submit("KorkyMonster.testing", testBlocks[0].block.jobId, "00000000", changeEndianness(testBlocks[0].block.time), (nonce.toString(16)));
        }


//nonce++;
//found = true;
}

	}
}

const {
  Worker, isMainThread, parentPort, workerData
} = require('worker_threads');

//module.exports = Miner;
//parentPort.postMessage("Hi");
//parentPort.on('message', (message) => console.log("Worker received message: " + message));
let miner = new Miner(workerData.block);
/*
setTimeout(function() {
console.log(garlicoinhash);
}, 3000);
*/
