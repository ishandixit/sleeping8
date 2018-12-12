var express = require('express');
var path = require('path');
var http = require('http')
// var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose')
var cors = require('cors');

console.log("heloooo")
var app = express();
global.config = require('./routes/utils/constants')
//setting NODE ENV if not set by start
if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'development';
}
var app = express();

//Getting DB Url
let dbUrl = config.constants.local.db_url


var options = {
    autoReconnect: true,
    keepAlive: 1,
    connectTimeoutMS: 30000,
    promiseLibrary: global.Promise,
    useNewUrlParser: true
}


mongoose.connect(dbUrl, options, function (err, db) {
    console.log("connected", dbUrl)
    // start server when db is connected
}).catch(err => {
    console.log("err. ", err);
});

// If the connection throws an error
mongoose.connection.on('error', function (err) {

    if (err) {
        console.log(err, " Its error in mongoose connection")
    }
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
    console.log("disconnect")

});
let port = config.constants.local.port
app.use(cors());
app.use(bodyParser.json({
    limit: '50mb'
}));
app.use(bodyParser.urlencoded({
    extended: true,
    limit: '50mb',
    parameterLimit: 50000
}));
app.set('port', port);

app.use('/api/v1', require('./routes/modules/profileSignUp'))
var server = http.createServer(app);
server.setTimeout(120000); // 10 * 60 seconds * 1000 msecs
server.listen(port, function () {
    console.log("server is running on port " + port);

});