const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    name: {
        type: 'String',
        required: true,
    },
    content: {
        type: 'String',
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
    isActive:{
        type: Boolean, 
        default: true
    },
});

module.exports= mongoose.model('Book', bookSchema);