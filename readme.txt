
- Create an empty project
- npm init
- create app.js
- change main file to app.js in package.json
- change package.json to write a dev-test script
- install websocket

- To Run:
    Tab 1
        - npm run dev
    Tab 2
        - npm run dev 3002 5002 ws://localhost:5001
    Tab 3
        - npm run dev 3003 5003 ws://localhost:5001,ws://localhost:5002

- To Run All Test Scenarios
    - npm run test


Sample Scenario:
- Get the Wallet address of second node
    http://localhost:3002/public-key
- Run a transaction to
    Put the scond node's wallet address as a paramater to transact in node 1
        http://localhost:3001/transact
- Mine Transactions
    http://localhost:3001/mine-transactions
- Check the wallets' balances
    http://localhost:3001/wallet-balance
    http://localhost:3002/wallet-balance

