const {promisify} = require('util');
const jwt = require('jsonwebtoken')
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const {sendEmail} = require('../utils/email');
const crypto = require('crypto');

const signToken = (id) => {
    return jwt.sign({id:id} , process.env.JWT_SECRET ,{ expiresIn:process.env.JWT_EXPIRES_IN});
}

const signUp = catchAsync(async(req,res,next) => {
    const newUser = await User.create({
        name:req.body.name,
        email:req.body.email,
        role:req.body.role,
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

const restrictTo = (...roles) => {
    return (req,res,next) => {
        if(!roles.includes(req.user.role)) {
            return next(new AppError('You do not have permission to perform this action' , 401));
        }
        next();
    }
};

const forgotPassword = catchAsync(async(req,res,next) => {
    
    //1) Get user based on POSTed email
    const user = await User.findOne({email:req.body.email});
    if(!user) {
        return next(new AppError('There is no user with email address' , 404));
    }

    //2)Generate the random reset token 
    const resetToken = user.createResetPasswordToken();
    await user.save({validateBeforeSave:false});
    
    //3)Send it to a user's email
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/reset-password/${resetToken}`;
    const message = `Forgot your password? Submit a PATCH request with your new password and ConfirmPassword to:${resetUrl}.\n
    If you don't forget your password , please ignore this email!`;

    try {
        await sendEmail({
            email:req.body.email,
            subject:'Your password reset token (valid 10 min)',
            message
        });
        res.status(200).json({
            status:'success',
            message:`Password reset token has been sent to ${req.body.email}`
        });
    } catch (error) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({validateBeforeSave:false});
        console.log(error);
        return next(new AppError('There was occured an error sending email , please try again!' , 500));
    }
});

const resetPassword = catchAsync(async(req,res,next) => {
    //1)Get user based token
    const resetToken = req.params.token;
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const user = await User.findOne({passwordResetToken:hashedToken , passwordResetExpires:{
        $gte:Date.now()
    }});
    console.log(user,hashedToken);
  

    //2)If token has not expired,and there is the user , set new password
    if(!user) {
        return next(new AppError('Token is invalid or expired!,please try again' , 400));
    }
    user.password = req.body.password;
    user.password_confirmation = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
   
    //3)Update changedPasswordAt property for the user
    user.passwordChangeAt = Date.now();
    await user.save({validateBeforeSave:false});
   
    //4)Log the user in , send JWT
    const token = signToken(user._id);    
    res.status(200).json({
        status:'success',
        token,
        message:'Password updated successfully!'
    });
});

const updatePassword = catchAsync(async(req,res,next) => {
    
    //1)Get the user from Collection
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    const decode = await promisify(jwt.verify)(token , process.env.JWT_SECRET);
    const user = await User.findById(decode.id).select('+password');
    console.log(decode,user);

   //2)Check if the POSTed current password is correct
    if(!req.body.password || !req.body.password_confirmation) {
       return next(new AppError('Password and password confirmation fields are required!' , 400));
    }

    // if(!(await user.correctPassword(req.body.password_confirmation,user.password))) {
    //     return next(new AppError('Your current password is wrong' , 400));
    // }

    //3)If so , update password
    user.password = req.body.password;
    user.password_confirmation = req.body.password_confirmation;
    user.passwordChangeAt = Date.now();
    await user.save({validateBeforeSave:false});

    //4)Log user in , send JWT Token
    const newToken = signToken(user._id);
    res.status(200).json({
        status:'success',
        newToken,
        message:`password ${user.name}'s updated successfully!`
    });
})

module.exports = {
    signUp,
    login,
    protect,
    restrictTo,
    forgotPassword,
    resetPassword,
    updatePassword
}