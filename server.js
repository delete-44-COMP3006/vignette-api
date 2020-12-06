// Import Express, use it initialise the application, and
// determine which port to use.
let express = require("express");
let mongoose = require("mongoose");
let routes = require("./routes")
var cors = require('cors')
let app = express();
let port = 9000;

// Enable CORs for all routes
app.use(cors())

let url = "mongodb+srv://admin:7%24zjpJei6VX!L2K%24sApuMeZfCHxB*he1*KBYuEJ%24bDCZ8b%40Yenm@vignettecluster.o4pwf.mongodb.net/vignette-db";
mongoose.connect(url, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.get("/submissions", routes.submissionsIndex);
app.get("/submissions/:id", routes.submissionsShow);

// Start the server on the specified port and print a helpful
// message to the console log to state that the server is running.
app.listen(port, function() {
  console.log("Listening on " + port);
});
