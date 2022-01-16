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
    .post(userController.addNewUser);

router
    .route('/:id')
    .get(userController.getUserById)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

router.post('/signup' , authController.signUp);

router.post('/login' , authController.login)

//Forgot Password API
router.post('/forgot-password' , authController.forgotPassword);

//Reset Password API
router.post('/reset-password/:token' , authController.resetPassword);

router.post('/update/password'  , authController.protect ,authController.updatePassword);

module.exports = router;