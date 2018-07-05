pragma solidity ^0.4.17;

contract Lottery { 
    // not about security but rather about whether or not somone can access varaible
    address public manager;
    address[] public players; 
    
    function Lottery() public { 
        manager = msg.sender; 
    }
    
    function enter() public payable { 
        //can pass in boolean 
        require(msg.value > .01 ether); 
        
        players.push(msg.sender);
    }
    
    function random() public view returns (uint) {
        //sha 3 is global
        //keccak256 is the same (class and sha3 is a class of it)
       return uint(sha3(block.difficulty, now, players));
    }
    
    function pickWinner() public restricted { 

        uint index = random() % players.length;
        // this is current contract and balance is balance
        players[index].transfer(this.balance); //0xfj48120dh 
        players = new address[](0);
    }
    // just to reduce amount of code we write
    modifier restricted() {
        require(msg.sender == manager);
        //means run rest of code in the function
        _;
    }
    //public means anyone can call 
    //view means not change any data strored in contract 
    function getPlayers() public view returns (address[]) {
        return players;
    }
    
}