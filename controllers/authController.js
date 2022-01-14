const {promisify} = require('util');
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
        password_confirmation:req.body.password,
        passwordChangeAt:req.body.passwordChangeAt
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

const protect = catchAsync(async (req,res,next) => {
    
    // 1)Getting token and check of it's there
    let token;
    
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if(!token) {
        return next(new AppError('You are not logged in , please log in to get access'));
    }
    
    // 2) Verification token
    // const decode = await jwt.verify(token , process.env.JWT_SECRET);
    
    const decode = await promisify(jwt.verify)(token , process.env.JWT_SECRET);

    // console.log(decode);

    // 3) Check if user still exists

    const currentUser = await User.findById(decode.id);

    //console.log(currentUser);

    if(!currentUser) {
        console.log('handle un fresh user');
        return next(new AppError('The user belonging to this token does no longer exists',401));
    }

    // 4) Check if user changed password after the token was issued
    if(await currentUser.changePasswordAfter(decode.iat)) {
        return next(new AppError('User has changed password recently , please log in again'));
    }
    req.user = currentUser;
    next();
});

module.exports = {
    signUp,
    login,
    protect
}