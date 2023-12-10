
const noteRouter = require('express').Router()

const Note = require('../models/note')

const { verifyUser } = require('../auth')

noteRouter
.get('/', verifyUser, (req, res) => {
    Note.find()
        .populate('creator')
        .then(docs => {
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(docs)
        })
        .catch(err => res.json(err))
})
.post('/', verifyUser, (req, res) => {
    Note.create({
        title: req.body.title,
        priority: req.body.priority,
        creator: req.user._id
    }).then(note => {
        res.statusCode = 201
        res.setHeader('Content-Type', 'application/json')
        res.json(note)
    })
    .catch(err => res.json(err))
})
.delete('/', verifyUser, (req, res) => {
    Note.deleteMany().then(result => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(result)
    })
    .catch(err => res.json(err))
})

module.exports = noteRouter