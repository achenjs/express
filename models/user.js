const mongoose = require('mongoose')

const UserSchema = require('../schemas/user')

User = mongoose.model('user', UserSchema)

module.exports = User