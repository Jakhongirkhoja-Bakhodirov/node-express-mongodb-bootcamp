const express = require('express');
const router = express.Router();
const userController = require('../controllers/usersController');
const authController = require('../controllers/authController');



router.post('/signup' , authController.signUp);

router.post('/login' , authController.login)

//Forgot Password API
router.post('/forgot-password' , authController.forgotPassword);

//Reset Password API
router.post('/reset-password/:token' , authController.resetPassword);

//Protect with JWT token all API's except declaring above this line!
router.use(authController.protect);

router.get('/me' , userController.getMe , userController.getUserById);

router.patch('/update/password' , authController.updatePassword);

router.patch('/update/me' , userController.updateMe);

router.delete('/delete/me' , userController.deleteMe);

router.use(authController.restrictTo('admin'));

router
    .route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser);

router
    .route('/:id')
    .get(userController.getUserById)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);



module.exports = router;