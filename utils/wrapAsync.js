function wrapAsync(fn){
    return function(req,res,next){
        fn(req, res, next).catch(next); // If an error occurs, 
        // pass it to the error-handling middleware
    }
}

module.exports = wrapAsync