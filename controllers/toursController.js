const Tour = require('../models/tourModel');
const ApiFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const handleFactory = require('./handleFactory');

const getAllTours = catchAsync(async(req,res,next) => {

    //Execute query
    const features = new ApiFeatures(Tour.find() , req.query)
    .filter()
    .sorting()
    .limitFields();
    const tours = await features.query;

    res.status(200).json({
        status:true,
        length:tours.length,
        data:{
            tours
        }
    });
})

const aliasTopTours = (req,res,next) => {
    req.query.limit = 5;
    req.query.page = 2;
    req.query.fields = ['name' , 'price']; 
    next();
}

// const checkID = (req,res,next,val) => {
//     console.log('Just check id');
//     next();
// }

const checkBody = (req,res,next) => {
    if(!req.body.name || !req.body.price) {
        res.status(401).json({
            status:false,
            message:'Bad reqeust please fill in reqeust'
        })
    } 
    next();
}

const addNewTour = catchAsync(async(req,res,next) => {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
        status:true,
        data : {
            newTour
        }
    });
});

const updateTour = catchAsync(async(req,res) => {

    const tour = await Tour.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true
    });

    res.status(200).json({
        status:true,
        data:{
            tour
        }
    })
});

const deleteTour =  handleFactory.deleteOne(Tour);

const getTourById = catchAsync(async(req,res,next) => {
    const tour = await Tour.findById(req.params.id).populate('reviews');
    if(!tour) {
        return next(new AppError(`Tour not found with following ID ${req.params.id}` , 404));
    }
    res.status(200).json({
        status:true,
        data:{
            tour
        }
    });
});

const getTourStats = catchAsync(async(req,res,next) => {
    const stats = await Tour.aggregate([
        { 
            $match:{
            duration:{$gte:4.5}
            }
        },
        {
            $group:{
            _id:{$toUpper:'$difficulty'},
            // _id:'$ratingsAverage',
            // _id:'$difficulty',
            numTours:{$sum:1},
            avgRating:{$avg:'$ratingsAverage'},
            avgPrice:{$avg:'$price'},
            minPrice:{$min:'$price'},
            maxPrice:{$max:'$price'}
            }
        },
        {
            $sort:{
                avgPrice:1
            }
        },
        // {
        //     $match:{
        //         _id:{
        //             $ne:'EASY'
        //         }
        //     }
        // }
    ]);

    res.status(200).json({
        status:true,
        data:{
            stats
        }
    });
})

const getMonthlyPlan = catchAsync(async(req,res,next) => {
        const year = req.params.year * 1 || 1;
        const plan = await Tour.aggregate([
            {
                $unwind:'$startDates'
            },
            {
                $match:{
                    startDates:{
                        $gte:new Date(`${year}-01-01`),
                        $lte:new Date(`${year}-12-31`)
                    }
                }
            },
            {
                $group:{
                    _id:{
                        $month:'$startDates'
                    },
                    numOfTours:{
                        $sum:1
                    },
                    tours:{
                        $push:'$name'
                    }
                }
            },
            {
                $addFields:{
                    month:'$_id'
                }
            },
            {
                $project:{
                    _id:0
                }
            },
            {
                $sort:{
                    numOfTours:-1
                }
            }
        ]);
        res.status(200).json({
            status:true,
            result:plan.length,
            data:{
                plan
            }
        }); 
});

module.exports = {
    getAllTours,
    getTourById,
    addNewTour,
    deleteTour,
    updateTour,
    checkBody,
    aliasTopTours,
    getTourStats,
    getMonthlyPlan
}