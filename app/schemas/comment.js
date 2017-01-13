const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

var CommentShema = new mongoose.Schema({
    movie: {type: ObjectId, ref: 'movie'},
    from: {type: ObjectId, ref: 'user'},
    reply: [{
        from: {type: ObjectId, ref: 'user'},            //  用户 id
        to: {type: ObjectId, ref: 'user'},              //  被评论用户 id
        content: String                                 //  被回复的信息
    }],
    content: String,
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

CommentShema.pre('save', function (next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now()
    }
    else {
        this.meta.updateAt = Date.now()
    }
    next()
})

CommentShema.statics = {
    fetch: function(cb) {
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(cb)
    },
    findById: function(id, cb) {
        return this
            .findOne({_id: id})
            .exec(cb)
    }
}

module.exports = CommentShema