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

#### Doing a "Ropsten" local dev deploy

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
  


## Running locally with a local eth node

See [these instructions for creating a local node](https://github.com/krisrandall/codecave_ethereum_blockchain).

Start up your node with something like :

```
$ geth --datadir /projects/local_ethereum_blockchain/node1 --networkid 61 console --rpc --rpcport 8545 
```

**Then** : Create 3 addresses (`personal.newAccount('password')` x 3) and copy them into the recepients file (*recepient\_descriptions*) in `app/javascripts/config.js`

**Also** : Do `personal.unlockAccount( eth.accounts[0], 'password' )` so the account is unlocked for the next steps, and also start mining `miner.start(1)` 

#### Manually deploy the contrats doing the following :

1. Go to remix : [https://remix.ethereum.org/](https://remix.ethereum.org/)
2. Open the PandaToken.sol and PandaProject.sol files
3. Start with the PandaToken, click "Compile" then "Details", select the "WEB3DEPLOY" code and paste it into your `geth` terminal (started above)
4. Note the contract address (copy it) - paste it into `app/javascripts/config.js` as *contract\_locations.panda\_token* (but also keep it copied for the next step)
5. Now in remix open the PandaProject, click "Compile", then "Details", select the "WEB3DEPLOY" code, but before pasting it in to the `geth` terminal set the following :

 * projectName = "whatever you like"
 * recipientAddresses = [ array of 3 "addresses" from `testrpc` terminal ]
 * recipientShares = [ 50, 30, 20 ]
 * pandaTokenContractAddr = "address copied in step 4 above"
6. After you paste this into `geth` grab the returned address and paste it into `config.js` as the *panda\_project* contract location

#### Finally, run the dApp locally

```
$ npm run dev
```

[http://localhost:8080/](http://localhost:8080/)

and change Metamask to "Localhost 8545"

Note that to donate you will need some ether in your Metamask account - you can transfer to it by copying that address from Metamask and sending the ether from the `geth` terminal : `eth.sendTransaction({from: eth.accounts[0], to: "<Metamask account>", value: web3.toWei(1, "ether")})`



### Trouble shooting

* "A bad HTTP response code (404) was received when fetching the script".   
  [https://github.com/vuejs-templates/webpack/issues/446#issuecomment-278503745](https://github.com/vuejs-templates/webpack/issues/446#issuecomment-278503745)


* "Error: Error: VM Exception while executing eth_call: invalid opcode".   
   [This is a bug with "testrpc", you cannot use "testrpc" for this](https://github.com/ethereumjs/testrpc/issues/345)
   
* "Error: exceeds block gas limit undefined"    
  You need some more ether, allow the miner to work for a little while
 
* Metamask Donate 0.1 ETH fails, and error says : "Error: invalid sender".      
  [Contract built with old ethereum client](https://ethereum.stackexchange.com/a/15635/19779) - upate your local ethereum client or backdate Metamask.   
  **OR - ensure your network id matches the chainID in your genesis.json file**
  
## Starting points for building DAAPs

This project was started by doing a   
`$ truffle init webpack`   
and then adjusting the sample app created.




