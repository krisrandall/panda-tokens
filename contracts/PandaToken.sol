pragma solidity ^0.4.11;
contract PandaToken { 

    mapping (address => uint256) public balances;
    address public owner;

    function PandaToken() {
        owner = msg.sender;
    }

    ///  @notice Give free tokens to a recipient
    function tokenFaucet(address whom, uint256 amount) public returns (uint256) {
        balances[whom] += amount;
        return balances[whom];
    }

    /// @notice Send tokens from the sender address to another address
    /// @param amount Amount of tokens to send
    /// @param destination Account to receive tokens
    /// @return Remaining balance of sender
    function sendTokens(uint256 amount, address destination) public returns (uint256 remainingBal) {
        if(balances[msg.sender] >= amount) {
            balances[msg.sender] -= amount;
            balances[destination] += amount;           
        }

        return balances[msg.sender];
    }

    /// @notice Get balance
    /// @return The balance of the sender
    function balance() constant returns (uint256) {
        return balances[msg.sender];
    }

    function () {
        revert();
    }
}
