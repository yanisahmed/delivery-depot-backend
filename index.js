const express = require('express')
const app = express()
require('dotenv').config()
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

const port = process.env.PORT || 5000


app.use(cors());
app.use(express.json())// alternative of body parser

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.74aai.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("delivery-depot-101");
        const percelCollection = database.collection("percels");
        const usersCollection = database.collection("users");

        console.log('database connected');

        // ========================= USERS ===================
        // GET API


        app.post('/users', async (req, res) => {
            user = req.body;
            const result = await usersCollection.insertOne(user);
            res.json(result);
        })
        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        })

        // ================= PERCELS ===============
        // GET API
        app.get('/percels', async (req, res) => {
            const cursor = percelCollection.find({}).sort({ _id: -1 });
            const result = await cursor.toArray();
            res.json(result);
        })

        // GET API With ID
        app.get('/percels/:id', async (req, res) => {
            const id = req.params.id;

            const query = { _id: ObjectId(id) };
            const result = await percelCollection.findOne(query);
            res.json(result);
        })


        // POST API
        app.post('/percels', async (req, res) => {
            const product = req.body;
            const result = await percelCollection.insertOne(product);
            console.log(`A document was inserted with the _id: ${result.insertedId}`);
            res.json(result);
        })

        // DELETE API
        app.delete('/percels/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };

            const result = await percelCollection.deleteOne(query);
            res.send(result)
        })


    }
    finally {
        // await client.close()
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Server is running');
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})