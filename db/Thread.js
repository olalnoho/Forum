const mongoose = require('mongoose')

const threadSchema = new mongoose.Schema({
   title: {
      type: String,
      required: true
   },
   content: {
      type: String,
      required: true
   },
   topic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'topic',
      required: true
   },
   posts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'post'
   }],
   by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true
   }
}, {
   timestamps: true
})


const Thread = mongoose.model('thread', threadSchema)

module.exports = Thread