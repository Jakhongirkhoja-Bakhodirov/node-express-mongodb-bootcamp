const User = require('../models/userModel');
const ApiFeatures = require('../utils/apiFeatures');
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

const getAllUsers = catchAsync(async(req,res) => {
    
    const users = await User.find();

    res.statusCode = 200;
    res.json({
        status:true,
        length:users.length,
        data:{
            users
        }
    });
})

const addNewUser = (req,res) => {
    const data = req.body

    const id = users[users.length-1].id+1;
    const newUser = Object.assign({
        id:id
    },data);

    users.push(newUser);

    // fs.writeFile(`${__dirname}/dev-data/data/users-simple.json`,JSON.stringify(users) , (err) => {
    //     if(err) {
    //         res.status(500).json({
    //             status:false,
    //             message:'something went wrong',
    //             error_message:err.message
    //         });
    //     }   
            
    //     res.status(200).json({
    //         status:true,
    //         data : newUser
    //     });
    // });
}

const updateUser = (req,res) => {
    const id = req.params.id*1;
    const user = users.find(el => el.id == id)

    if(user) {
        res.status(200).json({
            status:true,
            data:{
                user:req.body
            }
        });
    } else {
        res.status(404).json({
            status:false,
            message:'Not found'
        });
    }
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

const getUserById = (req,res) => {

    const id = req.params.id*1;

    const user = users.find(el => el.id == id)

    if(user) {
        res.status(200).json({
            status:true,
            data:{
                user:user
            }
        });
    } else {
        res.status(404).json({
            status:false,
            message:'Not found'
        });
    }
}
 
module.exports = {
    getAllUsers,
    getUserById,
    deleteUser,
    deleteMe,
    updateUser,
    updateMe,
    addNewUser
}

