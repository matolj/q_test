const mongoose = require('mongoose');
const connectDB = 'mongodb+srv://matolj:test@cluster0.ylfzucb.mongodb.net/?retryWrites=true&w=majority';

const connectDatabase = () => {
    mongoose.connect(connectDB,{ useNewUrlParser: true, useUnifiedTopology:true }).then(()=>{
        //console.log('Database connected!');
    }).catch((err)=>{
        throw new Error({message: 'Something went wrong with database config!'})
    })
}

module.exports = {
    connectDatabase
}