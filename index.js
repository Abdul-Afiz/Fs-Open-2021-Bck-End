const { request, response } = require("express");
const express = require("express");
const app = express();
app.use(express.json());
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

const info = `<p>Phonebook has info for ${persons.length} people</p> ${Date()}`;

app.get("/api/info", (request, response) => {
  response.send(info);
});

app.get("/", (req, res) => {
  res.send("<h1> Hello World!</h1>");
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

const generateId = () => {
  const maxId = Math.floor(Math.random() * 50);
  return Number(maxId);
};

app.post("/api/persons", (request, response) => {
  const body = request.body;
  console.log(body);
  const existingName = persons.find((person) => person.name === body.name);
  if (!body.name && !body.number) {
    return response.status(404).json({ error: "content is missing" });
  } else if (existingName) {
    return response.status(400).json({ error: "name already exist" }).end();
  }

  console.log(existingName);

  person = {
    id: generateId(),
    name: body.name,
    number: Number(body.number),
    date: new Date(),
  };

  persons = persons.concat(person);

  console.log(person);
  response.json(body);
});

// app.post("/api/persons", (request, response) => {
//   const body = request.body;

//   console.log(body.content);

//   if (!body.content) {
//     return response.status(400).json({ error: "content is missing" });
//   }

//   const person = {
//     content: body.content,
//     date: new Date(),
//     id: generateId(),
//   };

//   persons = persons.concat(person);

//   response.json(person);
// });

// app.post("/api/persons", (request, response) => {
//   const body = request.body;

//   console.log(body.content);

//   if (!body.content) {
//     return response.status(400).json({ error: "content is missing" });
//   }

//   const person = {
//     content: body.content,
//     date: new Date(),
//     id: generateId(),
//   };

//   persons = persons.concat(person);

//   response.json(person);
// });

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
