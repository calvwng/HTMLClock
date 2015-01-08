/* updates the dynamic time of the clock every second */
function getTime() {
   var d = new Date();
   var hour = d.getHours();
   var timeOfDay = hour < 12 ? "AM" : "PM";
   var minute = d.getMinutes();
   var seconds = parseInt(d.getSeconds());
   seconds = seconds < 10 ? "0" + seconds : seconds;
   var dynamicTimeClock = document.getElementById("dynamictime");
   var textTime = hour + ":" + minute + ":" + seconds + " " + timeOfDay;
   dynamicTimeClock.innerHTML = textTime;
   setTimeout(getTime, 1000); /* call every second */
}

/* call getTime on page load */
window.onload = function() {
   getTime();
};