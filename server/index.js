require('./db/connection')
const models = require('./db/models')

const { GraphQLServer } = require('graphql-yoga')

const authMiddleWare = require('./middleware/isAuth')

const Query = require('./resolvers/Query')
const Mutation = require('./resolvers/Mutation')
const User = require('./resolvers/User')
const Topic = require('./resolvers/Topic')
const Thread = require('./resolvers/Thread')
const Post = require('./resolvers/Post')

const options = {
   port: process.env.PORT || 4000,
   endpoint: '/graphql',
   subscriptions: '/subscriptions',
   playground: '/dev',
}

const server = new GraphQLServer({
   typeDefs: './schema.graphql',
   resolvers: {
      Query,
      Mutation,
      User,
      Topic,
      Thread,
      Post
   },
   context: req => ({
      ...req,
      models
   }),
})


server.express.post('/graphql', authMiddleWare)

server.start(options, () => console.log('server started'))