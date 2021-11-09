require("dotenv").config();
const { request, response } = require("express");
const express = require("express");
const app = express();
const cors = require("cors");
app.use(express.static("dist"));
app.use(express.json());
app.use(cors());

const Person = require("./models/person");

const morgan = require("morgan");

morgan.token("body", (request, response) => {
  return JSON.stringify(request.body);
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => res.json(persons));
});

app.put("/api/persons/:id", (req, res, next) => {
  const body = req.body;

  const person = {
    name: body.name,
    number: Number(body.number),
    date: new Date(),
  };

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then((updatePerson) => {
      res.json(updatePerson);
    })
    .catch((error) => next(Error));
});

app.delete("/api/persons/:id", (request, response) => {
  Person.findByIdAndRemove(request.params.id)
    .then(response.status(204).end())
    .catch((error) => console.log("error", error));
});

app.post("/api/persons", (request, response) => {
  const body = request.body;
  console.log(body);
  const existingName = persons.find((person) => person.name === body.name);
  if (!body.name && !body.number) {
    return response.status(400).json({ error: "content is missing" }).end();
  }
  console.log(existingName);
  person = new Person({
    name: body.name,
    number: Number(body.number),
    date: new Date(),
  });

  console.log(person);
  person.save().then((savedPerson) => response.json(savedPerson));
  persons = persons.concat(person);
});

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

const unKnownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

app.use(unKnownEndpoint);

const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "maformatted id" });
  }
  next(error);
};

app.use(errorHandler);

const port = process.env.PORT || 3001;
console.log(port);
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
