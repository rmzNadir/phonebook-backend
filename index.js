const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())

app.use(express.json())

morgan.token('body',function(req,res){
  return JSON.stringify(req.body)
})

app.use(morgan(function (tokens, req, res) {
  if(tokens.method(req,res)==='POST'){
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      tokens.body(req,res),
    ].join(' ')
  }
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
  ].join(' ')
}))


let persons = [
    {
        name: 'Arto Hellas',
        phone: '1232123589',
        id: 1
    },
    {
        name: "John Cena",
        phone: '11289391831',
        id: 2
      },
      {
        name: "Sentient Rock",
        phone: "1231534123",
        id: 3
      },
      {
        name: "John Wick",
        phone: "1892391702",
        id: 4
      },
      {
        name: "Non-Sentient Rock",
        phone: "123131312456",
        id: 5
      },
      {
        name: "Michael Jordan",
        phone: "89123891",
        id: 6
      },
      {
        name: "Just Michael",
        phone: "982973092",
        id: 7
      },
]

app.get('/api/persons',(req,res) => {
    res.json(persons);
})

app.get('/info',(req,res) => {
   res.send(`
    <div>
        <p>Phonebook has info for ${persons.length} people</p>
        ${new Date()}
    </div>
   `)
})

app.get('/api/persons/:id',(req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id ===id)
    
    if(person!==undefined){
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id',(req,res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person=>person.id!==id)
    res.status(204).end()
})

app.post('/api/persons',(req,res) => {
  const body = req.body
  //console.log(req)
  //console.log(body.name)
  //console.log(typeof body.name)
  //console.log(typeof persons[0].name)

  const getId = () => Math.floor(Math.random()*100000000)
  
  if(!body.name||!body.phone){
    return res.status(400).json({
      error: `Something's missing!`
    })
  } else if(persons.some(person => person.name === body.name)){
    return res.status(400).json({
      error: "name must be unique!"
    })
  }

  const person = {
    name: body.name,
    phone: body.phone,
    id: getId()
  }
  //console.log(person)

  persons = persons.concat(person)

  res.json(person)
})

const PORT = 3001
app.listen(PORT,() =>{
    console.log(`Server running on port ${PORT}`)
})