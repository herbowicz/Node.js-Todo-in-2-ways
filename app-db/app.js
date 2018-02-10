const MongoClient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectID
let db
MongoClient.connect('mongodb://cruder:crud123@ds123658.mlab.com:23658/crud', (err, database) => {
  if (err) return console.log(err)
  db = database
  app.listen(process.env.PORT || 3000, () => {
    console.log('Server listening on port 3000')
  })
})

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(express.static('./public/'))
app.set('view engine', 'ejs')


app.get('/', (req, res) => {
  db.collection('todo').find().toArray((err, result) => {
    if (err) return console.log(err)
    console.log(result)
    res.render('index.ejs', {
      todos: result
    })
  })
})

app.post('/add', (req, res) => {
  db.collection('todo').insertOne({
    todo: req.body.todo,
    complete: false
  }, (err, result) => {
    if (err) return console.log(err)
    console.log('Added Todo:', req.body.todo)
    res.redirect('/')
  })
})

app.put('/toggle/:id/:checked', (req, res) => {
  let checked = Boolean(JSON.parse(req.params.checked))
  console.log(checked)
  db.collection('todo').update({
    _id: ObjectId(req.params.id)
  }, {
    $set: {
      complete: checked
    }
  }, (err, result) => {
    if (err) return res.status(500).send(err)
    console.log('Toggle id:', req.params.id, req.params.checked)
    res.redirect(303, '/')
  })
})

app.put('/edit/:update_json', (req, res) => {
  const update = JSON.parse(req.params.update_json)
  update.forEach((item) => {
    db.collection('todo').update({
      _id: ObjectId(item.id)
    }, {
      $set: {
        todo: item.todo
      }
    })
    console.log('Updated id:', item.id, ' value: ', item.todo)
  })
  res.redirect(303, '/')
})

app.delete('/todo/:id', (req, res) => {
  db.collection('todo').deleteOne({
    _id: ObjectId(req.params.id)
  }, (err, result) => {
    if (err) return res.status(500).send(err)
    console.log('Deleted id:', req.params.id)
    res.redirect(303, '/')
  })
})

app.delete('/clear', (req, res) => {
  db.collection('todo').deleteMany({
    complete: true
  }, (err, result) => {
    if (err) return res.status(500).send(err)
    console.log('Clear completed')
    res.redirect(303, '/')
  })
})
