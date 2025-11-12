const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();

app.use(express.json());
app.use(bodyParser.json());

app.post("/events", async (req, res) => {
  const { type, data } = req.body;

  if (type === "CommentCreated") {
    const { id, content, postId, status } = data;

    const moderatedStatus = content.includes("orange")
      ? "rejected"
      : "approved";

    // Emit CommentModerated event
    await axios.post("http://event-bus-srv:4005/events", {
      event: {
        type: "CommentModerated",
        data: {
          id,
          content,
          postId,
          status: moderatedStatus,
        },
      },
    });
  }
  res.send({ status: "OK" });
});

app.listen(4003, () => {
  console.log("Posts service listening on port 4003");
});
