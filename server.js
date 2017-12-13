import express from 'express';
import mongoose, { Aggregate } from 'mongoose';
import bodyParser from 'body-parser';
import jwt from 'express-jwt';
import DB from './db';
import { User, Business, Review  } from './models';
import rsaValidation from 'auth0-api-jwt-rsa-validation';


mongoose.Promise = global.Promise;
// DB ||
mongoose.connect('mongodb://localhost:27017/test'
, {useMongoClient: true});

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
// TODO: ACTIVATE jwt
// var jwtCheck = jwt({
//   secret: rsaValidation(),
//   algorithms: ['RS256'],
//   issuer: "https://YOUR-AUTH0-DOMAIN.auth0.com/",
//   audience: 'https://movieanalyst.com'
// });
//
// app.use(jwtCheck);

// If we do not get the correct credentials, we’ll return an appropriate message
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({message:'Missing or invalid token'});
  }
});


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

//test
let filter;
let name;
let radius;
let location;
let outlets;
let query;
let aggregate;
let pipeline;
app.post('/filter', (req,res) => {
  //filter is sent in req body
   filter = req.body;

  //destructure different filters
   name = filter.name;
   radius = filter.radius;
   location = filter.location;
   outlets = filter.outlets;

//start filter
   aggregate = Business.aggregate()

//append to filter if necessary
   if (name) {
     aggregate = aggregate.match({name});
   }
   if (radius && location) {
     aggregate = aggregate.near({
           "near": location,
           "distanceField": "dist.calculated",
           "spherical": true,
           "maxDistance": radius
     })
   }
   if (outlets) {
     aggregate = aggregate.match({outlets})
   }

   aggregate.exec((err, result) => {
     if (err) {
       console.log(err);
       res.json(err);
     }
     console.log(result);
     res.json(result);
   })
});

app.get('/businesses', (req, res) => {
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
