const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.get('/' , (req,res) => {
    res.status(200).json({
        'message':'Something new'
    });
});

const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get('/api/v1/tours' , (req,res) => {
    res.statusCode = 200;
    res.json({
        'status':true,
        'length':tours.length,
        'data':{
            'tours':tours
        }
    });
});

app.listen(port , () => {
    console.log(`App is running on port ${port}`);
});