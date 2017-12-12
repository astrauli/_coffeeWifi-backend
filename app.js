import express from 'express';
import mongodb, { MongoClient } from 'mongodb';
import mongoose, { Schema } from 'mongoose';
import bodyParser from 'body-parser';

mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/test'
, {useMongoClient: true});

let userSchema = new Schema({
  sub: String
});

let businessSchema = new Schema({
  name: String,
  coordinates: Object
})

let User = mongoose.model('User', userSchema);
let Business = mongoose.model('businesses', businessSchema);
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {

  let server = app.listen(process.env.PORT || 8080, () => {
    let port = server.address().port;
    console.log("App now running on port", port);
  });
});


const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.get('/testinsert', (req, res) => {
  console.log("on test");

  res.send("hi")
})

app.get('/', (req, res) => {
  res.send("HI THERE");
});

app.post("/users", (req, res) => {
  // let query = getUsername(req.body);
  User.findOne(req.body, (err, user) => {
    if (err) {
      console.log("err",  err);
      res.json(err);
    }
    if (user === null) {
      User.create({sub: req.body.sub}, (err, doc) => {
        if(err) {
          console.log(err);
          res.json(err)
        }
        console.log("created user", doc);
        res.json(doc)
      })
    } else {
      console.log("user was found", user);
      res.json(user);
    }
  });
});

app.get('/businesses', (req, res) => {
  // TODO:
  //insert logic to fetch shops only a few miles away from current position
  // Business.find({}).circle('coordinates', {center: req.body.currentPosition, radius: 10, unique: true})
  Business.find({}, (err, docs) => {
    if (err) {
      console.log(err);
      res.json(err)
    }
    console.log(docs);
    res.send(docs)
  })
});
