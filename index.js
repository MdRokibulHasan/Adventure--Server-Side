const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;



// middle ware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9lpvp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('adventure');
        const servicesCollection = database.collection('events');
        const orderCollection = database.collection('order');

        // get api
        app.get('/events', async (req, res) => {

            const cursor = servicesCollection.find({});
            const events = await cursor.toArray();
            res.send(events);

        });
        // GET Single Service
        app.get('/details/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific service', id);
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);
        });

        //Post Api

        app.post('/events', async (req, res) => {
            const event = req.body;
            console.log('hit the post api');

            const result = await servicesCollection.insertOne(event);
            res.json(result)

        });

        // Order post api

        app.post('/order', async (req, res) => {
            const order = req.body;
            console.log('hit the post api');
            console.log(order);

            const result = await orderCollection.insertOne(order);
            res.json(result)

        });

        //order get api
        app.get('/order', async (req, res) => {

            const cursor = orderCollection.find({});
            const order = await cursor.toArray();
            res.send(order);

        });

        // DELETE API
        app.delete('/order/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { "_id": ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            res.json(result);
        })















    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {

    res.send('running Adventure server');
});

app.listen(port, () => {
    console.log('Running Adventure server on port', port);
})