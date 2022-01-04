const Tour = require('../models/tourModel');


const getAllTours = async(req,res) => {
    try{
        //Building query
        //1A)Filtering
        const queryObj = {...req.query};
        const exculededFields = ['limit' , 'page' , 'page' , 'fields' ,'sort'];

        exculededFields.forEach(el => delete queryObj[el]);

        //1B)Advanced filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lt|lte)\b/g , match => `$${match}`);
        
        let query = Tour.find(JSON.parse(queryStr));
    
        //2)Sorting
        if(req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('--createdAt');
        }

        //3)Field limiting
        if(req.query.fileds) {
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields);
        } else {
            query = query.select('-__v');
        }


        //Execute query
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