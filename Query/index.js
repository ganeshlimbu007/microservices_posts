const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const app = express();
const cors = require("cors");
app.use(cors());

app.use(express.json());
app.use(bodyParser.json());

const posts = {
  a: { id: "a", title: "First Post", comments: [] },
};
app.get("/posts", (req, res) => {
  res.send({ ...posts });
});

app.post("/events", (req, res) => {
  const { type, data } = req.body;

  if (type === "PostCreated") {
    const { title } = data;
    const id = randomBytes(4).toString("hex");
    posts[id] = { id, title, comments: [] };
    console.log("Post Created Event Received");
    res.send({ status: "OK" });
  }
  if (type === "CommentCreated") {
    const { content, postId } = data;
    console.log("queue data", data);
    const id = randomBytes(4).toString("hex");

    const comments = [...(posts[postId].comments || []), { id, content }];
    console.log("comments before push", comments);
    posts[postId].comments = comments;
    res.send({ status: "OK" });
  }
});

app.listen(4002, () => {
  console.log("Posts service listening on port 4002");
});
