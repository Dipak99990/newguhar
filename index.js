const express = require("express");
const cors = require("cors");
const Feedback = require("./schemas.js");
const mongoose = require("mongoose");
const DATABASE = process.env.DATABASE;
const port = process.env.port;
main().catch((err) => console.log(err));

async function main() {
  await mongoose
    .connect(`${DATABASE}`)
    .then(() => {
      console.log("MongoDB connected successfully");
    })
    .catch((err) => {
      console.error("Error connecting to MongoDB:", err);
    });

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

const app = express();
app.use(express.json());

app.use(cors());
//posting in db
app.post("/", async (req, res) => {
  try {
    let feedback = new Feedback();
    feedback.username = req.body.username;
    feedback.comment = req.body.comment;
    const result = await feedback.save();
    console.log(result);
    res.send(result);
  } catch (err) {
    console.error("Error saving feedback to MongoDB:", err);
    res.status(500).send("Error saving feedback to MongoDB");
  }
});
//getting from db
app.get("/", (req, res) => {
  Feedback.find({}, (err, feedback) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error retrieving users from database");
    } else {
      res.send(feedback);
    }
  });
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
