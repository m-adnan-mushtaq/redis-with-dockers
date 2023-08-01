//---------- express server------------
const express = require('express')
const app= express()
const mongoose= require('mongoose')
const client = require('./services/cache')
// connection to db
require('./db/conn')(mongoose).then(()=> console.log('db is connected')).catch(e=> console.log(e))
const db= mongoose.connection
db.once('open',async()=>{
    await client.connect()
    if(client.isOpen) console.log('REDIS IS CONNECTED TO LOCAL SERVER!');
})
// setting view engine
app.set('view engine','ejs')
app.use(express.urlencoded({extended:false}))
// access static files
//--- old way
//-- efficeint way
app.use(express.static(__dirname+'/public'))
app.use('*/css',express.static(__dirname+'/public/css'))
// ------------------routes----------------------------
//--------------- index route | home route----------------------
app.get('/',(req,res)=>res.render('index'));
//----- users route-------------
app.use('/users',require('./routes/user'))

//----- posts route-------------
app.use('/posts',require('./routes/post'))

//----- comments route-------------
app.use('/comments',require('./routes/comment'))

console.log('server is in cluster mode');

// listening the server
app.listen(process.env.PORT, console.log('server is runing at 3000'));