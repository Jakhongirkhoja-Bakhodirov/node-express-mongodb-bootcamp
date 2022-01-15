const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

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
    role:{
        type:String,
        enum:['admin' , 'lead-guide' , 'guide' , 'user'],
        default:'user'
    },
    password:{
        type:String,
        required:[true,'Please provide a password'],
        min:[8,'Password must be more or equal than 8 characters'],
        select:false
    },
    password_confirmation:{
        type:String,
        required:[true,'Please provide a password'],
        validate:{
            //Notes:this only works when user is created:Create or Save method from Mongoose
            validator:function(el) {
                return el === this.password
            },
            message:'Password do not match , please check it'
        }
    },
    passwordChangeAt:Date,
    passwordResetToken:String,
    passwordResetExpires:Date
});

//Using Document Middleware to hash password
userSchema.pre('save' , async function(next) {
    //this function only runs if the password is modified
    if(!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password , 12);

    this.password_confirmation = undefined;

    next();
});

//Using Document Middleware to 
userSchema.methods.correctPassword = async function(candidatePassword,userPassword) {
    return await bcrypt.compare(candidatePassword , userPassword);
};

userSchema.methods.changePasswordAfter = async function(JWTTimestamp) {
    if(this.passwordChangeAt) {
        return JWTTimestamp < (this.passwordChangeAt.getTime() / 1000);
    }

    return false;
};

userSchema.methods.createResetPasswordToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    this.passwordResetExpires = Date.now() + 10*60*1000;

    console.log({resetToken});

    console.log(this.passwordResetExpires , this.passwordResetToken);

    return resetToken;
}

const User = mongoose.model('User' , userSchema);

module.exports = User;



