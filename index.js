const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 5000


app.use(cors())
app.use(express.json())












const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_SECRET}@cluster0.ufcjidc.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const usersCollection = client.db("collegeAdmissionDB").collection("users")
        const collegesCollection = client.db("collegeAdmissionDB").collection("colleges")
        const cartCollection = client.db("collegeAdmissionDB").collection("carts")
        const reviewsCollection = client.db("collegeAdmissionDB").collection("reviews")

        // ======User related api============// 

        app.get('/users', async (req, res) => {
            const result = await usersCollection.find().toArray()
            res.send(users)
        })
        // add new user 
        app.post('/users', async (req, res) => {
            const user = req.body
            const query = { email: user.email }
            const existedUser = await usersCollection.findOne(query)
            if (existedUser) {
                return res.send({ message: "user already exists" })
            }
            const result = await usersCollection.insertOne(query)
            res.send(result)
        })

        //=========== college api's=============// 
        app.get('/colleges', async (req, res) => {
            const result = await collegesCollection.find().toArray()
            res.send(result)
        })

        //==================== review api's================

        app.get('/reviews', async (req, res) => {
            const result = await reviewsCollection.find().toArray()
            res.send(result)
        })

        app.post('/reviews', async (req, res) => {
            const newReview = req.body
            const result = await reviewsCollection.insertOne(newReview)
            res.send(result)
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("End Game server is running")
})

app.listen(port, () => {
    console.log(`End Game server is running on port ${port}`);
})