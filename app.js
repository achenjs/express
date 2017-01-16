/**
 * Created by Administrator on 2017/1/1.
 */
const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const session = require('express-session')
const bodyParser = require('body-parser')
const favicon = require('serve-favicon')
const port = process.env.PORT || 3333
const app = express()
const morgan = require('morgan')                              // http请求记录中间件
const mongoStore = require('connect-mongo')(session)
mongoose.connect('mongodb://localhost/express')
app.locals.moment = require('moment')
app.set('views', './app/views/pages')
app.set('view engine', 'jade')
app.use(express.static(path.join(__dirname, 'public')))
app.use(require('connect-multiparty')())
app.use(favicon(__dirname + '/public/favicon.ico'))
// 表单数据格式化
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json());
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  rolling: true,
  store: new mongoStore({
    url: 'mongodb://localhost/express',
    collection: 'sessions'
  }),
  cookie: {maxAge: 3600 * 1000}
}))

var env = process.env.NODE_ENV || 'development'
if('development' === env) {                         // 开发环境
  app.set('showStackError', true)
  app.use(morgan(':method :url :status'))
  app.locals.pretty = true                         // 代码格式化，不加的话源代码是压缩的
  mongoose.set('debug', true)
}

require('./config/router')(app)                     // 放在服务之前，不然会有一段404状态

app.listen(port)
console.log('express started on port ' + port)

