import { getSigner, notify, getToken, getCodeFromKey, getLitNodeClient } from './utils.js';

/**
 * This is an AWS Lambda handler that serves an API Gateway endpoint.
 * The REST api endpoint is invoked and passed:
 * headers: {
 *      signature: <The Web3 signature of the message from requestor in frontend>
 * }
 * body: {
 *      message: <In here goes the key of the item in Tableland where we want to request the value>
 * }
 * 
 * At no point we pass the address of the requestor nor the code, this is all retrieved here
 * in the backend using:
 * 
 * Lit Actions:
 * 1) To retrieve address from signature
 * 2) To retrieve encrypted code from smart contract in Polygon
 * 
 * Push Protocol:
 * 1) We generate the OTP for the code above and send it to the address retrieved via push protocol
 * so that the user receives a notification with the OTP numeric value to use.
 */
export const handler = async (event) => {
    let statusCode = 200;
    const request = JSON.parse(event.body);
    const signature = event.headers["signature"];
    const { message } = request;
    try {
        // We get a LitNodeClient to reuse across multiple activities
        const litNodeClient = await getLitNodeClient();
        // First use of Lit Actions, we retrieve the address of the sender from payload and signature
        const signerAddress = await getSigner(litNodeClient, event.body, signature);
        if (signerAddress) {
            // Second use of Lit Actions, we retrieve the code from smart contract
            const code = await getCodeFromKey(litNodeClient, signerAddress, message);
            // We generate OTP from code retrieved
            const token = getToken(code);
            // We send the requestor an OTP from the code provided
            await notify(signerAddress, token);
        } else {
            statusCode = 400;
        }
    } catch (e) {
        console.log(e);
        statusCode = 400;
    }

    console.log(`Returning now statusCode ${statusCode}`);
    const response = {
        statusCode,
        headers: {
            'Content-Type': 'text/html',
        }
    };
    return response;
};

export default handler