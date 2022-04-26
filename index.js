const express = require('express');
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const ObjectId = require("mongodb").ObjectId;
require('dotenv').config();

const port = process.env.PORT || 5000;

// middlewere
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9idnw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect();
        console.log('database connected')
        const database = client.db('hostDoor');
        const priceCollection = database.collection('pricing');
        const ordersCollection = database.collection('orders');


        // pricing get api
        app.get('/pricing', async(req, res)=>{
            const cursor = priceCollection.find({});
            const pricing = await cursor.toArray();
            res.send(pricing)
        })

        // single product get api
        app.get("/singleHosting/:id", async (req, res) => {
          const result = await priceCollection.find({ _id: ObjectId(req.params.id)}).toArray();
          res.send(result[0]);
         });

          // cofirm order post
        app.post("/confirmOrder", async (req, res) => {
          console.log(req.body);
          const result = await ordersCollection.insertOne(req.body);
          res.send(result);
        });

        // get orders api
        app.get('/orders', async(req, res)=>{
          const cursor = ordersCollection.find({});
          const orders = await cursor.toArray();
          res.send(orders);
        });

        // my orders
        app.get('/myOrder/:email', async(req, res)=>{
          const result = await ordersCollection.find({ email: req.params.email})
          .toArray();
          console.log(result);
          res.send(result);
        });
        
       // deleted order
      app.delete("/delteOrder/:id", async (req, res) => {
        const result = await ordersCollection.deleteOne({_id: ObjectId(req.params.id),});
        res.send(result);
      });


    }
    finally{
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello! Welcome to Host Door');
});

app.listen(port, () => {
  console.log(`Host door app listing at port ${port}`);
});