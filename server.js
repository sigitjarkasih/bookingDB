// import module
const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const path = require("path");

const app = express();
// connection to MongoDB
const connectDB = require("./database/db");

// import router
// Category
const categoryRouter = require("./router/categoryRouter");
// Bank
const bankRouter = require("./router/bankRouter");
// Item
const itemRouter = require("./router/itemRouter");
// Feature
const featureRouter = require("./router/featureRouter");
// Info
const infoRouter = require("./router/infoRouter");
// Customer
const customerRouter = require("./router/customerRouter");
// Boking
const bookingRouter = require("./router/bookingRouter");
// User
const userRouter = require("./router/userRouter")
// Dashboard
const dashboardRouter = require("./router/dashboardRouter")
// PageHome
const homeRouter = require("./router/homeRouter")

// connect to db
connectDB();

// setting cors morgan
app.use(cors());
app.use(logger("dev"));
// setup post JSON
app.use(express.json());
// setup post urlencoded
app.use(express.urlencoded({ extended: false }));

//Cors
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, Authorization, authorization, X-Requested-With, Content-Type, Accept"
  );
  res.header(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
  next();
});

//  setup public url for file
app.use(express.static(path.join(__dirname, "public")));

// url
// Category
app.use("/api/v1/category", categoryRouter);
// Bank
app.use("/api/v1/bank", bankRouter);
// Item
app.use("/api/v1/item", itemRouter);
// Feature
app.use("/api/v1/item/feature", featureRouter);
// Info
app.use("/api/v1/item/info", infoRouter);
// Customer
app.use("/api/v1/customer", customerRouter);
// Booking
app.use("/api/v1/booking", bookingRouter);
// USER
app.use("/api/v1/user", userRouter);
// Dashboard
app.use("/api/v1/dashboard", dashboardRouter);


// HomePage Client
app.use("/api/v1/client-dashboard", homeRouter);


const port = 3000;

// const port = 3001; <----Back End

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server Running at http://localhost:${port}`);
});
