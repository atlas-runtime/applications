var express = require('express');
const es6Renderer = require('express-es6-template-engine')
var Serve_static = require('serve-static')
var serve_static = Serve_static.serveStatic
var path = require('path');
var indexRouter = require('./routes/index');
var app = express;
app = app.createApplication()
// view engine setup
app.engine('html', es6Renderer);
app.set('views', 'views');
app.set('view engine', 'html');

//app.use(express.json());
//app.use(express.urlencoded({ extended: false }));
app.use(serve_static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

app.listen(3001, ()=> {
    console.log("Server is running port 3001");
})
module.exports = app;
