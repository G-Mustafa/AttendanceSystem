document.addEventListener("DOMContentLoaded",()=>{
    // Get the modal
    const modal = document.getElementById('id01');

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    let input = document.getElementById('total');
    input.oninput = handleInput;
    function handleInput(e) {
        let attendees = e.target.value;
        let htmlcon = "";
        for(let i=1;i<=attendees;i++){
            htmlcon += "<div><input class='form-control' type='text' name='allAttendees' placeholder='Attendee No."+i+"'></div>";
        }
        document.getElementById("attendee-names").innerHTML = htmlcon;
    }
});