pragma solidity ^0.4.17;

contract Inbox { 
    string public message; 
    
    //same name as contract, so this is the constructor
    function Inbox(string initialMessage) public { 
        message = initialMessage;
    }
    //not view or constant because we're attempting ot change contract
    function setMessage(string newMessage) public {
        message = newMessage; 
        
    }
}