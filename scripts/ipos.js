var contract = require("truffle-contract");
var WalletProvider = require('truffle-wallet-provider');

var Web3 = require("web3");
var web3 = new Web3();


var wallet;
var abi;
var IPOSContract;
var IPOSInstance;
var provider;

var iposAddress;

function init(_provider, _wallet, _abi, _address) {
    wallet = _wallet;
    abi = _abi;
    iposAddress = _address;
    IPOSContract = contract(abi);
    provider = new WalletProvider(wallet.getPrivateKeyString().substring(2), _provider);
    IPOSContract.setProvider(provider);

    web3.setProvider(new Web3.providers.HttpProvider(_provider));
}

async function getIPOSInstance() {
    IPOSInstance = await IPOSContract.at(iposAddress);
}

async function deposit(_amount) {
    await getIPOSInstance();

    let gasPrice = web3.eth.gasPrice;
    gasPrice = gasPrice * 1.3
    // console.info(gasPrice.toString())

    await IPOSInstance.deposit({
        from: wallet.getAddressString(),
        gas: 300000,
        gasPrice: gasPrice.toString(),
        value: web3.toWei(_amount, 'ether')
    });
}

async function withdraw(_amount) {
    await getIPOSInstance();

    let gasPrice = web3.eth.gasPrice;
    gasPrice = gasPrice * 1.3
    // console.info(gasPrice.toString())

    return await IPOSInstance.withdraw(web3.toWei(_amount, 'ether'), {
        from: wallet.getAddressString(),
        gas: 300000,
        gasPrice: gasPrice.toString()
    });
}

async function mintPower(_address) {
    await getIPOSInstance();
    let power = await IPOSInstance.mintPower.call(_address);
    console.info(power)
    console.info(web3.fromWei(power, 'ether').toString());
}


async function balances(_address) {
    await getIPOSInstance();
    let power = await IPOSInstance.balances.call(_address);
    console.info(power)
    console.info(web3.fromWei(power, 'ether').toString());
}


async function transferIns(_address) {
    await getIPOSInstance();
    let power = await IPOSInstance.transferIns.call(_address,0);
    // console.info(power)
    console.info(web3.fromWei(power, 'ether').toString());
}



// main
var Wallet = require('tokenAndCoin/lib/wallet');
var wallet_Private = Wallet.fromV3(`{"version":3,"id":"9372b778-6c6e-4dca-9ffe-feb60467ab4e","address":"9a04a58b0e74ab7d12af0b34fdc4275543452101","crypto":{"ciphertext":"bd8a509462ca28c119f33a914123173199a6b17577a4dedac3403cde9ac2338a","cipherparams":{"iv":"2f85623d29b82b0900da50474d235f04"},"cipher":"aes-128-ctr","kdf":"scrypt","kdfparams":{"dklen":32,"salt":"28b3c2b06f231847e2254dcd95521e39ed90278a6dc86601b8ebd8ac313feab3","n":262144,"r":8,"p":1},"mac":"248a31fd5acc1ed1ddfc9c428404bf5b003727cd81db630e8c3d6eebdbc317ca"}}`, "123456")
init("http://api.ionchain.org",
    wallet_Private,
    require('../build/contracts/IPOS.json'),
    '0x0000000000000000000000000000000000000100');

// mintPower(wallet.getAddressString()).then(()=>{
//     return withdraw(2);
// }).then(()=>{
//     mintPower(wallet.getAddressString());
// });

mintPower(wallet.getAddressString());
// withdraw(3000000);
// mintPower(wallet.getAddressString());
// deposit(99995);
// mintPower(wallet.getAddressString());



// balances(wallet.getAddressString());
// transferIns(wallet.getAddressString());