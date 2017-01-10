'use strict';

process.env.PWD = process.cwd();

//npm dependencies
var path = require('path');
var express = require('express'),
    cors = require('cors'),
    bodyParser = require('body-parser');

//local dependencies
var routes = require('./routes/routes');

//server setup
var app = express(),
    port = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(express.static(path.join(process.env.PWD, '../release')));
//app.use(express.static(path.join(__dirname, '../release')));
//app.use(express.static('../release'))
//app.use(express.static('release'))
//app.use(express.static('./release'))
//app.use('/release', express.static(path.join(__dirname, 'release')))
app.set('view engine', 'ejs');

var server = app.listen(port, () => {
    console.log('Example app listening at http://%s:%s', server.address().address, port);
});

//define our routes
routes.init(app);

//in case we need the instance later
module.exports = server;