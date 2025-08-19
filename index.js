const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");
const helmet = require("helmet");

const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/post");

dotenv.config();

mongoose.connect(process.env.MONGO_DB).then(() => {
    console.log("Mongoose connected");
});

const PORT = 8000;

//middleware

app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/post", postRoute);

app.get("/", (req, res) => {
    res.send("Welcome to Homepage ");
});

app.get("/users", (req, res) => {
    res.send("Welcome to user page ");
});

app.listen(PORT, () => {
    console.log(`Backend server listening on port ${PORT}`);
});
