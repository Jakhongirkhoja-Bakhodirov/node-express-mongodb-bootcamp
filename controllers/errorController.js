const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}:${err.value}`;
    return new AppError(message,400);
};

const handleDuplicateFields = (err) => {
    const message = `Duplicate field value: ${err.keyValue.name} Please use another name`;
    return new AppError(message,400);
}

const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message);
  
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
};
  
const handleJsonWebTokenError = () => {
    return new AppError('Invalid token,please login again',401);
}

const handleTokenExpiredError = () => {
    return new AppError('Token expired,please login again' , 401);
}

const sendErrorDev = (err,res) => {
    res.status(err.statusCode).json({
        status:err.status,
        error:err,
        message:err.message,
        stack:err.stack
    });
};
const sendErrorProd = (err,res) => {
    if(err.isOperational) {
        //Operational , trusted error:send message to client
        res.status(err.statusCode).json({
            status:err.status,
            message:err.message
        });
    } else {
        //Programming or other unkown error:don't leak error details
        //1) Log Error
        console.error('Error' , err);

        //2) Send generic message
        res.status(500).json({
            status:'error',
            message:'Something went wrong'
        });
    }
}
module.exports = (err,req,res,next) => {
    
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    
    if(process.env.NODE_ENV == 'development') {
        sendErrorDev(err,res);
    } else if(process.env.NODE_ENV == 'production') {
        
        let error = { ...err };
        if(err.name == 'CastError') {
            error = handleCastErrorDB(error);
        } 

        if(err.code == '11000') {
            error = handleDuplicateFields(error);
        }

        if(err.name == 'ValidationError') {
            error = handleValidationErrorDB(error);
        }

        if(err.name == 'JsonWebTokenError') {
            error = handleJsonWebTokenError(error);
        }

        if(err.name == 'TokenExpiredError') {
            error = handleTokenExpiredError(error);
        }

        sendErrorProd(error,res); 
    }
}