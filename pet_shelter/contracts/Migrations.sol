pragma solidity ^0.5.16;

contract Migrations {
  address public owner;
  uint public last_completed_migration;

//   modifier restricted() {
//     if (msg.sender == owner) _;
//   }

  modifier restricted() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
  }

//   function Migrations() {
//     owner = msg.sender;
//   }

    constructor() public {
        owner = msg.sender;
    }

  function setCompleted(uint completed) public restricted {
    last_completed_migration = completed;
  }

  function upgrade(address new_address) public restricted {
    Migrations upgraded = Migrations(new_address);
    upgraded.setCompleted(last_completed_migration);
  }
}


// contract Migrations {
//     address public owner;
//     uint public last_completed_migration;

//     modifier restricted() {
//         require(msg.sender == owner, "Only the owner can call this function");
//         _;
//     }

//     constructor() public {
//         owner = msg.sender;
//     }

//     function setCompleted(uint completed) public restricted {
//         last_completed_migration = completed;
//     }

//     function upgrade(address new_address) public restricted {
//         Migrations upgraded = Migrations(new_address);
//         upgraded.setCompleted(last_completed_migration);
//     }
// }