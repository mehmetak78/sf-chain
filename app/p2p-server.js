
const Websocket = require("ws");
//const P2P_PORT = process.env.P2P_PORT || 5001;
//const peers = process.env.PEERS ? process.env.PEERS.split(",") : [];

let P2P_PORT = process.argv[3];
if(P2P_PORT === undefined) {
    P2P_PORT = 5001
}
let peers = [];
let peersStr = process.argv[4];
if(peersStr === undefined) {
    peers = [];
}
else {
    peers = peersStr.split(",")
}

const MESSAGE_TYPES = {
    chain: "CHAIN",
    transaction: "TRANSACTION",
    clearTransactions: "CLEAR_TRANSACTIONS"
};

class P2pServer {
    constructor(blockchain, transactionPool) {
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.sockets = [];
    }

    listen() {
        const server = new Websocket.Server({port: P2P_PORT});
        server.on("connection", socket => {
            this.connectSocket(socket);
        });
        this.connectToPeers();
        console.log(`Listening for peer-to-peer connections on : ${P2P_PORT}`);
    }

    connectToPeers() {
        peers.forEach(peer => {
            const socket = new Websocket(peer);
            socket.on("open", () => {
                this.connectSocket(socket);
            })
        })
    };

    connectSocket(socket) {
        this.sockets.push(socket);
        console.log("Socket Connected");
        this.messageHandler(socket);
        this.sendChain(socket);
    }

    messageHandler(socket) {
        socket.on("message", message => {
            const data = JSON.parse(message);

            switch (data.type) {
                case MESSAGE_TYPES.chain:
                    this.blockchain.replaceChain(data.chain);
                    break;
                case MESSAGE_TYPES.transaction:
                    this.transactionPool.updateOrAddTransaction(data.transaction);
                    break;
                case MESSAGE_TYPES.clearTransactions:
                    this.transactionPool.clear();
                    break;
            }

        })
    }

    sendChain(socket) {
        socket.send(JSON.stringify({type: MESSAGE_TYPES.chain, chain: this.blockchain.chain}));
    }

    sendTransaction(socket, transaction) {
        socket.send(JSON.stringify({type: MESSAGE_TYPES.transaction,transaction}));
    }

    syncChains() {
        this.sockets.forEach(socket => this.sendChain(socket));
    }

    broadcastTransaction(transaction) {
        this.sockets.forEach(socket => this.sendTransaction(socket, transaction));
    }

    broadcastClearTransaction() {
        this.sockets.forEach(socket => socket.send(JSON.stringify({type: MESSAGE_TYPES.clearTransactions})));
    }

}

module.exports = P2pServer;