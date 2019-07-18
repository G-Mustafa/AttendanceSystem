const router = require("express").Router();
const Book = require("../models/attendanceBook");
const User = require("../models/user");
const Attendee = require("../models/attendee");

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
};

router.get("/",ensureAuthenticated,(req,res)=>{
    User.findById(req.user._id).populate("attendanceBooks").exec((error,foundUser)=>{
        if(error){
            console.log(error);
        }else{
            res.render(process.cwd()+"/views/showBooks",{title:"Attendance Books",loggedIn: true,user: foundUser,bookpage: true});
        }
    });
});

router.post("/",ensureAuthenticated,(req,res)=>{
    User.findById(req.user._id,(error,foundUser)=>{
        if(error){
            console.log(error);
        } else {
            Book.create({
                title: req.body.title,
                description: req.body.description,
                session: req.body.session,
                noOfAttendees: req.body.noOfAttendees            
            },(error,book)=>{
                if(error){
                    console.log(error);
                }else{
                    let attendees = [];
                    if(typeof req.body.allAttendees === "object"){
                        for(let i=0;i<req.body.allAttendees.length;i++){
                            attendees.push({name: req.body.allAttendees[i]});
                        }
                    }else if(typeof req.body.allAttendees === "string"){
                        attendees = {name: req.body.allAttendees};
                    }
                    Attendee.insertMany(attendees,(error,docs)=>{
                        book.allAttendees.push(...docs);
                        book.save();
                        foundUser.attendanceBooks.push(book);
                        foundUser.save();
                        res.redirect("/attendanceBooks");
                    }); 
                }
            });
        }
    });
});

router.get("/:id",ensureAuthenticated,(req,res)=>{
    Book.findById(req.params.id).populate("allAttendees").exec((error,foundBook)=>{
        if(error){
            console.log(error);
        }else{
            let attendanceInform = [];
            let present = 0;
            let lastHoliday = "";
            foundBook.allAttendees.forEach((item)=>{
                for(let i=0;i<item.attendance.length;i++){
                    if(item.attendance[i].isPresent){
                        present++;
                    }else{
                        lastHoliday = item.attendance[i].date;
                    }
                }
                attendanceInform.push([item.name,present,item.attendance.length,lastHoliday]);
                present = 0;
                lastHoliday = "";
            });
            res.render(process.cwd()+"/views/showBookData",{title: "Book Data",loggedIn: true,book: foundBook,inform: attendanceInform,bookpage: true});
        }
    });
});


module.exports = router;