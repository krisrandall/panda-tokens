# Panda Tokens

A DAPP to demonstrate the simplicity of smart contracts and Metamask.   


## Live (actually Test :) Instance

Once completed, a live instance will be deployed, with a link to it from here ...



## Development

#### Doing a local dev deploy

First start geth connected to the "Ropsten" testnet :    

```
geth --fast --cache=1048 --testnet --rpc --rpcapi "eth,net,web3" --rpccorsdomain '*' --rpcaddr localhost --rpcport 8545 --unlock 0x4Fcb8b0a22461BB32A7B95Cd7D0dB64fd2767433
```

where the address at the end is one you have created (see 'Getting some Ropsten test ether' below)

Then :    

```
$ truffle compile
$ truffle migrate --network ropsten
$ npm run dev
```

#### Getting some "Ropsten" test ether

1. download Mist
2. run Mist > Develop > Network > Testnet   
 .. it takes a little while to download, ~ 1 hour
3. create a new wallet in Mist    
4. Develop > Start mining      
  .. after this runs for a while (a few hours) you have some test Ether, this can then be transferred to your Metamask account from within Mist
  
#### Starting points for building DAAPs

This project was started by doing a   
`$ truffle init webpack`   
and then adjusting the sample app created.

