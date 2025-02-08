const mongoose = require('mongoose')
const Schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose')
// npm i passport-local-mongoose

const userSchema = new Schema({
    email : {
        type : String,
        required : true
    },
    // why we didnt define username or password becuase 
    // passport bydefault in the schema add a username and 
    // hash and salt field to the username, with the hashed password and the salt value 
    // that why we only define email 
})

// now to implemet we pass the user with 
// now in the user we pass as plugin the passportLocalMongoose
userSchema.plugin(passportLocalMongoose) // why we did this
// so that passport can create username salting and hashing can be implement

module.exports = mongoose.model('User',userSchema)

// with this the passport local provides some methods
// like setPassword changePassword and authenticate so we dont
// have to build anything from scratch there is already
// bsically it will implement these methods andthere are more methods

// now to configure passport there are some settings that we need to do 
