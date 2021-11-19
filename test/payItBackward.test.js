
const { catchRevert } = require("./exceptionsHelpers.js");
var PayItBackward = artifacts.require("./PayItBackward.sol");

contract("PayItBackward", function (accounts) {
  const [contractOwner, bob] = accounts;
  const deposit = web3.utils.toBN(2);

  beforeEach(async () => {
    instance = await PayItBackward.new();
  });

  it("is owned by owner", async () => {
    assert.equal(
      await instance.owner.call(),
      contractOwner,
      "owner is not correct",
    );
  });

  it("requires a minimum amount to be sent", async () => {
    var expectedErr = null;
    try {
      await instance.send({
        from: bob,
        value: 1,
      });
    } catch (err) {
      expectedErr = err;
    }
    assert(expectedErr != null, "should not allow 1 to be sent");
  });

  it("should pay the creator of the contract first", async () => {
    const amountToSend = 100;
    const result = await instance.send({
        from: bob,
        value: amountToSend,
    });

    const expectedEventResult = { accountAddress: contractOwner, amount: amountToSend };

    const logAccountAddress = result.logs[0].args.accountAddress;
    const logDepositAmount = result.logs[0].args.amount.toNumber();

    assert.equal(
      expectedEventResult.accountAddress,
      logAccountAddress,
      "LogSend event accountAddress property not correctly emitted",
    );

    assert.equal(
      expectedEventResult.amount,
      logDepositAmount,
      "LogSend event amount property not emitted",
    );
  });

  it("should pay the previous sender the amount", async () => {
    const amountToSend = 200;
    await instance.send({
        from: bob,
        value: 100,
    });

    const result = await instance.send({
        from: contractOwner,
        value: amountToSend,
    });

    const expectedEventResult = { accountAddress: bob, amount: amountToSend };

    const logAccountAddress = result.logs[0].args.accountAddress;
    const logDepositAmount = result.logs[0].args.amount.toNumber();

    assert.equal(
      expectedEventResult.accountAddress,
      logAccountAddress,
      "LogSend event accountAddress property not correctly emitted",
    );

    assert.equal(
      expectedEventResult.amount,
      logDepositAmount,
      "LogSend event amount property not emitted",
    );
  });

  it("should let the owner see the previous sender", async () => {
    await instance.send({
        from: bob,
        value: 100,
    });

    const result = await instance.getLastUser.call({from: contractOwner});
    assert.equal(
      result,
      bob,
      "Contract owner unable to see previous sender",
    );
  });

  it("should have the initial previously sent value be 0", async () => {
    const result = await instance.getPreviousAmountSent.call({from: bob});
    assert.equal(
      result,
      0,
      "Initial previous amount sent is not 0",
    );
  });

  it("should correctly display the previously sent value", async () => {
    await instance.send({
        from: bob,
        value: 100,
    });

    const result = await instance.getPreviousAmountSent.call({from: bob});

    assert.equal(
      result,
      100,
      "The previous amount sent was not correctly returned as 100",
    );
  });

  it("should not let anyone else see the previous sender", async () => {
    var expectedErr = null;
    var exposedAddress = null;
    try {
      await instance.send({
        from: bob,
        value: 100,
      });
      exposedAddress = await instance.getLastUser.call({from: bob});
    } catch (err) {
      expectedErr = err;
    }
    assert(expectedErr != null, "should error our making a call to see previous address");
    assert(exposedAddress == null, "should not expose previous address");
  });
});
