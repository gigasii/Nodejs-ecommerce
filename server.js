// Third-party packages
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDbStore = require("connect-mongodb-session")(session);
const csurf = require("csurf");
const helmet = require("helmet");
const flash = require("connect-flash");
const multer = require("multer");
const compression = require("compression");

// Core packages
const path = require("path");

// Imports
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const status = require("./controllers/status");
const User = require("./models/user");

// Constants
const MONGO_DB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.wwnlt.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority`;

// Initilization
const app = express();
const storage = multer.diskStorage({
  destination: (req, file, callback) => callback(null, "public"),
  filename: (req, file, callback) =>
    callback(null, Date.now() + "-" + file.originalname),
});
const filter = (req, file, callback) =>
  file.mimetype === "image/png" || file.mimetype === "image/jpeg"
    ? callback(null, true)
    : callback(null, false);

// Templating package
app.set("view engine", "ejs");
app.set("views", "templates");

// Data parsing
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(multer({ storage: storage, fileFilter: filter }).single("imageFile"));

// Files inside these folders are assumed to be from root
app.use(express.static(path.join(__dirname, "public")));

// Create or use existing session
app.use(
  session({
    secret: "SessionSecret",
    resave: false,
    saveUninitialized: false,
    store: new MongoDbStore({ uri: MONGO_DB_URI, collection: "sessions" }),
  })
);

// Enable CSRF protection
app.use(csurf());

// Enable addtional response headers for security
app.use(helmet());

// Enable flashing of session variables
app.use(flash());

// Enable compression of files
app.use(compression());

// Variables to be included for every request
app.use(async (req, res, next) => {
  // Set user
  if (req.session.user) {
    req.user = await User.findById(req.session.user._id);
  }
  // Variables only available in views
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

// Route-handling
app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.get("/500", status.serverError);
app.use(status.pageNotFound);

// Error-handling
app.use((error, req, res, next) => {
  res.redirect("/500");
});

// Connect to database
mongoose
  .connect(MONGO_DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log(`Server started on 5000`);
    // Server constantly listening for incoming requests
    app.listen(process.env.PORT || 5000);
  });
