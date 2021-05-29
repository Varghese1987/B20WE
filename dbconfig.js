
const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;
const dbUrl="mongodb+srv://varghese:varghese@cluster0.msc5a.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

module.exports={dbUrl, mongodb, mongoClient};