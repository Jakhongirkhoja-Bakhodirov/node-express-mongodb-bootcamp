const jwt = require('jsonwebtoken')
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

const signUp = catchAsync(async(req,res,next) => {
    const newUser = await User.create({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        password_confirmation:req.body.password
    });

    const token = jwt.sign({id:newUser._id} , process.env.JWT_SECRET ,{ expiresIn:process.env.JWT_EXPIRES_IN});
    
    res.status(201).json({
        status:true,
        token,
        data:newUser
    });
});


module.exports = {
    signUp
}