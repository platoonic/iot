/*

  Smart Lighting Project main JS file

*/

// Select DOM elements

// Light 1
const turnOnButton1 = document.querySelector("#turn-on1");
const turnOffButton1 = document.querySelector("#turn-off1");

// Light 2
const turnOnButton2 = document.querySelector("#turn-on2");
const turnOffButton2 = document.querySelector("#turn-off2");

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
  // testing and debugging
  console.log(
    "onMessageArrived:",
    message.destinationName,
    message.payloadString
  );
  /*
  
    Respond to different events emitted by Arduino

  */

  // Light 01 status
  if (message.destinationName === "/LIGHT/01/STATUS") {
    if (message.payloadString === "ON") {
      // Turn on
      turnOnLight(1);
    } else {
      // Turn off
      turnOffLight(1);
    }
  }

  // Light 02 status
  if (message.destinationName === "/LIGHT/02/STATUS") {
    if (message.payloadString === "ON") {
      // Turn on
      turnOnLight(2);
    } else {
      // Turn off
      turnOffLight(2);
    }
  }
}

/*
 *
 * Utility functions
 *
 */

function turnOnLight(number) {
  const offBadge = document.querySelector(`off${number}`);
  const onBadge = document.querySelector(`on${number}`);
  // Hide Off badge
  offBadge.style.display = "none";
  // Show on badge
  onBadge.style.display = "block";
}

function turnOffLight(number, state) {
  const offBadge = document.querySelector(`off${number}`);
  const onBadge = document.querySelector(`on${number}`);
  // Hide On badge
  onBadge.style.display = "none";
  // Show Off badge
  offBadge.style.display = "block";
}

/*
 *
 * Buttons Event Handlers
 *
 */

/*

  Light 1

*/

// Turn off
turnOffButton1.addEventListener("click", function () {
  // Hide Turn Off button and show Turn On
  turnOffButton1.style.display = "none";
  turnOnButton1.style.display = "block";
  message = new Paho.Message("OFF");
  message.destinationName = "/LIGHT/01/CONTROL";
  client.send(message);
});

// Turn On
turnOnButton1.addEventListener("click", function () {
  // Hide Turn On button and show Turn Off
  turnOnButton1.style.display = "none";
  turnOffButton1.style.display = "block";
  message = new Paho.Message("ON");
  message.destinationName = "/LIGHT/01/CONTROL";
  client.send(message);
});

/*

  Light 2

*/

// Turn Off
turnOffButton2.addEventListener("click", function () {
  // Hide Turn Off button and show Turn On
  turnOffButton2.style.display = "none";
  turnOnButton2.style.display = "block";
  message = new Paho.Message("OFF");
  message.destinationName = "/LIGHT/02/CONTROL";
  client.send(message);
});

// Turn On
turnOnButton2.addEventListener("click", function () {
  // Hide Turn On button and show Turn Off
  turnOnButton2.style.display = "none";
  turnOffButton2.style.display = "block";
  message = new Paho.Message("ON");
  message.destinationName = "/LIGHT/02/CONTROL";
  client.send(message);
});
