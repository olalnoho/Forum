const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const Mutation = {
   async createUser(parent, args, { models: { User } }, info) {
      try {
         const user = await new User(args.data).save()
         return jwt.sign({ id: user._id }, process.env.jwt_secret)
      } catch (err) {
         if (err.code == 11000) {
            throw new Error('Email already exists')
         }
         throw new Error('Could not register user')
      }
   },

   async updateUser(parent, args, { models: { User } }, info) {
      try {
         const user = await User.findByIdAndUpdate(args.id, args.data, { new: true })
         return user
      } catch (err) {
         throw new Error('Server erorr')
      }
   },

   async login(parent, { data: { email, password } }, { models: { User } }, info) {

      const user = await User.findOne({ email })

      if (!user) {
         throw new Error('Invalid credentials')
      }

      const isPasswordMatch = await bcrypt.compare(password, user.password)

      if (isPasswordMatch) {
         return jwt.sign({ id: user._id }, process.env.jwt_secret)
      } else {
         throw new Error('Invalid credentials')
      }
   },

   async createTopic(parent, { data: { title } }, { models: { Topic } }, info) {
      const topic = new Topic({ title })
      return await topic.save()
   },

   async createThread(parent, { data }, { models: { Thread, Topic, User }, request: req }, info) {
      if (!req.isAuth) {
         throw new Error('You have to be logged in to create Thread')
      }

      try {
         const topic = await Topic.findById(data.topic)
         if (!topic) {
            throw new Error()
         }

         const thread = new Thread({ ...data, by: req.user._id })
         topic.threads.unshift(thread)
         await topic.save()
         return await thread.save()

      } catch (error) {
         throw new Error('Could not create Thread')
      }
   },

   async createPost(parent, { data }, { models: { Post, Thread }, request: req }, info) {

      if (!req.isAuth) {
         throw new Error('You have to be logged in to post in this thread.')
      }

      try {
         const thread = await Thread.findById(data.thread)

         if (!thread) {
            throw new Error()
         }

         const post = new Post({ by: req.user.id, text: data.text, thread: data.thread })
         thread.posts.unshift(post)

         return await Promise.all([post.save(), thread.save()])
            .then(([post, thread]) => post)

      } catch (err) {
         throw new Error('Error when finding Thread')
      }
   }
}

module.exports = Mutation