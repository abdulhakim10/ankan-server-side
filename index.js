const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { query } = require('express');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;


// middle wares
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.47nvmfs.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const serviceCollection = client.db('ankanDb').collection('services');
        const reviewCollection = client.db('ankanDb').collection('reviews');

        app.get('/services', async(req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })


        // addService
        app.post('/services', async(req, res) => {
            const service = req.body;
            const result = serviceCollection.insertOne(service)
            res.send(result);
            console.log(result)
        })


        app.get('/limited', async(req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.limit(3).toArray();
            res.send(services);
        })

        // get service by id
        app.get('/service/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const service = await serviceCollection.findOne(query);
            res.send(service);
        })

        // insert review
        app.post('/reviews', async(req, res) =>{
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        })

        // get review
        app.get('/reviews', async(req, res) => {
            const query = {};
            const cursor = reviewCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })

        
        //delete review
        app.delete('/reviews/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const result = await reviewCollection.deleteOne(query);
            res.send(result);
        })


    }
    finally{

    }
}

run().catch(err => console.error(err));

app.get('/', (req, res) =>{
    res.send('ankan print server is running');
})

app.listen(port, (req, rea) => {
    console.log('server running on port:', port);
})