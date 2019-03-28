// Simulate a full contribution
const IPOS = artifacts.require("IPOS");
const BlockMiner = artifacts.require("BlockMiner.sol");

var calcG = require('../scripts/calculateGenesis');

contract("IPOS", function (accounts) {

    let ipos;
    let blockMiner;

    let iposAddress;

    it("Deploys all contracts", async function () {

        let iposFuture = IPOS.new();
        ipos = await iposFuture;
        iposAddress = ipos.address;
        console.info("ipos address: " + ipos.address);

        //
        let blockMinerFuture = BlockMiner.new();
        blockMiner = await blockMinerFuture;
        console.info("blockMiner address: " + blockMiner.address);

        //code
        // web3.eth.getCode(iposAddress).then(console.info);

    });

    it("deposit tokens", async function () {

        await ipos.deposit({
            from: accounts[0],
            gas: 300000,
            gasPrice: "2000",
            value: web3.utils.toWei('1', 'ether')
        });

        await wait(11);

        let power = await ipos.mintPower(accounts[0]);

        assert.equal(web3.utils.fromWei(power, 'ether'), 1, `${accounts[0]}'s minePower should equal 1`);

        await ipos.deposit({
            from: accounts[0],
            gas: 300000,
            gasPrice: "2000",
            value: web3.utils.toWei('1', 'ether')
        });

        await wait(11);

        power = await ipos.mintPower(accounts[0]);

        assert.equal(web3.utils.fromWei(power, 'ether'), 2, `${accounts[0]}'s minePower should equal 2`);



    });


    it("withdraw token", async function () {

        let beforeBalance = await web3.eth.getBalance(accounts[0]);
        console.info(`before withdraw balance ${beforeBalance}`);

        await ipos.withdraw(web3.utils.toWei('1', 'ether'), {
            from: accounts[0],
            gas: 300000,
            gasPrice: "20000000000",
        });

        let power = await ipos.mintPower(accounts[0]);

        let afterBalance = await web3.eth.getBalance(accounts[0]);
        console.info(`after withdraw balance ${afterBalance}`);


        assert.equal(web3.utils.fromWei(power, 'ether'), 1, `${accounts[0]}'s minePower should equal 1`);

    });

    // 等待区块
    async function wait(_amount) {

        // web3.eth.getBlockNumber().then(function (num) {
        //     console.info(`before ${num}`);
        // });

        for (let i = 0; i < _amount; i++) {
            await blockMiner.mine();
        }

        // web3.eth.getBlockNumber().then(function (num) {
        //     console.info(`after ${num}`);
        // })
    }

});

