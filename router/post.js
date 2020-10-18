const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')
const Post = mongoose.model('Post');
const User = mongoose.model('User');
const requireLogin = require('../middleware/requireLogin');

router.get('/allPost', (req, res) => {
    Post.find().populate("user", "_id name").then(posts => {
        res.json({
            posts
        })
    }).catch(
        err => console.log(err)
    );
})
router.post('/createPost', requireLogin, (req, res) => {
    const {
        title,
        image
    } = req.body;
    if (!title) {
        return res.status(401).json({
            message: "Please enter title for the post"
        });
    }
    req.user.password = undefined;
    const post = new Post({
        title,
        image,
        user: req.user
    });
    post.save().then(result => {
        res.json({
            post: result
        })
    }).catch(err => {
        console.log(err)
    })
})

router.get('/myPost', requireLogin, (req, res) => {
    Post.find({
        user: req.user._id
    }).populate('user', "_id name").then(myPost => {
        res.json({
            myPost
        })
    }).catch(
        err => console.log(err)
    )
})
module.exports = router;