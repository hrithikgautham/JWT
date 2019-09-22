const express = require('express')
const app = express()
const jwt = require('./jwt')
const tokens = require('./tokens')

app.use(express.json())

app.post('/login', (req, res) => {
    /**
     * the body of the request must contain an object of the format
     * { uswername: 'string', uid: 'number'}
     */
    const { username, uid } = req.body
    // user authentication
    // query database and check if the user is a reliable customer
    const payload = {
        "name": username,
        "uid": uid
    }
    const token = tokens.TOKEN_B
    const at = jwt.sign(payload, token)
    // console.log('access token: ', at)
    res.json({ accessToken: at })
})

app.listen(8000, () => {
    console.log('running on port 8000...')
})

// module.exports = jwt