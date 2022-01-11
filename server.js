const app = require('./app');
const mongoose = require('mongoose')

//set-up app's running port
const port = process.env.PORT || 3000;

//connecting MongoDB database
const DB = process.env.DATABASE.replace('<password>' , process.env.DATABASE_PASSWORD);

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

app.listen(port , () => {
    console.log(`App is running on port ${port}`);
});

