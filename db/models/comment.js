const mongoose = require('mongoose')
const { deleteCache } = require('../../middlewares/cache')

const commentSchema= new mongoose.Schema({
    content:String,
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:[true,'Comment does not contain any author!']
    },
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post',
        required:[true,'Comment does not contain any post id']
    }
})

commentSchema.statics.deleteCache=deleteCache
module.exports= mongoose.model('Comment',commentSchema)

