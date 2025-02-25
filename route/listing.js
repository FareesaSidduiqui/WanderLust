const express = require('express')
const router = express.Router({mergeParams:true})
const wrapAsync = require("../utils/wrapAsync.js")
const {isLoggedIn, isOwner,validateListing} = require('../middleware.js')
const listingController = require('../controllers/listing.js')
const multer = require('multer')
const {storage} = require('../cloudConfig.js')
const upload = multer({storage})

router.route('/')
.get(wrapAsync(listingController.Index))
.post(isLoggedIn,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.createList))

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