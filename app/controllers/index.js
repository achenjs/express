const Movie = require('../models/movie')
const Category = require('../models/category')

module.exports = {
    //index page
    index: function(req, res) {
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
                    title: '首页',
                    categories: categories
                })
            })
    },
    search: function (req, res) {
        var catId = req.query.cat
        var q = req.query.q
        var page = parseInt(req.query.page, 10) || 1
        var count = 2
        var index = (page-1) * count
        if(!catId) {                                                        // 首页搜索
            Movie.find({title: {$regex: q,$options:'i'}})
                .sort('meta.updateAt')
                .exec(function (err, movies) {
                    if(err) console.error(err)
                    var movies = movies || []
                    var results = movies.slice(index, index + count)
                    res.render('search', {
                        title: '结果列表页面',
                        keyword: q,
                        currentPage: page,
                        query: 'q=' + q,
                        totalPage: Math.ceil(movies.length / count),
                        movies: results
                    })
                })
        }else {                                                             // 通过更多进入类别页搜索
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
                    res.render('search', {
                        title: '结果列表页面',
                        keyword: category.name,
                        currentPage: page,
                        query: 'cat=' + catId,
                        totalPage: Math.ceil(movies.length / count),
                        movies: results
                    })
                })
        }
    }
}
