// now the env file isnt directly accesable and wont integrate in our backend to integrate it we use dotenv 
// for that we firstly install the package which is npm i dotenv
if(process.env.NODE_ENV != 'prouduction'){
    require('dotenv').config()
} //this if means that till we not in oroduction level we wanna use the env as in proudction we never use the env var 
// console.log(process.env.SECRET); // this gives alot of enivronment variable but we only want the secret one for that we right furhter .env.SECRET

// as we using multer and cloudinary together so for this we have lib already and we need to install it first 
// npm i cloudinary
// npm i multer-storage-cloudinary

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const path = require('path')
const methodOverride = require('method-override');
// const Listing = require('./model/listing.js')
// const Review = require('./model/review.js')
// const wrapAsync = require("./utils/wrapAsync.js")
const expressError = require('./utils/expressError.js')
// const {listingSchema,reviewSchema} = require('./schemaValid')
// The {} brackets in the require statement let you destructure and import only what you need from a file with multiple exports.
// If you don’t use {}, you’ll have to deal with the entire exported object and use dot notation to access specific properties.
// Destructuring is cleaner and more efficient when you need only a subset of exports.
// const schemas = require('./schemaValid');
// const listingSchema = schemas.listingSchema;
// const userSchema = schemas.userSchema;
const session = require('express-session')
const MongoStore = require('connect-mongo') // for this download the package first then require express-session then require connect-mongo
const flash = require('connect-flash')
const passport = require('passport')
const localStrategy = require('passport-local')
const User = require('./model/user.js')

// express router helps us in more structuring
const listingRouter = require('./route/listing')
const reviewRouter = require('./route/review')
const userRouter = require('./route/user.js')

// help in creating multiple templates a little advance version of ejs template 
const ejsMate = require('ejs-mate')
app.set('views',path.join(__dirname,"views"))
app.set('view engine','ejs')
app.use(express.urlencoded({extended:true})) // so that we get data from form into req body
// as in newList.ejs we using multi/data which means backend dont understand the data as we need to use package which understand multi/data enctype 
// for that we will use multer npm i multer this will only affect the multi/data form 
// after installing the package we firslty neeed to require it then initialize it and in that we tell that where we wanna save the files basically destination  
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
// ejs-mate 
app.engine('ejs',ejsMate)


app.listen(3000,()=>{
    console.log(`is working`);
})

const dbURL = process.env.ATLASDB_URL

main().then(()=>{ //with this we have made connection 
    console.log('success');}).catch(err => console.log(err));

async function main(){
    // await mongoose.connect("mongodb://127.0.0.1:27017/wonderlust") // this is async fun and start async process
    await mongoose.connect(dbURL)
}

// npm i connect-mongo basically to store session info not in local storage but in actual authentic area
// for this intall first then require express-session then require connect-mongo

const store = MongoStore.create({
    mongoUrl : dbURL,
    crypto : {
        secret : process.env.SECRET,
    },
    touchAfter : 24 * 3600 , //basically this is to store session checking if there is an actual update or not if no update then it'll remain same it wont keep changing
    // and regarding session info is that if not define the session info remains till 14 days
});

store.on('error',(err)=>{
    console.log('error in store mongodb',err);
})

const sessionOptions = {
    store : store ,
    secret: process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    // we adding some options in cookie to make our browser session last longer so the express session can have value a little longer too
    // or yeh cookie kai andar option add hotai hain is session kai andar hi which is the express session
    cookie : {
         expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
         maxAge : 7 * 24 * 60 * 60 * 1000,
         httpOnly : true,
        //  expires and maximum basically whenever we close the tab the cookies get expire
        // to make it last longer we add some option for the broswer session to last longer for this we use
        // expires and maxAge and give them some value acc to our req
        // Yes, that's correct! If you control the browser session by configuring
        //  the session settings (like expires or maxAge) in your Express session
        //   middleware, you can make the session data persist longer in the browser.
    }
}

app.get('/',(req,res)=>{
    res.send("/listings/home")
})

app.use(session(sessionOptions))
app.use(flash()) //need to use this before using the routers review and users etc
// we need sessions to implememt passport
// to keep track of session kai ek session hi hai toh user sai barbar login ka na bolai 
// ek hi session means ek hi user toh koi dosrai web page pr bhi jaye toh no worries isiliya

// jb bhi koi req aye toh passport ko initialize krdain ek bar 
// and we use this as middleware
// with this for each route our pasport will be initialize
app.use(passport.initialize())
app.use(passport.session()) // we do this basically website ko pta ho req ja rahi ek page sai dosrai page ki toh same user hai ya different
passport.use(new localStrategy(User.authenticate()))// passport kai andar basically joh user hain woh localStrategy kai throug
// authenticate hokr jain or authenticate means login ya singup

passport.serializeUser(User.serializeUser()) //session mein user related info store karana 
passport.deserializeUser(User.deserializeUser()) // session mein user related info hatadaina 

app.use((req,res,next)=>{
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')

    // so basically if i user res.locals in a middleware
    //  and that middleware gets called for every route so 
    // the req.user becomes accessable rigth ? 
    // req.user only holds the information of the currently logged-in user. If no user is logged in, req.user will be undefined.
    // This behavior relies on Passport.js managing the session for authenticated users. Here's a quick breakdown:
    res.locals.currentUser = req.user || null;
    console.log('this is the info =>',res.locals.currentUser);
    
// so basically all this done by passport bcuz it stores the info with its method which is Authenticate and once that it stores the info in the session and session info is in req.user ? 
    // Deserialization is the process of retrieving the full user data from a minimal piece of information (usually the user's unique identifier, like id) that is stored in the session.
// In the context of Passport.js and authentication, deserialization happens after a user is logged in and their session is active. It allows the application to attach the full user object to the req.user property on every subsequent request made by the logged-in user.


    next()
})

// this is for saving user in db
// app.get('/demoUser',async(req,res)=>{
//     let fakeUser = new User({
//         email : 'studentgmail.com',
//         username : 'zain'
//     })
//     // passport kai andar pbkdf2 hashing algorithm use hoti hai
//     //this also checks the username if it unique or not 
//      let regUser = await User.register(fakeUser,'helloworld')
//      res.send(regUser)
// })

// validate listing function
// and this function will be passed as middleware to the create listing route
// toh pehlai yeh validate kiya jayega listing ko then proced hoga further 

// validateReview function as middleware
// validateListing function as middleware

// jahn bhi /listings use ho wahn yeh use hoga 
app.use('/listings',listingRouter)
app.use('/listings/:id/reviews',reviewRouter)
app.use('/',userRouter)

// app.get('/testListing',async(req,res)=>{
//     let sampleListing = new Listing({
//         title : 'New Villa',
//         description : 'By the beach',
//         price : 1200,
//         location : 'Maldives',
//         country : 'South Asia'
//     })
//     await sampleListing.save();
//         console.log('Listing saved successfully');
//         res.send('Sample listing created');
// })


// if user sending req to a route which dosent exist so we can do one thing
app.all("*",(req,res,next)=>{
    next(new expressError(404,"Page not Found!"))
})


// error handling middleware
// this is when on some particular route which exists there some error occur
app.use((err,req,res,next)=>{
    let { statusCode=500 , message="invalid data"} = err
    // res.status(statusCode).send(message)
    // console.log(err);
    res.status(statusCode).render('error',{err})
    // res.send('Something went wrowng',{message})

    next()
})

// npm i ejs-mate
// npm i express-session
// custom wrap async basically a better way instead of try catch block 

