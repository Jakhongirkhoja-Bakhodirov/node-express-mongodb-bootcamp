const mongoose = require('mongoose');
const fs = require('fs');


require('dotenv').config({path:'./.env'});

const Tour = require('../../models/tourModel');
const User = require('../../models/userModel');
const Review = require('../../models/reviewModel');

//connecting MongoDB database
// const DB = process.env.DATABASE.replace('<password>' , process.env.DATABASE_PASSWORD);

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

//Read Json File
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json` , 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json` , 'utf-8'));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json` , 'utf-8'));
//IMPORT Data Into DB
const importData = async() => {
    try {
        await User.create(users , {
            validateBeforeSave:false
        });
        await Tour.create(tours);
        await Review.create(reviews);
        console.log('Data successfully loaded!');
        process.exit();
    }catch(err) {
        console.log('Importing data to db error',err);
    }
}

//Delete all data from DB
const deleteData = async() => {
    try{
        await Tour.deleteMany();
        await User.deleteMany();
        await Review.deleteMany();
        console.log('Data successfully deleted!');
        process.exit();
    }catch(err){
        console.log('Deleting data error',err);
    }
}

process.argv[2] == '--import' ? importData() :( process.argv[2] == '--delete' ? deleteData() : console.log('No command chosen'));

// if(process.argv[2]='--import') {
//     importData()
// } else if(process.argv[2]='--delete') {
//     deleteData()
// }


console.log(process.argv[2]);