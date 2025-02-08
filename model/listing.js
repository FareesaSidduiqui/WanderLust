const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Review = require("./review.js")

const listingSchema = new Schema({
    title :{
        type : String,
        required : true
    } ,
    description :{
        type : String
    } ,
    image  :{
        // type: String,
        // required: true,
        // set : (v)=> v === "" ? "https://images.unsplash.com/photo-1458571037713-913d8b481dc6?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=1080&ixid=eyJhcHBfaWQiOjF9&ixlib=rb-1.2.1&q=80&w=1920"  : v ,
        // default: "https://images.unsplash.com/photo-1458571037713-913d8b481dc6?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=1080&ixid=eyJhcHBfaWQiOjF9&ixlib=rb-1.2.1&q=80&w=1920",
        url : String, //image link
        filename : String, //image file name 
    },
    price :{
        type : Number
    } ,
    location :{
        type : String
    } ,
    country :{
        type : String
    } ,
    category: {
        type: String,
        required: true,
        enum: ["room", "trending", "arctic", "pools", "mountains", "castle", "farm", "mountain city", "camping"]
    } ,
    reviews : [
        {
            type: Schema.Types.ObjectId,
            ref : 'Review',
        },
    ],
    // hr listing ka ek single owner hoga toh isiliya koi array nae hoga
    // but owner will refer the user schema as we checking if the owner is loggedIn or not  

    // You need to reinitialize 
    // the owner field because it's a new field that 
    // didn't exist in the documents before. Unlike the reviews field 
    // (an array), MongoDB allows you to dynamically push to arrays even if they
    //  don't exist, automatically creating the field. However, for the owner field (a single value),
    //  you must explicitly set it using an update operation, as MongoDB won't create it automatically unless specified.
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User",
    }
})

listingSchema.post('findOneAndDelete',async(listing)=>{
    if(listing){
    await Review.deleteMany({_id : {$in:listing.reviews}})
    }
})
const Listing = mongoose.model('Listing', listingSchema)

module.exports = Listing