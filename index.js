const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        const servicesCollection = database.collection('services');
        const bookingsCollection = database.collection('bookings');
        //GET API
        app.get('/services',async(req,res)=>{
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })
        app.get('/bookings',async(req,res)=>{
            const cursor = bookingsCollection.find({});
            const bookings = await cursor.toArray();
            res.send(bookings);
        })
        //GET SINGLE SERVICE
        app.get('/services/:id',async(req,res)=>{
            const id =req.params.id;
            // console.log('getting the service id',id);
            const query = {_id:ObjectId(id)};
            const service = await servicesCollection.findOne(query);
            res.json(service);
        })
        //GET SINGLE BOOKING
        app.get('/bookings/:id',async(req,res)=>{
            const id = req.params.id;
            console.log('getting the booking id',id);
            const query = {_id:ObjectId(id)};
            const booking = await bookingsCollection.findOne(query);
            console.log(booking);
            res.json(booking);
        })
        //GET MY ORDER
        app.get('/myOrder/:email',async(req,res)=>{
            const result =await bookingsCollection.find({email:req.params.email}).toArray();
            res.send(result);
       })
        //POST API
        app.post('/services',async(req,res)=>{
            const service = req.body;
            console.log('hitting the post',service)
            const result = await servicesCollection.insertOne(service);
            // console.log(result);
            res.json(result)
        })
        app.post('/bookings',async(req,res)=>{
            const booking = req.body;
            console.log('hitting the woodword',booking)
            const result = await bookingsCollection.insertOne(booking);
            console.log(result);
            res.json(result);
        })
        //UPDATE API
        app.put('/services/:id',async(req,res)=>{
            const id =req.params.id;
            const updatedService = req.body;
           const filter = {_id: ObjectId(id)};
           const options= {upsert:true};
           const updateDoc={
               $set:{
                   Name: updatedService.Name,
                   Description: updatedService.Description,
                   img: updatedService.img,
                   Price: updatedService.Price
               }
           };
           const result = await servicesCollection.updateOne(filter,updateDoc,options)
           console.log('Updating',req);
           res.json(result);
        })
        //UPDATE STATUS
        app.put('/bookings/:id',(req,res)=>{
            const id = ObjectId(req.params.id);
            const data = req.body;
            bookingsCollection.findOneAndUpdate({_id:id},{$set:{status:data.status}})
            .then(result=>{
                res.send(result);
            })
        })
       //DELETE API
       app.delete('/services/:id',async(req,res)=>{
           const id= req.params.id;
           const query = {_id:ObjectId(id)};
           const result= await servicesCollection.deleteOne(query);
           res.json(result); 
       })
       app.delete('/bookings/:id',async(req,res)=>{
           const id= req.params.id;
           const query = {_id:ObjectId(id)};
           const result= await bookingsCollection.deleteOne(query);
           res.json(result); 
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