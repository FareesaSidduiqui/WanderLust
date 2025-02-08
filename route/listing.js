const express = require('express')
const router = express.Router({mergeParams:true})
const wrapAsync = require("../utils/wrapAsync.js")
// const expressError = require('../utils/expressError.js') both now in middleware
// const {listingSchema} = require('../schemaValid')
// const Listing = require('../model/listing.js') being used in controller/listing.js
const {isLoggedIn, isOwner,validateListing} = require('../middleware.js')
// we use mergeParams : true so that the url like /listings/:id so id actual 
// value just stay in the parent file and dosent travel to the desire route so 
// to make the values come from index.js to review.js or listing.js router file we use this
const listingController = require('../controllers/listing.js')

const multer = require('multer')
// with multer we can parse the data and saving into cloudianry account
// and before applied we will require the cloudinary storage
const {storage} = require('../cloudConfig.js')
// const upload = multer({dest:'uploads/'})//we want it to store at the cloudinary storage for that we can just do 
const upload = multer({storage})
// basically we saying that form kai data ko parse krnai kai liya we using multer



// basically passport store user info in req.user so if it undefined it means that its not logged In
// if its defined it means its logged in
// const isLoggedIn = (req,res,next)=>{
//     console.log(req.session);
//     console.log(req.path)
//     console.log(req.originalUrl);
    
    
//     if(!req.isAuthenticated()){
//         req.session.redirectUrl = req.originalUrl
//         req.flash('error','You must be logged in')
//         res.redirect('/login')
//     }
//     next()
// }

// module.exports.saveRedirectUrl = (req,res,next)=>{
//     if(req.session.redirectUrl){
//         res.locals.redirectUrl = req.session.redirectUrl 
//     }
//     next()
// }

// const validateListing = (req,res,next)=>{
//     let {error} = listingSchema.validate(req.body)
//     console.log(error);
//    if(error){
//        let errMsg = error.details.map((el)=> el.message).join(',')
//        throw new expressError(400,errMsg)
//    }else{
//        next()
//    }
// }

// index route
// router.get('/', wrapAsync( async(req,res)=>{
//     let allList =  await Listing.find({})
//     // console.log(allList);
//     res.render('listings/home.ejs',{allList})
// }))
// router.get('/',wrapAsync(listingController.Index))


// new list 
// router.get('/new',isLoggedIn,(req,res)=>{
//     // in this we wanna implemet if user logged In only then can add new listing
//     // and if not then cant this functionality is directly provided by the passport.isAuthenticate
//     // it checks joh session mein user ki info hai kiya woh logged In hai ya nae 
    
//     res.render('listings/newList')
// })
// router.get('/new',isLoggedIn,listingController.renderForm)

// router.post(
//     '/',
//     isLoggedIn,
//     validateListing,
//     wrapAsync( async(req,res)=>{
//     // try{
//     // // res.render('listings/ne')
//     // // let {title,description,image,price,location,country} = req.body
//     // // here the listing object mein sai e will extract the things
//     // let newList = req.body.listing
//     // // console.log(newList)
//     // let newListing = new Listing(newList)
//     // // console.log(newListing); //js object now can pass into new list
//     // await newListing.save()
//     // res.redirect('/listings')
//     // }
//     // catch(err){
//     //     next(err)
//     // } because we using our custom error handle we removing the try catch

//     // WRAPASYNC ERROR
//     // if(!req.body.listing){
//     //     throw new expressError(400,"Send valid data for listing")
//     // } instead of this using joi
//     // let result = listingSchema.validate(req.body)
//     // console.log(result);
//     // if(result.error){
//     //     throw new expressError(400,result.error)
//     // } all this in validate function making function for joi shcema 

//         // res.render('listings/ne')
//     // let {title,description,image,price,location,country} = req.body
//     // here the listing object mein sai e will extract the things
//     let newList = req.body.listing
//     // console.log(newList);
    
//     // console.log(newList)
//     let newListing = new Listing(newList)
//     // console.log(newListing); //js object now can pass into new list

//     // to not get error for new listing creating we need owner name also toh joh curr session mein hai logged in uska naam ajyaga
//     // in req obj it has many ifno and user also is one of the obj with this we get id of that loggedin user 
//     // console.log(req.user);
     
//     newListing.owner = req.user._id
//     await newListing.save()
//     req.flash('success','New Listing Created!')
//     res.redirect('/listings')
// })
// )
// router.post('/',isLoggedIn,validateListing,wrapAsync(listingController.createList))

// show route indiviual 
// router.get('/:id', wrapAsync( async(req,res)=>{
//     let {id} = req.params
//     let indiviualList = await Listing.findById(id)
//     .populate({path: "reviews",
//         populate: {
//             path : 'author'
//         }
//     }) //this review populate is nesting populate as every review has autor and every review is in list so that why
//     .populate('owner')
//     // console.log(indiviualList);
//     res.render('listings/show',{indiviualList})
// }))
// router.get('/:id',wrapAsync(listingController.showList))

// edit route 
// router.get('/:id/edit',isLoggedIn, isOwner ,wrapAsync( async(req,res)=>{
//     let {id} = req.params
//     let indiviual = await Listing.findById(id)
//     res.render('listings/edit' ,{indiviual})
// }))
// router.get('/:id/edit',isLoggedIn,validateListing,wrapAsync(listingController.renderEditForm))

// update route
// router.put('/:id',isLoggedIn ,isOwner,validateListing, wrapAsync( async (req,res)=>{
//     let {id} = req.params
//     // if(!req.body.listing){
//     //     throw new expressError(400,"Send valid data for listing")
//     // } here not needed this bcuz validate middleware is being used 

//     // so basically in show.ejs we did the functionality where hidding both button of edit and delete from the one who is not the owner but 
//     // what if someone from hopscoth or postman send req to our route because we havent set any autherization here so for this
//     // we breaking the findByIdAndUpdate in two parts one is findByyId then checking if that id is equals to our owner id
//     // if not then showing flash message also redirecting to the listings route if yes then do the findByIdAndUpdate part should be done as it precausion
//     // let listing = await Listing.findById(id)
//     // if(!listing.owner._id.equals(res.locals.currentUser._id)) {
//     //     req.flash('error',"You don't have permission to edit")
//     //     return res.redirect(`/listings/${id}`)  // we doing return so rest operation which is the edit one dosent perform
//     // } we did all this functionality through middleware and we using same logic everywhere that's why 
//     await Listing.findByIdAndUpdate(id,req.body.listing)
//     // console.log(req.body.listing);
//     req.flash('success','Existing List Updated!')
//     res.redirect(`/listings/${id}`)
// }))
// router.post('/:id', isLoggedIn,isOwner,validateListing,wrapAsync(listingController.editedList))

// Delete route 
// router.delete('/:id/dlt',isLoggedIn, isOwner ,wrapAsync(async(req,res)=>{
//     let {id} = req.params
//     await Listing.findByIdAndDelete(id)
//     req.flash('success','Existing List Deleted!')
//     res.redirect('/listings')
// }))

// we used controllers to put all the functionality to the backend 
// but we can make it more compact by using the router.route() with this
//  the same url with all req we can put it together

// see all listings and new list getting created route
router.route('/')
.get(wrapAsync(listingController.Index))
.post(isLoggedIn,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.createList))
// .post(upload.single('listing[image]'),(req,res)=>{res.send(req.file)}) //just like req.body we have req.file for the files we uploadin
// this middleware will be provided as image file ko req file mein karlaiga   
// 

// new list form
router.get('/new',isLoggedIn,listingController.renderForm)

// show indiviual and update list route 
router.route('/:id')
.get(wrapAsync(listingController.showList))
.put( isLoggedIn,
    isOwner,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.editedList))

// edit form route
router.get('/:id/edit',isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm))

// delete route
router.delete('/:id/dlt',isLoggedIn,isOwner,wrapAsync(listingController.destroyList))


module.exports = router