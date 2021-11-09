require("dotenv").config();

const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;

console.log(url);

console.log("connecting to", url);

mongoose
  .connect(url)
  .then((result) => console.log("connected to MongoDB"))
  .catch((error) => console.log("error connecting to mongodb", error));

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
  date: Date,
});

const Person = mongoose.model("Person", personSchema);

personSchema.set("toJSON", {
  transform: (document, returnedObj) => {
    returnedObj.id = returnedObj._id.toString();
    delete returnedObj._id;
    delete returnedObj.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
