//IMPORT PACKAGE
const express = require("express"); // provides a set of tools and features that simplify the process of building web applications and APIs (Routing,Middleware, Req and Resp,Static File Serving)
const app = express();
const morgan = require("morgan"); // logging package
const bodyParser = require("body-parser"); // is to extract this data from the request body, parse it into a usable format, and make it accessible to your application code.
const rateLimit = require("express-rate-limit"); // is a middleware for Express that rate-limits incoming requests to the server
// const helmet = require("helmet"); // is a collection of 14 smaller middleware functions that set HTTP response headers.
const sanitize = require("express-mongo-sanitize"); // is a middleware for Express that sanitizes user-supplied data to prevent MongoDB Operator Injection.
// const xss = require("xss-clean"); // is a middleware for Express that sanitizes user-supplied data to prevent Cross Site Scripting (XSS) attacks.
const cors = require("cors"); // is a middleware for Express that can be used to enable CORS with various options.

const userRoutes = require("./Routes/user");
const menuRoutes = require("./Routes/menu");
const complaintRoutes = require('./Routes/complaint')



//MIDDLEWARES
const logger = function (req, res, next) {
  console.log("Custom middleware called");
  next();
};
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// app.set('view engine', 'ejs');

let limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 1000, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after an hour",
});

app.use("/", limiter);
// app.use(helmet());


// app.use(express.json());
// app.use(express.urlencoded({extended:true, limit:"16kb"}));
// app.use(sanitize());
// app.use(xss());
app.set("view engine", "ejs");
app.use(express.static("public"));


app.use(logger);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); //extract urlencoded data
// app.use(cors());


//USING ROUTES
app.use("/users", userRoutes);
app.use("/menu", menuRoutes);
app.use("/complaints", complaintRoutes);


app.get('/logout', (req, res) => {
  res.clearCookie('jwt'); // Clear the JWT cookie
  res.redirect('/');
});

app.get("/", (req, res) => {
  res.render("register", { anonymous: true });
});


app.get("/showMenu", (req, res) => {
  res.render("showMenu", { anonymous: false });
});


app.get("/users/dashboard", (req, res) => {
  res.render("dashboard", { anonymous: false });
});

app.get("/users/adminDash", (req, res) => {
  res.render("adminDash", { anonymous: false });
});

//Handling errors
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});
  
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
