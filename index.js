const express = require('express')
const app = express()

let persons = [
    {
        name: 'Arto Hellas',
        phone: '1232123589',
        id: 2
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

const PORT = 3001
app.listen(PORT,() =>{
    console.log(`Server running on port ${PORT}`)
})