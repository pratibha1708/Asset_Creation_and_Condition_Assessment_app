//global variables
var width; 
var conditionPointLayer; // condition Layer
var assetPointLayer; // asset Layer
var desktop ; // global variable for the large screen set to 0 so that function always to through if statement 
var mobile; // for the small screen


function loadLeafletMap()
{ console.log('Start function to load leaflet map');
    
//load tiles

	L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {

		maxZoom: 18,
attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
			'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		id: 'mapbox/streets-v11',
tileSize: 512,
zoomOffset: -1

	}).addTo(mymap); 
    window.addEventListener('resize', setMapClickEvent); 
    setMapClickEvent();
    
}


function setMapClickEvent() { // get the window width 
     width = $(window).width(); // we use the bootstrap Medium and Large options for the asset location capture 
// and the small and XS options for the condition option 
// see here: https://www.w3schools.com/bootstrap/bootstrap_grid_system.asp 

   if (width < 992) { 

    if(mobile == 1){
        return false;
    }
       
    else { 
        mymap.off('click', onMapClick);
        if (assetPointLayer){
             mymap.removeLayer(assetPointLayer);       // removing assets points as soon as the window is resized to small. 

        }
       // functionality when window is small 
        setUpPointClick();
        trackLocation();
        setTimeout(closestFormPoint, 200);      // putting timer so that all the points are plotted and location is tracked and then closest point is calcilated
        //https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_win_settimeout1
        // closestFormPoint();
        closeGraph();
        closeTable();
       // tracking of user's location starts as the screen is minimized i.e. condition side is opened. 
       mobile =1;
       desktop =0;

        }}

     else{
        if(desktop ==1 ){
            return false;
        }
        
        else{
        if  (conditionPointLayer){
            mymap.removeLayer(conditionPointLayer);}   // the asset creation page 
// remove the map point if it exists 
            mymap.on('click', onMapClick);
            loadAssetPoint();         // loads the assets created by user as the webpage is launched 
            removePositionPoints();
              // removes the user's position point as soon as the window is maximised.
             if  (closestAssetLayer){
            mymap.removeLayer(closestAssetLayer);}
            if  (conditionReportLayer){
            mymap.removeLayer(conditionReportLayer);}
            if  ( notRatedLayer ){
            mymap.removeLayer( notRatedLayer );}    
               mobile = 0;
               desktop =1;


}}
}
 

var baseComputerAddress;
var dataAddress;
var URLLayer;

function setUpPointClick() { 
// create a geoJSON feature (in your assignment code this will be replaced 
// by an AJAX call to load the asset points on the map 
    var baseComputerAddress = document.location.origin; 
    var dataAddress= "/api/geoJSONUserId/"+user_id+""; 
    var URLLayer = baseComputerAddress + dataAddress;
        
    $.ajax({url:URLLayer ,async: false, crossDomain: true,success: function(result){
    console.log(result); // check that the data is correct

    var testMarkerGreen = L.AwesomeMarkers.icon({icon: 'play',markerColor: 'green'
});
    var testMarkerBeige = L.AwesomeMarkers.icon({icon: 'play',
markerColor: 'beige'});
    var testMarkerOrange = L.AwesomeMarkers.icon({icon: 'play',
markerColor: 'orange'});
    var testMarkerLightRed = L.AwesomeMarkers.icon({icon: 'play',
markerColor: 'red'});
    var testMarkerRed = L.AwesomeMarkers.icon({icon: 'play',
markerColor: 'darkred'});
var testMarkerWhite = L.AwesomeMarkers.icon({icon: 'play',
markerColor: 'white'});

    json = result[0];
    console.log(json);
    
 // and add it to the map and zoom to that location 
 // use the mapPoint variable so that we can remove this point layer on 

    //add the JSON layer onto the map - it will appear using the default icons
    //adding condition form as pop up by clickong on point to all the assets created by a specific user. 
    conditionPointLayer = L.geoJson(json, {
                pointToLayer: function(feature, latlng) {
                    if (feature.properties.condition_description == "Element is in very good condition")
                        {var popUpHTML = getPopupHTML(feature); 
                        return L.marker(latlng, {icon:testMarkerGreen}).bindPopup(popUpHTML);}

                    else if (feature.properties.condition_description == "Some aesthetic defects, needs minor repair")
                        {var popUpHTML = getPopupHTML(feature); 
                        return L.marker(latlng, {icon:testMarkerBeige}).bindPopup(popUpHTML);}

                    else if (feature.properties.condition_description == "Functional degradation of some parts, needs maintenance")
                        {var popUpHTML = getPopupHTML(feature); 
                        return L.marker(latlng, {icon:testMarkerOrange}).bindPopup(popUpHTML);}

                    else if (feature.properties.condition_description == "Not working and maintenance must be done as soon as reasonably possible")
                        {var popUpHTML = getPopupHTML(feature); 
                        return L.marker(latlng, {icon:testMarkerLightRed}).bindPopup(popUpHTML);}

                    else if (feature.properties.condition_description == "Not working and needs immediate, urgent maintenance")
                        {var popUpHTML = getPopupHTML(feature); 
                        return L.marker(latlng, {icon:testMarkerRed}).bindPopup(popUpHTML);}

                    else 
                        {var popUpHTML = getPopupHTML(feature); 
                        return L.marker(latlng, {icon:testMarkerWhite}).bindPopup(popUpHTML);}

                    },

                    
            }).addTo(mymap);
    conditionPointLayer.addData(json);

            //change the map zoom so that all the data is shown
            mymap.fitBounds(conditionPointLayer.getBounds());
            }

//end of the inner function
}); 

 // // the on click functionality of the POINT should pop up partially populated condition form so that the user can select the condition they require 
 // console.log(popUpHTML); 
}


function getPopupHTML(feature){
    var asset_name = feature.properties.asset_name;
    var installation_date = feature.properties.installation_date;
    // var user_id = 'user522';
    var previousConditionValue = feature.properties.condition_description;
    var condition;
    var assetID = feature.properties.asset_id;

	var htmlString = '<p><b><h2><center> Asset Condition Form </b></p></h2></center>' + 
    "<label for 'asset_name'><b>Asset Name: </label></b>" + "<div id = 'asset_name_" + assetID + "'" + ">" + asset_name + "</div><br>" +
    "<label for 'installation_date'><b>Installation Date: </label></b>"  + "<div id='installation_date_" + assetID + "'" + ">" + installation_date + "</div><br>" + 
	 "<div id = 'previousConditionValue_" + assetID + "' style='display:none;'>" + previousConditionValue + "</div>" +
	 "<div id = 'assetID_" + assetID  + "' style='display:none;'>" + assetID + "</div>" + 
     // "<div id = 'user_" + assetID + "' style='display:none;'>" + user_id + "</div>" + 
     '<p><b> Rate Asset Condition: </b> </p>' +
     "<input type = 'radio' name = 'condition' value ='Element is in very good condition' id = 'condition" + assetID + "_1'/>" + "1:Element is in very good condition"  + "<br />" +
     "<input type = 'radio' name = 'condition' value ='Some aesthetic defects, needs minor repair' id = 'condition" + assetID + "_2'/>" + "2:Some aesthetic defects, needs minor repair" +  "<br />" +
     "<input type = 'radio' name = 'condition' value ='Functional degradation of some parts, needs maintenance' id = 'condition" + assetID + "_3'/>" + "3:Functional degradation of some parts, needs maintenance" + "<br />" +
     "<input type = 'radio' name = 'condition' value ='Not working and maintenance must be done as soon as reasonably possible' id = 'condition" + assetID + "_4'/>" + "4:Not working and maintenance must be done as soon as reasonably possible" +  "<br />" +
     "<input type = 'radio' name = 'condition' value ='Not working and needs immediate, urgent maintenance' id = 'condition" + assetID + "_5'/>" + "5:Not working and needs immediate, urgent maintenance" +  "<br />" +
     "<button onclick ='checkCondition(" + assetID + ");return false;'> Save Asset Condition </button>"; 
     
return htmlString;

}


function onMapClick(e) {
	console.log('Form about to be created');
	var formHTML = basicFormHtml(e.latlng);
popup
.setLatLng(e.latlng)
.setContent("You clicked the map at " + e.latlng.toString()+"<br>"+formHTML)
.openOn(mymap);
console.log('Form created');

}


function basicFormHtml(latlng){

      // var user_id = 'user522';
      var longitude = latlng.lng; // to get latlong where user clicks 
      var latitude = latlng.lat;      

     var myvar = ''+' <p><b> Create a New Asset</b></p>' +
     '' +
     '' +
     '<label for="asset_name">Asset Name<b>* </b> </label><input type="text" size="25" id="asset_name" /><br />' +
    '<label for="installation_date">Installation Date<b>*  </label><input type="text" size="25" id="installation_date" /><br />' +
    '' +
    '' +
    '<div id="latitude" style="display: none;">'+ latitude + '</div>' + 
    '' +
    '' +
    '<div id="longitude" style="display: none;">'+ longitude + '</div>' + 
    '' +
    '' +
    // '<div id="user_id" style="display: none;">'+ user_id + '</div>' + 
    '' +
    '' + 
    '<button id="saveAsset" onclick="qualityCheck()">Save New Asset</button><br /> '; 

return myvar;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
}


function saveNewAsset() {
	// alert ("start saving new asset");

	var asset_name = document.getElementById("asset_name").value;
	var installation_date = document.getElementById("installation_date").value;
	var latitude = document.getElementById("latitude").innerHTML;
	var longitude = document.getElementById("longitude").innerHTML;
     // var user_id = document.getElementById("user_id").innerHTML;
    


	// alert(asset_name + " "+ installation_date + " "+ latitude + " " + longitude + " " + user_id);
	
	var postString = "asset_name="+asset_name +"&installation_date="+installation_date+"&latitude="+latitude +"&longitude="+longitude +"&user_id="+user_id;

	dataUploaded(postString);
}


function dataUploaded(postString) {
	// alert(postString);
var serviceUrl=  document.location.origin + "/api/insertAssetPoint";
   $.ajax({
    url: serviceUrl,
    crossDomain: true,
    async: false,
    type: "POST",
    data: postString,
    success: function(data){console.log(data);         
      alert( "Form Submitted" + "\n " + JSON.stringify(data));
      console.log("New Asset Form Submiited.");
       mymap.removeLayer(popup);   // to remove the form after its submitted
       if (mymap.hasLayer(assetPointLayer)){
        mymap.removeLayer(assetPointLayer);}
     //remove conditionLayer and calling loadAssetPoint so that point created is shown immediately on map  without loading the page
        loadAssetPoint(); 
    },

    error : function(){
        alert("ERROR!  This asset already exists. Try using unique name. Check the server connection and complete the form");
    }
     
}); 
  
}


function checkCondition(assetID){
    // alert('start saving condition infromation');
    var condition_description; 
    var condition; 

    var asset_name = document.getElementById("asset_name_" + assetID).innerHTML;
    // console.log(asset_name);
    var installation_date = document.getElementById("installation_date_" + assetID).innerHTML;
    // console.log(installation_date);
    // var user_id = document.getElementById("user_" + assetID).innerHTML;
    var assetID = document.getElementById("assetID_" + assetID).innerHTML;
    var previousConditionValue = document.getElementById("previousConditionValue_" + assetID).innerHTML;

    var postString = "assetID=" + assetID + "&asset_name=" +asset_name +"&installation_date=" +installation_date + "&user_id=" +user_id;

    var condition1 = document.getElementById("condition" + assetID + "_1");
    if (condition1.checked)
        { condition = condition1.id.split('_').slice(-1);
           condition_description = condition1.value;
          }

    var condition2 = document.getElementById("condition" + assetID + "_2");
    if (condition2.checked)
        {  condition = condition2.id.split('_').slice(-1);
           condition_description = condition2.value;
          }

    var condition3 = document.getElementById("condition" + assetID + "_3");
    if (condition3.checked)

        { condition = condition3.id.split('_').slice(-1);
           condition_description = condition3.value;
          }

    var condition4 = document.getElementById("condition" + assetID + "_4");
    if (condition4.checked)
        { condition = condition4.id.split('_').slice(-1);
           condition_description = condition4.value;
          }

    var condition5 = document.getElementById("condition" + assetID + "_5");
    if (condition5.checked)
        {condition = condition5.id.split('_').slice(-1);
           condition_description = condition5.value;
          }

    // compare condition to previous condition
        if (condition!= previousConditionValue){
        alert('Condition of the asset has changed!\n Previous Condition: ' + previousConditionValue + "\n New Condition: " +   condition_description);
    }

    else {
        alert('Condition has not changed!\n Previous Condition: ' + previousConditionValue + "\n New Condition: "  + condition_description);
    }
    postString = postString +  "&previousConditionValue=" + previousConditionValue+ "&condition=" + condition +"&condition_description=" + condition_description;

    // alert('postString: ' + postString);

    saveCondition(postString);

    // alert("Condition Information has been saved.");
    }

function saveCondition(postString){
    // alert(postString);

    var serviceUrl=  document.location.origin + "/api/insertConditionInformation";
   $.ajax({
    url: serviceUrl,
    crossDomain: true,
    type: "POST",
    data: postString,
    success: function(data){console.log(data); 
        alert("Condition Report Submitted."+  "\n" + JSON.stringify(data));
        console.log("Condition Report Submiited!");
        tellCountSubmission();  // to tell the no. of submission
        console.log("Tell the user number of reports submitted");
        mymap.closePopup();  // to close the form after its submitted

        mymap.removeLayer(conditionPointLayer); //remove conditionLayer and calling setUpPointClick so that color is changes immedialtely without loading the page
        setUpPointClick();
        
    } 

}); 
   
}


// function to give error message if user misses name or installation date
function qualityCheck(){
    var asset_name = document.getElementById("asset_name").value;
    var installation_date = document.getElementById("installation_date").value;

    if 
        (asset_name == "" || asset_name == null){
        alert("ERROR!!   Asset Name cannot be blank.  Enter an asset name.");
        return false;
    }
    else if 
        (installation_date == "" || installation_date == null){
        alert("ERROR!!    Installation Date cannot be blank.  Enter an Installation Date");
        return false;
    }
    else{
        saveNewAsset();
        return true;

    }
}


// function to tell user how many reports they have submitted when they submit the report
function tellCountSubmission(){
    var baseComputerAddress = document.location.origin; 
    var dataAddress= "/api/userConditionReports/" + user_id+ ""; 
    var URLLayer = baseComputerAddress + dataAddress;
        
    $.ajax({url:URLLayer ,async: false, crossDomain: true,success: function(result){
    console.log(result); // check that the data is correct

    var count;
    count = result[0].array_to_json[0].num_reports;
    console.log(count);

    alert("You have submitted " + count + " reports");
}
});

}


