import mongoose from "mongoose";

const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  biography: {
    type: String,
    default: null,
  }
},{timestamps:true});

module.exports = mongoose.model('Author', authorSchema);
