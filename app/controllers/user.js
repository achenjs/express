const express = require('express')
const app = express()
const User = require('../models/user')

exports.showSignup = function (req, res) {
    return res.render('signup')
}

exports.showSignin = function (req, res) {
    return res.render('signin')
}

exports.signup = function (req, res) {
    var userObj = req.body.user
    var name = req.body.name
    var _user
    User.findByName(name, (err, movie) => {
        if(err) console.error(err)
        if(movie.length !== 0) {
            return res.send({
                success: "用户名已存在"
            })
        }else {
            _user = new User(userObj)
            _user.save((err, users) => {
                if(err) console.error(err)
                req.session.user = users
                res.redirect('/')
            })
        }
    })
}

exports.signin = function (req, res) {
    var userObj = req.body.user
    var name = userObj.name
    var password = userObj.password
    User.findOne({name: name}, (err, user) => {
        if(err) console.error(err)
        if(!user) {
            res.send({
                success: "用户不存在!"
            })
        }else {
            user.comparePassword(password, (err, isMatch) => {
                if(err) console.error(err)
                if(isMatch){
                    req.session.user = user;
                    return res.redirect('/')
                }else{
                    return res.send({
                        success: "密码错误！"
                    })
                }
            })
        }
    })
}

exports.signout = function (req, res) {
    delete req.session.user
    delete app.locals.user
    return res.redirect('/')
}


exports.list = function (req, res) {
    User.fetch((err, userList) => {
        if(err) console.error(err)
        return res.render('userList', {
            title: 'express 用户列表页',
            userlist: userList
        })
    })
}

exports.signinRequired = function (req, res, next) {
    var user = req.session.user
    if(!user) {
        return res.redirect('/signin')
    }
    next()
}

exports.adminRequired = function (req, res, next) {
    var user = req.session.user
    if(user.role <= 10) {
        return res.redirect('/signin')
    }
    next()
}

