const _ = require('underscore')
const Movie = require('../models/movie')
const Category = require('../models/category')
const fs = require('fs')
const path = require('path')

module.exports = {
    detail: function (req, res) {
        //detail page
        const id = req.params.id
        Movie.update({_id: id},{$inc:{pv: 1}}, (err) => {
            console.error(err)
        })
        Movie.findById(id,(err, movies) => {
            Comment
                .find({movie: id})
                .populate('from', 'name')
                .populate('reply.from reply.to', 'name')
                .exec(function(err, comments) {
                    res.render('details', {
                        title: movies.title,
                        movie: movies,
                        comments: comments
                    })
                })
        })
    },
    new: function (req, res) {
        //admin new page
        Category.fetch((err, categories) => {
            console.log(categories)
            if(err) console.error(err)
            res.render('admin', {
                title: 'express 后台录入页',
                movie: {},
                categories: categories
            })
        })
    },
    update: function (req, res) {
        // admin update movie
        const id = req.params.id
        if(id) {
            Movie.findById(id, (err, movies) => {
                Category.find({}, (err, categories) => {
                    res.render('admin', {
                        title: 'express 后台更新页',
                        movie: movies,
                        categories: categories
                    })
                })
            })
        }
    },
    saveUpload: function (req, res) {
        var fileObj = req.files.uploadPoster
        var filePath = fileObj.path
        var fileName = fileObj.name
        if(fileName) {
            fs.readFile(filePath, (err, data) => {
                var timestamp = Date.now()
                var type = fileObj.type.split('/')[1]
                var poster = timestamp + '.' + type
                var newPath = path.join(__dirname, '../../', '/public/upload/' + poster)
                fs.writeFile(newPath, data, (err) => {
                    req.poster = poster
                    next()
                })
            })
        }else {
            next()
        }
    },
    save: function (req, res) {
        // admin save movie
        var id = req.body.movie._id
        var movieObj = req.body.movie
        var _movie

        if(req.poster) {
            console.log(11)
            movieObj.poster = req.poster
        }
        if(id) {
            Movie.findById(id, (err, movies) => {
                if(err) console.error(err)
                _movie = _.extend(movies, movieObj)
                _movie.save((err,movie) => {
                    if(err) console.error(err)
                    res.redirect('/movie/' + movie._id)
                })
            })
        }else {   // 新增的电影
            _movie = new Movie(movieObj)
            var categoryId = movieObj.category
            _movie.save((err,movie) => {
                if(err) console.error(err)
                if(categoryId) {
                    Category.findById(categoryId, (err, category) => {
                        category.movies.push(movie._id)
                        category.save((err, category) => {
                            if(err) console.error(err)
                            res.redirect('/movie/' + movie._id)
                        })
                    })
                }else {
                    // 新增类别
                    var category = new Category({
                        name: movieObj.categoryName,
                        movies: [movie._id]
                    })
                    category.save((err, category) => {
                        if(err) console.error(err)
                        movie.category = category._id
                        movie.save((err, movie) => {
                            if(err) console.error(err)
                            res.redirect('/movie/' + movie._id)
                        })
                    })
                }
            })
        }
    },
    list: function (req, res) {
        //admin list page
        Movie.fetch((err, movies) => {
            if(err) console.error(err)
            res.render('list', {
                title: 'express 列表页',
                movies: movies
            })
        })
    },
    del: function (req, res) {
        var id = req.params.id
        Movie.deleteId(id, (err, movies) => {
            if(err) {
                console.error(err)
            } else {
                res.json({
                    success: 200
                })
            }
        })
    }
}
