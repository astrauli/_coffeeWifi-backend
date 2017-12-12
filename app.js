import express from 'express';
import mongodb, { MongoClient } from 'mongodb';
import mongoose, { Schema } from 'mongoose';
import bodyParser from 'body-parser';

mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/test'
, {useMongoClient: true});

let userSchema = new Schema({
  name: String,
});
let User = mongoose.model('users', userSchema);

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {

  let server = app.listen(process.env.PORT || 8080, () => {
    let port = server.address().port;
    console.log("App now running on port", port);
  });
  // let newUser = new User({name: "JEFF!#"});
  // newUser.save((err) => {console.log(err);} )
  // User.findOne({name: "JEFF!#"}, (err, docs) => {
  //   if (err) {
  //     console.log(err);
  //   }
  //   console.log(docs);
  // });
  // User.find({})
  // User.create({name: 'JEFF'})
  //
});

const getUsername = (body) => {
  let query = User.findOne({name: body['name']});
  return query;
};

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
    console.log("user", user);
    res.json(user)
  });
});
