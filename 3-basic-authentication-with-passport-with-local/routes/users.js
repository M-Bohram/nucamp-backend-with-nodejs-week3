var express = require('express');
var router = express.Router();

const User = require('../models/user')
const passport = require('passport')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', (req, res) => {
  User.register(
    new User({ username: req.body.username }),
    req.body.password,
    err => {
      if(err) {
        res.statusCode = 500
        res.setHeader('Content-Type', 'application/json')
        return res.json({ err })
      }
      passport.authenticate('local')(req, res, () => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json({ success: true, status: 'Registration successful!'})
      })
    }
  )
})

router.post('/login', passport.authenticate('local'), (req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  res.json({ success: true, status: 'You are successfully logged in!'})
})

router.get('/logout', (req, res, next) => {
  if(req.session) {
    req.session.destroy()
    res.clearCookie('session-id')
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain')
    return res.end('You are logged out!')
  }
  const err = new Error('You are not logged in!')
  err.status = 401
  return next(err)
})

module.exports = router;
