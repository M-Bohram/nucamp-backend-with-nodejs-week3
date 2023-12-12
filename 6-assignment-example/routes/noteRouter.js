
const noteRouter = require('express').Router()

const Note = require('../models/note')

const { verifyUser, verifyAdmin } = require('../authenticate')

noteRouter.route('/')
.get(verifyUser, (req, res) => {
    Note.find()
        .populate('comments.creator')
        .then(docs => {
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(docs)
        })
        .catch(err => res.json(err))
})
.post(verifyUser, (req, res) => {
    const { title, priority, comment } = req.body
    Note.create({
        title,
        priority,
        comment: comment || {}
    }).then(note => {
        res.statusCode = 201
        res.setHeader('Content-Type', 'application/json')
        res.json(note)
    })
    .catch(err => res.json(err))
})
.delete(verifyUser, verifyAdmin, (req, res) => {
    Note.deleteMany().then(result => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(result)
    })
    .catch(err => res.json(err))
})

noteRouter.route('/:noteId/comments')
.get(verifyUser, (req, res, next) => {
    const noteId = req.params.noteId
    Note.findById(noteId)
        .populate('comments.creator')
        .then(note => {
            if(!note) {
                const err = new Error(`Note with ID ${noteId} does not exist!`)
                err.status = 404
                return next(err)
            }
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(note.comments)
        })
        .catch(err => res.json(err))
})
.post(verifyUser, (req, res, next) => {
    const noteId = req.params.noteId
    const { text } = req.body
    Note.findById(noteId).then(note => {
        note.comments = [...note.comments, { text, creator: req.user._id }]
        return note.save()
    })
    .then(result => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(result)
    })
    .catch(err => res.json(err))
})

noteRouter.route('/:noteId/comments/:commentId')
.delete(verifyUser, (req, res, next) => {
    const { noteId, commentId } = req.params;

    Note.findById(noteId).then(note => {
        if (!note) {
            const err = new Error('Note not found!');
            err.status = 404;
            return next(err);
        }

        const comment = note.comments.id(commentId);
        if (!comment) {
            const err = new Error('Comment not found!');
            err.status = 404;
            return next(err);
        }
        
        if(req.user._id.toString() !== comment.creator.toString()) {
            const err = new Error('You cannot perform this operation, you are not the creator!');
            err.status = 403;
            return next(err);
        }

        comment.remove();
        note.save().then(note => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(note);
        }).catch(err => next(err))
    })
    .catch(err => next(err));
})

module.exports = noteRouter