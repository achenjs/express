/**
 * Created by Administrator on 2017/1/1.
 */
const express = require('express');

const path = require('path');

const bodyParser = require('body-parser');

const port = process.env.PORT || 3000;

const app = express();

app.set('views', './views/pages');
app.set('view engine', 'jade');
//表单格式化
app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname, 'public')));
app.listen(port);

console.log('express started on port ' + port);

//index page
app.get('/', (req, res) => {
    res.render('index', {
        title: 'express 首页',
        movies: [{
          title: '机械战警',
          _id: 1,
          poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
        },{
          title: '机械战警',
          _id: 2,
          poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
        },{
          title: '机械战警',
          _id: 3,
          poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
        },{
          title: '机械战警',
          _id: 4,
          poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
        },{
          title: '机械战警',
          _id: 5,
          poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
        }]
    })
});

//detail page
app.get('/movie/:id', (req, res) => {
    res.render('details', {
        title: 'express 详情页',
        movie: [{
          doctor: '何塞·帕迪利亚',
          country: '美国',
          title: '机械战警',
          year: 2014,
          poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5',
          language: '英语',
          flash: 'http://player.youku.com/player.php/sid/XNjA1Njc0NTUy/v.swf',
          summary: '啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊'
        }]
    })
});

//admin page
app.get('/admin/movie', (req, res) => {
    res.render('admin', {
        title: 'express 后台录入页',
        movie: [{
          doctor: '',
          country: '',
          title: '',
          year: '',
          poster: '',
          language: '',
          flash: '',
          summary: ''
        }]
    })
});

//list page
app.get('admin/list', (req, res) => {
    res.render('list', {
        title: 'express 列表页',
        movie: [{
          _id: 1,
          doctor: '何塞·帕迪利亚',
          country: '美国',
          title: '机械战警',
          year: 2014,
          language: '英语',
          flash: 'http://player.youku.com/player.php/sid/XNjA1Njc0NTUy/v.swf'
        }]
    })
});
