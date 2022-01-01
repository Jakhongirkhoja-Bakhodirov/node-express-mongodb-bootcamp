const express = require('express');
const router = express.Router();
const fs = require('fs');


const users = JSON.parse(
    fs.readFileSync(`${__dirname}/../dev-data/data/users.json`)
);

const getAllUsers = (req,res) => {
    console.log(req.requestTime);
    res.statusCode = 200;
    res.json({
        status:true,
        length:users.length,
        request_time:req.requestTime,
        data:{
            users:users
        }
    });
}

const addNewUser = (req,res) => {
    const data = req.body

    const id = users[users.length-1].id+1;
    const newTour = Object.assign({
        id:id
    },data);

    users.push(newTour);

    fs.writeFile(`${__dirname}/dev-data/data/users-simple.json`,JSON.stringify(users) , (err) => {
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

const updateUser = (req,res) => {
    const id = req.params.id*1;
    const tour = users.find(el => el.id == id)

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

const deleteUser = (req,res) => {
    res.status(204).json({
        status:true,
        data:null
    });
}

const getUserById = (req,res) => {

    const id = req.params.id*1;

    const tour = users.find(el => el.id == id)

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
 


router
    .route('/')
    .get(getAllUsers)
    .post(addNewUser);

router
    .route('/:id')
    .get(getUserById)
    .patch(updateUser)
    .delete(deleteUser);


module.exports = router;