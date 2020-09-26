require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");

const Person = require("./models/person");
const { db } = require("./models/person");

app.use(cors());

app.use(express.json());

app.use(express.static("build"));

morgan.token("body", function (req) {
  return JSON.stringify(req.body);
});

app.use(
  morgan(function (tokens, req, res) {
    if (tokens.method(req, res) === "POST") {
      return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, "content-length"),
        "-",
        tokens["response-time"](req, res),
        "ms",
        tokens.body(req, res),
      ].join(" ");
    }
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
    ].join(" ");
  })
);

app.get("/info", async (req, res) => {
  let count = await db.collection("people").countDocuments();
  if (count === 0) {
    res.send(`
      <div>
        <p>Phonebook has no info yet!</p>
        ${new Date()}
      <div>
    `);
  } else {
    res.send(`
    <div>
        <p>Phonebook has info for ${count} ${
      count > 1 ? "people" : "person"
    }</p>
        ${new Date()}
    </div>
   `);
  }
});

app.get("/api/persons", (req, res, next) => {
  Person.find({})
    .then((persons) => {
      res.json(persons);
    })
    .catch((err) => next(err));
});

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((err) => next(err));
});

app.put("/api/persons/:id", (req, res, next) => {
  const body = req.body;
  //console.log(body)

  const person = {
    name: body.name,
    phone: body.phone,
    id: body.id,
  };
  Person.findByIdAndUpdate(req.params.id, person, {
    new: true, //IMPORTANT, without new: true the response would send the old version before the update
    runValidators: true, //IMPORTANT, runValidators is essential to enable Validation
    context: "query", //IMPORTANT, without setting the context we would get the error 'Cannot read property 'ownerDocument' of null'
  })
    .then((updatedPerson) => {
      return updatedPerson.toJSON();
    })
    .then((updatedAndFormatted) => {
      return res.json(updatedAndFormatted);
    })
    .catch((err) => next(err));
});

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end();
    })
    .catch((err) => next(err));
});

app.post("/api/persons", (req, res, next) => {
  const body = req.body;
  //console.log(req)
  //console.log(body.name)
  //console.log(typeof body.name)
  //console.log(typeof persons[0].name)

  const person = new Person({
    name: body.name,
    phone: body.phone,
  });

  person
    .save()
    .then((savedPerson) => {
      return savedPerson.toJSON();
    })
    .then((savedAndFormatted) => {
      return res.json(savedAndFormatted);
    })
    .catch((err) => next(err));
});

//error handling done by middleware
const errorHandler = (err, req, res, next) => {
  console.error(err.message);
  if (err.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  } else if (err.name === "ValidationError") {
    return res
      .status(400)
      .json({ error: `${err.name}: ${err.message}`, errorName: err.name }); //we send the error message as well as the error name so we can differentiate between multiple types of errors
  }
  next(err);
};

app.use(errorHandler); //since the execution order of middleware is the same as the order that they are loaded into express with the app.use function this is the correct place to load our error handler

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
