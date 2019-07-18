const mongoose = require("mongoose");

const AttendeeSchema = new mongoose.Schema({
    name: String,
    attendance: [
        {
            date: String,
            isPresent: Boolean
        }
    ]
});

module.exports = mongoose.model("Attendee", AttendeeSchema);