const express = require('express');
const router = express.Router();
const tourController = require('../controllers/toursController');
const authController = require('../controllers/authController');
const reviewRoutes = require('../routes/reviewRoutes');

router
    .route('/top-5-cheap')
    .get(authController.protect , tourController.aliasTopTours,tourController.getAllTours);

router
    .route('/stats')
    .get(authController.protect , authController.restrictTo('admin' , 'lead-guide') , tourController.getTourStats);

router
    .route('/monthly-plan/:year')
    .get(authController.protect , authController.restrictTo('admin' , 'lead-guide') , tourController.getMonthlyPlan);

router
    .route('/')
    .get(tourController.getAllTours)
    .post(authController.protect , authController.restrictTo('lead-guide' , 'admin') , tourController.createTour);

router
    .route('/:id')
    .get(tourController.getTourById)
    .patch(authController.protect , authController.restrictTo('lead-guide' , 'admin') , tourController.updateTour)
    .delete(authController.protect , authController.restrictTo('admin' , 'lead-guide'), tourController.deleteTour);

router.use('/:tourId/reviews' , reviewRoutes);

router.
    route('/tours-within/:distance/center/:latlng/unit/:unit')
    .get(tourController.getToursWithin);

router
    .route('/distance/:latlng/unit/:unit')
    .get(tourController.getDistance);

// router.post('/:tourId/reviews' , authController.protect , authController.restrictTo('user') , reviewController.createReiview);

module.exports = router;