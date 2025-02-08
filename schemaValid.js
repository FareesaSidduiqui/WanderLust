// we are checking if all the fields are being filled or not
// or if whole listing is empty for that 
//  if(!req.body.listing){
//     throw new ExpressError(400,"Send valid data for listing")
// }
// but for indiviual field if we want like for title for description
// hr ek kai liya separately if ki condition and error throw krna hoga
// issai issue hoga if model bara hua ya multiple model huai toh hr ek model kai hr ek field kai liya yehsb kraingain???
// for this mtlb client side kai liya toh we are ussing middleware and our customError class but 
// for server side???? 
// we use jio toh mtlb in a route for specific field error jio will detect the error and tell us the problem in short and simple way
// jio is a npm package and we have to require it first in our server file 
// npm i joi
// its for object validation  

// yeh schema joh hum define karaingain woh server kai liya hoga mtlb
// model validation handle from server side mongoose ka already define hai 

// with form we did client side validation and did error handling also
// 

const Joi = require('joi')

// jis schema ko validate krna us schema kai liya joi likhna 
// or listingSchema ko validate krnai kai liya likhaingain Joi.object
// mtlb joi kai andar object ana chahiya or uska naam hona chahhiya listing
// or listing naam kai object kai andar kuch or parametrs hain 


module.exports.listingSchema = Joi.object({

// mtl joi kai acc yeh listing ek object honi chahiya or required honi chhaiya
// listing schema kai andar listing object ani hi chahiya as required or is listing object kai andar

        listing : Joi.object({
        title : Joi.string().required(),
        description : Joi.string().required(),
        location : Joi.string().required(),
        price : Joi.number().required().min(0),
        country : Joi.string().required(),
        image : Joi.string().allow('',null), //basically allowing from client side to be null as mongoose filling the value 
        category: Joi.string().valid("room", "trending", "arctic", "pools", "mountains", "castle", "farm", "mountain city", "camping").required()

    }).required()

})

module.exports.reviewSchema = Joi.object({
    review : Joi.object({
        rating : Joi.number().required().min(1).max(5),
        comment : Joi.string().required()
    }).required()
})