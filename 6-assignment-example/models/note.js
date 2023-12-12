
const mongoose = require('mongoose')
const { Schema } = require('mongoose')

const commentSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

const noteSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    priority: {
        type: String,
        required: true
    },
    comments: [commentSchema]
},
{
    timestamps: true
})

const NoteModel = mongoose.model("Note", noteSchema)

module.exports = NoteModel