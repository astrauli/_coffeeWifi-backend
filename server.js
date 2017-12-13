import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import jwt from 'express-jwt';
import DB from './db';
import { User, Business, Review  } from './models';
import rsaValidation from 'auth0-api-jwt-rsa-validation';
import { initiateAggregate, addNameFilter, addLocationFilter, addOutletFilter, executeAggregate } from './query_functions';


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

app.get('/', (req, res) => {
  res.send("root");
});

app.post("/users", (req, res) => {
  let sub = req.body.sub;
  User.findOne({sub}, (err, user) => {
    if (err) {
      console.log("err",  err);
      res.json(err);
    }
    if (user === null) {
      User.create({sub}, (err, doc) => {
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


app.post('/filter', (req,res) => {
   let { name, radius, location, outlets } = req.body.filter;

   let aggregate = initiateAggregate(Business);
   aggregate = addNameFilter(aggregate, name);
   aggregate = addLocationFilter(aggregate, location, radius);
   aggregate = addOutletFilter(aggregate, outlets);
   result = executeAggregate(aggregate);
   console.log(result);
   res.json(result);
});

app.get('/businesses', (req, res) => {
  let { location, radius } = req.body;
  let aggregate = initiateAggregate(Business);
  aggregate = addLocationFilter(aggregate, location, radius);
  result = executeAggregate(aggregate);
  console.log(result);
  res.json(result);
});
