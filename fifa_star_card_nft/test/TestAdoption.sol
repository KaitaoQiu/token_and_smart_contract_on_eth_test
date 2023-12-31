pragma solidity ^0.5.16;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Adoption.sol";

contract TestAdoption {
    Adoption adoption = Adoption(DeployedAddresses.Adoption());

    function testUserCanAdoptCard() public {
        uint returnedId = adoption.adopt(8);
        uint expected = 8;
        Assert.equal(returnedId, expected, "Adoption of ID 8 should be recorded.");
    }

    function testGetAdopterAddressByCardId() public {
        address expected = address(this); // Use address(this) instead of this
        address adopter = adoption.adopters(8);
        Assert.equal(adopter, expected, "Owner of ID 8 should be recorded.");
    }

    // 测试所有领养者
    function testGetAdopterAddressByCardIdInArray() public {
        // 领养者的地址就是本合约地址
        address expected = address(this); // Use address(this) instead of this
        address[16] memory adopters = adoption.getAdopters();
        Assert.equal(adopters[8], expected, "Owner of ID 8 should be recorded.");
    }
}
