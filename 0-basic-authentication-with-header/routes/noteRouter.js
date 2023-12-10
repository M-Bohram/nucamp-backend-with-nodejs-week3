
const noteRouter = require('express').Router()

const Note = require('../models/note')

noteRouter
.get('/', (req, res) => {
    Note.find()
        .then(docs => {
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(docs)
        })
        .catch(err => res.json(err))
})
.post('/', (req, res) => {
    Note.create(req.body).then(note => {
        res.statusCode = 201
        res.setHeader('Content-Type', 'application/json')
        res.json(note)
    })
    .catch(err => res.json(err))
})
.delete('/', (req, res) => {
    Note.deleteMany().then(result => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(result)
    })
    .catch(err => res.json(err))
})

module.exports = noteRouter