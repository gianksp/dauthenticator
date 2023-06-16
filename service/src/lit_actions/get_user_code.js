/**
 * Get User Code
 * 
 * Retrieve the encrypted code to generate OTP from by requestor address and key.
 * Network: Polygon Mumbai
 * Contract Address: 0x74D142ca095Ea3B4932DCde651404E1e47D4675d
 * 
 * Lit Action ipfsId: QmQfQ847bH25hy1zRS2zGDDpvnR3CitkCwkzUuT6zz4EDp
 * https://ipfs.io/ipfs/QmQfQ847bH25hy1zRS2zGDDpvnR3CitkCwkzUuT6zz4EDp
 */
const getUserCode = async () => {
    const provider = new ethers.providers.JsonRpcProvider("https://rpc-mumbai.maticvigil.com", 80001);
    const abi = [
        {
            "inputs": [
              {
                "internalType": "address",
                "name": "_address",
                "type": "address"
              },
              {
                "internalType": "string",
                "name": "key",
                "type": "string"
              }
            ],
            "name": "get",
            "outputs": [
              {
                "internalType": "string",
                "name": "",
                "type": "string"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          }
    ]
    const dauthenticatorContract = new ethers.Contract("0x74D142ca095Ea3B4932DCde651404E1e47D4675d", abi, provider)
    const code = await dauthenticatorContract.get(address, key)

    LitActions.setResponse({response: JSON.stringify(code)})
};

getUserCode();