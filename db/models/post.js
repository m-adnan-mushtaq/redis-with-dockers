const mongoose = require('mongoose')
const { deleteCache } = require('../../middlewares/cache')

const postSchema = new mongoose.Schema({
    title: String,
    content: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Post does not contain any author!']
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment',
        }
    ]
})

postSchema.virtual('admin').get(function () {
    return `Admin: Adnan Malik`
})
postSchema.statics.deleteCache = deleteCache
module.exports = mongoose.model('Post', postSchema)

