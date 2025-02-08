const mongoose = require('mongoose')
const data = require('./data')
const Listing = require('../model/listing')

main()
.then(()=>{ //with this we have made connection 
    console.log('success');})
    .catch(err => console.log(err));

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wonderlust") // this is async fun and start async process
}

const initDB  = async () =>{
    await Listing.deleteMany({})
    data.data = data.data.map((obj)=>({
        ...obj,
        owner : '6797275635899fcd2b58b998',
    }))
    await Listing.insertMany(data.data)
    console.log('data was initialized');
    
}
// console.log(data.data);

initDB()
