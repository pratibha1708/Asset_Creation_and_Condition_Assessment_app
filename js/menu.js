//Menus: Functions to link menu functionality

//Defining global variables to store different layers
var userRankLayer; 
var closestAssetLayer; 
var conditionReportLayer;
var notRatedLayer;

// function to return userRanking
function userRanking(){
	var baseComputerAddress = document.location.origin; 
    var dataAddress= "/api/userRanking/" + user_id ; 
    var userRankLayer = baseComputerAddress + dataAddress;
        
        $.ajax({url:userRankLayer,async: false, crossDomain:true, success: function(result){
        	 var ranking;
        	 ranking = result[0].array_to_json[0].rank;
        	 //getting the rank from array_to_json 
        	 console.log(ranking);
        
            alert(" Your rank is: " + ranking );
            // return user ranking                    
        }//end of the inner function
}); // end of the ajax request 
}// end of the userRanking function



//function to addClosestAssets from user's location
function addClosestAssets(){
    //removing standard layer so that closest points visible properly
    if(mymap.hasLayer(conditionPointLayer)){
        mymap.removeLayer(conditionPointLayer);
    }
	
	var latitude = document.getElementById('latitude').innerHTML;;
	console.log(latitude);

	var longitude = document.getElementById('longitude').innerHTML;;
	console.log(longitude);	

    var testMarkerBlue = L.AwesomeMarkers.icon({
                icon: 'play', markerColor: 'blue'});
	
	var baseComputerAddress = document.location.origin; 
    var dataAddress= "/api/fiveClosestAssets/" + latitude + "/" + longitude; 
    var URLLayer = baseComputerAddress + dataAddress;
    if (mymap.hasLayer(closestAssetLayer)){
            alert("Sorry! Closest Asset Layer has been loaded once, you can't load it again");}

        else{
        
      $.ajax({url:URLLayer , async: false, crossDomain: true,success: function(result){
            console.log(result); // check that the data is correct
            
            var closestAsset = result[0];
           
            console.log(closestAsset);

            //add the JSON layer onto the map - it will appear using the default icons
            closestAssetLayer = L.geoJson(closestAsset, {
                pointToLayer: function(feature, latlng) {
                    // if (feature.properties.condition_description == "Element is in very good condition")
                        
                        return L.marker(latlng, {icon:testMarkerBlue}).bindPopup("Asset ID:   <b>" +  feature.properties.id + "</b>" + "   Asset Name:   <b>"  + feature.properties.asset_name + "</b>" + "   Installation Date   <b>" + feature.properties.installation_date + "</b>");

                    // return L.marker(latlng).bindPopup();
                },
            }).addTo(mymap);

            closestAssetLayer.addData(closestAsset);

            //change the map zoom so that all the data is shown
            mymap.fitBounds(closestAssetLayer.getBounds());            
        }
//end of the inner function
}); 

}// end of the ajax request 
}


function removeClosetAssets(){
    if(mymap.hasLayer(closestAssetLayer) == true){ 
        mymap.removeLayer(closestAssetLayer);
        mymap.addLayer(conditionPointLayer);
        mymap.fitBounds(conditionPointLayer.getBounds());
        }
     else {
        alert("Layer doesn't exist!" );
    }}
	


//function to give list of all assets having atleast one report with condition 1 (they are in best condition).

table = 0;

function bestConditionAsset(){
    if (table ==0){

document.getElementById("tableWrapper").style.top = "300px"; 
document.getElementById("tableWrapper").style.top="15%"; 

console.log(document.getElementById("tableWrapper").style.top);
var widtha = document.getElementById("tableWrapper").offsetWidth;
var heighta = document.getElementById("tableWrapper").offsetHeight;
console.log(widtha+" "+heighta); 
// keep the existing HTML as there is a button that is needed 
document.getElementById("tableWrapper").innerHTML=document.getElementById("tableWrapper").innerHTML+'<div class="h-75 w-75"><svg width="'+widtha+'" height="'+heighta+'" id="svg2"></svg></div>'

// Source: Week9 Tables: Advance Material

var layers =[];

    var baseComputerAddress = document.location.origin; 
    var dataAddress= "/api/assetsInGreatCondition"; 
    var URLLayer = baseComputerAddress + dataAddress;
        
        $.ajax({url:URLLayer,async: false,  crossDomain: true, success: function(result){

        console.log("result "+result);
          var features;
          features = result[0].array_to_json;

          // generate a string for the table
          var tableHTML = "<table>";
          
         var tableHTML = "<table id='data3' class='display' style='margin:1%' border ='2's color='black' >";

          tableHTML += "<h6><b>List of all the assets having best condition report (atleast once)</b>";


          // add the column titles
          tableHTML += "<tr><h2><b><td> ID </td><td> Asset Name </td><td>Installation Date</td><td>User ID </td><td> Timestamp </td></tr> </h2></b>";

          for (i=0;i< features.length;i++) {
            // add a new row
            tableHTML += "<tr>";

            // add a new column 
            tableHTML +="<td>";
            // add the table name
            tableHTML +=features[i].id;
            // close the column
            tableHTML +="</td>";


            // add a new column 
            tableHTML +="<td>";
            // add the feature type
            tableHTML +=features[i].asset_name;
            // close the column
            tableHTML +="</td>";

            // add a new column 
            tableHTML +="<td>";  
            tableHTML +=features[i].installation_date;
            // close the column
            tableHTML +="</td>";

             // add a new column 
            tableHTML +="<td>";  
            tableHTML +=features[i].user_id;
            // close the column
            tableHTML +="</td>";

             // add a new column 
            tableHTML +="<td>";  
            tableHTML +=features[i].timestamp;
            // close the column
            tableHTML +="</td>";
            
            //close the row
            tableHTML +="</tr>";

          } // end of the for loop
           
          tableHTML +='<td> <button type="button" class="close" aria-label="Close" style= "background-color: red; text-align: center; color: white; width: 100px;  right: 0%;top: 0%; font-size:  12pt; height: 30px; position:absolute; right:0%;" onclick="closeTable();"> Close Table </button></td>';
	      //https://stackoverflow.com/questions/51380509/add-buttons-in-a-dynamically-generated-table-with-js

          // close the table
          tableHTML +="</table>";

          // update the DIV
         
          document.getElementById("tableWrapper").innerHTML = tableHTML;


      }
        });
        table =1;}
        else if (table==1){
            alert("Table is already loaded, can't load it more than once!")
        }

}

           
function closeTable() { 
    if (table ==1){
	document.getElementById("tableWrapper").style.top = "-9999px"; 
    table =0;}
	
}


function addLast5Reports(){
    //removing standard layers so that conditionreportlayer is clearly visible
    if(mymap.hasLayer(conditionPointLayer)){
        mymap.removeLayer(conditionPointLayer);
    }

	 var baseComputerAddress = document.location.origin; 
    var dataAddress= "/api/lastFiveConditionReports/" + user_id +""; 
    var URLLayer = baseComputerAddress + dataAddress;

    if (mymap.hasLayer(conditionReportLayer)){
            alert("Sorry! Last Five Condition Report Layer has been loaded once, you can't load it again");}

        else{
        
        $.ajax({url:URLLayer,async: false,  crossDomain: true, success: function(result){
            
            var conditionReport;
            conditionReport = result[0];
            console.log(conditionReport);
	
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


    //add the JSON layer onto the map - it will appear using the colour coded icons
    conditionReportLayer = L.geoJson(conditionReport, {
                pointToLayer: function(feature, latlng) {
                    if (feature.properties.condition_description == "Element is in very good condition")
                        {
                        return L.marker(latlng, {icon:testMarkerGreen}).bindPopup("Condition Description:   <b>" +  feature.properties.condition_description + "</b>");}
                    else if (feature.properties.condition_description == "Some aesthetic defects, needs minor repair")
                        {
                        return L.marker(latlng, {icon:testMarkerBeige}).bindPopup("Condition Description:   <b>" +  feature.properties.condition_description + "</b>");}

                    else if (feature.properties.condition_description == "Functional degradation of some parts, needs maintenance")
                        {
                        return L.marker(latlng, {icon:testMarkerOrange}).bindPopup("Condition Description:   <b>" +  feature.properties.condition_description + "</b>");}

                    else if (feature.properties.condition_description == "Not working and maintenance must be done as soon as reasonably possible")
                        {
                        return L.marker(latlng, {icon:testMarkerLightRed}).bindPopup("Condition Description:   <b>" +  feature.properties.condition_description + "</b>");}

                    else if (feature.properties.condition_description == "Not working and needs immediate, urgent maintenance")
                        {
                        return L.marker(latlng, {icon:testMarkerRed}).bindPopup("Condition Description:   <b>" +  feature.properties.condition_description + "</b>");}

                    else 
                        {
                        return L.marker(latlng, {icon:testMarkerWhite}).bindPopup("Condition Description:   <b>" +  feature.properties.condition_description + "</b>");}
                },
            }).addTo(mymap);

            conditionReportLayer.addData(conditionReport);

            //change the map zoom so that all the data is shown
            mymap.fitBounds(conditionReportLayer.getBounds());
            
        }
//end of the inner function
}); 

}// end of the ajax request 

}
// function to remove last5conditionreport
function removeLast5Reports(){
    if(mymap.hasLayer(conditionReportLayer) == true){
        mymap.removeLayer(conditionReportLayer);
        mymap.addLayer(conditionPointLayer);
        mymap.fitBounds(conditionPointLayer.getBounds());
        }
    
     else {
        alert("Layer doesn't exist!" );
    }
}
	           
 // function to show assets not rated in last 3 days     
 function addNotRatedLast3day(){

    if(mymap.hasLayer(conditionPointLayer)){
        mymap.removeLayer(conditionPointLayer);
    }

 	var baseComputerAddress = document.location.origin; 
    var dataAddress= "/api/conditionReportMissing/" + user_id + ""; 
    var URLLayer = baseComputerAddress + dataAddress;
        
    if (mymap.hasLayer(notRatedLayer)){
            alert("Sorry! Not report in last 3 days Layer has been loaded once, you can't load it again");}

        else{
      $.ajax({url:URLLayer , async: false, crossDomain: true,success: function(result){
            console.log(result); // check that the data is correct
            
            var missingReport = result[0];
           
            console.log(missingReport);

            var testMarkerGray = L.AwesomeMarkers.icon({icon: 'play',
markerColor: 'gray'});


            //add the JSON layer onto the map - it will appear using the default icons
            notRatedLayer = L.geoJson(missingReport, {
                pointToLayer: function(feature, latlng) {
                    // var popUpForm =closestFormPoint(); 
                    var popUpHTML = getPopupHTML(feature); 
                    return L.marker(latlng, {icon:testMarkerGray}).bindPopup(popUpHTML);
                },
            }).addTo(mymap);

            notRatedLayer.addData(missingReport);

            //change the map zoom so that all the data is shown
            mymap.fitBounds(notRatedLayer.getBounds());
            
        }
//end of the inner function
}); 

}}// end of the ajax request 

// function to remove notRated in last 3 days assets layer
function  removeNotRatedLast3day(){
    if(mymap.hasLayer(notRatedLayer) == true){
        mymap.removeLayer(notRatedLayer);
        mymap.addLayer(conditionPointLayer);
        mymap.fitBounds(conditionPointLayer.getBounds());
        }
	 else {
		alert("Layer doesn't exist!" );
	}}
	
