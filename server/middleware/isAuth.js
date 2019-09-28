const jwt = require('jsonwebtoken')
const User = require('../db/User')

module.exports = async function (req, res, next) {
   const token = req.headers['x-auth-token']
   if (!token) {
      req.isAuth = false
      return next()
   }

   try {
      const decoded = jwt.verify(token, process.env.jwt_secret)
      const user = await User.findById(decoded.id)
      if (!user) {
         req.isAuth = false
         return next()
      } else {
         req.user = user
      }
   } catch (err) {
      req.isAuth = false
      return next()
   }

   req.isAuth = true
   next()
}