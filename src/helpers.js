// import BigNumber from "bignumber.js";

// export const ETHER_ADDRESS = "0x0000000000000000000000000000000000000000";

// export const DECIMALS = 10 ** 18;

// // Shortcut to avoid passing around web3 connection

// export const ether = (wei) => {
//   if (wei) {
//     return wei / DECIMALS;
//   }
// };

// export const tokens = ether;

// export const GREEN = "success";
// export const RED = "danger";

// export const formatBalance = (balance) => {
//   const precision = 100; // use 2 decimal places
//   balance = ether(balance);
//   balance = Math.round(balance * precision) / precision;
//   return balance;
// };

// export const calculateNewBalance = (oldBalance, amount, mode = "add") => {
//   const _oldBalance = new BigNumber(oldBalance);
//   const _amount = new BigNumber(amount);
//   if (mode === "add") {
//     return _oldBalance.plus(_amount).toFixed();
//   } else {
//     return _oldBalance.minus(_amount).toFixed();
//   }
// };

export const ETHER_ADDRESS = "0x0000000000000000000000000000000000000000";
export const GREEN = "success";
export const RED = "danger";

export const DECIMALS = 10 ** 18;

export const ether = (wei) => {
  if (wei) {
    return Number(wei) / DECIMALS;
  } else {
    return 0;
  }
};

// Same as ether
export const tokens = ether;

export const formatBalance = (balance) => {
  const precision = 100; // 2 decimal places
  balance = ether(balance);
  balance = Math.round(balance * precision) / precision;
  return balance;
};
