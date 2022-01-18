const mongoose = require('mongoose');
const User = require('./userModel');
const Tour = require('./tourModel');

const reviewSchema = mongoose.Schema({
   review:{
       type:String,
       required:[true,'A review can not be empty!'],
       min:10
   },
   rating:{
       type:Number,
       min:1,
       max:5
   },
   tour:{
       type:mongoose.Schema.ObjectId,
       required:[true,'A review must belongs to a tour!'],
       ref:Tour
   },
   user:{
       type:mongoose.Schema.ObjectId,
       required:[true,'A review must belongs to a user!'],
       ref:User
   },
   createdAt:{
       type:Date,
       default:Date.now()
   }
}, {  
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
});

reviewSchema.pre(/^find/ , function(next) {
    this.populate({
        path:'tour',
        select:'name'
    }).populate({
        path:'user',
        select:'name photo'
    });
    next();
});

const Review = mongoose.model('Review',reviewSchema);

module.exports = Review;