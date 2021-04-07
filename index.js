const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors= require('cors')
require('dotenv').config()

const port = 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());


const MongoClient = require('mongodb').MongoClient;
const { ObjectID } = require('mongodb')
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.undrt.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


client.connect(err => {
  const productscollection = client.db("rock-valley").collection("product");
  const ordersCollection = client.db("rock-valley").collection("orders");
  console.log("database connect")
 
   app.post("/addProduct", (req, res)=>{
         const product =req.body;
         console.log(product)
         productscollection.insertOne(product)
         .then(result =>{
             console.log(result.insertedCount)
             res.send(result.insertedCount > 0)
         })
   })

   app.get('/products', (req, res)=>{
       productscollection.find({})
       .toArray((err, documents)=>{
           res.send(documents);
       })
   })

   app.get('/product/:key', (req, res) => {
    productscollection.find({ key: req.params.key }) //.limit(9)
        .toArray((err, documents) => {
            res.send(documents[0]);
        })
})

 


app.post('/productsByKeys', (req, res) => {
    const productKeys = req.body;
    productscollection.find({ key: { $in: productKeys } })
        .toArray((err, documents) => {
            res.send(documents);
        })
})


app.post('/addOrder', (req, res) => {
    const order = req.body;
    ordersCollection.insertOne(order)
        .then(result => {
            res.send(result.insertedCount > 0)
        })
})

});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port)


// app.get('/events', (req, res) => {
    //     productscollection.find()
    //       .toArray((err, items) => {
    //           res.send(items)
    //       })
    //   })
    
    // app.post('/addEvent', (req, res) => {
    //     const newEvent = req.body;
    //     console.log('adding new event: ', newEvent)
    //     productscollection.insertOne(newEvent)
    //     .then(result => {
    //         console.log('inserted count', result.insertedCount);
    //         res.send(result.insertedCount > 0)
    //     })
    // })
    