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
storage["0x0000000000000000000000000000000000000000000000000000000000000000"]="0x21c0"; //初始化stakeMinAge

function batch(senderAddress, _amount) {
    // console.info("address: " + senderAddress);
    let balanceKey = testBalances(senderAddress);
    let genesisKey = testGenesisMintPower(senderAddress);
    let amountHex = calcAmount(_amount);

    storage[balanceKey] = amountHex;
    storage[genesisKey] = amountHex;

}

var accounts = [
    {"account": "0x1ac505f02e6a6aa7abb1b8b99c7c43bc53dba2de", "amount": 1},
    {"account": "0xb161119d490a1d2aedfa78f54ec31f72b1408896", "amount": 2},
    {"account": "0x5a211c7e5aedb31c2195d32c477d1f835103e927", "amount": 4},
    {"account": "0xb0ddb82c112bc898d95a506690fc85abeac125f3", "amount": 8},
    {"account": "0x1ae861cdadf036c4982f4ee1355ea51261dee981", "amount": 16},
    {"account": "0x41a1d899fb0ed0d71075a93fad6e6bc68fb3c046", "amount": 32},
    {"account": "0xaa8f398a08bb8666a79fb549cbcd4aac51b27b16", "amount": 64},
    {"account": "0xb7f295d3b0925c2fd8448744290cdccd30fbde98", "amount": 128},
    {"account": "0xecf12ec50a815c7941e6b621931bd149f4d3aeff", "amount": 256},
    {"account": "0x814da63e20e04b3e0c28a0baabf1585364a0fde5", "amount": 512},
    {"account": "0x0ca0943a8c11f261825e37d3a459d92ef049e58d", "amount": 1024},
    {"account": "0xe38a7d4bcaa472101a231ad44c0652583e39fa7a", "amount": 2048},
    {"account": "0x3c219595c375b6d76bf63040f911a7a84a19616f", "amount": 4096},
    {"account": "0x425e6e7a6ce79cdec910f980916a4f8391b1d9cc", "amount": 8192},
    {"account": "0xbe5b04af97802ec39504380aa07006f8e5c3b9db", "amount": 16384},
    {"account": "0xd80fdc96a68694355f8fde2c9eab204339003f69", "amount": 32768},
    {"account": "0xf2fc07711cb7f1c75330fe33dfc848f0c069572d", "amount": 65536},
    {"account": "0x4baa10f8cf11660d1a06669381ba93f8fe0ad22c", "amount": 131072},
    {"account": "0x9a04a58b0e74ab7d12af0b34fdc4275543452101", "amount": 262144},
    {"account": "0x80e0a788ba2318cb672bfd27fb3ceb9ef2a58595", "amount": 1048576},
    {"account": "0x19a377b4cc1446a95f354fc7adf36d144e61cfaa", "amount": 2097152},
    {"account": "0x223b2df20b5f1b4a3a3b931af4ca57e255a897cd", "amount": 4194304},
    {"account": "0x5005534356361e9e905499fe31fba32842cacf08", "amount": 8388608},
    {"account": "0x0e99cb7e59763e31db852c9a2eeb93002b5e8605", "amount": 16777216},
    {"account": "0xed64d1986e7861d0c51c0c5d24a91eb80340da62", "amount": 33554432},
    {"account": "0xc9f6b0b48d4a69aed30902d4250919e46ae1168d", "amount": 67108864},
    {"account": "0x66a9427c0a001e85c8b5b900dd0ee032c9cf2330", "amount": 134217728},
    {"account": "0x7a261075c737163ae2525f271717f3dbf5450b8c", "amount": 268435456},
    {"account": "0x0148ed09d405120a7dde3c010b2e5a6bc344a331", "amount": 263129089},
    //test
    {"account": "0xeb680f30715f347d4eb5cd03ac5eced297ac5046", "amount": 800000000},

]

for (let i = 0; i < accounts.length; i++) {

    batch(accounts[i].account, accounts[i].amount);
}

console.info(storage);