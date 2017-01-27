'use strict';

const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    value: String
});

module.exports = mongoose.model('Todo', todoSchema);
