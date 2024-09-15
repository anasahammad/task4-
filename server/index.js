const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser')
require('dotenv').config()

const corsOptions={
    origin: ["http://localhost:5173", "https://66e71eb323e3231e08880ea4--bejewelled-biscotti-679742.netlify.app"]
    
}
app.use(express.json())
app.use(cors(corsOptions))



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.goboxhh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    const database = client.db('task4');
    const userCollection = database.collection('users')

    //signup user
    app.post('/signup', async(req, res)=>{
        const {name, email, password} = req.body;

        const isExist = await userCollection.findOne({email})
        if(isExist) {
          return  res.status(400).send({message: "User already exist"})
        }

        const hashedPass = await bcrypt.hash(password, 8)
        const newUser = {name, email, password: hashedPass, status: 'active', registrationTime: new Date(), lastLoginTime: null}
        const result = await userCollection.insertOne(newUser)

        const token = jwt.sign(
            { id: result.insertedId, name: newUser.name, email: newUser.email }, 
            process.env.TOKENSECRET,
            { expiresIn: '1h' }
          );
    
         return res.status(201).json({
            user: {
              id: result.insertedId,
              name: newUser.name,
              email: newUser.email
            },
            token
          });
    })

    //login
    app.post("/login", async(req, res)=>{
        const {email, password} = req.body;

        try{
            const user = await userCollection.findOne({email})
        if(!user){
            return res.status(404).send({message: "User not found"})
        } 

        if(user.status === 'blocked'){
            return res.status(403).send({message: "Your account is block"})
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password)

        if(!isPasswordMatch){
            return res.status(400).send({message: "Password did not match"})
        }

        const token = jwt.sign({id: user._id,name: user.name, email: user.email}, process.env.TOKENSECRET, {expiresIn: '1h'})
 
        await userCollection.updateOne({ _id: user._id }, { $set: { lastLoginTime: new Date() } }) 

        return res.status(200).json({
            user: {
              id: user._id,
              name: user.name,
              email: user.email
            },
            token
          });
        
        }catch(error){
            return res.status(500).send({ message: "Internal server error", error: error.message });
        }

       
    })


     //get users
     app.get("/users", async(req, res)=>{
        const result = await userCollection.find().toArray() 
        res.send(result)
    })

    app.delete('/delete-users', async (req, res) => {
        const { ids } = req.body;
      
        try {
          await userCollection.deleteMany({ _id: { $in: ids.map(id => new ObjectId(id)) } });
          res.status(200).send({ message: 'Users deleted successfully' });
        } catch (error) {
          res.status(500).send({ message: 'Error deleting users', error: error.message });
        }
      });


      app.put('/block', async (req, res) => {
        const { ids } = req.body;
      
        try {
          await userCollection.updateMany({ _id: { $in: ids.map(id => new ObjectId(id)) } }, { $set: { status: 'blocked' } });
          res.status(200).send({ message: 'Users blocked successfully' });
        } catch (error) {
          res.status(500).send({ message: 'Error blocking users', error: error.message });
        }
      });
      
      app.put('/unblock', async (req, res) => {
        const { ids } = req.body;
      
        try {
          await userCollection.updateMany({ _id: { $in: ids.map(id => new ObjectId(id)) } }, { $set: { status: 'active' } });
          res.status(200).send({ message: 'Users unblocked successfully' });
        } catch (error) {
          res.status(500).send({ message: 'Error unblocking users', error: error.message });
        }
      });
      
      
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get("/", async(req, res)=>{
    res.send("the app is running")
})

app.listen(port, ()=>{
    console.log(`The app is running on port ${port}`)
})