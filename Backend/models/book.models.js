const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author', // Reference to Author Schema
    required: true,
  },
  genre: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Genre', // Reference to Genre Schema
      required: true,
    },
  ],
  picture: {
    type: String, // URL or path to the book cover image
    default: null,
  },
  status: {
    type: String,
    enum: ['available', 'borrowed'], // Book availability status
    default: 'available',
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Current owner of the book
    required: true,
  },
  previousOwners: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Users who previously owned the book
      },
      transferDate: {
        type: Date, // Date the ownership was transferred
        default: Date.now,
      },
    },
  ],
  contributors: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Users who contributed or donated the book
      },
      contributionDate: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
  reBorrowDates: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // User borrowing the book again
      },
      borrowDate: {
        type: Date,
        required: true, // Date of re-borrowing
      },
      returnDate: {
        type: Date, // Optional: Date of returning after re-borrowing
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

bookSchema.index({ location: '2dsphere' }); // Geospatial index for nearby searches

module.exports = mongoose.model('Book', bookSchema);
