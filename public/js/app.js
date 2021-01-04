/*

  Smart Lighting Project main JS file

*/

// Select DOM elements
const turnOnButton = document.querySelector("#turn-on");
const turnOffButton = document.querySelector("#turn-off");
const onStatus = document.querySelector(".on");
const offStatus = document.querySelector(".off");
const controls = document.querySelector(".controls");
const spinner = document.querySelector(".spinner");

// Create a client instance
const client = new Paho.Client("iotnetworks-mqtt.herokuapp.com", 80, "clienId");

// set callback handlers
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;

// connect the client
client.connect({ onSuccess: onConnect });

// called when the client connects
function onConnect() {
  // Once a connection has been made, make a subscription and send a message.
  console.log("Connected");
  // Hide Spinner
  spinner.style.display = "none";
  // Show the panel
  controls.style.display = "block";
  client.subscribe("/LED/CONTROL");
}

// called when the client loses its connection
function onConnectionLost(responseObject) {
  console.log("lost connection");
  if (responseObject.errorCode !== 0) {
    console.log("onConnectionLost:" + responseObject.errorMessage);
  }
}

// called when a message arrives
function onMessageArrived(message) {
  console.log(
    "onMessageArrived:",
    message.destinationName,
    message.payloadString
  );
}

// Buttons event handlers
turnOffButton.addEventListener("click", function () {
  // Hide Turn Off button and show Turn On
  turnOffButton.style.display = "none";
  turnOnButton.style.display = "block";
  message = new Paho.Message("OFF");
  message.destinationName = "/LED/CONTROL";
  client.send(message);
});

turnOnButton.addEventListener("click", function () {
  // Hide Turn On button and show Turn Off
  turnOnButton.style.display = "none";
  turnOffButton.style.display = "block";
  message = new Paho.Message("ON");
  message.destinationName = "/LED/CONTROL";
  client.send(message);
});
