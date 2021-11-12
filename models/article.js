const mongoose = require('mongoose');
const postblog = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    date:{
        type:Date
    },
    title:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    }
}
);

//create collection
module.exports = new mongoose.model('article',postblog);