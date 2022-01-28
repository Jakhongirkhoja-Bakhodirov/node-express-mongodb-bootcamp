const Tour = require('../models/tourModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const handleFactory = require('./handleFactory');

const getAllTours = handleFactory.getAll(Tour);

const aliasTopTours = (req,res,next) => {
    req.query.limit = 5;
    req.query.page = 2;
    req.query.fields = ['name' , 'price']; 
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

const getDistance = catchAsync(async(req,res,next) => {
    const { latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');
    
    const multiplier = unit === 'mi' ? 0.000621371 : 0.001;
    
    if (!lat || !lng) {
        next(
        new AppError(
            'Please provide latitutr and longitude in the format lat,lng.',
            400
        )
        );
    }
    
    const distances = await Tour.aggregate([
        {
        $geoNear: {
            near: {
            type: 'Point',
            coordinates: [lng * 1, lat * 1]
            },
            distanceField: 'distance',
            distanceMultiplier: multiplier
        }
        },
        {
        $project: {
            distance: 1,
            name: 1
        }
        }
    ]);
      
    res.status(200).json({
        status: 'success',
        data: {
        data: distances
        }
    });
});

// /tours-within/:distance/center/:latlng/unit/:unit
// /tours-within/233/center/34.111745,-118.113491/unit/mi
const getToursWithin = catchAsync(async(req,res,next) => {
    const { distance , latlng , unit } = req.params;
    const [lat,lng] = latlng.split(',');


    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
    if(!lat || !lng) {
        next(new AppError('Please provide latitutr and longitude in the format lat,lng.' , 400));
    }

    const tours = await Tour.find({
        startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
    });
    
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
          data: tours
        }
    });
});

module.exports = {
    getAllTours,
    getTourById,
    createTour,
    deleteTour,
    updateTour,
    aliasTopTours,
    getTourStats,
    getMonthlyPlan,
    getDistance,
    getToursWithin
}