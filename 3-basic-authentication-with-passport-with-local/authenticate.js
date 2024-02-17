const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const User = require('./models/user')

passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

exports.verifyUser = passport.authenticate('local')

exports.auth = (req, res, next) => {

    console.log(req.user)
    // check for cookie
    if(req.user && req.user.username === 'john') {
        return next()
    }

    const err = new Error("You need to login first!")
    err.status = 401
    return next(err)

    // const authHeader = req.headers.authorization

    // if(!authHeader) {
    //     const err = new Error("You are not authenticated!")
    //     res.setHeader('WWW-Authenticate', 'Basic')
    //     err.status = 401
    //     return next(err)
    // }

    // const credentialsEncoded = authHeader.split(' ')[1]
    // const [username, password] = Buffer.from(credentialsEncoded, 'base64')
    //                                    .toString().split(':')

    // if(username !== 'john' || password !== 'password') {
    //     const err = new Error("You are not authenticated!")
    //     res.setHeader('WWW-Authenticate', 'Basic')
    //     err.status = 401
    //     return next(err)
    // }

    // //res.cookie('user', 'john', { signed: true })
    // req.session.user = 'john'

    // return next()
}