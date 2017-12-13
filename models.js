import mongoose, { Schema } from 'mongoose';

let userSchema = new Schema({
  name: String,
  title: String,
  num: Number
});

let businessSchema = new Schema({
  name: String,
  loc: { type: {type: String }, coordinates: [Number]},
  reviews: [{type: Schema.Types.ObjectId}],
  outlets: Number
});
businessSchema.index({'loc': '2dsphere'});

let reviewsSchema = new Schema({
  user_id: [{type: Schema.Types.ObjectId}],
  business_id: [{type: Schema.Types.ObjectId}],
  stars: Number,
  review_content: String
});

export const User = mongoose.model('users', userSchema);
export const Business = mongoose.model('businesses', businessSchema);
export const Review = mongoose.model('reviews', reviewsSchema)
