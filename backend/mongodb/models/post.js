import mongoose from 'mongoose';

// Define the schema
const PostSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Name of the user
    prompt: { type: String, required: true }, // Prompt text
    photo: { type: String, required: true }, // Generated image URL
  },
  { timestamps: true } // Add timestamps for createdAt and updatedAt
);

// Create the model
const Post = mongoose.model('Post', PostSchema);

export default Post;
