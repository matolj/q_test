const Book = require('../models/Book')

module.exports = async (req,res,next) => {

    const book = await Book.findOne({_id: req.params.id, author: req.user.sub})
    
    if(book){
        next()
    }else{
        res.status(401).json({message:'You are not author!'})
   }
    
 };