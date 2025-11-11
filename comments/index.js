const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const commentsByPostId = {};
const { randomBytes } = require("crypto");

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.get("/posts/:id/comments", (req, res) => {
  if (!commentsByPostId[req.params.id]) {
    res.status(201).send([]);
  }
  res.status(201).send(commentsByPostId[req.params.id] || []);
});

app.post("/posts/:id/comments", async (req, res) => {
  const commentId = randomBytes(4).toString("hex");
  const { content } = req.body;
  const comment = { id: commentId, content, status: "pending" };
  const comments = commentsByPostId[req.params.id] || [];
  comments.push(comment);

  commentsByPostId[req.params.id] = comments;
  console.log("commentsByPostId", {
    id: commentId,
    content,
    postId: req.params.id,
    status: "pending",
  });

  await axios.post("http://localhost:4002/events", {
    event: {
      type: "CommentCreated",
      data: {
        id: commentId,
        content,
        postId: req.params.id,
        status: "pending",
      },
    },
  });
  res.status(201).send(comment);
});

app.post("/events", (req, res) => {
  const { type, data } = req.body;

  if (type === "CommentModerated") {
    const { postId, id, status, content } = data;
    const comments = commentsByPostId[postId];
    const comment = comments.find((comment) => comment.id === id);
    comment.status = status;

    axios.post("http://localhost:4005", {
      event: {
        type: "CommentUpdated",
        data: {
          id,
          status,
          postId,
          content,
        },
      },
    });
  }

  res.send({});
});

app.delete("/posts/:id/comments", (req, res) => {
  const { id } = req.params;
  delete commentsByPostId[id];
  res.status(200).send({ message: "Post deleted successfully" });
});

app.listen(4001, () => {
  console.log("Posts service listening on port 4001");
});
