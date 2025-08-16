const router = require("express").Router();
const User = require("../models/User");
const bcrpyt = require("bcrypt");

//REGISTER USER
router.post("/register", async (req, res) => {
    try {
        const salt = await bcrpyt.genSalt(10);
        const hashedPW = await bcrpyt.hash(req.body.password, salt);

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPW,
        });

        const user = await newUser.save();
        res.status(200).send(user);
    } catch (err) {
        console.log(err);
    }
});

router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            res.status(404).send("Error 404, user not found");
        }
    } catch (err) {
        console.log(err);
    }
});

router.get("/", (req, res) => {
    res.send("This is the auth route");
});

module.exports = router;
