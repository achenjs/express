/**
 * Created by achen on 2017/1/12.
 */
const mongoose = require('mongoose')

const Schema = mongoose.Schema

const ObjectId = Schema.Types.ObjectId

var CategorySchema = new Schema({
    name: String,
    movies: [{
        type: ObjectId,
        ref: 'movie'
    }],
    meta: [{
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }]
})

CategorySchema.pre('save', function (next) {
    if(this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now()
    }else {
        this.meta.updateAt = Date.now()
    }
    next()
})

CategorySchema.statics = {
    fetch: function (cb) {
        return this.find({}).sort('meta.update').exec(cb)
    },
    findById: function (id, cb) {
        return this.find({_id: id}).sort('meta.update').exec(cb)
    }
}

module.exports = CategorySchema
