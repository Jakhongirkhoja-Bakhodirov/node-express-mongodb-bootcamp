const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandling = require('./controllers/errorController');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');

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
    max:1000,
    windowMs:60*60*1000,
    message:'Too many request with the current IP address , please try again later on'
});

//Limit requests from same API
app.use('/api' , rateLimiter);

//Body-parser , reading data from body into req.body
app.use(express.json({limit:'10kb'}));

//Data sanitization against NoSQL query injection
app.use(mongoSanitize());

//Data sanitization against XSS
app.use(xss());

//Prevent parametr pollution
app.use(hpp({
    whitelist:['duration' ,'ratingsQuantity' , 'ratingsAverage' , 'difficulty' , 'maxGroupSize' , 'price']
}));

app.use(express.static(`${__dirname}/public`))

app.use('/api/v1/tours',tourRouter);
app.use('/api/v1/users',userRouter);
app.use('/api/v1/reviews',reviewRouter);

app.all('*' , (req,res,next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server` , 404));
}); 


app.use(globalErrorHandling);

module.exports = app;


