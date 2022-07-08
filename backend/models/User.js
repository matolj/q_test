const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: 'String',
        required: true,
    },
    lastName:  {
        type: 'String',
        required: true,
    },
    email:  {
        type: 'String',
        required: true,
        unique: true
    },
    password: { 
        type: String, 
        required: true
    },
    isActive:{
        type: Boolean, 
        default: true
    },
    roles: { 
        type: String,
        enum: ['Author', 'Admin'], 
        default: 'Author' 
    },
});

module.exports= mongoose.model('User', userSchema);