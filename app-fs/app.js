const fs = require('fs')
const DB_FILE = './data/db.json'

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.json())
app.use(express.static('./public/'))


app.get('/show', (req, res) => {
  fs.readFile(DB_FILE, (err, data) => {
    if (err) return console.log(err)
    const todos = JSON.parse(data)
    res.json({
      todos
    })
  })
})

app.post('/add', (req, res) => {
  fs.readFile(DB_FILE, (err, data) => {
    if (err) return console.log(err)
    const todos = JSON.parse(data)
    todos.push({
      todo: req.body.todo,
      complete: req.body.complete
    })
    const updateTodos = JSON.stringify(todos)

    fs.writeFile(DB_FILE, updateTodos, (err, data) => {
      if (err) return console.log(err)
      res.json({
        todos
      })
      console.log('Added Todo:', req.body.todo)
    })
  })
})

app.post('/toggle', (req, res) => {
  fs.readFile(DB_FILE, (err, data) => {
    if (err) return console.log(err)
    const todos = JSON.parse(data)
    todos[req.body.i].complete = !todos[req.body.i].complete
    const updateTodos = JSON.stringify(todos)

    fs.writeFile(DB_FILE, updateTodos, (err, data) => {
      if (err) return console.log(err)
      res.json({
        todos
      })
      console.log('Toggle id:', req.body.i)
    })
  })
})

app.post('/edit', (req, res) => {
  fs.readFile(DB_FILE, (err, data) => {
    if (err) return console.log(err)
    const todos = JSON.parse(data)
    req.body.i.forEach((val, index) => {
      todos[val].todo = req.body.editTodo[index]
    })
    const updateTodos = JSON.stringify(todos)

    fs.writeFile(DB_FILE, updateTodos, (err, data) => {
      if (err) return console.log(err)
      res.json({
        todos
      })
      console.log('Updated id:', req.body.i, "value: ", req.body.editTodo)
    })
  })
})

app.post('/destroy', (req, res) => {
  fs.readFile(DB_FILE, (err, data) => {
    if (err) return console.log(err)
    const todos = JSON.parse(data)
    todos.splice(req.body.i, 1)
    const updateTodos = JSON.stringify(todos)

    fs.writeFile(DB_FILE, updateTodos, (err, data) => {
      if (err) return console.log(err)
      res.json({
        todos
      })
      console.log('Deleted id :', req.body.i)
    })
  })
})

app.post('/clear', (req, res) => {
  fs.readFile(DB_FILE, (err, data) => {
    if (err) return console.log(err)
    let todos = JSON.parse(data)
    todos = todos.filter(item => !item.complete)
    const updateTodos = JSON.stringify(todos)

    fs.writeFile(DB_FILE, updateTodos, (err, data) => {
      if (err) return console.log(err)
      res.json({
        todos
      })
      console.log('Clear completed')
    })
  })
})


app.listen(3000, () => {
  console.log('Server listening on port 3000')
})
