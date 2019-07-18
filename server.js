const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcryptjs");
const indexRoutes = require("./routes/index.js");
const User = require("./models/user");
const bookRoutes = require("./routes/Books");
const sheetRoutes = require("./routes/Sheets");
require("dotenv").config();


const app = express();

app.use('/public', express.static(process.cwd() + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine","ejs");

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.MONGO_URI,{useNewUrlParser: true},(error)=>{
    if(error){
        console.log("Database error "+error);
    }else{
        console.log("Database is connected");

        passport.serializeUser((user, done)=>{
            done(null, user.id); 
        });
        passport.deserializeUser((id, done)=>{
            User.findById(id,(err, user)=>{
                done(err, user);
            });
        });

        passport.use(new LocalStrategy(
            (username, password, done)=>{
                User.findOne({ username: username },(err, user)=>{
                    console.log('User '+ username +' attempted to log in.');
                    if (err) { return done(err); }
                    if (!user) { return done(null, false); }
                    if (!bcrypt.compareSync(password, user.password)) { return done(null, false); }
                return done(null, user);
              });
            }
        ));
        
        app.use("/",indexRoutes);
        app.use("/attendanceBooks",bookRoutes);
        app.use("/attendanceBooks/:id/sheets",sheetRoutes);

        app.use((req, res, next) => {
            res.status(404)
            .type('text')
            .send('Not Found');
        });

        app.listen(process.env.PORT || 3000,()=>{
            console.log("app has started");
        });
    }
});