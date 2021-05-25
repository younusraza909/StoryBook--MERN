const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const morgan = require("morgan");
const exphbs = require("express-handlebars");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");
const methodOverride = require("method-override");

//Load Config File
dotenv.config({ path: "./config/config.env" });

//Passport config
require("./config/passport")(passport);

//Connecting to database
connectDB();

const app = express();

//Body Parses
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//connecting morgan to our app
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//Register Helper function for handlebars
const {
  select,
  editIcon,
  formatDate,
  truncate,
  stripTags,
} = require("./helpers/hbs");
//Handlebars
app.engine(
  ".hbs",
  exphbs({
    helpers: {
      formatDate,
      truncate,
      stripTags,
      editIcon,
      select,
    },
    defaultLayout: "main",
    extname: ".hbs",
  })
);
app.set("view engine", ".hbs");
//Method Override Middleware
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

//Sessions Middleware
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  })
);

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//setting express vairaible
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

//Setting Static Folder
app.use(express.static(path.join(__dirname, "public")));

//Routes
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/stories", require("./routes/stories"));

const PORT = process.env.PORT || 5000;
app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
