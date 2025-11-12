const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const events = [];

const app = express();
const cors = require("cors");
app.use(cors());

app.use(express.json());
app.use(bodyParser.json());

app.post("/events", (req, res) => {
  const event = req.body;
  console.log("Event Received:", event.type);
  events.push(event);
  console.log("i am called event-bus");
  axios.post("http://posts-clusterip-srv:4000/events", { ...event });
  axios.post("http://comments-srv/events", { ...event });
  axios.post("http://query-srv/events", { ...event });
  axios.post("http://moderation-srv/events", { ...event });
  res.send({ status: "OK" });
});

app.get("/events", (req, res) => {
  res.send(events);
});

app.listen(4005, () => {
  console.log("hello V12.0 event");

  console.log("Posts service listening on port 4005");
});
