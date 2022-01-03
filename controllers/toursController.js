const Tour = require('../models/tourModel');


const getAllTours = async(req,res) => {
    try{
        const tours = await Tour.find();
    
        res.status(200).json({
            status:true,
            length:tours.length,
            data:{
                tours:tours
            }
        });
    }catch(err) {
        res.status(404).json({
            status:false,
            message:err.message
        });
    }
}

const checkID = (req,res,next,val) => {
    console.log('Just check id');
    next();
}

const checkBody = (req,res,next) => {
    if(!req.body.name || !req.body.price) {
        res.status(401).json({
            status:false,
            message:'Bad reqeust please fill in reqeust'
        })
    } 
    next();
}

const addNewTour = async(req,res) => {
    try {
        const newTour = await Tour.create(req.body);
        res.status(201).json({
            status:true,
            data : newTour
        });
    } catch(err) {
        res.status(400).json({
            status:false,
            message:err
        })    
    }
}

const updateTour = (req,res) => {
    const id = req.params.id*1;

    res.status(200).json({
        status:true
    })
}

const deleteTour = (req,res) => {
    res.status(204).json({
        status:true,
        data:null
    });
}

const getTourById = async(req,res) => {
    try {
        const tour = await Tour.findById(req.params.id);
        res.status(200).json({
            status:true,
            data:{
                tour:tour
            }
        });
    }catch(err) {
        res.status(404).json({
            status:false,
            message:err.message
        });
    }
}


module.exports = {
    getAllTours,
    getTourById,
    addNewTour,
    deleteTour,
    updateTour,
    checkID,
    checkBody
}