const express = require('express');
const router = express.Router({mergeParams:true});
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');


router.use(authController.protect);

router
    .route('/')
    .get(reviewController.getAllReviews)
    .post(authController.restrictTo('user' , 'admin') , reviewController.setTourUserIds , reviewController.createReiview)

router
    .route('/:id')
    .get(reviewController.getReview)
    .delete(authController.restrictTo('admin' , 'lead-guide') , reviewController.deleteReview)
    .patch(authController.restrictTo('admin' , 'lead-guide') , reviewController.updateReview);


module.exports = router;