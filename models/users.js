const mongoose = require('mongoose');

const users = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    date:{
        type:Date
    },
}
);

//create collection
module.exports = new mongoose.model('userbase',users);