const express = require('express')
const router = express.Router({ mergeParams: true })
const wrapAsync = require("../utils/wrapAsync.js")
const User = require('../model/user.js')
const passport = require('passport')
const {saveRedirectUrl, isLoggedIn} = require('../middleware.js')
const userController = require('../controllers/user.js')

// signup form
// router.get('/signup', (req, res) => {
//     // res.send('signup')
//     res.render('users/singup')
// })
// router.get('/signup', userController.renderSignupForm)

// User get in db and signup also
// router.post('/signup', wrapAsync(async (req, res) => {
//     try {
//         let { username,
//             email,
//             password
//         } = req.body
//         let newUser = await User({ username, email })
//         const regUser = await User.register(newUser, password) //this reg async func thats why await
//         console.log(regUser);
//         // to make the signup and immediate login not separelty login needed with this
//         req.login(regUser,(err)=>{
//             if(err){
//                 next(err)
//             }
//             req.flash('success', 'Welcom to WanderLust')
//             res.redirect('/listings')
//         })
//     }
//     catch (e) {
//         req.flash('error', 'Username already exist')
//         res.redirect('/signup')
//     }

// }))
// router.post('/signup',wrapAsync(userController.userSignup))

// Login form 
// router.get('/login', (req, res) => {
//     res.render('users/login')
// })
// router.get('/login',userController.renderLoginForm)

// user logged In
// router.post('/login',
//     // humnai yeh middleware passport middleware sai just pehlai
//     //  takai joh original path hai woh store hijaye or login ho toh session reset
//     //  hojaye toh bhi dosent matter
//     saveRedirectUrl,
//     // 1 here checking in database if the login info matches with store db info
//     // if failure toh redirect to /login and flash a message
//     // all these three things done by the passport itself

//     // 2 with this when we login means this middleware give us green signal so paassport have the access to the session
//     // and as soon as we pass through this middleware our session get reset so all info get lost so req.session.redirectUrl will give us undefine value
//     // so due to this we save our session nfo in the locals bcuz passport dont have access to our locals

//     passport.authenticate("local",
//         {
//             failureRedirect: '/login',
//             failureFlash: true
//         }),
//     async(req, res) => {
//         req.flash('success','Welcome back to Wanderlust! You are logged in')

//         // if hum koi cheez mein edit ya add nae bss sirf platform pr direct login horahai hain
//         // toh locals mein koi path hi nae hoga redirect honai kai liya 
//         // direct login horahai toh iskai liya yeh condition lagaye
//         let url = res.locals.redirectUrl || '/listings'
//         res.redirect(url)
//     })
// router.post('/login',saveRedirectUrl,
//     passport.authenticate("local",
//     {
//         failureRedirect: '/login',
//         failureFlash: true
//     }),
//      userController.userLoggedIn)   


// router.get('/logout',(req,res)=>{
//     req.logout((err)=>{
//         if(err){
//             next(err)
//         }
//         req.flash('success','you are logged out!')
//         res.redirect('/listings')
//     })
// })
// router.get('/logout',userController.userLoggedOut)


router.route('/signup')
.get(userController.renderSignupForm)
.post(wrapAsync(userController.userSignup))

router.route('/login')
.get(userController.renderLoginForm)
.post(saveRedirectUrl,passport.authenticate("local",
    {
        failureRedirect: '/login',
        failureFlash: true
    }),
     userController.userLoggedIn)


router.get('/logout',userController.userLoggedOut)

module.exports = router

// npm install passport passport-local passport-local-mongoose


// req object stores alot of information 
// with this req object we accessing the orijginal url and relative url which we wanna redirect after login
// in this req obj we have session obj which stores info related session
// in this session obj we making redirectUrl and in which we storing the req originalUrl
// in if block we saving 