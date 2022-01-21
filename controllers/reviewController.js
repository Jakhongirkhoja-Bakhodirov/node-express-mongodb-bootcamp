const Review = require('../models/reviewModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const handleFactory = require('./handleFactory');

const getAllReviews = handleFactory.getAll(Review);

const getReview = handleFactory.getOne(Review);

const setTourUserIds = (req,res,next) => {
    if(!req.body.tour) req.body.tour = req.params.tourId;
    if(!req.body.user) req.body.user = req.user.id;
    next();
}

const createReiview = handleFactory.createOne(Review);

const updateReview = handleFactory.updateOne(Review);

const deleteReview = handleFactory.deleteOne(Review);


module.exports = {
    getAllReviews,
    getReview,
    createReiview,
    updateReview,
    deleteReview,
    setTourUserIds
}