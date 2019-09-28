const Query = {
   async users(parent, args, { models: { User }, request: req }, info) {
      try {
         return await User.find({})
      } catch (error) {
         throw new Error('Server Error')
      }
   },

   async currentUser(parent, args, { models: { User }, request: req }, info) {
      if (!req.isAuth) {
         throw new Error('Not Authorized')
      }

      return await User.findById(req.user._id)
   },

   async topics(parent, args, { models: { Topic } }, info) {
      try {
         return await Topic.find({})
      } catch (err) {
         throw new Error('Server error')
      }
   },

   async threadsInTopic(parent, args, { models: { Topic } }, info) {
      try {
         const topic = await Topic.findById(args.id).populate('threads')
         return topic.threads
      } catch (err) {
         throw new Error('Server error')
      }
   },

   async postsInThread(parent, args, { models: { Thread } }, info) {
      try {
         const thread = await Thread.findById(args.id).populate('posts')
         return thread.posts
      } catch (err) {
         throw new Error('Server error')
      }
   },

   async threadById(parent, args, { models: { Thread } }, info) {
      try {
         return Thread.findById(args.id).populate('posts by')
      } catch (err) {
         throw new Error('Could not find thread')
      }
   },
   async threads(parent, args, { models: { Thread } }, info) {
      return Thread.find({ topic: parent.id }).limit(1)
   }
}

module.exports = Query