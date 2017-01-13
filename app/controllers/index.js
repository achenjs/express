const Movie = require('../models/movie')
const Category = require('../models/category')

//index page
exports.index = function(req, res) {
    Category
        .find({})
        .populate({
            path: 'movies',
            select: 'title poster',
            options: {limit: 6}
        })
        .exec(function(err, categories) {
            if(err) console.error(err)
            res.render('index', {
                title: 'express 首页',
                categories: categories
            })
        })
}

exports.search = function (req, res) {
    var catId = req.query.cat
    var q = req.query.q
    var page = parseInt(req.query.page, 10) || 0
    var count = 2
    var index = (page-1) * count
    if(!catId) {
        Category.find({name: new RegExp(q, 'i')})
            .sort('meta.updateAt')
            .populate({
                path: 'movies',
                select: 'title poster'
            })
            .exec(function (err, categories) {
                if(err) console.error(err)
                var category = categories[0] || {}
                var movies = category.movies || []
                var results = movies.slice(index, index + count)
                console.log(results)
                res.render('search', {
                    title: 'express 结果列表页面',
                    keyword: q,
                    currentPage: page,
                    query: 'q=' + q,
                    totalPage: Math.ceil(movies.length / count),
                    movies: results
                })
            })
    }else {
        Category.find({_id: catId})
            .sort('meta.updateAt')
            .populate({
                path: 'movies',
                select: 'title poster'
                //options: {limit: count, skip: (page-1)*count}
            })
            .exec(function (err, categories) {
                if(err) console.error(err)
                var category = categories[0] || {}
                var movies = category.movies || []
                var results = movies.slice(index, index + count)
                console.log(results)
                res.render('search', {
                    title: 'express 结果列表页面',
                    keyword: category.name,
                    currentPage: page,
                    query: 'cat=' + catId,
                    totalPage: Math.ceil(movies.length / count),
                    movies: results
                })
            })
    }



}
