const crypto = require('crypto')

const header = {
    "alg": "HS256",
    "typ": "JWT"
}

function sign(payload, token) {
    if(typeof payload !== 'object' || typeof header !== 'object'){
        throw new Error('header and payload must be objects')
    }
    if(typeof token !== 'string'){
        throw new Error('token must be a string')
    }
    const b64Header = b64Encode(JSON.stringify(header))
    const b64Payload = b64Encode(JSON.stringify(payload))
    return `${b64Header}.${b64Payload}.${crypto.createHash('sha256', token).update(`${b64Header}.${b64Payload}`).digest('base64')}`
}

function b64Encode(data) {
    const buff = new Buffer.alloc(data.length, data);
    return buff.toString('base64')
}

function verify(authHeader, payload, token) {
    return new Promise((resolve, reject) => {
        const [hashedHeader ,payloadHash , hashedToken] = authHeader.split('.')
        const targetHash = crypto.createHash('sha256', token).update(`${b64Encode(JSON.stringify(header))}.${b64Encode(JSON.stringify(payload))}`).digest('base64')
        if(targetHash === hashedToken && hashedHeader === b64Encode(JSON.stringify(header)) && payloadHash === b64Encode(JSON.stringify(payload))) 
            /**
             * check for all the posiible malicious activities
             * the payload and the header must also be checked incase the 
             * the JWT was compromised by man in the middle attack. 
             */
            resolve(payload)
        else
            reject('Malicious User')
    })
}

module.exports = { sign, verify }