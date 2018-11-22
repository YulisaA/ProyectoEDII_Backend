var express = require('express');
var router = express.Router();

//obtain models
var users = require('../models/users');

//routes
users.methods(['get', 'post', 'put', 'delete']);
users.register(router, '/users');

//return router
module.exports = router;

//ip 192.168.1.5