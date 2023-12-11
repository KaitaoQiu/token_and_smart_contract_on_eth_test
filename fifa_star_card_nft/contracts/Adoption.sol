pragma solidity ^0.5.0;

contract Adoption {

  address[16] public adopters;  
  
  function adopt(uint cardId) public returns (uint) {
    require(cardId >= 0 && cardId <= 15);  

    adopters[cardId] = msg.sender;     
    return cardId;
  }

  function getAdopters() public view returns (address[16] memory) {
    return adopters;
  }

}
