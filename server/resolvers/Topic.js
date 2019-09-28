const Topic = {
   async totalThreads(parent, args, { models: { Thread } }, info) {
      const all = await Thread.find({ topic: parent.id })
      return all.length
   },

   async threads(parent, { skip, limit }, { models: { Thread } }, info) {
      return Thread
         .find({ topic: parent.id })
         .sort({ _id: -1 })
         .skip(skip)
         .limit(limit)
   }
}

module.exports = Topic