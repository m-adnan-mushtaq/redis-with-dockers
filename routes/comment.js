const express = require('express')
const Router= express.Router()
// ----------------------create new post route-------------------------
const Comment =require('../db/models/comment');
const Post =require('../db/models/post');
const  Mongoose  = require('mongoose');
// get
Router.route('/new')
.post(async(req,res)=>{
    try {
        const {post,content,author}= req.body
        // res.send(req.body)
        // console.log(Mongoose.isValidObjectId(req.body.author));
        const comment = new Comment({
            content,
            author:Mongoose.Types.ObjectId(author),
            post:Mongoose.Types.ObjectId(post)
        })
        await comment.save()
        let p = await Post.findByIdAndUpdate(post,{$push:{comments:comment._id}},{new:true})
        // console.log(comment,p);
        await Comment.deleteCache()
        await Post.deleteCache()
        res.redirect('back')
        
    } catch (error) {
        res.send(error.message)
    }
});



//-------------------------- Get the All comments-------------------------------------
Router.get('/',async(req,res)=>{
    try {
        const comments= await Comment.find().populate('author').cache()
        res.render('comments',{comments})
    } catch (error) {
        res.json(error)
    }
})
module.exports = Router