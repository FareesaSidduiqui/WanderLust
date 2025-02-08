const Listing = require('./model/listing')
const expressError = require('./utils/expressError')
const {listingSchema, reviewSchema} = require('./schemaValid.js')
const Review = require('./model/review.js')


module.exports.isLoggedIn = (req,res,next)=>{
    // the req object has alot of info
    console.log(req.session); //user related all info
    console.log(req.path) //this is relative path
    console.log(req.originalUrl);//this is the actual path 
    // yeh tb jb user ko login hona hoga for the thing specfically 
    // this is the way we checking if user is loggedIn or not
    // this tells the curr user in session is logged In or not 
    if(!req.isAuthenticated()){
        // if user not logged in so we save that orignal path in session and before logging in we savingthe session value in the locals
        req.session.redirectUrl = req.originalUrl
        // jb login hota toh session apni cheezein save nae krta for that
        // we store it in locals bcuz locals pr koi power nae hoti passport ki
        // but session pr hoti hai isiliya usper chnage hojata hai 
        req.flash('error','You must be logged in')
        res.redirect('/login')
    }
    next()
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        console.log(res.locals.redirectUrl);
        
        res.locals.redirectUrl = req.session.redirectUrl 
        console.log(res.locals.redirectUrl);

    }
    next()
}

module.exports.isOwner = async(req,res,next)=>{
    let {id} = req.params
    let listing = await Listing.findById(id) //we need listing by our database so need to access model
 
    // if (!listing.owner) {
    //     req.flash('error', "Listing owner is not defined.");
    //     return res.redirect(`/listings/${id}`);
    //   }
      

    if(!listing.owner._id.equals(res.locals.currentUser._id)) {
        req.flash('error',"You don't have permission of this listing!")
        return res.redirect(`/listings/${id}`)  // we doing return so rest operation which is the edit one dosent perform
    }
    next()
}

module.exports.validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body)
    console.log(error);
   if(error){
       let errMsg = error.details.map((el)=> el.message).join(',')
       throw new expressError(400,errMsg)
   }else{
       next()
   }
}

module.exports.validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body)
    console.log(error);
    
   if(error){
    let errMsg = error.details.map((el)=> el.message).join(',')
       throw new expressError(400,errMsg)
   }
   else{
    next()
   }
}

module.exports.isReviewAuthor = async(req,res,next)=>{
    let {id,reviewId} = req.params
    let review = await Review.findById(reviewId)
    if (!res.locals.currentUser || !review.author._id.equals(res.locals.currentUser._id)) {        req.flash('error','You are not the author of this review')
        return res.redirect(`/listings/${id}`)
    }
    next()
}