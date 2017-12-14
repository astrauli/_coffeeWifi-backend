import express from 'express';
import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';
import bodyParser from 'body-parser';
import jwt from 'express-jwt';
import DB from './db';
import { User, Business, Review, Item } from './models';
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
// app.use(function (err, req, res, next) {
//   if (err.name === 'UnauthorizedError') {
//     res.status(401).json({message:'Missing or invalid token'});
//   }
// });

app.get('/', (req, res) => {
  res.send("root");
});

app.post("/users", (req, res) => {
  let unique_id = req.body.sub;
  let query = User.findOne({sub: unique_id});
  query.exec((err, user) => {
    if (err) {
      res.json(err);
    } else if (user === null) {
      User.create({sub: unique_id}, (err, new_user) => {
        if(err) {
          res.json(err);
        }
          res.json(new_user);
      })
    } else {
      res.json(user);
    }
  })
});

app.get('/user/:id/reviews', (req, res) => {
  let id = req.params.id;
  Review.find({"user_id": ObjectId(id)}, (err, reviews) => {
    if (err) {
      res.json(err);
    }
    res.json(reviews)
  })

});

app.get('/business/:id/reviews', (req, res) => {
  let { id } = req.params;
  Review.find({"business_id": ObjectId(id)}, (err, reviews) => {
    if (err) {
      res.json(err);
    }
    res.json(reviews);
  })
});

app.post('/business/:id/reviews', (req, res) => {
  let { id } = req.params;
  let { user, review } = req.body;
  Review.create({"user_id": ObjectId(user.id), "business_id": ObjectId(id), "stars": review.stars, "content": review.content, "name": user.name}, (err,review) => {
    if(err) {
      res.json("review creation err", err)
    }
    User.findOneAndUpdate({"_id": ObjectId(user.id)}, {"$push": {"reviews": review._id}}, {"new": true}, (err,user) => {
      if(err) {
        res.json(err)
      }
    });
    Business.findOneAndUpdate({"_id": ObjectId(id)}, {"$push": {"reviews": review._id}}, {"new": true}, (err, business) => {
      if (err) {
        res.json(err)
      }
      Review.find({"_id": {"$in": business.reviews}}, (err, docs) => {
        if (err) {
          res.json(err);
        }
        res.json(docs);
      })
    })
  });
});

app.post('/filter', (req,res) => {
   let { name, radius, location, outlets } = req.body.filter;

   let aggregate = initiateAggregate(Business);
   aggregate = addNameFilter(aggregate, name);
   aggregate = addLocationFilter(aggregate, location, radius);
   aggregate = addOutletFilter(aggregate, outlets);
   let result = executeAggregate(aggregate);
   result.then(info => {
     res.json(info);
   });
});

app.get('/businesses', (req, res) => {
  let { latitude, longitude, radius } = req.query;
  let location = [parseFloat(longitude),parseFloat(latitude)];
  let aggregate = initiateAggregate(Business);
  aggregate = addLocationFilter(aggregate, location, parseInt(radius));
  let result = executeAggregate(aggregate);
  result.then(info => {
    res.json(info);
  });
});

app.get('/business/:id/food', (req, res) => {
  let { id } = req.params
  Item.find({"business_id": ObjectId(id), "type": "food"}, (err, foodItems) => {
    if (err) {
      res.json(err)
    }
    res.json(foodItems)
  });
});

app.get('/business/:id/drinks', (req, res) => {
  let { id } = req.params
  Item.find({"business_id": ObjectId(id), "type": "drink"}, (err, drinkItems) => {
    if (err) {
      res.json(err)
    }
    res.json(drinkItems)
  });
});

app.get('/business/:id/stats', (req, res) => {
  let { id } = req.params
  Business.findOne({"_id": ObjectId(id)}, (err, business) => {
    if (err) {
      res.json(err);
    }
    res.json(business.stats)
  });
});
