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

  axios.post("http://localhost:4000/events", { ...event });
  axios.post("http://localhost:4001/events", { ...event });
  axios.post("http://localhost:4002/events", { ...event });
  axios.post("http://localhost:4003/events", { ...event });
  res.send({ status: "OK" });
});

app.get("/events", (req, res) => {
  res.send(events);
});

app.listen(4005, () => {
  console.log("Posts service listening on port 4005");
});
