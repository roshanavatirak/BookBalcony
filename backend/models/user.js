const mongoose = require("mongoose");

const user = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true,
    },
    email:{
        type: String,
        required: true,
        unique:true,
    },
     phone: {
    type: String,
    required: true,
    unique:true,
  },
    password:{
        type: String,
        required: true,
    },
    address:{
        type: String,
        
    },
    avatar:{
        type: String,
        default:"https://img.freepik.com/free-psd/contact-icon-illustration-isolated_23-2151903337.jpg?ga=GA1.1.710266921.1749747219&semt=ais_hybrid&w=740",
    },
    role:{
        type : String,
        default : "user",
        enum:["user", "admin"],
    },
    favourites:[
        {
        type: mongoose.Types.ObjectId,
        ref: "books",
    },
],

cart:[
    {
    type: mongoose.Types.ObjectId,
    ref: "books",
},
],

orders:[
    {
    type: mongoose.Types.ObjectId,
    ref: "order",
},
],
},
{timestamps:true}
);
module.exports = mongoose.model("user", user);