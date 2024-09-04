const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    note:{
        type:String,
        required:true
    },
    complete:{
        type:Boolean,
        default:false

    }
})

const userModel = mongoose.model("todos",userSchema);
module.exports= userModel;