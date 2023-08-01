const User = require("../db/models/user")

// middlewrae for finding users
async function findUsers(req,res,next){
    try {
        // find all users from data base
        const users = await User.find().cache()
        if (users.length) {
            req.users= users
            next()
            return
        }
        res.send('No Users Found Please Sign in First')
    } catch (error) {
        res.send(error)
        console.log(error.message);
    }
}

module.exports={
    findUsers
}