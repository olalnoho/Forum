const mongoose = require('mongoose')

const topicSchema = new mongoose.Schema({
   title: {
      type: String,
      required: true,
      unique: true
   },
   threads: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'thread'
   }]
})

const Topic = mongoose.model('topic', topicSchema)
module.exports = Topic