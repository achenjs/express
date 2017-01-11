/**
 * Created by achen on 2017/1/11.
 */
const mongoose = require('mongoose')

const CommentShema = require('../schemas/comment')

Comment = mongoose.model('comment', CommentShema)

module.exports = Comment