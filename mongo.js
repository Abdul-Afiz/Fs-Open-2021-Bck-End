require("dotenv").config();
const mongoose = require("mongoose");
if (process.argv.length < 3) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password>"
  );
  process.exit(1);
}

const password = process.argv[2];
console.log(process.argv);

const url = process.env.MONGOD_URI;

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
  date: Date,
});

const Person = mongoose.model("Person", personSchema);

const person = new Person({
  name: "Almar",
  number: 11333,
  date: new Date(),
});

// person.save().then((result) => {
//   console.log("person saved!");
//   mongoose.connection.close();
// });

Person.find({}).then((persons) => {
  persons.forEach((person) => {
    console.log(person);
  });
  mongoose.connection.close();
});
