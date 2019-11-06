// Initialize Firebase
var index = 0;


  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyD4ontDwOITKT0ywET-3wFhRddTjnXQC70",
    authDomain: "train-schedule-82269.firebaseapp.com",
    databaseURL: "https://train-schedule-82269.firebaseio.com",
    projectId: "train-schedule-82269",
    storageBucket: "train-schedule-82269.appspot.com",
    messagingSenderId: "560140196944",
    appId: "1:560140196944:web:6445ca84b108d923358555"
  };

  firebase.initializeApp(firebaseConfig);




var database = firebase.database();

$("#formID").on("submit", function (event) {
    event.preventDefault();

    var name = $("#provider").val().trim();
    var destination = $("#trainDestination").val().trim();
    var firstDeparture= $("#firstDeparture").val().trim();
    var frequency = $("#frequency").val().trim();

    database.ref().push({
      name: name,
      destination: destination,
      firstDeparture: firstDeparture,
      frequency: frequency
    });

    $("#provider").val("");
    $("#trainDestination").val("");
    $("#firstDeparture").val("");
    $("#frequency").val("");

    return false;
  });

database.ref().orderByChild("dateAdded").on("child_added", function (childSnapshot) {

  var updateButton = $("<button>").html("<span class='glyphicon glyphicon-edit'></span>").addClass("updateButton").attr("data-index", index).attr("data-key", childSnapshot.key);
  var removeButton = $("<button>").html("<span class='glyphicon glyphicon-remove'></span>").addClass("removeButton").attr("data-index", index).attr("data-key", childSnapshot.key);

  var firstTime = childSnapshot.val().firstTime;
  var tFrequency = parseInt(childSnapshot.val().frequency);
  var firstDeparture = moment(firstTime, "HH:mm").subtract(1, "years");
  console.log(firstDeparture);
  console.log(firstTime);
  var currentTime = moment();
  var currentTimeCalc = moment().subtract(1, "years");
  var diffTime = moment().diff(moment(firstDeparture), "minutes");
  var tRemainder = diffTime%tFrequency;
  var minutesRemaining = tFrequency - tRemainder;
  var nextTRain = moment().add(minutesRemaining, "minutes").format ("hh:mm A");
  var beforeCalc = moment(firstDeparture).diff(currentTimeCalc, "minutes");
  var beforeMinutes = Math.ceil(moment.duration(beforeCalc).asMinutes());

  if ((currentTimeCalc - firstDeparture) < 0) {
    nextTrain = childSnapshot.val().firstTime;
    console.log("Before First Train");
    minutesRemaining = beforeMinutes;
  }
  else {
    nextTrain = moment().add(minutesRemaining, "minutes").format("hh:mm A");
    minutesRemaining = tFrequency - tRemainder;
    console.log("Working");
  }


  var newRow = $("<tr>");
  newRow.addClass("row-" + index);
  var cell1 = $("<td>").append(updateButton);
  var cell2 = $("<td>").text(childSnapshot.val().name);
  var cell3 = $("<td>").text(childSnapshot.val().destination);
  var cell4 = $("<td>").text(childSnapshot.val().frequency);
  var cell5 = $("<td>").text(nextTrain);
  var cell6 = $("<td>").text(minutesRemaining);
  var cell7 = $("<td>").append(removeButton);

  newRow
    .append(cell1)
    .append(cell2)
    .append(cell3)
    .append(cell4)
    .append(cell5)
    .append(cell6)
    .append(cell7);

 $("#tableContent").append(newRow);

 index++;
  
}, function (error) {

  alert(error.code);

});

function removeRow () {
  $(".row-" + $(this).attr("data-index")).remove();
  database.ref().child($(this).attr("data-key")).remove();
};

function editRow () {
  $(".row-" + $(this).attr("data-index")).children().eq(1).html("<textarea class='newName'></textarea>");
  $(".row-" + $(this).attr("data-index")).children().eq(2).html("<textarea class='newDestination'></textarea>");
  $(".row-" + $(this).attr("data-index")).children().eq(3).html("<textarea class='newFrequency' type='number'></textarea>");
  $(this).toggleClass("updateButton").toggleClass("submitButton");
};

function submitRow () {
  var newName = $(".newName").val().trim();
  var newDestination = $(".newDestination").val().trim();
  var newFrequency = $(".newFrequency").val().trim();

  database.ref().child($(this).attr("data-key")).child("name").set(newName);
  database.ref().child($(this).attr("data-key")).child("destination").set(newDestination);
  database.ref().child($(this).attr("data-key")).child("frequency").set(newFrequency);

  $(".row-" + $(this).attr("data-index")).children().eq(1).html(newName);
  $(".row-" + $(this).attr("data-index")).children().eq(2).html(newDestination);
  $(".row-" + $(this).attr("data-index")).children().eq(3).html(newFrequency);
  $(this).toggleClass("updateButton").toggleClass("submitButton");
};

$(document).on("click", ".removeButton", removeRow);
$(document).on("click", ".updateButton", editRow);
$(document).on("click", ".submitButton", submitRow);