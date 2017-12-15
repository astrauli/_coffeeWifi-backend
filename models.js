import mongoose, { Schema } from 'mongoose';


// TODO: Add required
// required: true

let userSchema = new Schema({
  name: {type: String},
  sub: {type: String},
  email: {type: String},
  reviews: [{type: Schema.Types.ObjectId, ref: 'Review'}],
  liked_locations: [{type: Schema.Types.ObjectId, ref: 'Business'}]
});

let businessSchema = new Schema({
  name: {type: String},
  loc: {type: {type: String}, coordinates: [Number]},
  reviews: [{type: Schema.Types.ObjectId, ref: 'Review'}],
  outlets: {type: Number, min: 0, max: 5 },
  menu: {
    food: [{type: Schema.Types.ObjectId}],
    drink: [{type: Schema.Types.ObjectId}]
  },
  stats: {
    coffeeRating: {type: Number},
    foodRating: {type: Number},
    wifiRating: {type: Number},
    volumeRating: {type: Number},
    tempRating: {type: Number},
    outletsRating: {type: Number}
  }
});
businessSchema.index({'loc': '2dsphere'});

let reviewsSchema = new Schema({
  user_id: {type: Schema.Types.ObjectId, ref: 'User'},
  business_id: {type: Schema.Types.ObjectId, ref: 'Business'},
  name: {type: String},
  stars: {type: Number, min: 0, max: 5},
  content: {type: String}
});

let itemsSchema = new Schema({
  name: {type: String},
  business_id: {type: Schema.Types.ObjectId},
  price: {type: Number},
  description: {type: String},
  image: {type: String},
  type: {type: String, enum: ["food", "drink"]}
})

export const User = mongoose.model('users', userSchema);
export const Business = mongoose.model('businesses', businessSchema);
export const Review = mongoose.model('reviews', reviewsSchema);
export const Item = mongoose.model('items', itemsSchema);
