require("dotenv").config();
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

//check for user password password

const url = process.env.MONGODB_URI;

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB: ", err.message);
  });

//Schema and model definition

const personSchema = new mongoose.Schema({
  //This is the schema that tells Mongoose how the objects are to be stored.
  name: {
    type: String,
    minlength: 3,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    minlength: 8,
    required: true,
    unique: true,
  },
});

personSchema.plugin(uniqueValidator);

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema); //This is the model, 'Person' is the singular name of the model.
