const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const jwt = require('jsonwebtoken')

const User = require('./models/user')
const config = require('./config')

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.SECRET_KEY
}

passport.use(new LocalStrategy(User.authenticate()))
passport.use(
    new JwtStrategy(
        opts,
        (jwt_payload, done) => {
            console.log('jwt payload', jwt_payload)
            User.findOne({ _id: jwt_payload._id }).then(user => {
                if(!user) return done(null, false)
                return done(null, user)
            }).catch(err => done(err, null))
        }
    )
)

exports.getToken = user => {
    return jwt.sign(user, config.SECRET_KEY, { expiresIn: "1h" })
}

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

// exports.verifyUser = passport.authenticate('local')
exports.verifyUser = passport.authenticate('jwt', { session: false })

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