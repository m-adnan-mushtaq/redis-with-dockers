const express = require('express')
const router= express.Router()

// import User model
const User = require('../db/models/user')
const { findUsers } = require('../middlewares/middleware')
// ------ add new user route------------
// Get 
router.route('/new')
.get((req,res)=>{
    const user = new User()
    res.render('users/form', {name:user.name})
})
// Post
.post(async(req,res)=>{
    // save new user to the data base
    try {
        await User.create(req.body)
        await User.deleteCache()
        res.redirect('/posts/new')
    } catch (error) {
        console.log(error.message);
        res.render('users/form', {name:req.body.name})
    }
})

router.get('/',findUsers,(req,res)=>res.render('users/users',{users:req.users}))


module.exports= router