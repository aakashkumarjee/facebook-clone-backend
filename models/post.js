const mongoose = require('mongoose');
const {
    ObjectId
} = mongoose.Schema.Types;

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    user: {
        type: ObjectId,
        ref: 'User'
    }
});
mongoose.model("Post", postSchema);