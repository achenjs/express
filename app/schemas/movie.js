var mongoose = require('mongoose')

var MovieShema = new mongoose.Schema({
  doctor: String,
  title: String,
  language: String,
  country: String,
  summary: String,
  flash: String,
  poster: String,
  year: Number,
  meta: {
    createAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
  }
})

MovieShema.pre('save', function(next) {
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now()
  }else {
    this.meta.updateAt = Date.now()
  }
  next()
})

MovieShema.statics = {
  fetch(cb) {
    return this.find({}).sort('meta.updateAt').exec(cb)
  },
  findById(id, cb) {
    return this.findOne({_id: id}).exec(cb)
  },
  deleteId(id, cb) {
    return this.remove({_id: id}).exec(cb)
  }
}

module.exports = MovieShema
