// SPDX-License-Identifier: MIT

pragma solidity >=0.8.9 <0.9.0;
library SafeMath {
    function mul(uint a,uint b) internal pure returns (uint){
        if (a == 0){
            return 0;
        }
        uint c = a * b;
        assert(c / a == b);
        return c;
    }
    function div(uint a,uint b) internal pure returns (uint) {
        // assert(b > 0); // Solidity automatically throws when dividing by 0
        uint c = a/b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold
        return c; 
    }
    function sub(uint a,uint b) internal pure returns (uint){
        assert(b <= a);
        return a - b;
    }
    function add(uint a,uint b) internal pure returns (uint){
        uint c = a + b;
        assert(c >= a);
        return c;
    }
}
contract JasonToken {
    string public name = "Jason Token";
    string public symbol = 'JT';
    uint256 public decimals = 18;
    uint256 public totalSupply;
    address _owner;
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    constructor()  {
        totalSupply = 1000000 * (10 ** decimals);
        balanceOf[msg.sender] = totalSupply;
        _owner = msg.sender;
    }
    event Transfer(address indexed from,address indexed to,uint256 value);
    event Approval(address indexed from,address indexed to,uint256 amount);
    modifier onlyOwner(){
        require(msg.sender == _owner,"ERROR:only owner can call this function");
        _;
    }
    function transfer(address _to,uint256 _amount) external returns (bool){
        _transfer(msg.sender, _to, _amount);
        return true;
    }
    function _transfer(address from,address to, uint256 amount) internal {
        uint256 myBalance  =  balanceOf[from];
        require(myBalance >= amount,"No money to transfer");
        require(to != address(0),"Transfer to address 0");
        balanceOf[from] =  myBalance - amount;
        balanceOf[to] = balanceOf[to] + amount;
        emit Transfer(from,to,amount);
    } 
    function approve(address spender,uint256 amount) external returns (bool) {
        _approve(msg.sender,spender,amount);
        return true;
    }
    function _approve(address owner,address spender, uint256 amount) internal {
        allowance[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }

    function transferFrom (address from,address to,uint256 amount) external returns (bool) {
        uint256 myAllowance = allowance[from][msg.sender];
        require(myAllowance>=amount,"Error : myAllowance < amount");
        _approve(from, msg.sender, myAllowance-amount);
        _transfer(from, to, amount);
        return true;
    }

    function mint(address account,uint256 amount) public onlyOwner {
        require(account != address(0),"ERROR: mint to address 0");
        totalSupply += amount;
        balanceOf[account] += amount;
        emit Transfer(address(0),account,amount);
    }

    function burn(address account,uint256 amount) public onlyOwner{
        require(account != address(0), "ERROR: burn from address 0");
        uint256 accountBalance =  balanceOf[account];
        require(accountBalance < amount,"ERROR: no more tokens to burn");
        balanceOf[account] -= amount;
        totalSupply -= amount;
        emit Transfer(account,address(0),amount);
    }


}