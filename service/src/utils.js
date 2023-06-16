import { ethers } from 'ethers';
import { authenticator } from 'otplib';
import * as PushAPI from "@pushprotocol/restapi";
import * as LitJsSdk from "@lit-protocol/lit-node-client";

// Lit Actions Signer
const authSig = {
    sig: process.env.SIGNATURE,
    derivedVia: "web3.eth.personal.sign",
    signedMessage: process.env.SIGNED_MESSAGE,
    address: process.env.AUTH_ADDRESS,
};

/**
 * getLitNodeClient
 * 
 * Get the lit node client
 * @returns LitNodeClient
 */
export const getLitNodeClient = async() => {
    console.log(authSig)
    const litNodeClient = new LitJsSdk.LitNodeClient({
        alertWhenUnauthorized: false,
        litNetwork: "serrano",
        debug: true,
      });
      await litNodeClient.connect();
      return litNodeClient;
}

/**
 * getSigner: Lit Action
 * 
 * given a payload and a signature from the UI, retrieve the address of the signer after
 * verification, this address will be used to send the notification with Push
 * 
 * The action code is stored on IPFS: QmRNb6AZScC4ARbT7cUyA7rJhWqhZtgPuwZM4XA69tBv4e
 * @param {*} litNodeClient 
 * @param {*} message 
 * @param {*} signature 
 * @returns 
 */
export const getSigner = async (litNodeClient, message, signature) => {
    const results = await litNodeClient.executeJs({
        ipfsId: 'QmRNb6AZScC4ARbT7cUyA7rJhWqhZtgPuwZM4XA69tBv4e',
        authSig,
        jsParams: {
            message,
            signature
        },
    });
    const targetAddr = JSON.stringify(results.response, null, 2).replace(/['"]+/g, '');
    console.log(`Lit protocol retrieval of address from sender ${targetAddr}`);
    return targetAddr;
}

/**
 * getCodeFromKey: Lit Action
 * 
 * retrieve the encrypted code to generate OTPs from smart contract given address and key
 * 
 * The action code is stored on IPFS: QmQfQ847bH25hy1zRS2zGDDpvnR3CitkCwkzUuT6zz4EDp
 * @param {*} litNodeClient 
 * @param {*} address 
 * @param {*} key 
 * @returns 
 */
export const getCodeFromKey = async (litNodeClient, address, key) => {
    const results = await litNodeClient.executeJs({
        ipfsId: 'QmQfQ847bH25hy1zRS2zGDDpvnR3CitkCwkzUuT6zz4EDp',
        authSig,
        jsParams: {
            address,
            key
        },
    });
    const encryptedCode = JSON.stringify(results.response, null, 2).replace(/['"]+/g, '');
    console.log(`Lit protocol retrieval of encrypted code from smart contract ${encryptedCode}`);
    return encryptedCode;
}

/**
 * notify: Push Protocol
 * 
 * it sends a generated OTP token to the address via push protocol
 * @param {*} address 
 * @param {*} token 
 */
export const notify = async (address, token) => {
    console.log(`Notifying with delegate ${process.env.DELEGATE_KEY} for channel ${process.env.CHANNEL}`)
    const signer = new ethers.Wallet(process.env.DELEGATE_KEY);
    let expiry = new Date();
    expiry.setMinutes(expiry.getMinutes()+1);
    console.log(`Sending token ${token} to address ${address}`)
    try {
        const response = await PushAPI.payloads.sendNotification({
            signer,
            senderType: 0,
            type: 3,
            identityType: 2,
            notification: {
                title: token,
                body: ``
            },
            payload: {
                title: token,
                body: ``,
                cta: '',
            },
            recipients: `eip155:5:${address}`,
            expiry,
            channel: `eip155:5:${process.env.CHANNEL}`,
            env: 'staging'
        });
        console.log(response)
        console.log("Message sent")
    } catch (err) {
        console.error('Error: ', err);
    }
}

/**
 * getToken
 * 
 * generate OTP from code
 * @param {*} code 
 * @returns 
 */
export const getToken = (code) => {
    return authenticator.generate(code);
}

