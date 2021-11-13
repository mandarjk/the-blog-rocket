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
    },
    body:{
        type:String,
    }
}
);

//create collection
module.exports = new mongoose.model('article',postblog);