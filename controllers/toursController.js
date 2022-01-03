const Tour = require('../models/tourModel');


const getAllTours = async(req,res) => {

    const tours = await Tour.find();
    
    res.status(200).json({
        status:true,
        length:tours.length,
        data:{
            tours:tours
        }
    });
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

const getTourById = (req,res) => {

    const id = req.params.id*1;

    res.status(200).json({
        status:true,
        data:{
        }
    });

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