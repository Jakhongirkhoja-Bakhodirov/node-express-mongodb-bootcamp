const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async(req,res,next) => {
    //1) Get tour data from collection
    const tours = await Tour.find();
    //2) Build template

    //3) Render that template using tour data from 1)
    res.status(200).render('overview' , {
        tours
    });
});

exports.getTour = (req,res) => {
    res.status(200).render('tour');
};

exports.getTourReview = catchAsync(async(req,res) => {
    // 1) Get the data for the requested tour including review and guides
    const tourDetail = await Tour.findOne({slug:req.params.slug}).populate({
        path:'reviews',
        fields:'review rating user'
    })
    // 2) Build template
    res.status(200).render('tour' , {
        tour:tourDetail
    });
    // 3) Render template using data from 1)


});
