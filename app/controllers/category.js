/**
 * Created by achen on 2017/1/12.
 */
const Category = require('../models/category')

exports.new = function (req, res) {
    res.render('category_admin', {
        title: 'express 创建类别页',
        category: {
            name: ""
        }
    })
}

exports.save = function (req, res) {
    var categoryObj = req.body.category
    var id = categoryObj._id
    var _category
    if(id !== 'undefined') {
        Category.findById(id, (err, category) => {
            if(err) console.error(err)
            _category = _.extend(category, categoryObj)
            _category.save((err, categorylist) => {
                if(err) console.error(err)
                res.redirect('/admin/category/list')
            })
        })
    }else {
        _category = new Category({
            name: categoryObj.name
        })
        _category.save((err, categorylist) => {
            if(err) console.error(err)
            res.redirect('/admin/category/list')
        })
    }
}

exports.list = function (req, res) {
    Category.fetch((err, categorylist) => {
        if(err) console.error(err)
        res.render('categorylist', {
            title: 'express 类别列表页',
            categorylist: categorylist
        })
    })
}