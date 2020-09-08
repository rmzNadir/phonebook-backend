const mongoose = require('mongoose')

//check for user password password

if(process.argv.length<3){
    console.log("Please provide the password as an argument: node mongo.js <password>")
    process.exit(1);
}

const password = process.argv[2]
const name = process.argv[3]
const phone = process.argv[4]

const url = `mongodb+srv://fullstack:${password}@cluster0.mzunl.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true})

//Schema and model definition

const personSchema = new mongoose.Schema({  //This is the schema that tells Mongoose how the objects are to be stored.
    name: String,
    phone: String,
})

const Person = mongoose.model('Person', personSchema) //This is the model, 'Person' is the singular name of the model.


//Fetch all phonebook entries

if(process.argv.length<5){
    console.log('Phonebook: ')
    Person.find({}).then(result => {
        result.forEach(person => {
          console.log(person.name, person.phone)
        })
        mongoose.connection.close()
    })
}else{ //Save an entry
    const person = new Person({
        name: name,
        phone: phone
    })
    
    person.save().then(result => {
        console.log(`added ${person.name} number ${person.phone} to phonebook`)
        mongoose.connection.close()
    })
}



