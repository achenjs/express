/**
 * Created by achen on 2017/1/12.
 */
const mongoose = require('mongoose')

const CategorySchema = require('../schemas/category')

Category = mongoose.model('category', CategorySchema)

module.exports = Category