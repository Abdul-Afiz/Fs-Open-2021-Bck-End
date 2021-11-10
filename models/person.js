require("dotenv").config();

const mongoose = require("mongoose");
const mongooseUniqueValidator = require("mongoose-unique-validator");

const url = process.env.MONGODB_URI;

console.log("connecting to", url);

mongoose
  .connect(url, { useNewUrlParser: true })
  .then((result) => console.log("connected to MongoDB"))
  .catch((error) =>
    console.log("error connecting to mongodb :", error.message)
  );

const personSchema = new mongoose.Schema({
  name: { type: String, unique: true, minlength: 3, required: true },
  number: { type: String, minlength: 8, required: true },
  date: Date,
});

// mongooseUniqueValidator.defaults.message =
//   "Error, expected {PATH} to be unique.";

personSchema.set("toJSON", {
  transform: (document, returnedObj) => {
    returnedObj.id = returnedObj._id.toString();
    delete returnedObj._id;
    delete returnedObj.__v;
  },
});

personSchema.plugin(mongooseUniqueValidator);

const Person = mongoose.model("Person", personSchema);

module.exports = Person;
