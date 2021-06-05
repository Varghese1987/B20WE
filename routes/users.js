var express = require('express');
var router = express.Router();

const {dbUrl,mongodb,mongoClient} = require("../dbconfig");
const { hashing, hashCompare, createJWT, authenticate, permit } = require('../library/auth');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post("/register",async(req,res)=>{
  const client = await mongoClient.connect(dbUrl);
  try {
    const db= client.db("b20WE");
    const user = await db.collection("users").findOne({email:req.body.email});
    if(user){
      res.status(400).json({
        message:"User Already Exists"
      })
    }else{
      // console.log(req.body.password)
      const hash = await hashing(req.body.password)
      req.body.password = hash;
      // console.log(req.body.password)
      const document = await db.collection("users").insertOne(req.body);
      res.status(200).json({
        message:"record Added",
      })
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }finally{
    client.close();
  }
})

router.post("/login",async(req,res)=>{
  // take the user and password
  // check user available or not
  // if available, we need to compare the password
  const {email,password}=req.body;
  const client = await mongoClient.connect(dbUrl);
  try {
    const db = client.db("b20WE");
    const user = await db.collection("users").findOne({email:email});
    if(user){
      const compare = await hashCompare(password, user.password)
      console.log("Compare-",compare)
     if(compare){
       // generate token
       const token = await createJWT({
         email,
         id:user._id,
         role:user.role,
       })
      res.status(200).json({
        token,
        message:"Login Success"
      })
     }else{
      res.status(400).json({
        message:"Wrong Password"
      })
     }
    }else{
      res.json({
        message:"No User Available"
      })
    }
  } catch (error) {
    
  }
})

router.get("/all-users",[authenticate,permit(1,3)],async(req,res)=>{
  const client = await mongoClient.connect(dbUrl);
  try {
    const db = client.db("b20WE");
    const users = await db.collection("users").find().toArray();
    res.status(200).json({users})
   
  } catch (error) {
    console.log(error)
  }
})

module.exports = router;
