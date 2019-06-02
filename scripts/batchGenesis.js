var Web3 = require('web3');

var web3 = new Web3();

var _ = require('underscore');
_.str = require('underscore.string');
_.mixin(_.str.exports());


function testBalances(senderAddress) {
    let newKey = mapLocation(1, senderAddress);
    // console.info('balance key: ' + newKey);
    return newKey;
}

//////////////
function testGenesisMintPower(senderAddress) {
    //test
    let newKey = mapLocation(2, senderAddress);
    // console.info('genesis key: ' + newKey);
    return newKey;

}


function calcAmount(_amount) {
    _amount = web3.toWei(_amount, 'ether');
    _amount = web3.toHex(_amount);
    _amount = _amount.substring(2);
    if (_amount.length % 2 == 0) {
        _amount = "0x" + _amount;
    } else {
        _amount = "0x0" + _amount;
    }
    // console.info('amount: ' + _amount);

    return _amount;

}

// calcAmount(100000000);//1亿

function mapLocation(slot, key) { // 32 byte ,256 bit
    // return uint256(keccak256(key, slot));
    key = _.pad(key, 64, '0');
    slot = _.pad(slot, 64, '0');
    key = key + slot;

    return web3.sha3(key, {"encoding": "hex"})

}

function arrLocation(slot, index, elementSize) {
    // return uint256(keccak256(slot)) + (index * elementSize);

    slot = _.pad(slot, 64, '0');
    slotHash = web3.sha3(slot, {"encoding": "hex"});
    return increaseHexByX(slotHash, index * elementSize)

}

function increaseHexByOne(hex) {
    let x = new web3.toBigNumber(hex);
    let sum = x.add(1);
    let result = '0x' + sum.toString(16);
    return result
}

function increaseHexByX(hex, n) {
    let x = new web3.toBigNumber(hex);
    let sum = x.add(n);
    let result = '0x' + sum.toString(16);
    return result
}


// main
let storage = {};
storage["0x0000000000000000000000000000000000000000000000000000000000000000"]="0x1680"; //初始化stakeMinAge

function batch(senderAddress, _amount) {
    // console.info("address: " + senderAddress);
    let balanceKey = testBalances(senderAddress);
    let genesisKey = testGenesisMintPower(senderAddress);
    let amountHex = calcAmount(_amount);

    storage[balanceKey] = amountHex;
    storage[genesisKey] = amountHex;

}

var accounts = [
    {"account": "0x1ac505f02e6a6aa7abb1b8b99c7c43bc53dba2de", "amount": 100000},
    {"account": "0xb161119d490a1d2aedfa78f54ec31f72b1408896", "amount": 100000},
    {"account": "0x5a211c7e5aedb31c2195d32c477d1f835103e927", "amount": 100000},


];

for (let i = 0; i < accounts.length; i++) {

    batch(accounts[i].account, accounts[i].amount);
}

console.info(storage);