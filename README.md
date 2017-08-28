![](images/icon.png)
#   Panda Tokens
*A DAPP to demonstrate the simplicity of smart contracts and Metamask.*

----

### PLEASE NOTE THIS IS JUST A PROOF OF CONCEPT AND IS NOT PRODUCTION-READY CODE

----

It has the following functionality :   

* detect Metamask installed, and Metamask account setup.  
* allow donation of 0.1 ETH which results in the smart contract distributes to it's registered recipients and the donor being allocated 2 panda tokens.  
* the % distributions are read from the contract and displayed on the webpage.  
* the demo is on the test "Ropsten" and the addresses link to ropsten.etherscan.io so you can see that the donations are really happening. 


## "Live" (Ropsten testnet) Instance

#### Panda Token demo URL : [http://krisrandall.github.io/panda-tokens/](http://krisrandall.github.io/panda-tokens/)
 
 
You can easily create a new account using Metamask (just remember to change to "Ropsten" first after installing it).    

You will need some test Ether in order to donate, your can mine for it using Mist on testnet (see "Getting some test ether" below).


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

