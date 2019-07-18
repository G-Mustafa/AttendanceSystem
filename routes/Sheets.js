const router = require("express").Router({mergeParams: true});
const Attendee = require("../models/attendee");
const Book = require("../models/attendanceBook");

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
};

router.post("/",ensureAuthenticated,(req,res)=>{
    Book.findById(req.params.id).populate("allAttendees").exec((error,foundBook)=>{
        if(error){
            console.log(error);
        }else{
            const obj ={
                "true": true,
                "false": false
            };
            const date = Date().replace(/\(.+\)/,"");
            const data = req.body;
            foundBook.attendanceSheets.push(date);
            foundBook.save();
            foundBook.allAttendees.forEach((item)=>{
                item.attendance.push({
                    date: date,
                    isPresent: obj[data[item.name]]
                });
                item.save();
            });
            res.redirect("/attendanceBooks/"+req.params.id);
        }
    });
});

router.get("/:date",ensureAuthenticated,(req,res)=>{
    Book.findById(req.params.id).populate("allAttendees").exec((error,foundBook)=>{
        if(error){
            console.log(error);
        }else{
            let attSheet = [];
            foundBook.allAttendees.forEach((item)=>{
                for(let i=0;i<item.attendance.length;i++){
                    if(Date.parse(item.attendance[i].date) === Date.parse(req.params.date)){
                        attSheet.push({name: item.name,isPresent: item.attendance[i].isPresent});
                        break;
                    }
                }
            });
            res.render(process.cwd()+"/views/attendanceSheet",{date: req.params.date,sheet: attSheet,title: "Attendance Sheet",loggedIn: true,bookpage: true});
        }
    });
});

module.exports = router;