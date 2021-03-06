/**
* author: Calvin Wong
* version: 2-5-15
*/

// Global variable for userid--how to avoid using this to add alarm?
// Save user id to a hidden HTML element and retrieve from there?
var myId = ""; 

// Initialize Parse with assigned app key
Parse.initialize("TLcCgRXGM1U5N0ACN5TQyEMkWjYPyKOIr176hRhD",
  "kkkDh7A0oGdHHYXFDveRQwXbGp9VGaLI6kYbstoO");

/* updates the dynamic time of the clock every second */
function getTime() {
   var d = new Date();
   var hour = d.getHours();
   var timeOfDay = (hour < 12) ? "AM" : "PM";
   hour = (hour > 12) ? hour - 12 : hour; 
   var minute = d.getMinutes();
   minute = (minute < 10) ? "0" + minute : minute;
   var seconds = parseInt(d.getSeconds());
   seconds = seconds < 10 ? "0" + seconds : seconds;
   var dynamicTimeClock = document.getElementById("dynamictime");

   var textTime = hour + ":" + minute + ":" + seconds + " " + timeOfDay;
   dynamicTimeClock.innerHTML = textTime;

   // Alert user when any alarm time is reached
   var shortTime = hour + ":" + minute + " " + timeOfDay;
   $(".alarmTime").each(function(index) {
      // For each alarm time, if time has been reached, alert and delete alarm
      if (seconds == "00" && shortTime == $(this).html()) {
         alert("Alarm time reached: " + shortTime);
         //deleteAlarm(null, shortTime);
      }
   });

   setTimeout(getTime, 1000); /* call every second */
}

function getTemp() {
   var def = $.Deferred(); // Create Deferred object before loading tasks

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

   setTimeout(function() { // After specified time, resolve func and move on
      def.resolve();
   }, 500);
   return def; // vs return $.Deferred().resolve(), which is too fast for this
}

/* callback function for Lab 9, makes get request and passes header along */
var callback = function(){
    token = localStorage.getItem("token");
    $.ajax({
        url: 'https://api.imgur.com/3/account/me',
        type: 'GET',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        },
        success: function(result) {
            alert('So I heard you like Mudkip, ' + result.data.url);
            console.log('So I heard you like Mudkip');
            console.log(result);
        }
    });
}

/* call getTime on page load */
window.onload = function() {
   getTime();
   getTemp().done(showHtml); // After getTemp's deferred obj resolves, show page

   initSelectTime();             // Initialize hr, min, ampm options

   // JSON Object to store data from
   var jsonObj = {"client_id":"fbe2ec80131b55b", 
                  "type":"token", 
                  "callback_function":"callback" };
   init(jsonObj);
};

/* Show the HTML page (for after page elements are loaded) */
function showHtml() {
   $("html").removeClass("hide");
}

/*--- Alarm functions ---*/

/**
*  Initializes hr, min, and ampm options for selecting alarm time
*/
function initSelectTime() {
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
}

function showAlarmPopup() {
   $("#mask").removeClass("hide");
   $("#popup").removeClass("hide");
}

function hideAlarmPopup() {
   $("#mask").addClass("hide");
   $("#popup").addClass("hide");
}


/**
* Adds an alarm with the selected hour, min, ampm, and name
* to the Parse DB, and to the #alarms div
*/
function addAlarm() {
   var hours = $("#hours option:selected").text();
   var mins = $("#mins option:selected").text();
   var ampm = $("#ampm option:selected").text();
   var alarmName = $("#alarmName").val();
   var time = hours + ":" + mins + " " + ampm;

   ga('send', 'event', 'Alarm', 'Add'); // Send event to Google Analytics

   // Insertion of new Alarm object into Parse DB
   var AlarmObject = Parse.Object.extend("Alarm");
   var alarmObject = new AlarmObject();
   alarmObject.save({"time":time, "alarmName":alarmName, "userid":myId}, {
      success: function(object) {
         if ($("#alarms").html() == "No Alarms Set") {
            clearAlarmDisplay();       // Clear default msg if no prev alarms
         }

         insertAlarm(time, alarmName); // Insert alarm into #alarms div
         hideAlarmPopup();
      }
   });
}

/**
* Inserts a new alarm in the #alarms div, accepting only a time and alarm name
*/
function insertAlarm(timeVal, alarmName) {
   var container = $("<div>");
   container.addClass(".flexable");

   var name = $("<div>");
   name.addClass("floatLeft");   // Keep alarmName floating on left
   name.html(alarmName);
   name.appendTo(container);

   var time = $("<div>");      // Keep time floating on right
   time.addClass("floatRight");
   time.addClass("alarmTime"); // For checking if time has been reached
   time.html(timeVal);
   time.insertAfter(name);

   name.appendTo(container);     // Put name and time into a container div
   time.appendTo(container);

   // Create a delete button for this alarm
   var delButton = $("<input type=\"button\" value=\"Delete\">");
   delButton.addClass("floatRight");
   delButton.click(function() {
      deleteAlarm(alarmName, timeVal);
   });

   delButton.appendTo("#alarms");   // Float delete button to the right

   var spacer = $("<div>&nbsp&nbsp&nbsp</div>"); // Float spacer to the right
   spacer.addClass("floatRight");
   spacer.appendTo("#alarms");

   container.appendTo("#alarms");   // Float name/time container to the left

   $("<br></br>").insertAfter(container); // Append a newline at end
   $("<br></br>").insertAfter(container); // Append a newline at end
}


/**
* Delete an alarm from the Parse DB and updates the #alarms div.
* If alarmName is null, then the first result with the given timeVal
* will be deleted.
*/
function deleteAlarm(alarmName, timeVal) {
   var Alarm = Parse.Object.extend("Alarm");
   var query = new Parse.Query(Alarm);

   ga('send', 'event', 'Alarm', 'Delete'); // Send event to Google Analytics

   if (alarmName != null) {
      query.equalTo("alarmName", alarmName);  // Result must have given alarmName
   }
   query.equalTo("time", timeVal);         // Result must have given time

   query.find({
     success: function(results) {
       var alarmToDelete = results[0];

       alarmToDelete.destroy({              // Delete the found Alarm object
         success: function(alarmToDelete) {
            getAllAlarms();                 // Update list of alarms
         },
         error: function(alarmToDelete, error) {
            alert("Error while deleting alarm: " + error);
         }
       });
     },
     error: function(error) {
       alert("Error while finding alarm to delete: " + error);
     }
   });   
}

/**
* Initializes connection to Parse DB and populates #alarms div with alarms
*/
function getAllAlarms(userid) {
   clearAlarmDisplay();

   // Parse DB query to get all alarms
   var AlarmObject = Parse.Object.extend("Alarm");
   var query = new Parse.Query(AlarmObject);
   query.equalTo('userid', userid);

   query.find({
      success: function(results) {
         if (results.length == 0) {           // If no alarms set
            $("#alarms").html("No Alarms Set");
         }
         for (var i = 0; i < results.length; i++) { 
            insertAlarm(results[i].get("time"), results[i].get("alarmName"));
         }
      }
   });
}

function clearAlarmDisplay() {
   // Clear all displayed alarms so that updated alarms can be displayed
   $("#alarms").html("");
}

/**
*  Recurring function to check if given alarm time has been met
*/
function listenForTime(time) {
   var timeSplit = time.split(" ");           // Split time into hr:min, ampm

   var currentTime = $("#dynamictime").html();// Split into hr:min:sec, ampm
   var curTimeSplit = currentTime.split(" ");

   var reachedTime = curTimeSplit[0].indexOf(timeSplit[0]) > -1
                     && curTimeSplit[1] == timeSplit[1] > -1;

   if (reachedTime) {
      alert("*RING RING RING* It's " + time + "!");
      return;
   }

   setTimeout(listenForTime(time), 1000);     // Check every second
}


// This is called with the results from from FB.getLoginStatus().
function statusChangeCallback(response) {
 console.log('statusChangeCallback');
 console.log(response);
 // The response object is returned with a status field that lets the
 // app know the current login status of the person.
 if (response.status === 'connected') {
   // Logged into your app and Facebook.
   testAPI();
 } else if (response.status === 'not_authorized') {
   // The person is logged into Facebook, but not your app.
   document.getElementById('status').innerHTML = 'Please log ' +
     'into this app.';
 } else {
   // The person is not logged into Facebook, so we're not sure if
   // they are logged into this app or not.
   document.getElementById('status').innerHTML = 'Please log ' +
     'into Facebook.';
 }
}

// Get user's login status, and handle it through appropriate callback
// 1. Logged into your app ('connected')
// 2. Logged into Facebook, but not your app ('not_authorized')
// 3. Not logged into Facebook and can't tell if they are logged into
//    your app or not.
function checkLoginState() {
 FB.getLoginStatus(function(response) {
   statusChangeCallback(response);
 });
}

window.fbAsyncInit = function() {
  FB.init({
    appId      : '352874954912281',
    cookie     : true,  // enable cookies to allow the server to access 
                        // the session
    xfbml      : true,  // parse social plugins on this page
    version    : 'v2.1' // use version 2.1
  });

  checkLoginState();
};

// Load the SDK asynchronously
(function(d, s, id) {
 var js, fjs = d.getElementsByTagName(s)[0];
 if (d.getElementById(id)) return;
 js = d.createElement(s); js.id = id;
 js.src = "//connect.facebook.net/en_US/sdk.js";
 fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

// Here we run a very simple test of the Graph API after login is
// successful.  See statusChangeCallback() for when this call is made.
function testAPI() {
 console.log('Welcome!  Fetching your information.... ');
 FB.api('/me', function(response) {
   console.log('Successful login for: ' + response.name);
   myId = response.name; // For usage in addAlarm()

   document.getElementById('status').innerHTML =
     response.name + '\'s alarms:';
   getAllAlarms(response.name);
 });
}