const _ = require('underscore')
const Movie = require('../models/movie')

exports.detail = function (req, res) {
    //detail page
    const id = req.params.id
    Movie.findById(id,(err, movies) => {
        Comment.find({movie: id}, (err, comments) => {
            console.log(comments)
            res.render('details', {
                title: 'express ' + movies.title,
                movie: movies,
                comments: comments
            })
        })
    })
}

exports.new = function (req, res) {
    //admin new page
    res.render('admin', {
        title: 'express 后台录入页',
        movie: {
            doctor: '',
            country: '',
            title: '',
            year: '',
            poster: '',
            language: '',
            flash: '',
            summary: ''
        }
    })
}

exports.update = function (req, res) {
    // admin update movie
    const id = req.params.id
    if(id) {
        Movie.findById(id, (err, movies) => {
            res.render('admin', {
                title: '后台更新页',
                movie: movies
            })
        })
    }
}

exports.save = function (req, res) {
    // admin save movie
    var id = req.body.movie._id
    var movieObj = req.body.movie
    var _movie
    if(id !== 'undefined') {
        Movie.findById(id, (err, movies) => {
            if(err) console.error(err)
            _movie = _.extend(movies, movieObj)
            _movie.save((err,movie) => {
                if(err) console.error(err)
                res.redirect('/movie/' + movie._id)
            })
        })
    }else {   // 新增的电影
        _movie = new Movie({
            doctor: movieObj.doctor,
            title: movieObj.title,
            country: movieObj.country,
            language: movieObj.language,
            year: movieObj.year,
            poster: movieObj.poster,
            summary: movieObj.summary,
            flash: movieObj.flash
        })
        _movie.save((err,movie) => {
            if(err) console.error(err)
            res.redirect('/movie/' + movie._id)
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
