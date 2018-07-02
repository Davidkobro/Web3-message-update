const assert = require('assert'); 
const ganache = require('ganache-cli');
//constructor functions always capitalized 
const Web3 = require('web3');
//instance of web3 - each instance connect to diff networks
// will change depending on provider (changes when metamask is there too)
const provider = ganache.provider();
const web3 = new Web3(provider);

const { interface, bytecode } = require('../compile');

let accounts;
let inbox;

beforeEach(async () => {
    //get a list of all accounts 
    //only use capital Web3 one time and lower is for the instance 
    //web3 is asynchronous in nature and returns a promise
   accounts = await web3.eth.getAccounts()
         
    //use one of those accounts to deploy 
    //the contract 

   inbox = await new web3.eth.Contract(JSON.parse(interface)) 
        .deploy({ data: bytecode, arguments: ['Hi there!'] })
        .send( { from: accounts[0], gas: '1000000'})

        inbox.setProvider(provider);
 });
   

describe('Inbox', () => {
    it('deploys a contract', () => {
        //node standard - ok makes sure that inbox... is a defined value
       // makes sure deployment process makes sense
        assert.ok(inbox.options.address);
    });

    it('has a default message', async () =>  {
        //first set parenteses pass in any arguements might require
        //second set is to customize transaction to be sent out to network
        const message = await inbox.methods.message().call();
        assert.equal(message, 'Hi there!');
    });

    it('can change the message', async () => { 
        //modifying the contract so we can't use call
        //.send is like send transacation and says who is paying
        //helpful that ganache creates accounts 
        //when send, no assign to variable because if not successful 
        //will return an error regardless
       await inbox.methods.setMessage('bye').send({ from: accounts[0] });
       const message = await inbox.methods.message().call();
       assert.equal(message, 'bye');
    });
});




/*

//Mocha is a general purpose testing framework
//it - run one assertion (take 2 values - one produce and one should be equal) 
//on something we're trying to test 
//describe groups a collection of it functions 
//before each is utility that abstracts some amount of logic 
//and not rewrite code 

class Car { 
    park() {
        return 'stopped'; 
    }

    drive() {
        return 'vroom';
    }
}
// need to define ahead of time and use let becuase we change the value of car
let car;

beforeEach(() => { 
    car = new Car();
});


//'Car' just used for organization purposes
describe('Car', () => { 
    it('can and should park', () => {
        //create instance of class park 
        const car = new Car(); 
        //sees if same -- new instance that parks -- what it shoudl be 
        assert.equal(car.park(), 'stopped');

    });

    it('can drive', () => {
        const car = new Car(); 
        assert.equal(car.drive(), 'vroom');
    });
});

*/