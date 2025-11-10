const express = require("express");
const bodyParser = require("body-parser");

const commentsByPostId = {};
const { randomBytes } = require("crypto");

const app = express();

app.use(express.json());
app.use(bodyParser.json());

app.get("/posts/:id/comments", (req, res) => {
  if (!commentsByPostId[req.params.id]) {
    throw new Error("Post not found");
  }
  res.send(commentsByPostId[req.params.id] || []);
});

app.post("/posts/:id/comments", (req, res) => {
  console.log("called", req.params.id);
  const commentId = randomBytes(4).toString("hex");
  const { content } = req.body;
  const comment = { id: commentId, content };
  const comments = commentsByPostId[req.params.id] || [];
  comments.push(comment);

  commentsByPostId[req.params.id] = comments;

  res.status(201).send(comment);
});

app.delete("/posts/:id/comments", (req, res) => {
  const { id } = req.params;
  delete commentsByPostId[id];
  res.status(200).send({ message: "Post deleted successfully" });
});

app.listen(4001, () => {
  console.log("Posts service listening on port 4001");
});
