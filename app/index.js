
const express = require("express");
const bodyParser = require("body-parser");
const Blockchain = require("../blockchain");
const P2PServer = require("./p2p-server");
const Wallet = require("../wallet");
const TransactioPool = require("../wallet/transaction-pool");

//const HTTP_PORT = process.env.HTTP_PORT || 3001;
let HTTP_PORT = process.argv[2];
if(HTTP_PORT === undefined) {
    HTTP_PORT = 3001
}
const app = express();
app.use(bodyParser.json());

const blockchain = new Blockchain();
const wallet = new Wallet();
const transactionPool = new TransactioPool();
const p2pServer = new P2PServer(blockchain, transactionPool);


app.get("/blocks",(req, res) => {
    res.json(blockchain.chain);
});

app.post("/mine",(req, res) => {
    const block = blockchain.addBlock(req.body.data);
    console.log(`New Block added : ${block.toString()}`);
    p2pServer.syncChains();
    res.redirect("/blocks");
});

app.get("/transactions",(req, res) => {
    res.json(transactionPool.transactions);
});

app.post("/transact",(req, res) => {
    const {recipient, amount} = req.body;
    const transaction = wallet.createTransaction(recipient, amount, transactionPool);
    p2pServer.broadcastTransaction(transaction);
    res.redirect("/transactions")
});

app.get("/public-key",(req, res) => {
    res.json({publicKey: wallet.publicKey});
});

app.listen(HTTP_PORT, () => console.log(`Listening on port ${HTTP_PORT}`));
p2pServer.listen();
