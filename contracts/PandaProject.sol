pragma solidity ^0.4.11;
import "./PandaToken.sol"; 


contract PandaProject {

    bytes32 public name;
    address[] public owners;
    PandaToken public pandaTokenContract;

    struct Distribution {
        address recipient;
        uint256 share;
    }

    struct Donation {
        address donor;
        uint256 amount;
    }

    Distribution[5] public distributions;

    function PandaProject(bytes32 projectName, address[5] recipientAddresses, uint256[5] recipientShares, address pandaTokenContractAddr) 
    {
        owners.push(msg.sender);
        name = projectName;
        pandaTokenContract = PandaToken(pandaTokenContractAddr);
        for (uint i=0; i < recipientAddresses.length; i++) {
            distributions[i] = Distribution({
                recipient: recipientAddresses[i],
                share: recipientShares[i]
            });
        }
    }

    /// @notice Donate panda tokens to this project. Tokens are distributed among recipients
    function donate(uint256 totalAmount) {
        Distribution memory distribution;
        uint256 remainingAmount;
        remainingAmount = totalAmount;

        for(uint i = 0; i < distributions.length; i++) {
            distribution = distributions[i];
            uint256 distAmount = totalAmount * distribution.share / 100;
            remainingAmount -= distAmount;
            pandaTokenContract.sendTokens(distAmount, distribution.recipient); //Send tokens from sender to recipient
        }
        //If any remaining, give to random recipient
        //TODO: Make random. Using first recipient as placeholder
        pandaTokenContract.sendTokens(remainingAmount, distributions[0].recipient);
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

    
    //Sending ether to this contract is not allowed
    function () {
        revert();
    }
}