const express = require('express');
const router = express.Router();
const tourController = require('../controllers/toursController');
const authController = require('../controllers/authController');
const reviewRoutes = require('../routes/reviewRoutes');

router
    .route('/top-5-cheap')
    .get(tourController.aliasTopTours,tourController.getAllTours);

router
    .route('/stats')
    .get(tourController.getTourStats);

router
    .route('/monthly-plan/:year')
    .get(tourController.getMonthlyPlan);

router
    .route('/')
    .get(authController.protect,tourController.getAllTours)
    .post(tourController.checkBody,tourController.createTour);

router
    .route('/:id')
    .get(tourController.getTourById)
    .patch(tourController.updateTour)
    .delete(authController.protect ,authController.restrictTo('admin' , 'lead-guide'),tourController.deleteTour);

router.use('/:tourId/reviews' , reviewRoutes);

// router.post('/:tourId/reviews' , authController.protect , authController.restrictTo('user') , reviewController.createReiview);

module.exports = router;