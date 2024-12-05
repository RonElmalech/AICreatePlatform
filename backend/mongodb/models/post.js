import moongose from 'mongoose';
const Post = new moongose.Schema({
    name:{type:String, required:true},
    prompt:{type:String, required:true},
    photo:{type:String, required:true},
});

const postSchema = moongose.model('Post', Post);
export default postSchema;