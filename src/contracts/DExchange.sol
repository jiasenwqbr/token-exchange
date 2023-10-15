// SPDX-License-Identifier: MIT
// Deposite & Withdraw Funds
// Manage orders - Make or cancle
// Handle Trades - Charge fees

// TODO:
// [X] Set the fee  account
    // Whenever we deploy the smart contract and will also set the account whenever we  deploy the 
    // samrt contract will tell it where the fee goes
// [X] Deposite tokens
// [] Withdraw tokens
// [] Deposite Ether
// [] WithDraw Ether
// [] Check balances
// [] Make order
// [] Cancle order
// [] Fill order
// [] Charge fees 
pragma solidity >=0.8.9 <0.9.0;
import "./JasonToken.sol"; 

contract Exchange {
    using SafeMath for uint;
    // Variables
    address public feeAccount; // The account that recieves exchange fees
    uint256 public feePercent; // the fee percentage
    // The frist key is the token address
    // The second key is the address of the user who deposited the token
    mapping(address => mapping(address => uint256)) public tokens;
    address constant ETHER = address(0); // Store ether in tokens mapping with blank address
    //  a way to model the order 
    struct _Order {
        uint256 id;
        address user; // This is going to be the person who made the order
        address tokenGet; // The address of the token they want to purchase
        uint256 amountGet; // The amount of tokens I want to get 
        address tokenGive; // The token that they are going to use in trade 
        uint256 amountGive; // The amount of tokens that they are going to use in the trade 
        uint256 timestamp; // This is gona be the actual time that the order was created
    }
    // A way store the order
    mapping (uint256 => _Order) public orders;
    uint256 public orderCount;
    mapping(uint256 => bool) public orderCanceled;
    mapping(uint256 => bool) public orderFilled;

    // Events
    event Deposit(address token,address user,uint256 amount,uint256 balance);
    event Withdraw(address token,address user,uint256 amount,uint256 balance);
    event Order (uint256 id,address user,address tokenGet,uint256 amountGet,address tokenGive,uint256 amountGive,uint256 timestamp);
    event Cancel ( uint256 id,address user,address tokenGet,uint256 amountGet,address tokenGive,uint256 amountGive,uint256 timestamp);
    event Trade(uint256 id,address user,address tokenGet,uint256 amountGet,address tokenGive,uint256 amountGive,address userFill,uint256 timestamp);


    constructor(address _freeAccount,uint256 _freePercent){
        feeAccount = _freeAccount;
        feePercent = _freePercent;
    }
    // Fallback:revert if Ether is sent to this smart contract by mistakes 
    fallback() external {
        revert();
    }
    function depositToken(address _token,uint256 _amount) public {
        // Which Token ?
        // How much ?
        // Send Token to this contract 
        // Manage deposite - update balance
        // Emint Event 
        require(_token != ETHER);
        require( JasonToken(_token).transferFrom(msg.sender, address(this), _amount));
        tokens[_token][msg.sender] =  tokens[_token][msg.sender].add(_amount);
        emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }

    function withDrawToken(address _token,uint256 _amount) public {
        require(_token != ETHER);
        uint256 balance = tokens[_token][msg.sender];
        require(balance>=_amount);
        require(JasonToken(_token).transfer(msg.sender, _amount));
        tokens[_token][msg.sender] = tokens[_token][msg.sender].sub(_amount);
        emit Withdraw(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }
    function depositEther() payable public {
        tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender].add(msg.value);
        emit Deposit(ETHER,msg.sender,msg.value,tokens[ETHER][msg.sender]);
    }
    function  withdrawEther(uint _amount)  public {
        require(tokens[ETHER][msg.sender]>=_amount);
        tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender].sub(_amount);
        //msg.sender.transfer(_amount);
        address payable recipient = payable(msg.sender);
        recipient.transfer(_amount);
        emit Withdraw(ETHER,msg.sender,_amount,tokens[ETHER][msg.sender]);
    }
    function balanceOf(address _token,address _user) public view returns (uint256){
        return tokens[_token][_user];
    }

    function makeOrder(address _tokenGet,uint256 _amountGet,address _tokenGive,uint256 _amountGive) public {
        orderCount = orderCount + 1;
        orders[orderCount] = _Order(orderCount,msg.sender,_tokenGet,_amountGet,_tokenGive,_amountGive,block.timestamp);
        emit Order (orderCount,msg.sender,_tokenGet,_amountGet,_tokenGive,_amountGive,block.timestamp);
    }
    function cancelOrder(uint256 _id) public {
        _Order storage _order = orders[_id];
        // Must be my order
        require(address(_order.user) == msg.sender);
        // Must be a valid order
        require(_order.id == _id);
        orderCanceled[_id] = true;
        emit Cancel (_order.id,msg.sender,_order.tokenGet,_order.amountGet,_order.tokenGive,_order.amountGive,_order.timestamp);
    }
    function fillOrder(uint256 _id) public {
        require(_id > 0 && _id <= orderCount);
        require(!orderFilled[_id]);
        require(!orderCanceled[_id]);
        _Order storage _order = orders[_id];
        _trade(_order.id,_order.user,_order.tokenGet,_order.amountGet,_order.tokenGive,_order.amountGive);
        orderFilled[_id] = true;
    }
    function _trade(uint256 _orderId,address _user,address _tokenGet,uint256 _amountGet,address _tokenGive,uint256 _amountGive) internal {
        //fee deduceted from _amountGet
        // fee paid by the user that fills the order,a.k.a msg.sender
        uint256 _feeAmount = _amountGive.mul(feePercent).div(100);
        // Execute trade     // Charge fee
        tokens[_tokenGet][msg.sender] = tokens[_tokenGet][msg.sender].sub(_amountGet.add(_feeAmount));
        tokens[_tokenGet][_user] = tokens[_tokenGet][_user].add(_amountGet);
        tokens[_tokenGet][feeAccount] =   tokens[_tokenGet][feeAccount].add(_feeAmount);
        tokens[_tokenGive][_user] = tokens[_tokenGive][_user].sub(_amountGive);
        tokens[_tokenGive][msg.sender] = tokens[_tokenGive][msg.sender].add(_amountGive);
        // Emit trade event
        emit Trade(_orderId,_user,_tokenGet,_amountGet,_tokenGive,_amountGive,msg.sender,block.timestamp);
    }

}
