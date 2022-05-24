const jwt = require('jsonwebtoken')
const SECRECT_KEY = "surajkumar"

const generateToken = (id) => {
    return jwt.sign(id,SECRECT_KEY)
}

const verifyToken = async (req, res, next) => {
    const cookie = req.headers.cookie
    console.log(cookie);
    if (cookie) {
        const token = cookie.split('=')[1]
        console.log();
        const id = parseInt (jwt.verify(token,SECRECT_KEY))
        req.UserId = id
        next()
    }
    else{
    res.status(401).json({ status: 'unathorized'})
    }
}


module.exports = {generateToken, verifyToken};

