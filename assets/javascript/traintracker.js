
// Firebase config
var firebaseConfig = {
    apiKey: "AIzaSyBxfjuizISPOgQGFn1mvugHNiROE6XH7Cc",
    authDomain: "train-timer-a8487.firebaseapp.com",
    databaseURL: "https://train-timer-a8487.firebaseio.com",
    projectId: "train-timer-a8487",
    storageBucket: "train-timer-a8487.appspot.com",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var database = firebase.database();

// Button handler for adding a new train
$("#addTrainButton").on("click", function(event) {
  event.preventDefault();

  // Grabs user input
  var trainName = $("#trainNameInput").val().trim();
  var trainDestination = $("#destinationInput").val().trim();
  var trainTime = moment($("#timeInput").val().trim(), "HH:mm").format("X");
  var trainFrequency = $("#frequencyInput").val().trim();

  // Creates local "temporary" object for holding employee data
  var newTrain = {
    name: trainName,
    destination: trainDestination,
    time: trainTime,
    frequency: trainFrequency
  };

  // Uploads employee data to the database
  database.ref().push(newTrain);

  // Log everything to console
  console.log(newTrain.name);
  console.log(newTrain.destination);
  console.log(newTrain.time);
  console.log(newTrain.frequency);


  // Clears all of the text-boxes
  $("#trainNameInput").val("");
  $("#destinationInput").val("");
  $("#timeInput").val("");
  $("#frequencyInput").val("");
});


database.ref().on("child_added", function(childSnapshot) {
    console.log(childSnapshot.val());
  
    // Store everything into a variable.
    var trainName = childSnapshot.val().name;
    var trainDestination = childSnapshot.val().destination;
    var trainFirstTime = moment(childSnapshot.val().time, "X");
    var trainFrequency = childSnapshot.val().frequency;
    var nextTrainTime = moment();
  
    // Employee Info
    console.log(trainName);
    console.log(trainDestination);
    console.log(trainFirstTime);
    console.log(trainFrequency);
  

    // Calculate next train time
    var minutesAway = '0'

    //var empMonths = moment().diff(moment(empStart, "X"), "months");   
    var trainTimeDifference = moment().diff(trainFirstTime, "minutes");
    console.log(trainTimeDifference); 

    if (trainTimeDifference > 0){
        minutesAway = trainFrequency - (trainTimeDifference % trainFrequency);
        nextTrainTime.add(minutesAway, "minutes");
    } else{
        nextTrainTime = trainFirstTime;
        minutesAway = (trainTimeDifference * -1) + 1;
    }

    // Calculate minutes to next train
  
    // Create the new row
    var newRow = $("<tr>").append(
      $("<td>").text(trainName),
      $("<td>").text(trainDestination), 
      $("<td>").text(trainFrequency),
      $("<td>").text(nextTrainTime.format("hh:mm a")),
      $("<td>").text(minutesAway),
    );
  
    // Append the new row to the table
    $("#trainTable > tbody").append(newRow);
  });