const express = require('express');
const router = express.Router();
const tourController = require('../controllers/toursController');
router
    .route('/')
    .get(tourController.getAllTours)
    .post(tourController.addNewTour);

router
    .route('/:id')
    .get(tourController.getAllTours)
    .get(tourController.getTourById)
    .patch(tourController.updateTour)
    .delete(tourController.deleteTour);

module.exports = router;