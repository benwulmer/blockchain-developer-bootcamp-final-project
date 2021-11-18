/*
 * This exercise has been updated to use Solidity version 0.8.5
 * See the latest Solidity updates at
 * https://solidity.readthedocs.io/en/latest/080-breaking-changes.html
 */
// SPDX-License-Identifier: MIT
pragma solidity 0.5.16;

//Ownable
//Inheritance

//Proper Use of Require, Assert and Revert
//Using Specific Compiler Pragma
//Use Modifiers Only for Validation

contract PrevUserTracker {
  address payable private prevAddress;

  constructor() payable public {
      prevAddress = msg.sender;
  }

  function updateLastAddress(address payable newAddress) public {
    prevAddress = newAddress;
  }

  function getLastAddress() public view returns(address payable) {
    return prevAddress;
  }
}

contract PayItBackward is PrevUserTracker {
  address public owner;
  uint constant minValue = 100;  

  constructor() payable public {
      owner = msg.sender;
  }

  event LogSend(address accountAddress, uint amount);


  modifier onlyOwner() {
    require(msg.sender == owner, "Only the owner is allowed to see the previous address.");
    _;
  }

  /// @notice Get the last user of this contract (only callable by the owner)
  /// @return The previous address
  function getLastUser() public onlyOwner returns (address payable) {
    return getLastAddress();
  }  

  /// @notice Pay the previous user of this contract
  function send() public payable {
    // Prevent people from sending minimal amounts to set themselves up to receive next.
    require(msg.value >= minValue);
    address payable prev = getLastAddress();
    prev.transfer(msg.value);
    updateLastAddress(msg.sender);
    emit LogSend(prev, msg.value);
  }
}
