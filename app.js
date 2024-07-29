if(process.env.NODE_ENV != "production") {
    require('dotenv').config();
    console.log("Linked with Cloud")
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");



const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const PORT = process.env.PORT || 8080;

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL;
main()
   .then(() => {
      console.log("connected to db");
   })
   .catch((err) => {
      console.log(err);
   });

async function main(){
    await mongoose.connect(dbUrl);
}

app.set("views engine", "ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", () => {
    console.log("Session Store Error", err);
});

const sessionOptions = {
    store,
    secret:process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    },
};



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//Middleware for Flash
app.use((req, res, next) => {
    let success = res.locals.success = req.flash("success");
    let error = res.locals.error = req.flash("error");
    let currUser = res.locals.currUser = req.user;  
    next();
});

//Routes
app.get("/", (req, res) => {
    res.render("./listings/index.ejs");
});

app.use("/listings", listingRouter);
app.use("/", reviewRouter);
app.use("/", userRouter);



//Error Handling Middlewares
app.all("*",(err, req, res, next) =>{
    next(new ExpressError( 404, "Page Not Found!!!"));
    console.log(error);
});

app.use((err, req, res, next) => {
    let {status=500, message="Something went wrong"} = err;
    res.status(status).render("error.ejs", {err});
    // res.status(status).send(message);
});

app.listen(8080, () => {
    console.log("server is listening to port:8080");
});
