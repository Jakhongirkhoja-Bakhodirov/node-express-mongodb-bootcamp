const Review = require('../models/reviewModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const handleFactory = require('./handleFactory');

const getAllReviews = catchAsync(async(req,res) => {
    let filter = {};

    if(req.params.tourId)  filter = { tour: req.params.tourId };
    
    const reviews = await Review.find(filter);

    res.status(200).json({
        success:'success',
        results:reviews.length,
        data:reviews
    });
});

const getReview = catchAsync(async(req,res,next) => {
    const review = await Review.findById(req.params.id);
    if(!review) {
        return next(new AppError(`A review not found with following ${req.params.id} id` , 404));
    }
    res.status(200).json({
        success:'success',
        data:review
    });
});

const createReiview = catchAsync(async(req,res) => {
    if(!req.body.tour) req.body.tour = req.params.tourId;
    if(!req.body.user) req.body.user = req.user.id;

    const review = await Review.create(req.body);
    
    res.status(201).json({
        status:'success',
        review
    });
});

const updateReview = catchAsync(async(req,res,next) => {
    const review = await Review.findByIdAndUpdate(req.params.id,req.body,{
        runValidators:true,
        new:true
    });
    
    if(!review) {
        return next(new AppError(`A review not found with following ${req.params.id} id` , 404));
    }

    res.status(200).json({
        status:'success',
        review
    });
});

const deleteReview = handleFactory.deleteOne(Review);


module.exports = {
    getAllReviews,
    getReview,
    createReiview,
    updateReview,
    deleteReview
}