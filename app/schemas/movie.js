var mongoose = require('mongoose')
var Schema = mongoose.Schema
var ObjectId = Schema.Types.Object

var MovieShema = new Schema({
  doctor: String,
  title: String,
  language: String,
  country: String,
  summary: String,
  flash: String,
  poster: String,
  year: Number,
  pv: {
    type: Number,
    default: 0
  },
  category: {
    type: ObjectId,
    ref: 'category'
  },
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
