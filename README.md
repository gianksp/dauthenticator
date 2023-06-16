[![N|Solid](https://i.ibb.co/yVw1R9M/Placeholder.png)](https://dauthenticator.com)
# Dauthenticator
### _A decentralized alternative to Google Authenticator App_

Welcome to [Dauthenticator](https://dauthenticator.com), the decentralized TOTP solution that provides secure and flexible authentication for your digital world. A [HackFS2023](https://www.ethglobal.com/showcase/dauthenticator-5w4mw) Project by [Giancarlo](https://twitter.com/gianksp).

- Type some Markdown on the left
- See HTML in the right
- ✨Magic ✨

## Architecture

The three main actions include 1) the addition of new encrypted entries to a user table in Tableland and routed through the smart contract in Polygon. 2) The retrieval of the labels to display in the UI. 3) The user clicks on send code and signs such message including the label, this is processed by a containerized service that retrieves the signer, decrypts the code, and sends the push notification back to the requestor.

[![N|Solid](https://ipfs.moralis.io:2053/ipfs/QmZCJhHEL4GLDeZTbXwUKY27ehVSTys8MEhn5wpQNgaJyR/Blank%20diagram.jpeg)](https://dauthenticator.com)

### Supported Functionalities
- Store codes
- Retrieve labels
- Generate OTP for stored codes, sent to user via Push protocol

### Not Supported (WIP)
- Encryption
- Retrieval of code from Lit Action is done against smart contract! not tableland yet

## Tech

A list of all the technologies used for the service. The frontend was created with [Webstudio](https://webstudio.so), and the smart contract deployed to [Polygon Mumbai](https://mumbai.polygonscan.com/address/0x419B6DA1Cc20Ca3592EeD67cc69BadCf0cC7Ada9).

Here you can deep dive on each specific implementation

- [Webstudio](https://webstudio.so) - The frontend was built with Webstudio, a no-code Web3 native drag and drop blocks platform powered by Tailwind. The application is deployed in IPFS with a custom domain.
- [Lit Protocol](https://github.com/gianksp/dauthenticator/blob/master/service/src/utils.js#L20-L80) - Two Lit Actions are deployed to IPFS and executed from a containerized service. One action unwraps the requestor signature, and the other retrieves the on-chain code to generate OTP.
- [IPFS](https://github.com/gianksp/dauthenticator/blob/master/service/src/utils.js#L43-L80) - Two Lit Actions source codes (Javascript) are hosted on IPFS and the CID references as the source of the action for computing on the  OTP service. The frontend is hosted in IPFS as well.
- [Tableland](https://github.com/gianksp/dauthenticator/blob/master/contracts/Dauthenticator.sol#L41) - From a smart contract indexer in Polygon (Mumbai), we create tables for each user and store their own credentials. Then retrieve the credentials from the OTP service via a signed message.
- [Push Protocol](https://github.com/gianksp/dauthenticator/blob/master/service/src/utils.js#L89-L120) - The OTP generated is sent to the requestor via Push Protocol. It requires the chrome extension (staging) installed. The user receives a browser notification with the OTP.
- [Polygon (Mumbai)](https://github.com/gianksp/dauthenticator/blob/master/service/src/utils.js#L89-L120) - Polygon Mumbai testnet is the host of our smart contract that takes care of the indexing of users within the platform. This contract is queried from the UI and the OTP service. This is the [contract](https://mumbai.polygonscan.com/address/0x419B6DA1Cc20Ca3592EeD67cc69BadCf0cC7Ada9) and its [source code](https://github.com/gianksp/dauthenticator/blob/master/contracts/Dauthenticator.sol)

