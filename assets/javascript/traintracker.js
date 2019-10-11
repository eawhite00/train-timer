// Set up firebase config
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
  
    // Store everything into appropriate variables
    var trainName = childSnapshot.val().name;
    var trainDestination = childSnapshot.val().destination;
    var trainFirstTime = moment(childSnapshot.val().time, "X");
    var trainFrequency = childSnapshot.val().frequency;
    var nextTrainTime = moment(); // default to the current time
    var minutesAway = '0' // initiaulized at zero

    // Below we calculate when the next train is coming

    // First we get the number of minutes between now and when the first train of the day is scheduled
    var trainTimeDifference = moment().diff(trainFirstTime, "minutes");
    
    // If trainTimeDifference is positive it means the first train has already come, and we need to calcuate the next one with the train frequency.
    if (trainTimeDifference > 0){

        // Here we get the number of minutes to the next train
        minutesAway = trainFrequency - (trainTimeDifference % trainFrequency);

        // Add that number of minutes to the current time
        nextTrainTime.add(minutesAway, "minutes");

    } else{

        //If we're in here, it means the train hasn't come for the first time yet. We just set the next train to be its first time.
        nextTrainTime = trainFirstTime;

        //We've already calcucated the minutes to the next train, but we need to flip it to positive because of how the diff is oreitned.
        minutesAway = (trainTimeDifference * -1) + 1; // one extra because the difference cuts off a minute because it doesn't round seconds
    }
  
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