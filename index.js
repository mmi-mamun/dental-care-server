const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();

//middle ware
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Personal dental server is running...')
})

app.listen(port, () => {
    console.log(`Personal dental server is running on port: ${port}`);
})


//mongodb

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ijax3zt.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const serviceCollection = client.db('dentalCare').collection('services');
        const reviewCollection = client.db('dentalCare').collection('review');

        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })

        // app.get('services/:id', async (req, res) => {
        //     const id = req.params.id;
        //     console.log(req);
        //     const query = { _id: ObjectId(id) };
        //     const service = await serviceCollection.findOne(query);
        //     res.send(service);
        // })
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        })

        //review api
        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        })

        //get reviews
        app.get('/reviews', async (req, res) => {
            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        })

    }

    finally {

    }
}

run().catch(err => console.error(err))
