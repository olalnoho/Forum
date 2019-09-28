const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
   name: {
      type: String,
      default: 'Anonymous'
   },
   email: {
      type: String,
      unique: true,
      required: true
   },
   password: {
      type: String,
      required: true,
   },
})


userSchema.pre('save', async function () {
   if (this.isModified('password')) {
      const salt = await bcrypt.genSalt(10)
      this.password = await bcrypt.hash(this.password, salt)
   }
})

const User = mongoose.model('user', userSchema)

module.exports = User