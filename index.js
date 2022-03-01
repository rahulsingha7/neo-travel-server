const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 7000;

//middleWare
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1wb5a.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try {
        await client.connect();
        const database = client.db('travelers');
        const bookingCollection = database.collection('bookings');
        //GET API
        app.get('/bookings',async(req,res)=>{
            const cursor = bookingCollection.find({});
            const bookings = await cursor.toArray();
            res.send(bookings);
        })

    }
    finally
    {
        // await client.close();
    }
}
run().catch(console.dir);
app.get('/',(req,res)=>{
    res.send('Running Neo-Travel Server');
})
app.listen(port,()=>{
    console.log('Listening From Port',port);
})