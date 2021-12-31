const express = require('express');
const app = express();
const port = 3000;

app.get('/' , (req,res) => {
    res.status(200).json({
        'message':'Something new'
    });
});

app.listen(port , () => {
    console.log(`App is running on port ${port}`);
});