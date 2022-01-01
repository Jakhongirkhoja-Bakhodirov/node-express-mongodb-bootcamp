const express = require('express');
const fs = require('fs');
const morgan = require('morgan');

const app = express();

//set-up app's running port
const port = 3000;

//Declare Middlewares
app.use(express.json());
app.use(morgan('dev'));

const tourRouter = express.Router();
const userRouter = express.Router();

app.use('/api/v1/tours',tourRouter);
app.use('/api/v1/users',userRouter);

app.use((req,res,next) => {
    console.log('Hello from the test middleware')
    next();
})

app.use((req,res,next) => {
    req.requestTime = new Date().toISOString();
    console.log('Hello from the test middleware')
    next();
})

app.get('/' , (req,res) => {
    res.status(200).json({
        message:'Something new'
    });
});

const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const getAllTours = (req,res) => {
    console.log(req.requestTime);
    res.statusCode = 200;
    res.json({
        status:true,
        length:tours.length,
        request_time:req.requestTime,
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

    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`,JSON.stringify(tours) , (err) => {
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


const getAllUsers = (req,res) => {
    console.log(req.requestTime);
    res.statusCode = 200;
    res.json({
        status:true,
        length:tours.length,
        request_time:req.requestTime,
        data:{
            tours:tours
        }
    });
}

const addNewUser = (req,res) => {
    const data = req.body

    const id = tours[tours.length-1].id+1;
    const newTour = Object.assign({
        id:id
    },data);

    tours.push(newTour);

    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`,JSON.stringify(tours) , (err) => {
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

const deleteUser = (req,res) => {
    res.status(204).json({
        status:true,
        data:null
    });
}

const getUserById = (req,res) => {

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
 
tourRouter
    .route('/')
    .get(getAllTours)
    .post(addNewTour);

tourRouter
    .route('/:id')
    .get(getTourById)
    .patch(updateTour)
    .delete(deleteTour);

userRouter
    .route('/')
    .get(getAllUsers)
    .post(addNewUser);

userRouter
    .route('/:id')
    .get(getUserById)
    .patch(updateUser)
    .delete(deleteUser);

app.listen(port , () => {
    console.log(`App is running on port ${port}`);
});