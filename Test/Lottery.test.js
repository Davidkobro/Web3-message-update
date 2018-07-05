// helper library part of node standard library 
const assert = require('assert');
//automatically open ganache
const ganache = require('ganache-cli');
const Web3 = require ('web3');
// provider enables us to connect with netork so it'd be ropsten.provider
const web3 = new Web3(ganache.provider());

// require object with both properties
const { interface, bytecode } = require('../compile');

// loval veriables
//holds instance of contract
let lottery;
// holds accounts generated and unlocked for us as part of ganache cli
let accounts 

beforeEach(async () => {
    accounts = await web3.eth.getAccounts(); 

    //tells web3 about what methods an inbox contract has (interface)
    lottery = await new web3.eth.Contract(JSON.parse(interface))
        //tells that we want to deploy a new copy of this contract with the inputs 
        .deploy({ data: bytecode })
        //tells web3 to send out a transaction (deploy creates object that can then be deploeyd)
        //gas property as well
        .send({ from: accounts[0], gas: '1000000' });
});

describe('Lottery Contract', async () => {
    it('deploys a contract', async () => {
        //makes sure contract was deployed by making sure its defined
        //address that contract was deployed to
        //asser.ok just makes sure it's defined (proves deployed)
        assert.ok(lottery.options.address);
    });
    // Q: what behavior do we care about? 
    it('allows one accounts to enter', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            //converts to ether as opposed to wei 
            value: web3.utils.toWei('0.02', 'ether')
        });

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });
        // should be, actually is
        assert.equal(accounts[0], players[0]); 
        assert.equal(1, players.length);
    });
    it('allows multiple accounts to enter', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            //converts to ether as opposed to wei 
            value: web3.utils.toWei('0.02', 'ether')
        });
        await lottery.methods.enter().send({
            from: accounts[1],
            //converts to ether as opposed to wei 
            value: web3.utils.toWei('0.02', 'ether')
        });
        await lottery.methods.enter().send({
            from: accounts[2],
            //converts to ether as opposed to wei 
            value: web3.utils.toWei('0.02', 'ether')
        });

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });
        // should be, actually is
        assert.equal(accounts[0], players[0]);
        assert.equal(accounts[1], players[1]);
        assert.equal(accounts[2], players[2]); 
        assert.equal(3, players.length);
    });

    it('require a minimum amount of ether to enter', async () => {
        try { 
            await lottery.methods.enter().send({ 
             from: accounts[0],
             value: 200 
             //when using async await, we can do try catch to make sure
             //some error occurs
             // we want to see an error
            });
            //if this ran, it'd mean our test failed because catch should go
            assert(false);
            //traditional promises would just be catch, not try catch
        } catch (err) { 
            //just to show that something passes in this function
            assert(err);
        }
    });

    it('only manager can call pickWinner', async() => {
        try {
            await lottery.methods.pickWinner().send({
                from: accounts[1]
            });
            //if get here, fail test no matter what
            assert(false);
        } catch (err) {
            assert(err);
        }
    });

    it('sends money to winner and resets the players array', async () => {
        await lottery.methods.enter().send({
            from: accounts[0], 
            value: web3.utils.toWei('2', 'ether')
        });
        // returns ether in wei an account controls
        const initialBalance = await web3.eth.getBalance(accounts [0]);
        await lottery.methods.pickWinner().send({ from: accounts[0] });
        const finalBalance = await web3.eth.getBalance(accounts [0]);
        const difference = finalBalance - initialBalance;
       
        assert(difference > web3.utils.toWei('1.8', 'ether'));
    });
});

