const Review = require('../models/reviewModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const getAllReviews = catchAsync(async(req,res) => {
    const reviews = await Review.find();
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
        data:reviews
    });
});

const createReiview = catchAsync(async(req,res) => {
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

const deleteReview = catchAsync(async(req,res,next) => {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
        return next(new AppError(`No review found with that ${req.params.id} Id`, 404));
      }
    
      res.status(204).json({
        status: 'success',
        data: null
      });
});


module.exports = {
    getAllReviews,
    getReview,
    createReiview,
    updateReview,
    deleteReview
}