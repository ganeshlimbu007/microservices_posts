const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");

const posts = {};
const { randomBytes } = require("crypto");

const app = express();
const cors = require("cors");
app.use(cors());

app.use(express.json());
app.use(bodyParser.json());

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/posts", async (req, res) => {
  console.log("i am called posts");
  const id = randomBytes(4).toString("hex");
  const { title } = req.body;
  const post = { id, title };
  posts[id] = post;

  await axios.post("http://event-bus-srv:4005/events", {
    type: "PostCreated",
    data: post,
  });

  res.status(201).send(post);
});

app.post("/events", (req, res) => {
  const event = req.body.event || {};
  console.log("Received Event:", event);
  res.send({ ...event });
});

app.delete("/posts/:id", (req, res) => {
  const { id } = req.params;
  delete posts[id];
  res.status(200).send({ message: "Post deleted successfully" });
});

app.listen(4000, () => {
  console.log("hello V12.0");

  console.log("Posts service listening on port 4000");
});
