// Server connection modules
const app = require("express")();
const mongoose = require("mongoose");
const routes = require("./routes");

const getHint = require("./writing-hints");

const cors = require("cors");
const bodyParser = require("body-parser");

// Import websockets packages
const http = require("http").Server(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
  },
});

// Set constants for the server
const port = process.env.PORT || 9000;
const url = process.env.DB_URL;

// Enable CORs for all routes
app.use(cors());

// Enable body parsing to extract data
app.use(bodyParser.urlencoded({ extended: false }));

mongoose.connect(url, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

// Get the default connection
const db = mongoose.connection;

// Alert any DB connection issues
db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.get("/submissions", routes.submissionsIndex);
app.get("/submissions/:id", routes.submissionsShow);
app.post("/submissions", routes.submissionsCreate);
app.patch("/submissions/:id", routes.submissionsUpdate);

io.on("connection", (socket) => {
  console.log("Client connected");

  // Every 30 seconds, send users writing a new submission a random hint
  setInterval(() => {
    socket.emit("writingHint", getHint());
  }, 30000);

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Start the server
http.listen(port, function () {
  console.log(`Listening on ${port}`);
});

module.exports = http;
