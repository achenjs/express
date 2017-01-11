var mongoose = require('mongoose')
var sha1 = require('sha1')

var UserSchema = new mongoose.Schema({
    name: {
       unique: true,
        type: String
    },
    nickname: String,
    password: String,
    // 0: nimal user  1: verified user 2: professonal user
    role: {
        type: Number,
        default: 0
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

UserSchema.pre('save', function (next) {
    var user = this
    if(this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now()
    }else {
        this.meta.updateAt = Date.now()
    }
    user.password = sha1(user.password + '这是个秘密')
    next()
})

// 实例
UserSchema.methods = {
    comparePassword(_password, cb) {
        if(sha1(_password + '这是个秘密') === this.password){
            cb(null, true)
        }else{
            cb(true)
        }
    }
}

// 静态
UserSchema.statics = {
    fetch(cb) {
      return this
          .find({})
          .sort('meta.updateAt')
          .exec(cb)
    },
    findByName(name, cb) {
      return this.find({name: name}).exec(cb)
    },
    findById(id, cb) {
        return this.find({_id: id}).exec(cb)
    }
}

module.exports = UserSchema
