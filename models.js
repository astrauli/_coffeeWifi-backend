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
  loc: {type: {type: String }, coordinates: [Number]},
  reviews: [{type: Schema.Types.ObjectId, ref: 'Review'}],
  outlets: {type: Number, min: 0, max: 5 }
});
businessSchema.index({'loc': '2dsphere'});

let reviewsSchema = new Schema({
  user_id: {type: Schema.Types.ObjectId, ref: 'User'},
  business_id: {type: Schema.Types.ObjectId, ref: 'Business'},
  stars: {type: Number, min: 0, max: 5},
  content: {type: String}
});

export const User = mongoose.model('users', userSchema);
export const Business = mongoose.model('businesses', businessSchema);
export const Review = mongoose.model('reviews', reviewsSchema)
