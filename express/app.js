'use strict';

const app = require('express')(),
    bodyParser = require('body-parser'),

    config = require('./config'),
    todo = require('./todos/todo');

require('./db');

app.listen(config.port, config.ip, () => {
    console.log(`Server running at ${config.ip}:${config.port}`);
});

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/todo-client.js', function(req, res) {
    res.sendFile(__dirname + '/todo-client.js');
});

app.get('/style.css', function(req, res) {
    res.sendFile(__dirname + '/style.css');
});

app.use(bodyParser.json());

app.use('/api/v1', todo);

// error handling
app.use((req, res, next) => {
    const err = new Error(`Not Found ${req.path}`);
    err.status = 404;
    next(err);
});
app.use((error, req, res, next) => {
    if (error) {
        console.log(error);
        return res.status(400).json({error});
    }
    next(error);
});
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
