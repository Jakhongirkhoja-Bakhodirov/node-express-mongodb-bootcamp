const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const AppError = require('./utils/appError');
const globalErrorHandling = require('./controllers/errorController');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

require('dotenv').config({path:'./.env'});


//Declare Middlewares
// app.use()

//setting secure http headers
app.use(helmet());

//Developement logging
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}   

const rateLimiter = rateLimit({
    max:2,
    windowMs:60*60*1000,
    message:'Too many request with the current IP address , please try again later on'
});

//Limit requests from same API
app.use('/api' , rateLimiter);

//Body-parser , reading data from body into req.body
app.use(express.json({limit:'10kb'}));

app.use(express.static(`${__dirname}/public`))

app.use('/api/v1/tours',tourRouter);
app.use('/api/v1/users',userRouter);

app.all('*' , (req,res,next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server` , 404));
}); 


app.use(globalErrorHandling);

module.exports = app;


