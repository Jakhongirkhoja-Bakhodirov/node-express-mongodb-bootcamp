const express = require('express');
const fs = require('fs');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const app = express();

//set-up app's running port
const port = 3000;

//Declare Middlewares
app.use(express.json());
app.use(morgan('dev'));


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


app.listen(port , () => {
    console.log(`App is running on port ${port}`);
});