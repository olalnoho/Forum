const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
   text: {
      type: String,
      required: true
   },
   thread: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'thread'
   },
   by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
   },
})

const Post = mongoose.model('post', postSchema)

module.exports = Post