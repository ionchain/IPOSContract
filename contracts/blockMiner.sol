pragma solidity ^0.5.0;
// file: BlockMinder.sol

// used to "waste" blocks for truffle tests
contract BlockMiner {

    uint blocksMined;

    constructor() public {
        blocksMined = 0;
    }

    function mine() public {
        blocksMined += 1;
    }
}