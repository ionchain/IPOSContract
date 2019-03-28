```
truffle migrate --network development_migrate -f 2 
```

编译合约：

```angular2html
solc --optimize --bin-runtime ./contracts/ipos.sol
```


### 几点需要注意的地方

1. 创世块合约的余额

2. 创世块stakeAge 需要在genesis.json 中配置