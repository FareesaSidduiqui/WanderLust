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
const Listing = require('./model/listing.js')
// const Review = require('./model/review.js')
// const wrapAsync = require("./utils/wrapAsync.js")
const expressError = require('./utils/expressError.js')
const session = require('express-session')
const MongoStore = require('connect-mongo') // for this download the package first then require express-session then require connect-mongo
const flash = require('connect-flash')
const passport = require('passport')
// const localStrategy = require('passport-local')
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
    cookie : {
         expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
         maxAge : 7 * 24 * 60 * 60 * 1000,
         httpOnly : true,
    }
}

app.use(session(sessionOptions))
app.use(flash()) //need to use this before using the routers review and users etc
app.use(passport.initialize())
app.use(passport.session()) // we do this basically website ko pta ho req ja rahi ek page sai dosrai page ki toh same user hai ya different
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser()) //session mein user related info store karana 
passport.deserializeUser(User.deserializeUser()) // session mein user related info hatadaina 

app.use((req,res,next)=>{
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')

    res.locals.currentUser = req.user || null;
    console.log('this is the info =>',res.locals.currentUser);

    next()
})

app.get('/',async(req,res)=>{
    try {
        const allList = await Listing.find({}); // Fetch listings from your database
        const searchQuery = req.query.country || ''; // Get query parameter if available

        res.render("listings/home", { currentUser: req.user, searchQuery, allList });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }

})

app.use('/listings',listingRouter)
app.use('/listings/:id/reviews',reviewRouter)
app.use('/',userRouter)


app.all("*",(req,res,next)=>{
    next(new expressError(404,"Page not Found!"))
})


app.use((err,req,res,next)=>{
    let { statusCode=500 , message="invalid data"} = err
    // res.status(statusCode).send(message)
    res.status(statusCode).render('error',{err})
    // res.send('Something went wrowng',{message})

    next()
})



