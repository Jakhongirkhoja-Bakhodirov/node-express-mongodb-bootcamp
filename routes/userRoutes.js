const express = require('express');
const router = express.Router();
const userController = require('../controllers/usersController');

router.param('id' , (req,res,next,val) => {
    console.log(`The param middleware ${val}`);
    next();
})

router
    .route('/')
    .get(userController.getAllUsers)
    .post(userController.addNewUser);

router
    .route('/:id')
    .get(userController.getUserById)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);


module.exports = router;