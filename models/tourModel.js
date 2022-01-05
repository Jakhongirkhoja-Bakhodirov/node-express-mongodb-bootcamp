
const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true , 'A tour name is required!'],
        unique:true
    },
    duration:{
        type:Number,
        required:[true,'A tour duration is required!']
    },
    maxGroupSize:{
        type:Number,
        required:[true,'A tour must have a group size']
    },
    difficulty:{
        type:String,
        required:[true,'A tour must have a difficulty']
    },
    rating:{
        type:Number,
        default:4.5
    },
    price:{
        type:Number,
       // required:[true,'A tour price is required!']
    },
    ratingsAverage:{
        type:Number,
        required:[true,'A tour must have a ratings average']
    },
    ratingsQuantity:{
        type:Number,
        required:[true,'A tour must have a ratings quantity']
    },
    priceDiscount:Number,
    summary:{
        type:String,
        trim:true
    },
    description:{
        type:String,
        trim:true,
        required:[true,'A tour must have a description']
    },
    imageCover:{
        type:String,
        required:[true,'A tour must have a cover image']
    },
    images:[String],
    createdAt:{
        type:Date,
        default:Date.now()
    },
    startDates:{
        type:[Date]
    },
    slug:{
        type:String
    }
},  {  
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
});

tourSchema.virtual('durationWeeks').get(function() {
    return this.duration / 7;
});

//Document Middleware:runs before .save() and .create()
tourSchema.pre('save' , function(next) {
    this.slug = slugify(this.name , {lower:true})
    next();
});

//Post middleware is executed after all pre middleware has been executed
tourSchema.post('save' , function(doc , next) {
    console.log(doc);
    next();
});

const Tour = mongoose.model('Tour' , tourSchema);

module.exports = Tour;