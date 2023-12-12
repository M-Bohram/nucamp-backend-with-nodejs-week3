const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('./models/user')

const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const jwt = require('jsonwebtoken')
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
            User.findOne({ _id: jwt_payload._id }).then(user => {
                if(!user) return done(null, false)
                return done(null, user)
            }).catch(err => done(err, null))
        }
    )
)

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

exports.getToken = user => {
    return jwt.sign(user, config.SECRET_KEY, { expiresIn: "1h" })
}

exports.verifyUser = passport.authenticate('jwt', { session: false })

exports.verifyAdmin = (req, res, next) => {
    if (req.user.admin) {
        return next()
    }
    const err = new Error('You are not authorized to perform this operation!')
    err.status = 403
    res.setHeader('Content-Type', 'text/plain')
    return next(err)
}