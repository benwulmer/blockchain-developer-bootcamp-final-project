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

/// @title A way to keep track of the previous user of this contract
/// @author Ben Ulmer
contract PrevUserTracker {
  address payable private prevAddress;

  constructor() payable public {
      prevAddress = msg.sender;
  }

  /// @notice Updates the state of the contract to reflect the latest user of the contract.
  /// @param newAddress The newest used address
  function updateLastAddress(address payable newAddress) public {
    prevAddress = newAddress;
  }

  /// @notice Provides the address last used by this contract.
  /// @return The last used address.
  function getLastAddress() public view returns(address payable) {
    return prevAddress;
  }
}

/// @title Donation mechanism for previous user of the contract
/// @author Ben Ulmer
contract PayItBackward is PrevUserTracker {
  /// @notice The owner of the contract.
  address public owner;
  /// @notice The minimum value that can be sent.
  uint constant minValue = 100;  
  /// @notice The previous amount sent.
  uint prevAmountSent = 0;

  constructor() payable public {
      owner = msg.sender;
  }

  /// @notice Emitted when money is sent to the previous user
  /// @param accountAddress The address the amount was sent to
  /// @param amount The amount that was sent
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

  /// @notice Gets the previous amount sent to the previous address.
  /// @return The previous amount sent
  function getPreviousAmountSent() public returns (uint) {
    return prevAmountSent;
  }  

  /// @notice Pay the previous user of this contract
  function send() public payable {
    // Prevent people from sending minimal amounts to set themselves up to receive next.
    require(msg.value >= minValue);
    address payable prev = getLastAddress();
    prev.transfer(msg.value);
    updateLastAddress(msg.sender);
    prevAmountSent = msg.value;
    emit LogSend(prev, msg.value);
  }
}
