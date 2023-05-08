const { Client, PrivateKey, AccountId,TokenMintTransaction,TokenType,TokenNftInfoQuery,TokenSupplyType,TokenCreateTransaction, AccountCreateTransaction, AccountBalanceQuery, Hbar,AccountInfoQuery} = require("@hashgraph/sdk");
require("dotenv").config();
const client = Client.forTestnet();
// 1 er compte
const myAccountId = AccountId.fromString("0.0.4575516");
const myPrivateKey=PrivateKey.fromString("3030020100300706052b8104000a0422042098b9c2c02219fe094667691ebbf9b1c477ef9f42b7d0a75f240d300d6aea58aa");
client.setOperator(myAccountId, myPrivateKey);


//2 eme compte
//Create new keys

const newAccountPrivateKey = PrivateKey.generateED25519(); 
const newAccountPublicKey = newAccountPrivateKey.publicKey;

//3 eme compte
//Create new keys

const newAccountPrivateKey1 = PrivateKey.generateED25519(); 
const newAccountPublicKey1 = newAccountPrivateKey.publicKey;
// const query= new AccountInfoQuery
async function main() {
  
    

//2 eme compte
const newAccount = await new AccountCreateTransaction()
    .setKey(newAccountPublicKey)
    .setInitialBalance(Hbar.fromTinybars(1000))
    .execute(client);

//3eme compte

const newAccount1 = await new AccountCreateTransaction()
    .setKey(newAccountPublicKey1)
    .setInitialBalance(Hbar.fromTinybars(1000))
    .execute(client);


// Get the new account ID
const getReceipt = await newAccount.getReceipt(client);
const newAccountId = getReceipt.accountId;

// Get the new account1 ID
const getReceipt1 = await newAccount1.getReceipt(client);
const newAccountId1 = getReceipt1.accountId;

//Log the account ID
console.log("The second account ID is: " +newAccountId);
console.log("The third account ID is: " +newAccountId1);
    

//creation du nft 



const nftCreate = await new TokenCreateTransaction()
	.setTokenName("diploma")
	.setTokenSymbol("GRAD")
	.setTokenType(TokenType.NonFungibleUnique)
	.setDecimals(0)
	.setInitialSupply(0)
	.setTreasuryAccountId(myAccountId)
	.setSupplyType(TokenSupplyType.Finite)
	.setMaxSupply(250)
	.setSupplyKey(myPrivateKey)
	.freezeWith(client)
    .setTokenMemo("memo du nft")
    .setFeeScheduleKey(newAccountPublicKey);

//Sign the transaction with the treasury key
const nftCreateTxSign = await nftCreate.sign(myPrivateKey);

//Submit the transaction to a Hedera network
const nftCreateSubmit = await nftCreateTxSign.execute(client);

//Get the transaction receipt
const nftCreateRx = await nftCreateSubmit.getReceipt(client);

//Get the token ID
const tokenId = nftCreateRx.tokenId;

//Log the token ID
console.log(` Created NFT with Token ID: ${tokenId} \n`);

const nftInfos = await new TokenNftInfoQuery()
     .setNftId(tokenId)
     .execute(client);
console.log(`Created NFT with Token info: ${nftInfos} \n`);



//-	Minter un NFT sur la collection (les métadata à spécifier sont libres)

const transaction = await new TokenMintTransaction()
     .setTokenId(tokenId)
     .setAmount(1000)
     .setMaxTransactionFee(new Hbar(20)) //Use when HBAR is under 10 cents
     .freezeWith(client);

//Sign with the supply private key of the token 
const signTx = await transaction.sign(supplyKey);

//Submit the transaction to a Hedera network    
const txResponse = await signTx.execute(client);

//Request the receipt of the transaction
const receipt = await txResponse.getReceipt(client);
    
//Get the transaction consensus status
const transactionStatus = receipt.status;

console.log("The transaction consensus status " +transactionStatus.toString());




}

main();