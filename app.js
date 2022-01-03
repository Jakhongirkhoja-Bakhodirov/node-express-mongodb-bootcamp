const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose')

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

require('dotenv').config({path:'./config.env'});


//connecting MongoDB database
const DB = process.env.DATABASE.replace('<password>' , process.env.DATABASE_PASSWORD);

mongoose.connect(process.env.DATABASE_LOCAL,{
    useNewUrlParser:true,
    // useCreateIndex:true,
    // useFindAndModify:false
}).then((con) => {
    console.log('Connected to database successfully!');
   // console.log(con.connections);
}).catch((err) => {
    console.log(`Database connection error ${err}`);
});



//Declare Middlewares
// app.use()
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
app.use(express.json());

app.use(express.static(`${__dirname}/public`))

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

module.exports = app;


