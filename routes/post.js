const express = require('express')
const Router= express.Router()
// ----------------------create new post route-------------------------
const Post =require('../db/models/post');
const  Mongoose  = require('mongoose');
const { findUsers } = require('../middlewares/middleware');
// get
Router.route('/new')
.get(findUsers,(req,res)=>{
    const post = new Post()
    // render form
    res.render('posts/newPost',{post,authors:req.users})
})
.post(findUsers,async(req,res)=>{
    try {
        const {title,content,author}= req.body
        // res.send(req.body)
        // console.log(Mongoose.isValidObjectId(req.body.author));
        const post = new Post({
            title,
            content,
            author:Mongoose.Types.ObjectId(req.body.author)
        })
        await post.save()
        await Post.deleteCache()
        res.redirect(`/posts/${post._id}`)
        
    } catch (error) {
        res.send(error.message)
    }
});


// ------------------------get that specific post-----------------------------------
Router.get('/:id',findUsers,async(req,res)=>{
    try {
        let populateOptions=['author',{
            path:"comments",
            populate:{
                path:"author"
            }
        }]
        const post= await Post.findById(req.params.id).populate(populateOptions).cache({populateOptions})
        res.render('posts/post',{post,authors:req.users,comments:post.comments})
        // res.json(post)
    } catch (error) {
        res.send(error.message)
    }
})

//-------------------------- Get the All Posts-------------------------------------
Router.get('/',async(req,res)=>{
    try {
        const posts= await Post.find().populate('author').cache()
        res.render('posts/posts',{posts})
    } catch (error) {
        res.json(error)
    }
})
module.exports = Router