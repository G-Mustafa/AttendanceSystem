const passport = require('passport');
const bcrypt = require('bcryptjs');
const router = require("express").Router();
const User = require("../models/user");
      
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
      return next();
  }
  res.redirect('/');
};

router.get("/",(req, res) => {
  if(req.isAuthenticated()){
    res.redirect("/attendanceBooks");
  }else{
    res.render(process.cwd() + '/views/index', {title:"Attendance System",loggedIn: false,bookpage: false});
  }
});

router.post("/login",passport.authenticate('local', { 
  failureRedirect: "/"
  }),(req,res) => {
    User.findOne({username: req.body.username},(error,foundUser)=>{
      if(error){
        console.log("error: ",error);
      }else{
        res.redirect("/attendanceBooks");
      }
    });
});

router.post("/register",(req, res, next) => {
  const hash = bcrypt.hashSync(req.body.password, 8);
  User.findOne({ username: req.body.username },(err, user)=>{
    if(err) {
      next(err);
    } else if (user) {
      res.redirect('/');
    } else {
      User.create({
        username: req.body.username,
        password: hash,
        email: req.body.email
        },(err, doc) => {
          if(err) {
            res.redirect('/');
          } else {
            next(null, user);
          }
        }
      )
    }
  })},
  passport.authenticate('local', { 
    failureRedirect: '/',
  }),
  (req, res) => {
    res.redirect("/attendanceBooks");
  }
);

router.get("/logout",(req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
