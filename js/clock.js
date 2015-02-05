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

   /* Set up options for "mins" select tag */
   var hrSelect = $("#hours");
   for (i = 1; i <= 12; i++) {
      //var hr = (i < 10) ? ("0" + i) : i;
      $("<option>" + i + "</option>").appendTo(hrSelect);
   }

   /* Set up options for "mins" select tag */
   var minSelect = $("#mins");
   for (i = 0; i < 10; i++) {
      $("<option>0" + i + "</option>").appendTo(minSelect);
   }
   for (i = 10; i <= 59; i++) {
      $("<option>" + i + "</option>").appendTo(minSelect);
   }
};

/*--- Alarm functions ---*/

function showAlarmPopup() {
   $("#mask").removeClass("hide");
   $("#popup").removeClass("hide");
}

function hideAlarmPopup() {
   $("#mask").addClass("hide");
   $("#popup").addClass("hide");
}

/**
* Creates text for a saved alarm and appends it to the "alarms" div
*/
function insertAlarm(hours, mins, ampm, alarmName) {
   var container = $("<div>");
   container.addClass(".flexable");

   var name = $("<div>");
   name.addClass("name");
   name.html(alarmName);
   name.appendTo(container);

   var time = $("<div>");
   time.addClass("time");
   var timeVal = hours + ":" + mins + " " + ampm;
   time.html(timeVal);
   time.appendTo(container);

   container.appendTo("#alarms");
   $("<br></br>").appendTo("#alarms");
}

/**
* Adds an alarm with the selected hour, min, ampm, and name
*/
function addAlarm() {
   var hours = $("#hours option:selected").text();
   var mins = $("#mins option:selected").text();
   var ampm = $("#ampm option:selected").text();
   var alarmName = $("#alarmName").val();

   insertAlarm(hours, mins, ampm, alarmName);
   hideAlarmPopup();
}