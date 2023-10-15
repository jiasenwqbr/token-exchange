import { tokens, EVM_REVERT } from "./helper";
const Token = artifacts.require("./JasonToken");
require("chai").use(require("chai-as-promised")).should();

contract("Token", ([deployer, receiver, exchange]) => {
  const name = "Jason Token";
  const symbol = "JT";
  const decimals = "18";
  const totalSupply = tokens(1000000).toString();
  let token;
  beforeEach(async () => {
    token = await Token.new();
  });

  describe("deployment", () => {
    it("tracts the name ", async () => {
      const result = await token.name();
      result.should.equal(name);
    });
    it("tracks the symbol", async () => {
      const result = await token.symbol();
      result.should.equal(symbol);
    });

    it("tracks the decimals", async () => {
      const result = await token.decimals();
      result.toString().should.equal(decimals);
    });
    it("tracks the total supply", async () => {
      const result = await token.totalSupply();
      result.toString().should.equal(totalSupply);
    });
  });

  describe("sending tokens", () => {
    let result;
    let amount;
    describe("success", async () => {
      beforeEach(async () => {
        amount = tokens(100);
        result = await token.transfer(receiver, amount, { from: deployer });
      });

      it("transfer token balances", async () => {
        let balanceOf;
        balanceOf = await token.balanceOf(deployer);
        balanceOf.toString().should.equal(tokens(999900).toString());
        balanceOf = await token.balanceOf(receiver);
        balanceOf.toString().should.equal(tokens(100).toString());
      });

      it("emits a transfer event", async () => {
        const log = result.logs[0];
        log.event.should.eq("Transfer");
        const event = log.args;
        event.from.toString().should.equal(deployer, "from is correct");
        event.to.toString().should.equal(receiver, "to is correct");
        event.value
          .toString()
          .should.equal(amount.toString(), "amount is correct");
      });
    });

    describe("failure", async () => {
      it("rejects insufficient balances", async () => {
        let invalidAccount;
        invalidAccount = tokens(100000000); // 100 million - greater than total supply
        await token
          .transfer(receiver, invalidAccount, { from: deployer })
          .should.be.rejectedWith(EVM_REVERT);

        invalidAccount = tokens(10); // recipient has no tokens
        await token
          .transfer(deployer, invalidAccount, { from: receiver })
          .should.be.rejectedWith(EVM_REVERT);
      });

      it("rejects invalid recipients", async () => {
        await token.transfer(0x0, amount, { from: deployer }).should.be
          .rejected;
      });
    });
  });
  describe("approve", () => {
    let result;
    let amount;
    beforeEach(async () => {
      amount = tokens(100);
      result = await token.approve(exchange, amount, { from: deployer });
    });
    describe("success", () => {
      it("allocates an allowance for delegated token spending on exchange", async () => {
        const allowance = await token.allowance(deployer, exchange);
        allowance.toString().should.equal(amount.toString());
      });
      it("emits on Approval event", async () => {
        const log = result.logs[0];
        log.event.should.eq("Approval");
        const event = log.args;
        // console.log('deployer',deployer)
        // console.log('receiver',receiver)
        // console.log('exchange',exchange)
        // console.log('log.args',log.args)
        event.from.toString().should.equal(deployer, "owner is correct");
        event.to.toString().should.equal(exchange, "spender is correct");
        event.amount
          .toString()
          .should.equal(amount.toString(), "amount is correct");
      });
    });
  });
  describe("Transfer From", async () => {
    let result;
    let amount;
    beforeEach(async () => {
      amount = tokens(100);
      await token.approve(exchange, amount, { from: deployer });
    });
    describe("success", async () => {
      beforeEach(async () => {
        amount = tokens(100);
        result = await token.transferFrom(deployer, receiver, amount, {
          from: exchange,
        });
      });
      it("transfer token balance ", async () => {
        let balanceOf;
        balanceOf = await token.balanceOf(deployer);
        balanceOf.toString().should.equal(tokens(999900).toString());
        balanceOf = await token.balanceOf(receiver);
        balanceOf.toString().should.equal(tokens(100).toString());
      });
      it("resets the allowance", async () => {
        const allowance = await token.allowance(deployer, exchange);
        allowance.toString().should.equal("0");
      });
      it("emits a Approval event", async () => {
        const log = result.logs[0];
        //console.log('result',result)
        log.event.should.eq("Approval");
        const event = log.args;
        //console.log('event',event)
        event.from.toString().should.equal(deployer, "from is correct");
        event.to.should.equal(exchange, "to is correct");
        event.amount
          .toString()
          .should.equal(tokens(0).toString(), "value is correct");
      });
    });
  });
});
