require('dotenv').config()
const express = require('express')
const app = express()
const ejs = require('ejs')
const path = require('path') 
const expressLayout = require('express-ejs-layouts')
const PORT = process.env.PORT || 4000
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('express-flash')
const MongoDbStore = require('connect-mongo')
// const  passport = require('passport')

// Database Connection
const { stringify } = require("querystring");              
mongoose.connect(process.env.MONGO_CONNECTION_URL)    // OR if env file not created mongoose.connect("mongodb://localhost:27017/pizza")    
.then(() => console.log("Database Connected..."))            
.catch( (err) => console.log('Connection Failed...'));     

// Passport config
// const passportInit = require('./app/config/passport')
// passportInit(passport)
// app.use(passport.initialize())
// app.use(passport.session())


// Session config
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: MongoDbStore.create({
        mongoUrl: process.env.MONGO_CONNECTION_URL
    }),
    saveUninitialized: false,
     cookie: {maxAge: 1000 * 60 * 60 * 24} // 24 hrs
    
}))

app.use(flash())

// Assets
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false}))
app.use(express.json())

// Global Middleware
app.use((req, res, next) => {
    res.locals.session = req.session
    next()
})

// set template engine
app.use(expressLayout)
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs')

//routes
require('./routes/web')(app)


app.listen(PORT , () => {
    console.log(`Listening on port ${PORT}`)
})
