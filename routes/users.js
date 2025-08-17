const router = require("express").Router();
const bcrypt = require("bcrypt");
const { findByIdAndUpdate } = require("../models/User");
const User = require("../models/User");

//update a user

router.put("/:id", async (req, res) => {
    try {
        if (req.body.userID === req.params.id) {
            if (req.body.password) {
                try {
                    const salt = await bcrypt.genSalt(10);
                    req.body.password = await bcrypt.hash(
                        req.body.password,
                        salt
                    );
                } catch (err) {
                    return res.status(500).json(err);
                }
            }
            try {
                const user = await User.findByIdAndUpdate(req.params.id, {
                    $set: req.body,
                });

                return res.status(200).send("Changes successful");
            } catch (err) {
                return res.status(500).json(err);
            }
        } else {
            return res.status(401).send("You may update only your account");
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

//delete a user
router.delete("/:id", async (req, res) => {
    try {
        if (req.body.userID === req.params.id) {
            try {
                const user = await User.findByIdAndDelete(req.params.id);
                return res.status(200).send("Deletion complete");
            } catch (err) {
                return res.status(500).json(err);
            }
        } else {
            return res.status(401).send("You may delete only your account");
        }
    } catch (err) {
        return res.status(500).json(err);
    }
});

//get a user
//follow a user
//unfollow a user

router.post("/", (req, res) => {
    res.send("This is the user route");
});

router.get("/", (req, res) => {
    res.send("This is the user route");
});

module.exports = router;
