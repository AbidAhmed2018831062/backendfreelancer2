const cookieSession = require("cookie-session");
const express = require("express");
const { InworldClient } =require("@inworld/nodejs-sdk");

const cors = require("cors");
const mongoose=require("mongoose");
const passportSetup = require("./passport");
const passport = require("passport");
const authRoute = require("./routes/auth");
const messageRoute = require("./routes/message");
const StripeRoute = require("./routes/stripe");
const PlanRoute = require("./routes/plans");
const ProfileRoute = require("./routes/profile");
const AdminRoute = require("./routes/admin");
var bodyParser = require('body-parser')

require('dotenv').config();

mongoose.set("strictQuery", false);

// Define the database URL to connect to.
const mongoDB = `mongodb+srv://keyesiamrasekataihoyegesibeka:<${process.env.MONGODB_PASSWORD}>@confess.wwk6tpq.mongodb.net/?retryWrites=true&w=majority`;

// Wait for database to connect, logging an error if there is a problem
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}
const app = express();
var jsonParser = bodyParser.json()
 
// create application/x-www-form-urlencoded parser
app.use(express.urlencoded({extended:false}));
app.use(express.json());

 
app.use(
  cookieSession({ name: "session", keys: ["lama"], maxAge: 24 * 60 * 60 * 100 })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

app.use("/auth", authRoute);
app.use("/message", messageRoute);
app.use("/payment", StripeRoute);
app.use("/plans", PlanRoute);
app.use("/profile", ProfileRoute);
app.use("/admin", AdminRoute);
app.get("/chat", async (_, res) => {
    const token = await client.generateSessionToken()
  
    res.setHeader("Content-Type", "application/json")
    res.end(JSON.stringify(token))
  })
app.listen("5000", () => {
  console.log("Server is running!");
});