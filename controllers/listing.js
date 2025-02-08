const Listing = require('../model/listing')

module.exports.Index = async(req,res)=>{
    let query = {};
    console.log(req.query);
    
    if (req.query.category) {
        query.category = req.query.category;
    }

    if (req.query.country) {
        query.country = new RegExp(req.query.country, 'i');
    }

    let allList = await Listing.find(query);
    res.render('listings/home.ejs', { allList,searchQuery: req.query.country  });
}

// new Form 
module.exports.renderForm = (req,res)=>{
    // in this we wanna implemet if user logged In only then can add new listing
    // and if not then cant this functionality is directly provided by the passport.isAuthenticate
    // it checks joh session mein user ki info hai kiya woh logged In hai ya nae 
    
    res.render('listings/newList')
}

// new List
module.exports.createList = async(req,res)=>{
    // try{
    // // res.render('listings/ne')
    // // let {title,description,image,price,location,country} = req.body
    // // here the listing object mein sai e will extract the things
    // let newList = req.body.listing
    // // console.log(newList)
    // let newListing = new Listing(newList)
    // // console.log(newListing); //js object now can pass into new list
    // await newListing.save()
    // res.redirect('/listings')
    // }
    // catch(err){
    //     next(err)
    // } because we using our custom error handle we removing the try catch

    // WRAPASYNC ERROR
    // if(!req.body.listing){
    //     throw new expressError(400,"Send valid data for listing")
    // } instead of this using joi
    // let result = listingSchema.validate(req.body)
    // console.log(result);
    // if(result.error){
    //     throw new expressError(400,result.error)
    // } all this in validate function making function for joi shcema 

        // res.render('listings/ne')
    // let {title,description,image,price,location,country} = req.body
    // here the listing object mein sai e will extract the things

    let url = req.file.path
    let filename = req.file.filename
    let newList = req.body.listing
    // console.log(req.file);
    
    // console.log(newList);
    
    
    // console.log(newList)
    let newListing = new Listing(newList)
    // console.log(newListing); //js object now can pass into new list

    // to not get error for new listing creating we need owner name also toh joh curr session mein hai logged in uska naam ajyaga
    // in req obj it has many ifno and user also is one of the obj with this we get id of that loggedin user 
    // console.log(req.user);
     
    newListing.owner = req.user._id
    newListing.image = {url,filename}
    // console.log(newListing);
    await newListing.save()
    req.flash('success','New Listing Created!')
    res.redirect('/listings')
}

// show
module.exports.showList = async(req,res)=>{
    let {id} = req.params
    let indiviualList = await Listing.findById(id)
    .populate({path: "reviews",
        populate: {
            path : 'author'
        }
    }) //this review populate is nesting populate as every review has autor and every review is in list so that why
    .populate('owner')
    // console.log(indiviualList);
    // console.log(indiviualList);
    res.render('listings/show',{indiviualList})
}

// edit
module.exports.renderEditForm = async(req,res)=>{
    let {id} = req.params
    let indiviual = await Listing.findById(id)
    res.render('listings/edit' ,{indiviual})
}

module.exports.editedList = async (req,res)=>{
    let {id} = req.params
    // if(!req.body.listing){
    //     throw new expressError(400,"Send valid data for listing")
    // } here not needed this bcuz validate middleware is being used 

    // so basically in show.ejs we did the functionality where hidding both button of edit and delete from the one who is not the owner but 
    // what if someone from hopscoth or postman send req to our route because we havent set any autherization here so for this
    // we breaking the findByIdAndUpdate in two parts one is findByyId then checking if that id is equals to our owner id
    // if not then showing flash message also redirecting to the listings route if yes then do the findByIdAndUpdate part should be done as it precausion
    // let listing = await Listing.findById(id)
    // if(!listing.owner._id.equals(res.locals.currentUser._id)) {
    //     req.flash('error',"You don't have permission to edit")
    //     return res.redirect(`/listings/${id}`)  // we doing return so rest operation which is the edit one dosent perform
    // } we did all this functionality through middleware and we using same logic everywhere that's why 
    let editedListing = await Listing.findByIdAndUpdate(id,req.body.listing)
    // console.log(req.body.listing);

    if(typeof req.file  !== 'undefined'){
    let url = req.file.path
    let filename = req.file.filename
    editedListing.image = {url,filename}
    await editedListing.save()
    }
    req.flash('success','Existing List Updated!')
    res.redirect(`/listings/${id}`)
}

module.exports.destroyList = async(req,res)=>{
    let {id} = req.params
    await Listing.findByIdAndDelete(id)
    req.flash('success','Existing List Deleted!')
    res.redirect('/listings')
}