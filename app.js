const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const morgan = require("morgan");
const exphbs = require("express-handlebars");
const path = require("path");
const passport = require("passport");
const session = require("express-session");

//Load Config File
dotenv.config({ path: "./config/config.env" });

//Passport config
require("./config/passport")(passport);

//Connecting to database
connectDB();

const app = express();

//connecting morgan to our app
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//Handlebars
app.engine(".hbs", exphbs({ defaultLayout: "main", extname: ".hbs" }));
app.set("view engine", ".hbs");

//Sessions Middleware
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
  })
);

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//Setting Static Folder
app.use(express.static(path.join(__dirname, "public")));

//Routes
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));

const PORT = process.env.PORT || 5000;
app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
