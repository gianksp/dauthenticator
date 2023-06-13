import { authenticator } from 'otplib';
import express from 'express';
import bodyParser from 'body-parser';
import * as PushAPI from "@pushprotocol/restapi";
import { ethers } from 'ethers';
import dotenv from 'dotenv';

dotenv.config();
var app = express();
app.use(bodyParser.json());

const verifyMessage = ({ message, address, signature }) => {
    try {
      const signerAddr = ethers.utils.verifyMessage(message, signature);
      if (signerAddr.toLocaleLowerCase() === address.toLocaleLowerCase()) {
        return true;
      } else {
        console.log(`No match requestor ${signerAddr} with target ${address}`)
      }
    } catch (err) {
      console.log(`Could not verify ${err}`);
    }
    return false;
}

const notify = async (address, token) => {
    const signer = new ethers.Wallet( process.env.DELEGATE_KEY);

    let expiry = new Date();
    expiry.setMinutes(expiry.getMinutes()+1);

    await PushAPI.payloads.sendNotification({
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
}

/**************************API**********************************/

/**
 * This endpoint receives a body with format
 * {
 *   "address": "0x06bd1006c1acd8f32ab9599b5608f789cb22a4f7",
 *   "message": "XYZ",
 *   "signature": "0xa9ad7339cdfb65c1f49de00c964162ca67cfde69893d9cf7e489df02bb06c10429e45b37c27ad06e1d02cd530dab09bcdb569d1fbd4cf37a8c96c98330aec24c1b"
 * }
 * 
 * You can use https://etherscan.io/verifiedSignatures# to verify signatures manually for debugging purposes.
 * 
 * Once received it will compare the address and message against the signature and if valid, will generate an OTP
 * based on the message and send it to the user via push protocol.
 * 
 * If the user has installed the chrome extension for staging:
 * https://chrome.google.com/webstore/detail/push-staging-protocol-alp/bjiennpmhdcandkpigcploafccldlakj
 * 
 * should receive the OTP codes.
 */
app.post("/generate", async (req, res, next) => {
    const { address, message, signature } = req.body;
    const isValid = verifyMessage({ message, address, signature })
    if (isValid) {
        const token = authenticator.generate(message);
        notify(address, token)
        res.status(200);
        res.send(token);
    } else {
        res.status(400);
        res.send('Invalid request');
    }
});

app.listen(3000, () =>   console.log('Server running on port 3000'));