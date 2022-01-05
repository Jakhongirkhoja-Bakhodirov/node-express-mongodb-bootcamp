const express = require('express');
const router = express.Router();
const tourController = require('../controllers/toursController');


router.param('id' , tourController.checkID);

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
    .get(tourController.getAllTours)
    .post(tourController.checkBody,tourController.addNewTour);

router
    .route('/:id')
    .get(tourController.getTourById)
    .patch(tourController.updateTour)
    .delete(tourController.deleteTour);

module.exports = router;