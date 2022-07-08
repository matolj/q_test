const express = require('express');
const router = express.Router();
const checkAuth = require('../helpers/authorize');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../config.json');
const checkAdmin = require('../helpers/isAdmin');
const userController = require('../controllers/user');

// routes
router.post('/authenticate', async (req, res, next)=> {
    let fetchedUser;
    const userByEmail = await userController.findUserByEmail(req.body.username)
    
    if(!userByEmail){
      res.status(400).json({message:'Invalid authentication credentials!'})
    }else{

      fetchedUser = userByEmail;
      const validCredentials = await bcrypt.compare(req.body.password, fetchedUser.password)
      if(!validCredentials){
        res.status(400).json({message:'Auth failed!'})
      }else{

        const token = jwt.sign(
          { sub: fetchedUser.id, role: fetchedUser.roles },
          config.secret
        );

         res.json({
              id: fetchedUser.id,
              firstName: fetchedUser.firstName,
              lastName: fetchedUser.lastName,
              username: fetchedUser.email,
              role: fetchedUser.roles,
              token
        })

      }
    }
});

router.get('/', checkAuth, (req, res, next) => {

    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const getAuthorsQuerry = User.find({roles : "Author", isActive:true});
    let fetchedAuthors;
  
    if(pageSize && currentPage){
      getAuthorsQuerry
        .skip(pageSize * (currentPage - 1))
        .limit(pageSize);
    }
    
    getAuthorsQuerry
        .then((documents) =>{
          fetchedAuthors = documents;
          return User.countDocuments({roles : "Author", isActive:true});
        })
        .then((count)=>{
          res.status(200).json({message: 'OK', authors: fetchedAuthors, maxAuthors:count})
        })
        .catch(error=>{
          res.status(500).json({message:'Fetching authors failed!'})
        })
});

router.get('/:id', checkAuth, async (req, res, next) => {
    try{
      const user = await userController.findUserById(req.params.id)
      if(user){
        res.status(200).json(user)
      } 
    }catch{
      res.status(500).json({message:'Cant find user!'})
    }

});

router.post('/create-author', checkAuth, checkAdmin, async (req, res, next) => {

    bcrypt.hash(req.body.password, 10)
    .then(hash=>{
      const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hash
      })
      user.save()
      .then(result=>{
        res.status(201).json({
          message: 'User created!',
          user: result
        })
      })
      .catch(err=>{
          res.status(500).json({message: 'Something went wrong!'})
      })
    })
});

router.delete('/:id', checkAuth, checkAdmin, async (req, res, next) => {

    try{
        const deletedUser = await userController.deleteUserById(req.params.id)
        if(deletedUser){
          res.status(200).json(deletedUser)
        } 
    }catch{
        res.status(500).json({message: 'Something went wrong!'})
    }
  
});

router.post('/edit-author/:id', checkAuth, checkAdmin, async (req, res, next) => {

  try{
    const hash = await bcrypt.hash(req.body.password, 10)
    const updateAuthor = await userController.editUser(req.params.id, hash, req.body)

    if(updateAuthor){
      res.status(201).json({
        message: 'User updated!',
        user: updateAuthor
      })
    }
  }catch{
    res.status(500).json({message: 'Something went wrong!'})
  }

});

module.exports = router;