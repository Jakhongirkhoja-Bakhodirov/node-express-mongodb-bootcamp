const fs = require('fs');


const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

const getAllTours = (req,res) => {
    
    res.status(200).json({
        status:true,
        length:tours.length,
        data:{
            tours:tours
        }
    });
}

const addNewTour = (req,res) => {
    const data = req.body

    const id = tours[tours.length-1].id+1;
    const newTour = Object.assign({
        id:id
    },data);

    tours.push(newTour);

    fs.writeFile(`${__dirname}/../dev-data/data/tours-simple.json`,JSON.stringify(tours) , (err) => {
        if(err) {
            res.status(500).json({
                status:false,
                message:'something went wrong',
                error_message:err.message
            });
        }   
            
        res.status(200).json({
            status:true,
            data : newTour
        });
    });
}

const updateTour = (req,res) => {
    const id = req.params.id*1;
    const tour = tours.find(el => el.id == id)

    if(tour) {
        res.status(200).json({
            status:true,
            data:{
                tour:req.body
            }
        });
    } else {
        res.status(404).json({
            status:false,
            message:'Not found'
        });
    }
}

const deleteTour = (req,res) => {
    res.status(204).json({
        status:true,
        data:null
    });
}

const getTourById = (req,res) => {

    const id = req.params.id*1;

    const tour = tours.find(el => el.id == id)

    if(tour) {
        res.status(200).json({
            status:true,
            data:{
                tour:tour
            }
        });
    } else {
        res.status(404).json({
            status:false,
            message:'Not found'
        });
    }
}


module.exports = {
    getAllTours,
    getTourById,
    addNewTour,
    deleteTour,
    updateTour
}