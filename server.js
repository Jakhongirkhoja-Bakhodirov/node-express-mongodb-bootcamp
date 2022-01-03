const app = require('./app');


//set-up app's running port
const port = process.env.PORT || 3000;


app.listen(port , () => {
    console.log(`App is running on port ${port}`);
});

