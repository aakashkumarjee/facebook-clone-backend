const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
    JWT_SECRET
} = require("../keys");
const requireLogin = require('../middleware/requireLogin')


router.get("/", (req, res) => {
    res.send("hello from  router");
});
router.get('/protected', requireLogin, (req, res) => {
    res.send("You got to protected  content");
})
router.post("/signup", (req, res) => {
    const {
        name,
        email,
        password
    } = req.body;
    if (!name || !email || !password) {
        return res.status(422).json({
            err: "Please add all the fields",
        });
    }
    User.findOne({
            email: email,
        })
        .then((savedUser) => {
            if (savedUser) {
                return res.status(422).json({
                    errors: "User already exists",
                });
            }
            bcrypt
                .hash(password, 12)
                .then((hashedPassword) => {
                    const user = new User({
                        name,
                        email,
                        password: hashedPassword,
                    });
                    user.save().then((user) => {
                        res.json({
                            message: "Successfully added",
                        });
                    });
                })
                .catch((error) => {
                    console.log(error);
                });
        })
        .catch((error) => {
            console.log(error);
        });
});
router.post("/signin", (req, res) => {
    const {
        email,
        password
    } = req.body;
    if (!email || !password) {
        return res.status(422).json({
            error: "please add email or password",
        });
    }
    User.findOne({
            email: email
        })
        .then((user) => {
            if (!user) {
                return res.status(422).json({
                    error: "Invalid Details",
                });
            }
            bcrypt
                .compare(password, user.password)
                .then((matched) => {
                    if (matched) {
                        const token = jwt.sign({
                            _id: user._id
                        }, JWT_SECRET);
                        res.json({
                            token
                        });
                        ///return res.json({ message: "Successfully signed in" });
                    } else {
                        return res.status(422).json({
                            error: "Invalid Details"
                        });
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        })
        .catch((error) => {
            console.log(error);
        });
});
module.exports = router;