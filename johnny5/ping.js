var five = require("johnny-five");
var board = new five.Board();

board.on("ready", function() {

  // Create a new `ping` hardware inst
  var pingL = new five.Ping(11);
  var pingM = new five.Ping(12);
  var pingR = new five.Ping(13);
  console.log("started");

  // Properties

  // ping.in/ping.inches
  //
  // Calculated distance to object in inches
  //

  // ping.cm
  //
  // Calculated distance to object in centimeters
  //

  pingL.on("change", function() {
    console.log("Left object is " + this.cm + "cm away");
  });
  pingM.on("change", function() {
    console.log("Center object is " + this.cm + "cm away");
  });
  pingR.on("change", function() {
    console.log("Right object is " + this.cm + "cm away");
  });
});