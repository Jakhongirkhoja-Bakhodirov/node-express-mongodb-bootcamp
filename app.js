const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

require('dotenv').config({path:'./config.env'});


//Declare Middlewares
// app.use()
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
app.use(express.json());

app.use(express.static(`${__dirname}/public`))

app.use('/api/v1/tours',tourRouter);
app.use('/api/v1/users',userRouter);

app.all('*' , (req,res) => {
    res.status(404).json({
        status:false,
        message:`Can't find ${req.originalUrl} on this server`
    });
}); 

app.use((req,res,next) => {
    req.requestTime = new Date().toISOString();
    console.log('Hello from the test middleware')
    next();
})

module.exports = app;


