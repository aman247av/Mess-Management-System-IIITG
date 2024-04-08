const dotenv = require('dotenv');
dotenv.config({path: './config.env'});

const app = require('./app');
const mongoose = require("mongoose");
// console.log(process.env);
const port = process.env.PORT || 3000;

mongoose
  .connect(
    "mongodb+srv://" +
      process.env.DB_USER +
      ":" +
      process.env.DB_PASSWORD +
      "@cluster1.vghohbs.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => console.log("Database connected!"));


app.listen(port, () => {
    console.log('server has started at...');
})