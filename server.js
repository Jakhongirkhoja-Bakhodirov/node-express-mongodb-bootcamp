const app = require('./app');
const mongoose = require('mongoose');


//set-up app's running port
const port = process.env.PORT || 3000;

const tourSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true , 'A tour name is required!'],
        unique:true
    },
    rating:{
        type:Number,
        default:4.5
    },
    price:{
        type:Number,
        required:[true,'A tour price is required!']
    }
});

const Tour = mongoose.model('Tour' , tourSchema);

const newTour = new Tour({
    name:'New Tour Name 2',
    //rating:4.6,
    price:89.99
})

newTour.save().then((doc) => {
    console.log(doc);
}).catch(err => {
    console.log('document saving error',err);
})

app.listen(port , () => {
    console.log(`App is running on port ${port}`);
});

