if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

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

app.get("/api/persons", (req, res, next) => {
  Person.find({})
    .then((persons) => res.json(persons.map((person) => person.toJSON())))
    .catch((error) => next(error.message));
});

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person.toJSON());
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (request, response, next) => {
  const body = request.body;

  const person = new Person({
    name: body.name,
    number: Number(body.number),
    date: new Date(),
  });

  person
    .save()
    .then((savedPerson) => response.json(savedPerson))
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then((result) => response.status(204).end())
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (req, res, next) => {
  const body = req.body;
  const person = {
    name: body.name,
    number: Number(body.number),
    date: new Date(),
  };

  Person.findByIdAndUpdate(req.params.id, person, {
    new: true,
  })
    .then((updatePerson) => {
      res.json(updatePerson);
    })
    .catch((error) => next(error));
});

const unKnownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

app.use(unKnownEndpoint);

const errorHandler = (error, req, res, next) => {
  console.error(error.message);
  console.log("anything seen");

  if (error.name === "CastError" && error.kind == "ObjectId") {
    return res.status(400).send({ error: "maformatted id" });
  } else if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  }
  next(error);
};

app.use(errorHandler);

const port = process.env.PORT || 3001;
console.log(port);
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
