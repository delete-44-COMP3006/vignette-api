// Import Express, use it initialise the application, and
// determine which port to use.
const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 9000;

// Enable CORs for all routes
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

const url = process.env.DB_URL;

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

// Start the server
app.listen(port, function () {
  console.log(`Listening on ${port}`);
});

module.exports = app;
