const crypto = require('crypto')

const header = {
    typ: 'JWT',
    alg: 'HS256'
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
    return `${b64Header}.${b64Payload}.${crypto.createHash('sha256').update(`${b64Header}${b64Payload}${token}`).digest('base64')}`
}

function b64Encode(data) {
    const buff = new Buffer.alloc(data.length, data);
    return buff.toString('base64')
}

function verify(authHeader, payload, token) {
    return new Promise((resolve, reject) => {
        const [ , , hashedToken] = authHeader.split('.')
        const targetHash = crypto.createHash('sha256').update(`${b64Encode(JSON.stringify(header))}${b64Encode(JSON.stringify(payload))}${token}`).digest('base64')
        if(targetHash === hashedToken)
            resolve(payload)
        else
            reject('Malicious User')
    })
}

module.exports = { sign, verify }