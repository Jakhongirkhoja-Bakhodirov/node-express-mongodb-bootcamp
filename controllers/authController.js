const jwt = require('jsonwebtoken')
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signToken = (id) => {
    return jwt.sign({id:id} , process.env.JWT_SECRET ,{ expiresIn:process.env.JWT_EXPIRES_IN});
}

const signUp = catchAsync(async(req,res,next) => {
    const newUser = await User.create({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        password_confirmation:req.body.password
    });

    const token = signToken(newUser._id);
    
    res.status(201).json({
        status:true,
        token,
        data:newUser
    });
});

const login = catchAsync(async(req,res,next) => {
    const { email , password } = req.body;

    //1)Check if email and password exist
    if(!email || !password) {
        return next(new AppError('Please provide email and password' , 400));
    }

    //2)Check if user exist and password is correct

    const user = await User.findOne({ email }).select('+password');

    if(!user || !await user.correctPassword(password,user.password)) {
        return next(new AppError('Incorrect email or password' , 401));
    }

    //3)If everything is okey send token to client

    const token = signToken(user._id);

    res.status(200).json({
        status:'success',
        token
    });
});

module.exports = {
    signUp,
    login
}