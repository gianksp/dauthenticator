/**
 * Get Message Sender
 * 
 * This method receives a payload and a signature and returns the address
 * from where it was originated, this address is eventually used within
 * Dauthenticator to send the OTP code to
 * 
 * Lit Action ipfsId: QmRNb6AZScC4ARbT7cUyA7rJhWqhZtgPuwZM4XA69tBv4e
 * https://ipfs.io/ipfs/QmRNb6AZScC4ARbT7cUyA7rJhWqhZtgPuwZM4XA69tBv4e
 */
const getMessageSender = async () => {
    const address = ethers.utils.verifyMessage(message, signature);
    LitActions.setResponse({response: JSON.stringify(address)});
};

getMessageSender();