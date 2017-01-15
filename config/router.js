const Index = require('../app/controllers/index')
const User = require('../app/controllers/user')
const Movie = require('../app/controllers/movie')
const Comment = require('../app/controllers/comment')
const Category = require('../app/controllers/category')

module.exports = function (app) {
    app.use((req, res, next) => {
        // if(!res.headersSent) {
        //     res.render('404')
        // }else {
        //     console.log('session中的用户：'+ req.session.user.name)
        // }
        var _user = req.session.user
        app.locals.user = _user
        next()
    })
    // Index
    app.get('/', Index.index)

    // Movie
    app.get('/movie/:id', Movie.detail)
    app.get('/admin/movie', User.signinRequired, User.adminRequired, Movie.new)
    app.get('/admin/update/:id', User.signinRequired, User.adminRequired, Movie.update)
    app.post('/admin/movie/new', User.signinRequired, User.adminRequired , Movie.saveUpload, Movie.save)
    app.get('/admin/list', User.signinRequired, User.adminRequired, Movie.list)
    app.delete('/admin/delete/:id', User.signinRequired, User.adminRequired, Movie.del)

    // User
    app.get('/signup', User.showSignup)
    app.get('/signin', User.showSignin)
    app.post('/user/signup', User.signup)
    app.post('/user/signin', User.signin)
    app.get('/user/signout', User.signout)
    app.get('/admin/user/list', User.signinRequired, User.adminRequired, User.list)

    // Comment
    app.post('/user/comment', User.signinRequired, Comment.save)

    // Category
    app.get('/admin/category', User.signinRequired, User.adminRequired, Category.new)
    app.post('/admin/category/new', User.signinRequired, User.adminRequired, Category.save)
    app.get('/admin/category/list', User.signinRequired, User.adminRequired, Category.list)

    // Results
    app.get('/results', Index.search)
}
