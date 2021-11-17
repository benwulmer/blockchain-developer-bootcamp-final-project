var SimpleBank = artifacts.require("./PayItBackward.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleBank);
};
