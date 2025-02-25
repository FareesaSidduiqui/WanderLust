const User = require('../model/user.js')

module.exports.renderSignupForm = (req, res) => {
    // res.send('signup')
    res.render('users/singup')
}

module.exports.userSignup = async (req, res) => {
    try {
        let { username,
            email,
            password
        } = req.body
        let newUser = await User({ username, email })
        const regUser = await User.register(newUser, password) //this reg async func thats why await
        console.log(regUser);
        req.login(regUser,(err)=>{
            if(err){
                next(err)
            }
            req.flash('success', 'Welcom to WanderLust')
            res.redirect('/listings')
        })
    }
    catch (e) {
        req.flash('error', 'Username already exist')
        res.redirect('/signup')
    }

}

module.exports.renderLoginForm =  (req, res) => {
    res.render('users/login')
}

module.exports.userLoggedIn = async(req, res) => {
    req.flash('success','Welcome back to Wanderlust! You are logged in')

    let url = res.locals.redirectUrl || '/listings'
    res.redirect(url)
}

module.exports.userLoggedOut = (req,res)=>{
    req.logout((err)=>{
        if(err){
            next(err)
        }
        req.flash('success','you are logged out!')
        res.redirect('/listings')
    })
}