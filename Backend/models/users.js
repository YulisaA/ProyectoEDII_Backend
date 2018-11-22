var restful = require('node-restful');
var mongoose = restful.mongoose;

var userSchema = new mongoose.Schema({
    email: String,
    userName: String,
    password: String
})
module.exports = restful.model('users', userSchema);
