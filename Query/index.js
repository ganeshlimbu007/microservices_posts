const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const app = express();
const cors = require("cors");
app.use(cors());

app.use(express.json());
app.use(bodyParser.json());

const posts = {};
const events = [];

const handleEvent = (type, data) => {
  if (type === "PostCreated") {
    const { title } = data;
    const id = randomBytes(4).toString("hex");
    posts[id] = { id, title, comments: [] };
    console.log("Post Created Event Received");
    res.send({ status: "OK" });
  }
  if (type === "CommentCreated") {
    console.log("Comment Created Event Received");
    const { content, postId, status } = data;
    console.log("queue data", data);
    const id = randomBytes(4).toString("hex");

    const comments = [
      ...(posts[postId].comments || []),
      { id, content, status },
    ];
    console.log("comments before push", comments);
    posts[postId].comments = comments;
    res.send({ status: "OK" });
  }

  if (type === "CommentUpdated") {
    const { id, postId, status, content } = data;
    const comments = posts[postId].comments;
    const comment = comments.find((comment) => comment.id === id);
    comment.status = status;
    console.log("Comment Updated Event Received");
    res.send({ status: "OK" });
  }
};

app.get("/posts", (req, res) => {
  res.send({ ...posts });
});

app.post("/events", (req, res) => {
  const { type, data } = req.body;

  handleEvent(type, data);
});

app.listen(4002, async () => {
  console.log("Posts service listening on port 4002");

  const res = await axios("http://localhost:4005/events");
  for (let event of res.data) {
    console.log("Processing event:", event.type);
    handleEvent(event.type, event.data);
  }
});
