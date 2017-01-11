const mongoose = require('mongoose')

const MovieShema = require('../schemas/movie')

Movie = mongoose.model('movie', MovieShema)

module.exports = Movie
