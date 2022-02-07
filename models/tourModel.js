
const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
const User = require('./userModel');

const tourSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true , 'A tour name is required!'],
        unique:true,
        minlength:[10,'A tour must have more or equal than 10 characters'],
        maxlength:[40,'A tour must have less or equal than 10 characters'],
        // validate:[validator.isAlpha , 'Tour must contains only characters']
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
       required:[true,'A tour price is required!']
    },
    priceDiscount:{
        type:Number,
        validate:{
            validator:function(value) {
                //this only points to current doc on new document creation 
                return value < this.price;
            },
            message:'Discount price ({VALUE}) should be below regular price'
        }
    },
    ratingsAverage:{
        type:Number,
        required:[true,'A tour must have a ratings average'],
        set:val => Math.round(val*10) / 10
    },
    ratingsQuantity:{
        type:Number,
        required:[true,'A tour must have a ratings quantity']
    },
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
    startLocation: {
        // GeoJSON
        type: {
          type: String,
          default: 'Point',
          enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String
      },
    locations: [
        {
          type: {
            type: String,
            default: 'Point',
            enum: ['Point']
          },
          coordinates: [Number],
          address: String,
          description: String,
          day: Number
        }
    ],
    guides:[{
        type:mongoose.Schema.ObjectId,
        ref:User
    }],
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

//Declaring indexes 
// tourSchema.index({price:1});

tourSchema.index({price:1 , ratingsAverage:-1})
tourSchema.index({startLocation:'2dsphere'});

tourSchema.virtual('durationWeeks').get(function() {
    return this.duration / 7;
});

tourSchema.virtual('reviews' , {
    ref:'Review',
    foreignField:'tour',
    localField:'_id'
});

//Document Middleware:runs before .save() and .create()
// tourSchema.pre('save' , async function(next) {
//     const guidePromises = this.guides.map(async id => User.findById(id));
//     this.guides = await Promise.all(guidePromises);
//     next();
// });

tourSchema.pre('save' , function(next) {
    this.slug = slugify(this.name , {lower:true})
    next();
});

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

tourSchema.pre(/^find/ , function(next) {
    this.populate({
        path:'guides',
        select:'-passwordResetToken -passwordResetExpires -passwordChangeAt -email'
    });
    next();
});

// tourSchema.post(/^find/ , function(doc,next) {
//     console.log(doc);
//     next();
// }); 

//Aggregation Middleware
// tourSchema.pre('aggregate' , function(next) {
//     this.pipeline().unshift({
//         $match:{
//             secretTour:{
//                 $ne:false
//             }
//         }
//     })
//     console.log(this.pipeline());
//     next();
// });

const Tour = mongoose.model('Tour' , tourSchema);

module.exports = Tour;