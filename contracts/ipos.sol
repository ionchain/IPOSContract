pragma solidity ^0.5.0;

import "./SafeMath.sol";

contract IPOS {
    using SafeMath for uint256;

    uint public stakeMinAge = 8640; // minimum age for coin age: 1D

    struct transferInStruct {
        uint256 amount;
        uint256 fromBlock;
    }

    mapping(address => uint256) public balances;
    mapping(address => uint256) public genesisMintPower;
    mapping(address => transferInStruct[]) public transferIns;


    // deposit
    function deposit() public payable returns (bool) {

        balances[msg.sender] = balances[msg.sender].add(msg.value);

        uint256 hasZero = 0;


        for (uint i = 0; i < transferIns[msg.sender].length; i++) {
            if (transferIns[msg.sender][i].amount == 0) {
                transferIns[msg.sender][i].amount = msg.value;
                transferIns[msg.sender][i].fromBlock = getBlockNumber();
                hasZero = 1;
            }
        }


        if (hasZero == 0) {
            transferIns[msg.sender].push(transferInStruct(msg.value, getBlockNumber()));
        }

        return true;
    }
    // withdraw
    function withdraw(uint256 _amount) public returns (bool){

        balances[msg.sender] = balances[msg.sender].sub(_amount);

        uint256 _remain = _amount;

        if (genesisMintPower[msg.sender] > 0) {
            if (genesisMintPower[msg.sender] >= _remain) {
                genesisMintPower[msg.sender] = genesisMintPower[msg.sender].sub(_remain);
                transferIns[msg.sender].push(transferInStruct(genesisMintPower[msg.sender], getBlockNumber()));
                _remain = 0;
                delete genesisMintPower[msg.sender];
            } else {
                _remain = _remain.sub(genesisMintPower[msg.sender]);
                delete genesisMintPower[msg.sender];
            }
        }

        uint256 _now = getBlockNumber();

        for (uint i = 0; i < transferIns[msg.sender].length && _remain > 0; i++) {

            if (_now > transferIns[msg.sender][i].fromBlock.add(stakeMinAge)) {
                if (transferIns[msg.sender][i].amount >= _remain) {
                    transferIns[msg.sender][i].amount = transferIns[msg.sender][i].amount.sub(_remain);
                    _remain = 0;
                    transferIns[msg.sender][i].fromBlock = _now;
                } else {
                    _remain = _remain.sub(transferIns[msg.sender][i].amount);
                    delete transferIns[msg.sender][i];
                }
            }
        }

        for (uint i = 0; i < transferIns[msg.sender].length && _remain > 0; i++) {

            if (_now <= transferIns[msg.sender][i].fromBlock.add(stakeMinAge)) {
                if (transferIns[msg.sender][i].amount >= _remain) {
                    transferIns[msg.sender][i].amount = transferIns[msg.sender][i].amount.sub(_remain);
                    _remain = 0;
                    transferIns[msg.sender][i].fromBlock = _now;
                } else {
                    _remain = _remain.sub(transferIns[msg.sender][i].amount);
                    delete transferIns[msg.sender][i];
                }
            }
        }

        assert(_remain == 0);
        // 合约给用户转账
        msg.sender.transfer(_amount);

        return true;
    }

    // 计算用户的算力
    function mintPower(address _address) public view returns (uint _power){
        if (genesisMintPower[_address] > 0) {
            _power = genesisMintPower[_address];
        }

        uint256 _now = getBlockNumber();

        for (uint i = 0; i < transferIns[_address].length; i++) {
            if (_now > transferIns[_address][i].fromBlock.add(stakeMinAge)) {
                _power = _power.add(transferIns[_address][i].amount);
            }
        }
    }

    function getBlockNumber() internal view returns (uint256) {
        return block.number;
    }

}