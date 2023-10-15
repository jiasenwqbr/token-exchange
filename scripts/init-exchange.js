// Contracts
const Token = artifacts.require("JasonToken");
const Exchage = artifacts.require("Exchange");
// utils
const ETHER_ADDRESS = "0x0000000000000000000000000000000000000000";
const ether = (n) => {
  return new web3.utils.BN(web3.utils.toWei(n.toString(), "ether"));
};
// same as ether
const tokens = (n) => ether(n);
const wait = (s) => {
  const milliseconds = s * 1000;
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};
module.exports = async function (callback) {
  try {
    // Fetch accounts from wallet - these are unlocked
    const accounts = await web3.eth.getAccounts();
    console.log("accounts:", accounts);

    // Fetch the deployed token
    const token = await Token.deployed();
    console.log("Token fetched", token.address);

    // Fetch the delpoyed exchange
    const exchange = await Exchage.deployed();
    console.log("Exchange fetched", exchange.address);

    // Give tokens to account[1]
    const sender = accounts[0];
    const receiver = accounts[1];
    let amount = web3.utils.toWei("10000", "ether"); // 10000 tokens

    await token.transfer(receiver, amount, { from: sender });
    console.log(`Transferred ${amount} tokens from ${sender} to ${receiver}`);

    //Set up exchange users
    const user1 = accounts[0];
    const user2 = accounts[1];

    // User 1 Deposit Ether
    amount = 1;
    await exchange.depositEther({ from: user1, value: ether(amount) });
    console.log(`Deposit ${amount} Ether from ${user1}`);

    // User 2 Approves Tokens
    amount = 1000;
    await token.approve(exchange.address, tokens(amount), { from: user2 });
    console.log(`Approved ${amount} tokens from ${user2}`);

    // User 2 Deposit Tokens
    await exchange.depositToken(token.address, tokens(amount), { from: user2 });
    console.log(`Deposited ${amount} tokens from ${user2}`);

    /////////////////////////////////////////////////////////////////
    // Send a Canceled Order
    //

    // User 1 makes order to get tokens
    let result;
    let orderId;
    result = await exchange.makeOrder(
      token.address,
      tokens(100),
      ETHER_ADDRESS,
      ether(0.1),
      { from: user1 }
    );
    console.log(`Made order from ${user1}`);

    // user 1 cancells order
    orderId = result.logs[0].args.id;
    await exchange.cancelOrder(orderId, { from: user1 });
    console.log(`Cancelled order from ${user1}`);

    ///////////////////////////////////////////////////////////////////////////
    // Seed open orders
    // user 1 makes 10 orders
    for (let i = 1; i <= 10; i++) {
      result = await exchange.makeOrder(
        token.address,
        tokens(10 * i),
        ETHER_ADDRESS,
        ether(0.01),
        { from: user1 }
      );
      console.log(`make order from ${user1}`);
      await wait();
    }

    // user 2 make 10 orders
    for (let i = 1; i <= 10; i++) {
      result = await exchange.makeOrder(
        ETHER_ADDRESS,
        ether(0.01),
        token.address,
        tokens(10 * i),
        { from: user2 }
      );
      console.log(`make order from ${user2}`);
      await wait();
    }
  } catch (error) {
    console.log(error);
  }
  callback();
};
