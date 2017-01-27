'use strict';

const express = require('express'),

    Todo = require('./model'),

    router = express.Router();

router.get('/todo', (req, res, next) => {

    Todo.find({})
        .then(todos => {
            res.json({todos});
        })
        .catch(next);
});

router.post('/todo', (req, res, next) => {
    new Todo(req.body.todo)
        .save()
        .then(todo => {
            console.log(todo);
            res.json({todo});
        })
        .catch(next);
});

router.delete('/todo/:_id', (req, res) => {
    Todo.remove({ _id : req.params._id}, function (err) {
    res.send('err');
});
});

router.put('/todo/:_id', (req, res, next) => {
    Todo.update({'_id':req.params._id},
    {$set: req.body.todo}, function (err) {
        if (err) throw err;
    });
Todo.find({_id: req.params._id})
    .then(todo => {
    res.json({todo});
})
.catch(next);
});

module.exports = router;
