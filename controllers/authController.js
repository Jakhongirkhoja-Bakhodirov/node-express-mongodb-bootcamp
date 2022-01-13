const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

const signUp = catchAsync(async(req,res,next) => {
    const newUser = await User.create(req.body);
    res.status(201).json({
        status:true,
        data:newUser
    });
})

module.exports = {
    signUp
}