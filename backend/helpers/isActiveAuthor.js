const User = require('../models/User')

module.exports = async (req,res,next) => {

    const activeAutor = await User.findOne({_id: req.user.sub, isActive: true})
    
    if(activeAutor){
        next()
    }else{
        res.status(401).json({message:'You are not active anymore!'})
   }
    
 };