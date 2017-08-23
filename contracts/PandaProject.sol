pragma solidity ^0.4.11;
import "./PandaToken.sol"; 


contract PandaProject {

    string public name;
    address[] public owners;
    PandaToken public pandaTokenContract;

    string[] public debug_log;
    uint[] public debug_log_of_numbers;

    uint exchangeRate = 2;

    struct Distribution {
        address recipient;
        uint256 share;
    }

    struct Donation {
        address donor;
        uint256 amount;
    }

    Distribution[] public distributions;


function toString(address x) returns (string) {
    bytes memory b = new bytes(20);
    for (uint i = 0; i < 20; i++) {
        b[i] = byte(uint8(uint(x) / (2**(8*(19 - i)))));
    }
    return string(b);
}

    function PandaProject(string projectName, address[] recipientAddresses, uint256[] recipientShares, address pandaTokenContractAddr) {
        owners.push(msg.sender);
        name = projectName;
        pandaTokenContract = PandaToken(pandaTokenContractAddr);

        debug_log.push("here, about to do loop");
        debug_log.push("here we go...");
        debug_log_of_numbers.push(recipientAddresses.length);


        uint j;
        for (j=0; j<recipientAddresses.length; j++) {
            debug_log.push(toString(recipientAddresses[j]));
            distributions.push(Distribution({
                recipient: recipientAddresses[j],
                share: recipientShares[j]
            }));
        }

        debug_log.push("finished");
    }

    /// @notice Donate panda tokens to this project. Tokens are distributed among recipients
    function donate() payable returns (bool) {

        Distribution memory distribution;
        uint remainingAmount;
        remainingAmount = msg.value;

        // 1. run the donation through the standard distribution but transfer ETH
        uint i;
        for( i = 0; i < distributions.length; i++) {
            distribution = distributions[i];
            uint distAmount = msg.value * distribution.share / 100;
            remainingAmount -= distAmount;
            distribution.recipient.transfer( distAmount );
        }

        // allocate a panda token per eth allocated
        uint pandaTokens = msg.value * exchangeRate;

        // 2. allocat PAN to msg.sender 
        pandaTokenContract.tokenFaucet( msg.sender, pandaTokens );
    }
       

    modifier onlyOwner() {
        if (isOwner(msg.sender)) 
            _;
    }   

    function kill() onlyOwner {
        suicide(msg.sender);
    }
    

    function isOwner(address owner) returns (bool) {
        uint i = 0;
        bool found = false;
        for (i=0; i<owners.length; i++) {
            if (owners[i] == owner) {
                found = true;
                break;
            }
        }
        return found;
    }

    function addOwner(address newOwner) onlyOwner {
       owners.push(newOwner); 
    }
    
    function removeOwner(address ownerToRemove) onlyOwner {
        if (owners.length == 1) {
            revert(); //Can't remove all owners
        }
        else {
            uint i = 0;
            for (i=0; i<owners.length; i++) {
                if (owners[i] == ownerToRemove) {
                    delete owners[i];
                    break;
                }
            }
        }          
    } 


    function () {
        revert();
    }
}