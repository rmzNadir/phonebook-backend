require('dotenv').config()
const mongoose = require('mongoose')

//check for user password password

const url = process.env.MONGODB_URI

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify:false})
    .then(result =>{
        console.log('connected to MongoDB')
    })
    .catch((err)=>{
        console.log('Error connecting to MongoDB: ', err.message)
    })

//Schema and model definition

const personSchema = new mongoose.Schema({  //This is the schema that tells Mongoose how the objects are to be stored.
    name: String,
    phone: String,
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema) //This is the model, 'Person' is the singular name of the model.