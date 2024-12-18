import mongoose from 'mongoose';

// Define the schema
const PostSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    prompt: { type: String, required: true },
    photo: { type: String, required: true },
  },
  { timestamps: true }
);

// Create the model
const Post = mongoose.model('Post', PostSchema);

export default Post;
