const Thread = {
   async by(parent, { id }, { models: { User } }, info) {
      return await User.findById(parent.by)
   },

   async posts(parent, { id }, { models: { Post } }, info) {
      return await Post.find({ thread: parent._id }).populate('by thread')
   },
   async postCount(parent, args, { models: { Thread } }, info) {
      return parent.posts.length
   },
   topic(parent, args, { models: { Topic } }, info) {
      return Topic.findOne({ threads: parent.id })
   }
}

module.exports = Thread