const express = require('express')
const app = express()
const jwt = require('./jwt')
const tokens = require('./tokens')

app.use(express.json())

const posts = [// mock database
    {
        username: "hrithik",
        title: "this is my title"
    },
    {
        username: "gautham",
        title: "this is my another title"
    },
    {
        username: "emily",
        title: "this is my emily's title"
    }
]

app.get('/posts', authToken, (req, res) => {// actual server
    res.json(posts.filter(post => post.username === req.user.name));
})

function authToken(req, res, next) {
    // console.log(req.headers['authorization'])
    const authHeader = req.headers['authorization']
    console.log(authHeader);
    // const token = authHeader && authHeader.split(' ')[1]
    const { username, uid } = req.body 
    const payload = {
        "name": username,
        "uid": uid
    }
    if(!authHeader){
        return res.sendStatus(401)
    }
    jwt.verify(authHeader, payload, tokens.TOKEN_B).then(user => {
        req.user = user
        console.log('authorised!!!: ');
        next()
    }).catch(err => {
        console.error('Error: ', err);
        res.json({status: '403', message: err});
    })
    // next()
}

app.listen(3000, () => {
    console.log('running on port 3000...')
})