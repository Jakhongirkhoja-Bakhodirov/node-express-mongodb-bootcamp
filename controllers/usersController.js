const fs = require('fs');

const users = JSON.parse(
    fs.readFileSync(`${__dirname}/../dev-data/data/users.json`)
);

const getAllUsers = (req,res) => {
    console.log(req.requestTime);
    res.statusCode = 200;
    res.json({
        status:true,
        length:users.length,
        request_time:req.requestTime,
        data:{
            users:users
        }
    });
}

const addNewUser = (req,res) => {
    const data = req.body

    const id = users[users.length-1].id+1;
    const newUser = Object.assign({
        id:id
    },data);

    users.push(newUser);

    fs.writeFile(`${__dirname}/dev-data/data/users-simple.json`,JSON.stringify(users) , (err) => {
        if(err) {
            res.status(500).json({
                status:false,
                message:'something went wrong',
                error_message:err.message
            });
        }   
            
        res.status(200).json({
            status:true,
            data : newUser
        });
    });
}

const updateUser = (req,res) => {
    const id = req.params.id*1;
    const user = users.find(el => el.id == id)

    if(user) {
        res.status(200).json({
            status:true,
            data:{
                user:req.body
            }
        });
    } else {
        res.status(404).json({
            status:false,
            message:'Not found'
        });
    }
}

const deleteUser = (req,res) => {
    res.status(204).json({
        status:true,
        data:null
    });
}

const getUserById = (req,res) => {

    const id = req.params.id*1;

    const user = users.find(el => el.id == id)

    if(user) {
        res.status(200).json({
            status:true,
            data:{
                user:user
            }
        });
    } else {
        res.status(404).json({
            status:false,
            message:'Not found'
        });
    }
}
 
module.exports = {
    getAllUsers,
    getUserById,
    deleteUser,
    updateUser,
    addNewUser
}

