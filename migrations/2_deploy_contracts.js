const IPOS = artifacts.require("IPOS");

module.exports = async function (deployer, network, accounts) {
    if (network === "development") return;  // Don't deploy on tests

    let iposFuture = IPOS.new();

    // IPOS wait
    let ipos = await iposFuture;
    console.info("ipos address: " + ipos.address);

};
