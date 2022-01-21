const express = require('express');
const router = express.Router();
const userController = require('../controllers/usersController');
const authController = require('../controllers/authController');

router.param('id' , (req,res,next,val) => {
    console.log(`The param middleware ${val}`);
    next();
})

router
    .route('/')
    .get(authController.protect,userController.getAllUsers)
    .post(userController.createUser);

router
    .route('/:id')
    .get(userController.getUserById)
    .patch(userController.updateUser)
    .delete(authController.protect,authController.restrictTo('admin') ,userController.deleteUser);

router.post('/signup' , authController.signUp);

router.post('/login' , authController.login)

//Forgot Password API
router.post('/forgot-password' , authController.forgotPassword);

//Reset Password API
router.post('/reset-password/:token' , authController.resetPassword);

router.patch('/update/password' , authController.protect , authController.updatePassword);

router.patch('/update/me' , authController.protect ,userController.updateMe);

router.delete('/delete/me' , authController.protect ,userController.deleteMe);

module.exports = router;