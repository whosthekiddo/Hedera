const { Client, PrivateKey, AccountId,getTopicMemo, AccountCreateTransaction,TopicUpdateTransaction,TopicCreateTransaction, TopicMessageSubmitTransaction, AccountBalanceQuery, Hbar,AccountInfoQuery} = require("@hashgraph/sdk");
require("dotenv").config();
require("dotenv").config();

const client = Client.forTestnet();
// const newAccount=AccountBalanceQuery.
const myAccountId = AccountId.fromString("0.0.4575515");
const myPrivateKey=PrivateKey.fromString("3030020100300706052b8104000a042204209ae38f2aa13a445ef5db5653b6f1ef5af999ce033f6a7128b5e17353c1b9f509");
client.setOperator(myAccountId, myPrivateKey);

//Create new keys

const newAccountPrivateKey = PrivateKey.generateED25519(); 
const newAccountPublicKey = newAccountPrivateKey.publicKey;
// const query= new AccountInfoQuery
async function main() {
    //     const createAccount = await new AccountCreateTransaction()
    //     .setKey(newAccountPublicKey)
    //     .execute(client);
     
   

//Create a new account with 1,000 tinybar starting balance
const newAccount = await new AccountCreateTransaction()
    .setKey(newAccountPublicKey)
    .setInitialBalance(Hbar.fromTinybars(1000))
    .execute(client);

    

// Get the new account ID
const getReceipt = await newAccount.getReceipt(client);
const newAccountId = getReceipt.accountId;

//Log the account ID
console.log("The new account ID is: " +newAccountId);
    //Verify the account balance
     const accountBalance = await new AccountBalanceQuery()
        .setAccountId(newAccountId)
       .execute(client);

console.log("The new account balance is: " +accountBalance.hbars.toTinybars() +" tinybar.");
//creating topic
let transactionId = await new TopicCreateTransaction().setTopicMemo("this is my memo for this topic");
const txResponse = await transactionId.execute(client);
const transactionReceipt = await txResponse.getReceipt(client);
const newTopicId =  transactionReceipt.topicId;



//Create a transaction to add a submit key
let transaction = await new TopicUpdateTransaction()
    .setTopicId(newTopicId)
    .setSubmitKey(newAccountPublicKey)
    .freezeWith(client);



//Sign the transaction with the admin key to authorize the update
const signTx = await transaction.sign(newAccountPrivateKey);
    
//Sign with the client operator private key and submit to a Hedera network
const txResponse1 = await signTx.execute(client);

//Request the receipt of the transaction
const receipt = await txResponse.getReceipt(client);

//Get the transaction consensus status
const transactionStatus = receipt.status;

console.log("The transaction consensus status is " +transactionStatus);

console.log("The new topic ID is " + newTopicId);
const memo = transactionId.getTopicMemo();
console.log("The topic memo is " + memo);

//modification du memo du topic

 transaction = await new TopicUpdateTransaction()
    .setTopicMemo("this is the new memo")
    .freezeWith(client);

    //Sign the transaction with the admin key to authorize the update
const signTx1 = await transaction.sign(newAccountPrivateKey);
    
//Sign with the client operator private key and submit to a Hedera network
const txResponse2 = await signTx1.execute(client);

    
  
    
   const memo2 = transactionId.getTopicMemo();
console.log("The new topic memo is " + memo2);


//-	Soumettre un message au topic
 transaction = await new TopicMessageSubmitTransaction()
    .setTopicId(newTopicId)
    .setMessage("this is my topic s msg ");
//Get the transaction message
const getMessage = transaction.getMessage();
console.log("the topic's msg  "+ getMessage);
}

main();