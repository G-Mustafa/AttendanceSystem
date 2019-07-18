const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
    title: String,
    description: String,
    session: String,
    noOfAttendees: Number,
    allAttendees: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Attendee"
        }
    ],
    attendanceSheets: [String]
});

module.exports = mongoose.model("Book", BookSchema);