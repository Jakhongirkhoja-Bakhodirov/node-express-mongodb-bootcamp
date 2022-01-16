const nodemailer = require('nodemailer');
const catchAsync = require('./catchAsync');

const sendEmail = catchAsync(async(options) => {
    //1)Create a transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        // service:'Gmail', if you want to use gmail service to send email to users , the users have to activate in gmail `less secure app` option !!!
        auth:{
            user:process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASSWORD
        }
    });

    //2)Define the email options
    const mailOptions = {
        from:'Jakhongir Bakhodirov <admi@gmail.com>',
        to:options.email,
        subject:options.subject,
        text:options.message
    }

    //3)Actually send the email
    return await transporter.sendMail(mailOptions);
});

module.exports = {sendEmail};