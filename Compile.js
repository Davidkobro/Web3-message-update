const path = require('path');
//cross platform
const fs = require('fs');
const solc = require('solc');

//dirname always set to current working directory
const inboxPath = path.resolve(__dirname, 'contracts', 'Inbox.sol');
const source = fs.readFileSync(inboxPath, 'utf8');

// contract exporting is interface and the other is bytecode
module.exports = solc.compile(source,1).contracts[':Inbox'];