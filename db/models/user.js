const mongoose = require('mongoose')
const { deleteCache } = require('../../middlewares/cache')
// creating a user model
const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        validate:{
            validator:val=> /^[A-Za-z\s]+$/.test(val),
            message:props=> `${props.value} does not required format, Use only letters!`
        }
    }
})
userSchema.virtual('fullName').get(function () {
    return this.name.toUpperCase()
})
userSchema.statics.deleteCache=deleteCache
module.exports= mongoose.model('User',userSchema)
