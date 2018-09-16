var config = {
    apiKey: "AIzaSyBIhe6Rkp-YxL6yTSeuLf8-hzBbHfYfFRM",
    authDomain: "train-scheduler-got.firebaseapp.com",
    databaseURL: "https://train-scheduler-got.firebaseio.com",
    projectId: "train-scheduler-got",
    storageBucket: "",
    messagingSenderId: "858231151122"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

  

  var currentDistance = 0;
  var locationName = "";
  var map = $("#myimage");

  map.on("click", function(e) {
    console.log(e);
  //get x and x coordinates of the click event
  e = e || window.event;
  var x = e.pageX;
  var y = e.pageY;
  currentDistance = getDistance(x, y);
  console.log("this is currentdistance: " + currentDistance);
  $("#current-distance").val(currentDistance);
});
    
  $("#add-raven").on("click", addRaven);

  //Functions
  //////////////////////////////////////////////////////////////

  function addRaven() {
    event.preventDefault();
   

    var destination = $("#destination").val().trim();
    var departureTime = $("#times").val().trim();
    console.log("new departure time for this raven: " + departureTime);
    var distance = $("#current-distance").val().trim();
    
    var newRaven = {
        destination: destination,
        leaves: departureTime,
        distance: distance,
    }; 

    database.ref().push(newRaven);

    $("#destination").val("");
   
    $("#current-distance").val("");

  }; //end addRaven

  database.ref().on("child_added", function(snap) {

    var destination = snap.val().destination;
    var departureTime = snap.val().leaves;
    var distance = snap.val().distance;

    var relation = $("#times").attr("data");
  console.log("relation = " + relation);

    var time = moment(departureTime, "HH:mm");
    console.log("trip leaves at: " + time);
    console.log("trip leaves at: " + moment(time, "X").format("MMM DD HH:mm"));
    console.log("trip leaves at: " + moment(time, "X").format("HH:mm"));

    var nextTime = departureHour(time);
    console.log("nextTime = " + nextTime);
    console.log("nextTime = " + moment(nextTime, "X").format("MMM DD HH:mm"));
    console.log("nextTime = " + moment().add(nextTime, "hours").format("d HH:mm"));
    
    var flightTime = Math.round((parseInt(distance) / 50) * 60 ) * 60000; //in milliseconds
    console.log("flight time " + flightTime);

    estimatedArrival = moment(flightTime + nextTime).format("MMM D HH:mm");
    console.log("sum of flightTime and nextTime = " + moment(flightTime + nextTime));
    console.log("sum of flightTime and nextTime = " + moment(flightTime + nextTime).format("MMM DD HH:mm"));
    console.log("estimated arrival = " + estimatedArrival);

    function spread() { return ((Math.floor((Math.random() * 12)+ 1) + 24) * 60 ) * 60000};
    console.log("spread = " + spread);

    var deliveryTime = flightTime + nextTime + spread();
    console.log("deliveryTime = " + deliveryTime);

    var messageDeliveryTime = moment(deliveryTime).format("MMM DD HH:mm");
    console.log("message delivery time: " + messageDeliveryTime);

    var returnDeliveryTime = deliveryTime + spread() + flightTime;
    console.log("The total time until the message returns in milliseconds " + returnDeliveryTime);

    var returnMessageTime = moment(returnDeliveryTime).format("MMM DD HH:mm");
    console.log("Return message time: " + returnMessageTime);

    var totalTimeLeft = Math.abs(returnDeliveryTime - moment());
    console.log("totalTimeLeft: " + totalTimeLeft);
    console.log("totalTimeLeft: " + moment(totalTimeLeft).format("DD HH:mm"));
    console.log("totalTimeLeft: " + moment(totalTimeLeft).format("ddd, h a"));
    console.log("totalTimeLeft: " + moment(returnDeliveryTime).from(moment()));

    var timeLeft = moment(returnDeliveryTime).from(moment());
    console.log("total time of the difference between the return message arrival and now: " + moment().diff(moment(returnDeliveryTime)));
    console.log("total time of the difference between the return message arrival and now: " + moment().diff(moment(returnDeliveryTime)));
    console.log("timeLeft = " + timeLeft)

    var now = moment().format("HH:mm");

    var price = getRevenue(distance);

    $("#time").text("The current time is: " + now);

    var newData = $("<tr>").append(
        $("<td>").text(destination),
        $("<td>").text(distance + " miles"),
        $("<td>").text(price + " gold"),
        $("<td>").text(moment(nextTime, "X").format("MMM DD HH:mm")),
        $("<td>").text(estimatedArrival),
        $("<td>").text(messageDeliveryTime),
        $("<td>").text(returnMessageTime),
        $("<td>").text(timeLeft),
    );

    $("#ravens").append(newData);

  }); //end database child listener

function departureHour(time) {
  if (time - moment() > 0) {
    return time;
  } else {
    return moment(time).add(1, "days")
  }
};  

function getRevenue(distance){
  var priceMile = 0;
  if (distance < 200) {
    priceMile = 3;
  } else if ((distance > 200) && (distance < 1000) ) {
    priceMile = 5;
  } else {priceMile = 8}
  return (Math.round((priceMile * distance) / 1000) * 2)
}; //end getRevenue

function getCost(distance){
  //this is cost assuming on-demand flights. assumes one round trip per day. expressed in gold per day.
  const days = 365 * 2;
  const trainingCostPerDay = distance / days;
  return trainingCostPerDay
}; //end getCost

function getProfit(distance){
  var cost = getCost(distance);
  var revenue = getRevenue(distance);
  return revenue - cost;
}; //end getProfit


  function getDistance(x, y) {
  const oldTownX = 148;
  const oldTownY = 2718;
//calculate distance from Oldtown
  var a = Math.abs(x-oldTownX);
  var b = Math.abs(y-oldTownY);
  var c = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
  const milesPerPixel = 2.3;
  var miles = Math.round(milesPerPixel * c);
  console.log("Miles from oldtown: " + miles);
  return miles
}; //end getDistance


  
  



