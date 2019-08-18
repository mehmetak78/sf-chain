const Transaction = require("../wallet/transaction");
const Wallet = require("../wallet");

class Miner {
    constructor(blockchain, transactionPool, wallet, p2PServer) {
        this.blockhain = blockchain;
        this.transactionPool = transactionPool;
        this.wallet = wallet;
        this.p2pServer = p2PServer;
    }

    mine() {
        const validTransactions = this.transactionPool.validTransactions();
        validTransactions.push(Transaction.rewardTransaction(this.wallet, Wallet.blockchainWallet()))
        const block = this.blockhain.addBlock(validTransactions);
        this.p2pServer.syncChains();
        this.transactionPool.clear();
        this.p2pServer.broadcastClearTransaction();

        return block;
    }
}

module.exports = Miner;