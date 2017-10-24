pragma solidity ^0.4.11;



contract PandaToken { 

    address public contractOwner;
    mapping (address => uint256) private balances;
    uint256 private _totalSupply;
    mapping(address => mapping (address => uint256)) allowed;
    string public constant symbol = "PAN";
    string public constant name = "Panda Token";
    uint8 public constant decimals = 17;

    function PandaToken() public {
        contractOwner = msg.sender;
    }

    function isContractOwner(address _address) internal view returns (bool) {
        return ( _address == contractOwner);
    }

    modifier onlyContractOwner() {
        require(isContractOwner(msg.sender));
        _;
    }

    // Get the total token supply
    function totalSupply() public constant returns (uint256 ts) {
        return _totalSupply; 
    }

    // Get the account balance of _owner
    function balanceOf(address _owner) public constant returns (uint256 balance) {
        return balances[_owner];
    }

    // Send _value amount of tokens to address _to
    function transfer(address _to, uint256 _amount) public returns (bool success) {
        if (
            balances[msg.sender] >= _amount 
            && _amount > 0
            && balances[_to] + _amount > balances[_to]
        ) 
        {
            balances[msg.sender] -= _amount;
            balances[_to] += _amount;
            Transfer(msg.sender, _to, _amount);
            return true;
        } 
        else {
            return false;
        }
    }

    // Send _value amount of tokens from address _from to address _to
    function transferFrom(
        address _from,
        address _to,
        uint256 _amount
    ) public returns (bool success) 
    {
        //If the origin account has enough funds,
        //and the sender is allowed to transfer that amount from the origin account,
        //and the amount is more than zero
        //(and an extra check to ensure that we're not sending an effectively negative amount)
        if (
            balances[_from] >= _amount
            && allowed[_from][msg.sender] >= _amount
            && _amount > 0
            && balances[_to] + _amount > balances[_to]) 
        {
            balances[_from] -= _amount;
            allowed[_from][msg.sender] -= _amount;
            balances[_to] += _amount;
            Transfer(_from, _to, _amount);
            return true;
        } 
        else {
            return false;
        }
    }

    // Allow _spender to withdraw from your account, multiple times, up to the _value amount.
    function approve(address _spender, uint256 _value) public returns (bool success) {
        allowed[msg.sender][_spender] = _value;
        Approval(msg.sender, _spender, _value);
        return true;
    }

    // Returns the amount which _spender is still allowed to withdraw from _owner
    function allowance(address _owner, address _spender) public constant returns (uint256 remaining) {
        return allowed[_owner][_spender];
    }


    // Triggered when tokens are transferred.
    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    // Triggered whenever approve(address _spender, uint256 _value) is called.
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);

    // Give free tokens to a recipient
    function tokenFaucet(address whom, uint256 amount) public returns (uint256) {
        if (amount > 0 && (balances[whom] + amount > balances[whom])) {
            balances[whom] += amount;
            _totalSupply += amount;
        }
        return balances[whom];
    }

    function () public {
        revert();
    }
}
