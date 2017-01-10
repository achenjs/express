/**
 * Created by Administrator on 2017/1/1.
 */
const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const session = require('express-session')
const _ = require('underscore')
const bodyParser = require('body-parser')
const port = process.env.PORT || 3333;
const app = express()
const Movie = require('./models/movie')
const User = require('./models/user')
mongoose.connect('mongodb://localhost/express')
app.locals.moment = require('moment')
app.set('views', './views/pages')
app.set('view engine', 'jade')
//表单格式化
//app.use(bodyParser.urlencoded())
app.use(express.static(path.join(__dirname, 'public')))

// 表单数据格式化
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  rolling: true,
  cookie: {maxAge: 3600 * 1000}
}))
console.log('express started on port ' + port)

app.listen(port);
//index page
app.get('/', (req, res) => {
  var user = req.session.user
  console.log(user)
  Movie.fetch((err, movies) => {
    if(err) console.error(err)
    res.render('index', {
      title: 'express 首页',
      movies: movies,
      user: user
    })
  })
});

//detail page
app.get('/movie/:id', (req, res) => {
  const id = req.params.id
  Movie.findById(id,(err, movies) => {
    res.render('details', {
      title: 'express ' + movies.title,
      movie: movies
    })
  })
});

//admin page
app.get('/admin/movie', (req, res) => {
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
});

// admin update movie
app.get('/admin/update/:id', (req, res) => {
  const id = req.params.id
  if(id) {
    Movie.findById(id, (err, movies) => {
      res.render('admin', {
        title: '后台更新页',
        movie: movies
      })
    })
  }
})

// admin post movie
app.post('/admin/movie/new', (req, res) => {
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
})

//list page
app.get('/admin/list', (req, res) => {
  Movie.fetch((err, movies) => {
    if(err) console.error(err)
    res.render('list', {
        title: 'express 列表页',
        movies: movies
    })
  })
});

app.delete('/admin/delete/:id', (req, res) => {
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
})

app.post('/user/signup', (req, res) => {
  var userObj = req.body.user
  var name = req.body.name
  var _user
  User.findByName(name, (err, movie) => {
    if(err) console.error(err)
    if(movie.length !== 0) {
      res.send({
        success: "用户名已存在"
      })
    }else {
      _user = new User(userObj)
      _user.save((err, users) => {
        if(err) console.error(err)
        req.session.user = {
          id: users._id,
          name: users.nickname
        }
        res.redirect('/')
      })
    }
  })
})

app.post('/user/signin', (req, res) => {
  var userObj = req.body.user
  var name = userObj.name
  var password = userObj.password
  User.findOne({name: name}, (err, user) => {
    if(err) console.error(err)
    if(!user) {
      res.send({
        success: "用户不存在!"
      })
    }
    user.comparePassword(password, (err, isMatch) => {
      if(err) console.error(err)
      if(isMatch){
        req.session.user = user;
        return res.redirect('/')
      }else{
        res.send({
          success: "密码错误！"
        })
      }
    })
  })
})

app.get('/admin/user/list', (req, res) => {
  User.fetch((err, users) => {
    if(err) console.error(err)
    res.render('userList', users)
  })
})

app.use((req, res) => {
  if(!res.headersSent) {
    res.render('404')
  }else {
    console.log('session中的用户：'+req.session.user.name)
  }
})

