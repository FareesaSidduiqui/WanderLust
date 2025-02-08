const express = require('express')
const router = express.Router({mergeParams:true})
const wrapAsync = require("../utils/wrapAsync.js")
// const expressError = require('../utils/expressError.js')
// const {reviewSchema} = require('../schemaValid') both now require in middleware
// const Listing = require('../model/listing.js')
// const Review = require('../model/review.js') both listing and review is now in controller folder
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware.js')
const reviewController = require('../controllers/reviews.js')


// const validateReview = (req,res,next)=>{
//     let {error} = reviewSchema.validate(req.body)
//     console.log(error);
    
//    if(error){
//     let errMsg = error.details.map((el)=> el.message).join(',')
//        throw new expressError(400,errMsg)
//    }
//    else{
//     next()
//    }
// }


// reviews
// post route
// we are creating only post route because we are viewing reviews only with the lists
// and not separately
// /listings/:id/reviews = / bcuz cuttting common part
// router.post('/',isLoggedIn,validateReview,wrapAsync( async(req,res)=>{
//     let {id} = req.params
//     let listing = await Listing.findById(id)    
//     let newReview = new Review(req.body.review)
//     newReview.author = req.user._id
//     console.log(newReview);
    
//     listing.reviews.push(newReview)
//     await newReview.save()
//     await listing.save()
//     req.flash('success','New Review Posted!')
//     res.redirect(`/listings/${id}`)
// }))
router.post('/',isLoggedIn,validateReview,wrapAsync(reviewController.createReview))

// delete review route
// router.delete('/:reviewId',isLoggedIn,isReviewAuthor,wrapAsync(async(req,res)=>{
//      let{id,reviewId} = req.params
//      await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
//      await Review.findByIdAndDelete(reviewId)
//     req.flash('success','Review Deleted!')
//      res.redirect(`/listings/${id}`)
// }))
router.delete('/:reviewId',isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview))

// This is the update object specifying how to modify the document.
// $pull is a MongoDB update operator that:
// Removes items from an array field that match a given condition.
// reviews:
// The name of the array field in the Listing document.
// reviewId:
// The value to remove from the reviews array.

module.exports = router