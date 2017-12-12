import express from 'express';
import mongodb, { MongoClient } from 'mongodb';
import mongoose, { Schema } from 'mongoose';
import bodyParser from 'body-parser';

mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGODB_URI || 'mongodb://root:bestappever@ds133856.mlab.com:33856/coffeewifi' ||'mongodb://localhost:27017/test'
, {useMongoClient: true});

let userSchema = new Schema({
  sub: String
});

let businessSchema = new Schema({
  name: String,
  loc: { type: {type: String }, coordinates: [Number]}
});
businessSchema.index({'loc': '2dsphere'});


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
  // req.body.currentPosition
  // Business.find(
  //   { loc:
  //     { $near :
  //         {
  //           $geometry : {
  //              type : "Point" ,
  //              coordinates : [-122, 37.443902444762696] },
  //           $maxDistance : 10
  //         }
  //      }
  //   }).then(res => console.log(res))
  // Business.find({}, (err, docs) => {
  //   if (err) {
  //     console.log(err);
  //     res.json(err)
  //   }
  //   console.log(docs);
  //   res.send(docs)
  // })
  Business.aggregate(
    [
        { "$geoNear": {
            "near": {
                "type": "Point",
                "coordinates": [-122.41, 37.78]
            },
            "distanceField": "distance",
            "spherical": true,
            "maxDistance": 100
        }}
    ],
    function(err,results) {
      console.log(results);
      res.json(results)
    }
)
});
