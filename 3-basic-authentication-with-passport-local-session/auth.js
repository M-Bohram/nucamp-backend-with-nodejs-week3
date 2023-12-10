
const parseAuthHeader = authHeader => {
    const usernamePasswordPartEncoded = authHeader.split(" ")[1]
    const usernamePasswordPart = Buffer.from(usernamePasswordPartEncoded, "base64").toString()
    const [username, password] = usernamePasswordPart.split(":")
    return {
        username,
        password
    }
}

const createUnauthencatedResponse = (res, next) => {
    const err = new Error('You are not authenticated!')
    err.status = 401
    res.setHeader('WWW-Authenticate', 'Basic')
    return next(err)
}

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('./models/user')

exports.local = passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

exports.authorizeUsers = (req, res, next) => {
    console.log(req.user)

    if(req.user && req.user.username === 'john') {
        return next()
    }

    const err = new Error("You need to login first!")
    err.status = 401
    return next(err)
}