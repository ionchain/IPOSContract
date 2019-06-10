const BlockTime = 15; // 出块时间

const Max_BALANCE_IONC = 300000; // 保证金合约的总余额


var target = 2 ** 63 / (BlockTime * Max_BALANCE_IONC);
target = Math.floor(target);

var targetHex = target.toString(16);

targetHex = targetHex.length % 2 == 0 ? targetHex : "0" + targetHex;
targetHex = "0x" + targetHex;
console.info(targetHex); // baseTarget