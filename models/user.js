const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Listing = require("./listing.js");
const passportLocalMongoose = require('passport-local-mongoose').default;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  wishlist: [
    {
      type: Schema.Types.ObjectId,
      ref: "Listing" // Make sure this matches exactly how you named your Listing model!
    }
  ]
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);