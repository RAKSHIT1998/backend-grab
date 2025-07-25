import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    image: String,
    link: String,
    releaseDate: Date,
    trending: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const Movie = mongoose.model('Movie', movieSchema);
export default Movie;
