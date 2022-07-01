const { createHmac } = await import('node:crypto');
const axios = require('axios');

async function send(input, awsConfig) {

    const reqBody = JSON.stringify(input.tickets);

    var hmac = createHmac('sha256', awsConfig.signingKey);
    const signature = hmac.update(reqBody).digest('hex');

    return await axios.post(awsConfig.lambdaUrl, reqBody, {
        headers: {
            'Content-Type': 'application/json',
            'X-Hub-Signature': signature
        }
    });
}

module.exports = {
    send
}