const Tour = require('../models/tourModel');


const getAllTours = async(req,res) => {
    try{
        const queryObj = {...req.query};
        const exculededFields = ['limit' , 'page' , 'page' , 'fields' ,'sort'];
        exculededFields.forEach(el => delete queryObj[el]);
        console.log(queryObj,req.query);

        // const tours = await Tour.find({
        //     duration:req.query.duration,
        //     difficulty:req.query.difficulty
        // });
        const query = Tour.find(queryObj);
    //    const tours = await Tour.find().where('duration').equals('5').where('difficulty').equals('easy');

        const tours = await query;

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
    checkBody
}