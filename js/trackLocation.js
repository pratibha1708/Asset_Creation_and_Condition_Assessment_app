// create an array to store all the location tracking points
var userLocationLayer = [];
// store the ID of the locaiton tracker so that it can be used to switch the location tracking off
var geoLocationID;

//function to track user's location
function trackLocation() {
if (navigator.geolocation) {
geoLocationID = navigator.geolocation.watchPosition(showPosition);

}
else {
document.getElementById('showLocation').innerHTML = "Geolocation is not supported by this browser.";
}
}

function showPosition(position) {

// add the new point into the array
// the 'push' command
document.getElementById('latitude').innerHTML = position.coords.latitude; 
document.getElementById('longitude').innerHTML = position.coords.longitude;
console.log(document.getElementById('latitude').innerHTML);

userLocationLayer.push(L.marker([position.coords.latitude,position.coords.longitude]).addTo(mymap));
 }


function removePositionPoints() {
// disable the location tracking so that a new point won't be added while you are removing the old points
// use the geoLocationID to do this 
navigator.geolocation.clearWatch(geoLocationID);
// now loop through the array and remove any points
// note that we start with the last point first as if you remove point 1 then point 2 becomes point 1 so
// a loop doesn't work
// also we use -1 as arrays in javascript start counting at 0
for (var i=userLocationLayer.length-1; i > -1;i--) {
console.log("removing point "+i + " which has coordinates "+userLocationLayer[i].getLatLng());
mymap.removeLayer(userLocationLayer[i]);
}
}

// code adapted from https://www.htmlgoodies.com/beyond/javascript/calculate-the-distance-between-two-points-in-your-web-apps.html 
function calculateDistance(lat1, lon1, lat2, lon2, unit) { 
    var radlat1 = Math.PI * lat1/180; 
    var radlat2 = Math.PI * lat2/180; 
    var radlon1 = Math.PI * lon1/180; 
    var radlon2 = Math.PI * lon2/180; 
    var theta = lon1-lon2; 
    var radtheta = Math.PI * theta/180; 
    var subAngle = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta); 
    subAngle = Math.acos(subAngle); 
    subAngle = subAngle * 180/Math.PI; 
    // convert the degree value returned by acos back to degrees from radians 
    dist = (subAngle/360) * 2 * Math.PI * 3956; 
    // ((subtended angle in degrees)/360) * 2 * pi * radius ) 
    // where radius of the earth is 3956 miles 
    if (unit=="K") 
        { dist = dist * 1.609344 ;} 
    // convert miles to km 
    if (unit=="N") 
        { dist = dist * 0.8684 ;} 
    // convert miles to nautical miles 
    return dist; 
}


// function to open pop-up if user is within a specific distance of point. 
function closestFormPoint() {

// take the leaflet formdata layer
// go through each point one by one
// and measure the distance to Warren Street
// for the closest point show the pop up of that point
var minDistance = 100000000000;
var closestFormPoint = 0;

// var userlat = trackLocationLayer.lat;
// var userlng = trackLocationLayer.lng;
var userlat = document.getElementById('latitude').innerHTML;
var userlng = document.getElementById('longitude').innerHTML;
console.log(userlat,userlng);
conditionPointLayer.eachLayer(function(layer) {

var distance = calculateDistance(userlat,userlng,layer.getLatLng().lat, layer.getLatLng().lng, 'K');
if (distance < minDistance){
minDistance = distance;
closestFormPoint = layer.feature.properties.asset_id;
}
});
console.log(closestFormPoint);
// for this to be a proximity alert, the minDistance must be
// closer than a given distance - you can check that here
// using an if statement
// show the popup for the closest point
conditionPointLayer.eachLayer(function(layer) {
if (layer.feature.properties.asset_id == closestFormPoint){
layer.openPopup();
}
});

}  

