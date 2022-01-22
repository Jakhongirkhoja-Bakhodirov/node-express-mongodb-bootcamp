const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const handleFactory = require('./handleFactory');

const filterObj = (obj , ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if(allowedFields.includes(el))  {
            newObj[el] = obj[el];
        }
    });
    return  newObj;
}

const getAllUsers = handleFactory.getAll(User);

const createUser = handleFactory.createOne(User);

const updateUser = handleFactory.updateOne(User);

const getMe = (req,res,next) => {
    req.params.id = req.user.id;
    next();
}

const updateMe = catchAsync(async(req,res,next) => {
    //1)Create an Error if user posts password data
    if(req.body.password || req.body.password_confirmation) {
        return next(new AppError('This route is not for updating password , please use other API',400));
    }

    //Filter request body 
    const filteredBody = filterObj(req.body , 'name' , 'email');

    //2)Update user Document
    const updatedUser = await User.findByIdAndUpdate(req.user.id,filteredBody,{
        new:true,
        runValidators:true
    }); 
    res.status(200).json({
        status:'success',
        message:'User data has been updated successfully!',
        user:updatedUser
    });
});

const deleteUser = handleFactory.deleteOne(User);

const deleteMe = async(req,res) => {
    await User.findByIdAndUpdate(req.user.id,{active:false});
    
    res.status(204).json({
        status:'success',
        message:'User has been deleted successfully'
    });
}

const getUserById = handleFactory.getOne(User);
 
module.exports = {
    getAllUsers,
    getUserById,
    deleteUser,
    deleteMe,
    updateUser,
    updateMe,
    createUser,
    getMe
}

