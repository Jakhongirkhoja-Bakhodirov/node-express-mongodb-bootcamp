
const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true , 'A tour name is required!'],
        unique:true,
        minlength:[10,'A tour must have more or equal than 10 characters'],
        maxlength:[40,'A tour must have less or equal than 10 characters']
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
        required:[true,'A tour must have a difficulty'],
        enum:{
            values:['easy' , 'medium' , 'difficult'],
            message:'Difficulty is either:easy , medium , difficult'
        }
    },
    rating:{
        type:Number,
        default:4.5,
        min:[1,'A rating must be above 1.0'],
        max:[5,'A rating must be below 5.0']
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
    },
    secretTour:{
        type:Boolean    
    }
},  {  
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
});

tourSchema.virtual('durationWeeks').get(function() {
    return this.duration / 7;
});

//Document Middleware:runs before .save() and .create()
// tourSchema.pre('save' , function(next) {
//     this.slug = slugify(this.name , {lower:true})
//     next();
// });

// //Post middleware is executed after all pre middleware has been executed
// tourSchema.post('save' , function(doc , next) {
//     console.log(doc);
//     next();
// });

//Query middleware 
// tourSchema.pre(/^find/ , function(next) {
//     console.log('Find' , this.getQuery());
//     this.find({duration:{$ne:51}})
//     next();
// })

// tourSchema.post(/^find/ , function(doc,next) {
//     console.log(doc);
//     next();
// }); 

//Aggregation Middleware
tourSchema.pre('aggregate' , function(next) {
    this.pipeline().unshift({
        $match:{
            secretTour:{
                $ne:false
            }
        }
    })
    console.log(this.pipeline());
    next();
});

const Tour = mongoose.model('Tour' , tourSchema);

module.exports = Tour;