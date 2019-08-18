
const express = require("express");
const bodyParser = require("body-parser");
const Blockchain = require("../blockchain");
const P2PServer = require("./p2p-server");
const Wallet = require("../wallet");
const TransactioPool = require("../wallet/transaction-pool");
const Miner = require('./miner');

//const HTTP_PORT = process.env.HTTP_PORT || 3001;
let HTTP_PORT = process.argv[2];
if(HTTP_PORT === undefined) {
    HTTP_PORT = 3001
}
const app = express();
app.use(bodyParser.json());

const blockchain = new Blockchain();
const wallet = new Wallet();
const transactionPool = new TransactioPool(blockchain);
const p2pServer = new P2PServer(blockchain, transactionPool);
const miner = new Miner(blockchain, transactionPool, wallet, p2pServer);


app.get("/blockchain",(req, res) => {
    res.json(blockchain.chain);
});

app.post("/mine-transactions",(req, res) => {
    const block = miner.mine();
    console.log(`New block added: ${block.toString()}`);
    res.redirect('/blockchain');
});

app.post("/mine",(req, res) => {
    const block = blockchain.addBlock(req.body.data);
    console.log(`New Block added : ${block.toString()}`);
    p2pServer.syncChains();
    res.redirect("/blockchain");
});

app.get("/transactions",(req, res) => {
    res.json(transactionPool.transactions);
});

app.post("/transact",(req, res) => {
    const {recipient, amount} = req.body;
    const transaction = wallet.createTransaction(recipient, amount, blockchain, transactionPool);
    p2pServer.broadcastTransaction(transaction);
    res.redirect("/transactions")
});

app.get("/public-key",(req, res) => {
    res.json({publicKey: wallet.publicKey});
});

app.get("/wallet-balance",(req, res) => {
    res.json({balance: wallet.calculateBalance(blockchain)});
});

app.listen(HTTP_PORT, () => console.log(`Listening on port ${HTTP_PORT}`));
p2pServer.listen();
