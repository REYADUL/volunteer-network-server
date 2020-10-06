const express = require('express')
const boydParser = require('body-parser');
const cors =require('cors');
const MongoClient = require('mongodb').MongoClient;
const { request } = require('express');
const ObjectId = require('mongodb').ObjectID;
require('dotenv').config()



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.603oj.mongodb.net/userEvents?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true });

const port = 5000


const app =express()

app.use(cors());
app.use(boydParser.json());



app.get('/', (req, res) => {
  res.send('Hello volunteer!')
})




client.connect(err => {
  const events = client.db("userEvents").collection("events");
  console.log('database connected');
  
  app.post('/addEvent' , (req,res)=>{

    const newEvent = req.body;
    events.insertOne(newEvent)
    .then(result=>{
      // console.log(result);
      res.send(result);
    })
    console.log(newEvent);
  } )


    app.get('/taskEvent',(req,res)=>{
      // console.log(req.query.email);
      events.find({email:req.query.email})
      .toArray((err,documents)=>{
        res.send(documents);
      })
  })


  app.delete('/deleteEvent/:id', (req, res) => {
    console.log(req.params.id);
    // res.send('it is delete')
    events.deleteOne({ _id: ObjectId(req.params.id)})
      .then((result) => {
        res.send(result);
      })
  })


});







app.listen(process.env.PORT||port)
