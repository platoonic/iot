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
const client = new Paho.Client("142.93.45.107", 8888, "clienId");

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
  client.subscribe("/LED/01/STATUS");
  client.subscribe("/LED/02/STATUS");
  client.subscribe("/LDR");
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
  if (message.destinationName === "/LED/01/STATUS") {
    if (message.payloadString === "ON") {
      // Turn on
      turnOnLight(1);
    } else if (message.payloadString === "OFF") {
      // Turn off
      turnOffLight(1);
    } else {
      lightFault(1);
    }
  }

  // Light 02 status
  if (message.destinationName === "/LED/02/STATUS") {
    if (message.payloadString === "ON") {
      // Turn on
      turnOnLight(2);
    } else if (message.payloadString === "OFF") {
      // Turn off
      turnOffLight(2);
    } else {
      lightFault(2);
    }
  }

  // Environment Status
  if (message.destinationName === "/LDR") {
    const env = document.querySelector(".env");
    if (message.payloadString === "BRIGHT") {
      env.innerText = "Bright";
    } else {
      env.innerText = "Dark";
    }
  }
}

/*
 *
 * Utility functions
 *
 */

function turnOnLight(number) {
  const offBadge = document.querySelector(`.off${number}`);
  const onBadge = document.querySelector(`.on${number}`);
  const faultBadge = document.querySelector(`.fault${number}`);
  // Hide Off badge
  offBadge.style.display = "none";
  faultBadge.style.display = "none";
  // Show on badge
  onBadge.style.display = "block";
}

function turnOffLight(number) {
  const offBadge = document.querySelector(`.off${number}`);
  const onBadge = document.querySelector(`.on${number}`);
  const faultBadge = document.querySelector(`.fault${number}`);
  // Hide On badge
  onBadge.style.display = "none";
  faultBadge.style.display = "none";
  // Show Off badge
  offBadge.style.display = "block";
}

function lightFault(number) {
  const offBadge = document.querySelector(`.off${number}`);
  const onBadge = document.querySelector(`.on${number}`);
  const faultBadge = document.querySelector(`.fault${number}`);
  // Hide everything badge
  onBadge.style.display = "none";
  offBadge.style.display = "none";
  // Show Off badge
  faultBadge.style.display = "block";
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
  let message = new Paho.Message("OFF");
  message.destinationName = "/LED/01/CONTROL";
  client.send(message);

  let message2 = new Paho.Message("TESTING");
  message2.destinationName = "test";
  client.send(message2);
});

// Turn On
turnOnButton1.addEventListener("click", function () {
  // Hide Turn On button and show Turn Off
  turnOnButton1.style.display = "none";
  turnOffButton1.style.display = "block";
  message = new Paho.Message("ON");
  message.destinationName = "/LED/01/CONTROL";
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
  message.destinationName = "/LED/02/CONTROL";
  client.send(message);
});

// Turn On
turnOnButton2.addEventListener("click", function () {
  // Hide Turn On button and show Turn Off
  turnOnButton2.style.display = "none";
  turnOffButton2.style.display = "block";
  message = new Paho.Message("ON");
  message.destinationName = "/LED/02/CONTROL";
  client.send(message);
});
