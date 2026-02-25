// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract MultiSigWallet {
    event Deposit(address indexed sender, uint amount);
    event Submit(uint indexed txId);
    event Approve(address indexed owner, uint indexed txId);
    event Revoke(address indexed owner, uint indexed txId);
    event Execute(uint indexed txId);

    struct Transaction{
        address to;
        uint value;
        bytes data;
        bool executed;
    }
    address [] public owners;
    mapping(address => bool) public isOwner;
    mapping(uint => mapping(address => bool)) public approved;
    uint public required;

    Transaction[] public transactions;

 modifier onlyOwner(){
        require(isOwner[msg.sender], "Not owner");
        _;
    }

 modifier txExists(uint _txid){
        require(_txid < transactions.length, "tranaction does not exist");
        _;
    }

 modifier notApproved(uint _txid){
        require(!approved[_txid][msg.sender], "Transaction already approved");
        _;
    }

 modifier notExecuted(uint _txId){
     require(!transactions[_txId].executed, "transaction already executed");
     _;
    }

    constructor(address[] memory _owners, uint _required){
     require(_owners.length > 0, "Owner Required");
     require (_required > 0 && _required <= _owners.length,
        "Invalid number of Owners");


     for (uint i; i<_owners.length; i++) {
            address owner = _owners[i];

            require(owner != address(0), "address zero detected");
            require(!isOwner[owner], "Owner is not unique");
            isOwner[owner] = true;
            owners.push(owner);
           
        }
        _required = required;


    }
    receive () external payable {
        emit Deposit(msg.sender, msg.value);

    }

    function submit(address _to, uint _value, bytes calldata _data) external onlyOwner{
        transactions.push(Transaction({
        to: _to,
        value: _value,
        data: _data,
    executed: false
    }));
    emit Submit(transactions.length - 1);
    }

  function approve(uint _txId) external onlyOwner txExists(_txId) notApproved(_txId) notExecuted(_txId) {
    approved[_txId] [msg.sender] = true;
    emit Approve (msg.sender, _txId);
   }

   function getApprovalCount(uint _txId) public view returns (uint count) {
     for (uint i; i < owners.length; i++) {
        if (approved[_txId][owners[i]]) {
            count +=1;
        }
       }
   }
   function exectute(uint _txId) external txExists(_txId) notExecuted(_txId){
    require(getApprovalCount(_txId) >= required, "approval less than required");
    Transaction storage transaction = transactions[_txId];
    transaction.executed = true;
    (bool success,) = transaction.to.call{value: transaction.value}(
        transaction.data
    );
    require (success, "transaction failed");
    emit Execute(_txId);
   }
   function revoke(uint _txId) external onlyOwner txExists(_txId) notExecuted(_txId){
    require(approved[_txId][msg.sender], "transaction not approved");
    approved[_txId][msg.sender] = false;
    emit Revoke(msg.sender, _txId);
   }
}



