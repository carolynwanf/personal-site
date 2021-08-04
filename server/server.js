// making a server
// require express
// use express to make an app
// set up port
// set up server
// tell app to use statics
// send '/' to index.html
// routing
var path = require('path');
var express = require('express');
var app = express();
var port = process.env.PORT || 5000
var server = app.listen(port, function() {
    console.log('Node app is running on port', port);
});
app.use(express.static('build'));
app.get('/', (req, res) => res.sendFile(path.resolve('build', 'index.html')));
app.get('/defaultsite', (req, res) => res.sendFile(path.resolve('build', 'index.html')));
app.get('/:page', (req, res) => {
    console.log(req.params)
    res.sendFile(path.resolve('build', `${req.params}/index.html`))});
