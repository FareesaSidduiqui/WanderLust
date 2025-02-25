const express = require('express')
const router = express.Router({ mergeParams: true })
const wrapAsync = require("../utils/wrapAsync.js")
const User = require('../model/user.js')
const passport = require('passport')
const {saveRedirectUrl, isLoggedIn} = require('../middleware.js')
const userController = require('../controllers/user.js')

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
