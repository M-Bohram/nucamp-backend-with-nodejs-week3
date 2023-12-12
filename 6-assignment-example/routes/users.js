var express = require('express');
var router = express.Router();

const User = require('../models/user')
const passport = require('passport');
const { getToken, verifyUser, verifyAdmin } = require('../authenticate');
/* GET users listing. */


router.get('/', verifyUser, verifyAdmin, function(req, res, next) {
  User.find().then(users => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.json(users)
  }).catch(err => next(err))
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
  const token = getToken({ _id: req.user._id })
  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  res.json({ success: true, token, status: 'You are successfully logged in!'})
})

module.exports = router;
