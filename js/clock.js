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

function getTemp() {
   /* AJAX request to forecast.io url */
   $.getJSON("https://api.forecast.io/forecast/c7a60cf9130a63d5272931b9ea476aac/35.300399,-120.662362?callback=?", 
   function(json) {
      // Set forecast label to the daily summary
      $("#forecastLabel").html(json.daily.summary);

      // Set the icon based on the daily icon field
      var imageSrc = "img/" + json.daily.icon + ".png";
      $("#forecastIcon").attr("src", imageSrc);

      // Set background color according to temperature
      var curTemp = json.daily.data[0].temperatureMax;
      var colorClass;
      if (curTemp < 60) {
         colorClass = "cold";
      }
      else if (curTemp < 70) {
         colorClass = "chilly";
      }
      else if (curTemp < 80) {
         colorClass = "nice";
      }
      else if (curTemp < 90) {
         colorClass = "warm";
      }
      else if (curTemp >= 90) {
         colorClass = "hot";
      }
      $("body").addClass(colorClass);
   });
}

/* call getTime on page load */
window.onload = function() {
   getTime();
   getTemp();
};