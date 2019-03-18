//Declare dependencies
const client = require('./stratum-client/index.js');
const crypto = require('crypto'); //Hashing libraries for SHA256
const {
  Worker, MessageChannel, MessagePort, isMainThread, parentPort
} = require('worker_threads');
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var options = {};
var workers = [];

function getPoolInfo() {
  rl.question('Enter address and port: (Default "grlcgang.com:3333")', function(answer) {
    if (answer.indexOf(":") == -1) {
      answer = "grlcgang.com:3333";
    }
    options.address = (answer.split(":"))[0];
    options.port = (answer.split(":"))[1];
    console.log("The recieved info was server " + options.address + " at port " + options.port);
  rl.question('Enter worker username and password seperated by a colon: (Default "KorkyMonster.testing:x")', function(answer) {
    if (answer.indexOf(":") == -1) {
      answer = "KorkyMonster.testing:x";
    }
    options.worker = (answer.split(":"))[0];
    options.password = (answer.split(":"))[1];
    console.log("The recieved info was worker " + options.worker + " with password " + options.password);
  rl.close();
  startConnection();

  });

  });
/*
  rl.question('Enter worker username and password seperated by a colon: (Default "KorkyMonster.testing:x")', function(answer) {
    if (answer.indexOf(":") == -1) {
      answer = "KorkyMonster.testing:x";
    }
    options.worker = (answer.split(":"))[0];
    options.password = (answer.split(":"))[1];
    console.log("The recieved info was worker " + options.worker + " with password " + options.password);
  });
  rl.close();
  startConnection();
*/
}

getPoolInfo();

function startConnection() {
const Client = client({
  server: options.address,
  port: options.port,
  worker: options.worker,
  password: options.password,
  autoReconnectOnError: true,
  onConnect: () => console.log('Connected to server'),
  onClose: () => console.log('Connection closed'),
  onError: (error) => console.log('Error', error.message),
  onAuthorizeSuccess: () => console.log("Authorized successfully"), //Client.submit("KorkyMonster.testing", "cb06", "00000000", "gf$
  onAuthorizeFail: () => console.log('WORKER FAILED TO AUTHORIZE OH NOOOOOO'),
  onNewDifficulty: (newDiff) => { options.diff = newDiff}, //setDiff(newDiff),
  onSubscribe: (subscribeData) => console.log('[Subscribe]', subscribeData),
  onNewMiningWork: (newWork) => buildBlock(newWork),
  onSubmitWorkSuccess: (error, result) => console.log("Yay! Our work was accepted!"),
  onSubmitWorkFail: (error, result) => console.log("Oh no! Our work was refused because: "),
});

}


function buildBlock(newWork) {
coinbase = newWork.coinb1 + newWork.extraNonce1 + "00000000" + newWork.coinb2; //Construct the coinbase transaction
console.log("This is our coinbase: " + coinbase);
merkle_branches = newWork.merkle_branch;

//We need to double hash our coinbase
    let a1 = (Buffer.from(coinbase, "hex"));  //.reverse();
    let firstHash = crypto.createHash('sha256').update(a1).digest();
    let hashOfHash =  crypto.createHash('sha256').update(firstHash).digest();
    //hashOfHash.reverse();   
console.log("Final coinbase transaction: " + hashOfHash.toString('hex'));
console.log("Final merkle branches: "      + merkle_branches);
merkle_root = hashOfHash.toString('hex');


//Now we hash the root and each branch and smash the hashes together, which becomes the new merkle root.
for (let i = 0; i < merkle_branches.length; i++) {
    let a1 = (Buffer.from(merkle_root, "hex"));
    let b1 = (Buffer.from(merkle_branches[i], "hex"));  
    let c = (Buffer.concat([a1,b1]));    
    let firstHash = crypto.createHash('sha256').update(c).digest();
    let hashOfHash =  crypto.createHash('sha256').update(firstHash).digest();
    // hashOfHash.reverse();   
    merkle_root =  (hashOfHash.toString('hex'));
}

console.log("Final merkle root: " + merkle_root);

console.log("Final prevhash: " + changePrevhashEndianness(newWork.prevhash));

blocks = [
        // Example Version 1 block:
        // Web Explorer:  https://insight.bitpay.com/block/0000000000000000e067a478024addfecdc93628978aa52d91fabd4292982a50
        // JSON download: https://insight.bitpay.com/api/block/0000000000000000e067a478024addfecdc93628978aa52d91fabd4292982a50
        {
                block: {
                        version: parseInt('0x' + newWork.version, 16),
                        previousblockhash: changePrevhashEndianness(newWork.prevhash),
                        merkleroot: merkle_root,
                        time: changeEndianness(newWork.ntime),
                        bits: changeEndianness(newWork.nbits),
                        diff: options.diff,
                        jobId: newWork.jobId,
			initialNonce: 1717644816
                },
        },
];

//console.log(blocks);

startMining(blocks);

}

function startMining(blocks) {
  const selectedBlock = 0;
  const {block} = blocks[selectedBlock];
    for (var i = 0; i < 4; i++) {
      if (workers[i] != null) {
        workers[i].terminate(function () {
          workers[i] = new Worker("./index.js", {workerData: {block: block}});
          workers[i].on('message', (message) => messageFromWorker(message));
        })
      } else if (workers[i] == null) {
        workers[i] = new Worker("./index.js", {workerData: {block: block}});
        workers[i].on('message', (message) => messageFromWorker(message));
      }
    }
  
}

function messageFromWorker(message) {
  if (message.submit) {
     console.log(message.submit);
     Client.submit(message.submit[0], message.submit[1], message.submit[2], changeEndianness(message.submit[3]), (message.submit[4]));
  }
  if (message.nonce) {
     console.log("Nonce: " + message.nonce);
  }
}




//UTILS
const changeEndianness = (string) => {
        const result = [];
        let len = string.length - 2;
        while (len >= 0) {
          result.push(string.substr(len, 2));
          len -= 2;
        }
        return result.join('');
}

//Prevhash gets endianness swapped for every 4 bytes, which is 8 hex characters
const changePrevhashEndianness = (string) => {
        pieces = string.match(/.{1,8}/g);
        for (let i = 0; i < pieces.length; i++) {
                pieces[i] = changeEndianness(pieces[i]);
        }
        pieces = pieces.join('');
        return pieces;
}

