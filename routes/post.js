const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");

router.get("/", (req, res) => {
    res.send("Post page");
});

//create a post
router.post("/", async (req, res) => {
    const newPost = new Post(req.body);
    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    } catch (err) {
        res.status(500).json(err);
    }
});

//update a post
router.put("/:id", async (req, res) => {
    const editorID = req.body.userID;
    const postID = req.params.id;

    const postToEdit = await Post.findById(postID);
    if (postToEdit.userID === editorID) {
        try {
            await postToEdit.updateOne({ $set: req.body });
            res.status(200).send(req.body);
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(401).json("You can only edit your own posts");
    }
});

//delete a post

router.delete("/:id", async (req, res) => {
    const deletorID = req.body.userID;
    const postID = req.params.id;

    const postToDelete = await Post.findById(postID);
    if (postToDelete.userID === deletorID) {
        try {
            await postToDelete.deleteOne();
            res.status(200).send("Post deleted");
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(401).json("You can only delete your own posts");
    }
});

//like a post
router.put("/:id/like", async (req, res) => {
    const likerID = req.body.userID;
    const postID = req.params.id;
    try {
        const postToLike = await Post.findById(postID);
        if (postToLike.userID != likerID) {
            if (!postToLike.likes.includes(likerID)) {
                await Post.updateOne(postToLike, { $push: { likes: likerID } });
                res.status(200).json("Post liked");
            } else {
                res.status(401).json("You already liked this post!");
            }
        } else {
            res.status(401).json("You cannot like your own post!");
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

//get a post
router.get("/:id", async (req, res) => {
    try {
        const postID = req.params.id;
        const post = await Post.findById(postID);
        res.status(200).send(post);
    } catch (err) {
        res.status(500).json(err);
    }
});

//get timeline posts
router.get("/timeline/all", async (req, res) => {
    try {
        const currUser = await User.findById(req.body.userID);
        const posts = await Post.find({ userID: currUser._id });
        const friendPosts = await Promise.all(
            currUser.following.map((friendID) => {
                return Post.find({ userID: friendID });
            })
        );

        res.status(200).json(posts.concat(...friendPosts));
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
