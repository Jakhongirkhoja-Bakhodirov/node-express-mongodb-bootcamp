const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true , 'Please provide your name']
    },
    email:{
        type:String,
        required:[true,'Please provide your email'],
        unique:true,
        lowercase:true,
        validate:[validator.isEmail,'Please provide valid email']
    },
    photo:String,
    password:{
        type:String,
        required:[true,'Please provide a password'],
        min:[8,'Password must be more or equal than 8 characters']
    },
    password_confirmation:{
        type:String,
        required:[true,'Please provide a password'],
    },
});


const User = mongoose.model('User' , userSchema);

module.exports = User;