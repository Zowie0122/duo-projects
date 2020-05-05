const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        require:true
    },
    email: {
        type: String,
        required: true;
        unique: true
    },
    avatar: {
        type:String
    },
    data: {
        type: Date,
        default: Date.now()
    }
})

module.exports = User = mongoose.model("user",UserSchema)