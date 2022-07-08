const express = require('express');
const router = express.Router();
const checkAuth = require('../helpers/authorize');
const Book = require('../models/Book')
const authorController = require('../controllers/author')
const isAuthor = require('../helpers/isAuthor')

router.get('/', (req, res, next) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const getBooksQuerry = Book.find({isActive: true}).populate('author');
    let fetchedBooks;
  
    if(pageSize && currentPage){
        getBooksQuerry
        .skip(pageSize * (currentPage - 1))
        .limit(pageSize)
    }
    
    getBooksQuerry
        .then((documents) =>{
            fetchedBooks = documents;
            return Book.countDocuments({isActive: true});
        })
        .then((count)=>{
          res.status(200).json({message: 'OK', books: fetchedBooks, maxBooks:count})
        })
        .catch(error=>{
          res.status(500).json({message:'Fetching books failed!'})
        })
   
});

router.get('/my-books', checkAuth, (req, res, next) => {

  const userId = req.user.sub;
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const getBooksQuerry = Book.find({author: userId, isActive: true}).populate('author');
  let fetchedBooks;

  if(pageSize && currentPage){
      getBooksQuerry
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize)
  }
  
  getBooksQuerry
      .then((documents) =>{
          fetchedBooks = documents;
          return Book.countDocuments({author: userId, isActive: true});
      })
      .then((count)=>{
        res.status(200).json({message: 'OK', books: fetchedBooks, maxBooks:count})
      })
      .catch(error=>{
        res.status(500).json({message:'Fetching books failed!'})
      })
   
});

router.post('/write-book', checkAuth, async (req, res, next) => {

  try{
    const writeBook =await authorController.writeBook(req.body, req.user.sub)
    if(writeBook){
      res.status(201).json({
        message: 'Book created!',
             book: writeBook
         })
    }
  }catch{
      res.status(500).json({message: 'Something went wrong!'})
  }
 
});

router.post('/edit-book/:id', checkAuth, isAuthor, async (req, res, next) => {

  try{
    const bookUpdate = await authorController.updateBook(req.params.id, req.body)
    
    if(bookUpdate){
     
      res.status(201).json({
        message: 'Book updated!',
        book: bookUpdate
      })

    }
  }catch{
    res.status(500).json({message: 'Something went wrong!'})
  }

});

router.delete('/delete-book/:id', checkAuth, isAuthor, async (req, res, next) => {

  try{
      const deletedBook = await authorController.deleteBookById(req.params.id)
      if(deletedBook){
        res.status(200).json(deletedBook)
      } 
  }catch{
      res.status(500).json({message: 'Something went wrong!'})
  }

});


module.exports = router;