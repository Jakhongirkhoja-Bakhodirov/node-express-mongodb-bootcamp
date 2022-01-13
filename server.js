const app = require('./app');
const mongoose = require('mongoose')

//set-up app's running port
const port = process.env.PORT || 3000;

process.on('uncaughtException' , err => {
    console.log('Uncaught Exception Shutting down ...')
    console.log(err.name,err.message);
    process.exit(1);
});

//connecting MongoDB database
//const DB = process.env.DATABASE.replace('<password>' , process.env.DATABASE_PASSWORD);

mongoose.connect(process.env.DATABASE_LOCAL,{
    useNewUrlParser:true,
    // useCreateIndex:true,
    // useFindAndModify:false
}).then((con) => {
    console.log('Connected to database successfully!');
   // console.log(con.connections);
});

const server = app.listen(port , () => {
    console.log(`App is running on port ${port}`);
});


process.on('unhandledRejection' , (err) => {
    console.log('Unhadled Rejection App shuting down ..');
    console.log(err.name,err.message);
    server.close(() => {
        process.exit(1);
    });
})

