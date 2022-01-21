const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const handleFactory = require('./handleFactory');

const getAllTours = handleFactory.getAll(Tour);

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

const createTour = handleFactory.createOne(Tour);

const updateTour = handleFactory.updateOne(Tour);

const deleteTour =  handleFactory.deleteOne(Tour);

const getTourById = handleFactory.getOne(Tour, {path:'reviews'});

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
    createTour,
    deleteTour,
    updateTour,
    checkBody,
    aliasTopTours,
    getTourStats,
    getMonthlyPlan
}