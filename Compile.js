const path = require('path');
//cross platform
const fs = require('fs');
const solc = require('solc');

//dirname always set to current working directory
const lotteryPath = path.resolve(__dirname, 'contracts', 'Lottery.sol');
const source = fs.readFileSync(lotteryPath, 'utf8');

// contract exporting is interface and the other is bytecode
module.exports = solc.compile(source,1).contracts[':Lottery'];