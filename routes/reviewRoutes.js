const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

router
    .route('/')
    .get(reviewController.getAllReviews)
    .post(reviewController.createReiview)

router
    .route('/:id')
    .get(reviewController.getReview)
    .delete(reviewController.deleteReview)
    .patch(reviewController.updateReview);


module.exports = router;