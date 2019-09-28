const mongoose = require('mongoose')

mongoose.connect(process.env.mongo_uri, {
   useCreateIndex: true,
   useNewUrlParser: true,
   useFindAndModify: false
}).then(_ => console.log('DB up'))