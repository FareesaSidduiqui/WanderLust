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
    let url = req.file.path
    let filename = req.file.filename
    let newList = req.body.listing
    let newListing = new Listing(newList)
   
    newListing.owner = req.user._id
    newListing.image = {url,filename}
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
   
    let editedListing = await Listing.findByIdAndUpdate(id,req.body.listing)

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