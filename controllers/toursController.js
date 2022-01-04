const Tour = require('../models/tourModel');
const ApiFeatures = require('../utils/apiFeatures');

const getAllTours = async(req,res) => {
    try{
      //Execute query
        const features = new ApiFeatures(Tour.find() , req.query).filter().sorting().limitFields();
        const tours = await features.query;

        res.status(200).json({
            status:true,
            length:tours.length,
            data:{
                tours
            }
        });
    }catch(err) {
        res.status(404).json({
            status:false,
            message:err.message
        });
    }
}

const aliasTopTours = (req,res,next) => {
    req.query.limit = 5;
    req.query.page = 2;
    req.query.fields = ['name' , 'price']; 
    next();
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
            data : {
                newTour
            }
        });
    } catch(err) {
        res.status(400).json({
            status:false,
            message:err
        })    
    }
}

const updateTour = async(req,res) => {

    try{
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
    }catch(err){
        res.status(400).json({
            status:false,
            message:err.message
        });
    }
}

const deleteTour = async(req,res) => {
    try{
        const tour = await Tour.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status:true,
            data:{
                tour
            }
        });
    }catch(err){
        res.status(404).json({
            status:false,
            message:err.message
        });
    }
}

const getTourById = async(req,res) => {
    try {
        const tour = await Tour.findById(req.params.id);
        res.status(200).json({
            status:true,
            data:{
                tour
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
    checkBody,
    aliasTopTours
}