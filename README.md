## IPOSContract

本项目是`ionchain-core`中保证金合约，在保证金合约中存储`POS`矿工的算力

## 编译合约

使用`solc`编译`ipos.sol`合约，将编译后的代码拷贝到`genesis.json`中的`code`变量中

```angular2html
solc --optimize --bin-runtime ./contracts/ipos.sol
```

## 生成创世矿工的算力

`ionchain-core`是使用`POS`共识算法，所以需要在创世区块中生成一批创世矿工及矿工所拥有的算力

```angular2html
node ./scripts/batchGenesis.js
```

将脚本输出的字符串拷贝入`genesis.json`中的`storage`变量中



## 创始区块

创建创世区块，并命名为`gensis.json`

```angular2html
{
		  "config": {
			"chainId": 1
		  },
		  "alloc": {},
			"0x0000000000000000000000000000000000000100": {
			  "code": "编译后的合约代码",
			  "storage": {},
			  "balance": "所有矿工算力的综合"
			}
		  },
		  "coinbase": "0x0000000000000000000000000000000000000000",
		  "difficulty": "0x01",
		  "extraData": "0x777573686f756865",
		  "gasLimit": "0x47e7c4",
		  "nonce": "0x0000000000000001",
		  "mixhash": "0x0000000000000000000000000000000000000000000000000000000000000000",
		  "parentHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
		  "timestamp": "0x00",
		  "baseTarget": "0x1bc4fd6588",
		  "blockSignature": "0x00",
		  "generationSignature": "0x00"
		}
```

### 几点需要注意的地方

1. 创世块合约`0x0000000000000000000000000000000000000100`的余额，创始区块的余额应为目前所有矿工的算力总和
