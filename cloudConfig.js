const cloudinary = require("cloudinary").v2 //npm install cloudinary@1.21.0
const {CloudinaryStorage} = require("multer-storage-cloudinary") //npm install multer-storage-cloudinary

// basically we connecting with cloudinary here
cloudinary.config({
    cloud_name : process.env.CLOUD_NAME,
    api_key : process.env.CLOUD_API_KEY,
    api_secret : process.env.CLOUD_API_SECRET
})

// now after telling cloudinary its us we will make a folder there for our files
const storage = new CloudinaryStorage({
    cloudinary : cloudinary,
    params : {
        folder : 'wanderlust_DEV',
        allowedFormats : ['png','jpeg','jpg']
    }
})

module.exports = {
    cloudinary,
    storage
}