const _ = require('underscore')
const Movie = require('../models/movie')
const Category = require('../models/category')

exports.detail = function (req, res) {
    //detail page
    const id = req.params.id
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
}

exports.new = function (req, res) {
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
}

exports.update = function (req, res) {
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
}

exports.save = function (req, res) {
    // admin save movie
    var id = req.body.movie._id
    var movieObj = req.body.movie
    var _movie
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
        var categoryId = _movie.category
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
}

exports.list = function (req, res) {
    //admin list page
    Movie.fetch((err, movies) => {
        if(err) console.error(err)
        res.render('list', {
            title: 'express 列表页',
            movies: movies
        })
    })
}

exports.del = function (req, res) {
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
