var user_id; 
// global variable to store user_id
var assetPointLayer; 
//global variable to store asset Points 


// function to get user_id 
function getUserId(){
    // using ajax to get endpoint frpm api repo to fetch the user_id
    var baseComputerAddress = document.location.origin; 
    var dataAddress= "/api/getUserId"; 
    var userLayer = baseComputerAddress + dataAddress;

    // here async set to false to that statement you are calling has to complete before the next statement in your function can be called
    // so that the user_id is returned and then user_id can be passed to geoJSONUserId and data for speceific user can be loaded correctly.
    // Source: tackoverflow.com/questions/1478295/what-does-async-false-do-in-jquery-ajax#:~:text=Setting%20async%20to%20false%20means%20the%20instructions%20following%20the%20ajax,for%20the%20request%20to%20complete.

            $.ajax({url:userLayer , async: false, crossDomain: true,success: function(result){
                user_id = result.user_id;

                console.log(user_id); // check that the data is correct
            }
        })
        }
 

//function to loadAssetPoint data
function loadAssetPoint(){
    

        var baseComputerAddress = document.location.origin; 
        var dataAddress= "/api/geoJSONUserId/"+user_id+""; 
        var URLLayer = baseComputerAddress + dataAddress;
        
            $.ajax({url:URLLayer ,async: false, crossDomain: true,success: function(result){
            console.log(result); // check that the data is correct

            var testMarkerBlue = L.AwesomeMarkers.icon({
                icon: 'play', markerColor: 'blue'});
            

            assets = result[0];
            console.log(assets);

            //add the JSON layer onto the map - it will appear using the default icons
            assetPointLayer = L.geoJson(assets, {
                pointToLayer: function(feature, latlng) {

                    // adding condition of assets as pop-up on the asset creation side.

                    if (feature.properties.condition_description == "Element is in very good condition")
                        {
                        return L.marker(latlng, {icon:testMarkerBlue}).bindPopup("Latest Condition Information:   <b>" + feature.properties.condition_description +"</b>");}

                    else if (feature.properties.condition_description == "Some aesthetic defects, needs minor repair")
                        {
                        return L.marker(latlng, {icon:testMarkerBlue}).bindPopup("Latest Condition Information:  <b>" +feature.properties.condition_description +"</b>");}

                    else if (feature.properties.condition_description == "Functional degradation of some parts, needs maintenance")
                        { 
                        return L.marker(latlng, {icon:testMarkerBlue}).bindPopup("Latest Condition Information:  <b>" +feature.properties.condition_description +"</b>");}

                    else if (feature.properties.condition_description == "Not working and maintenance must be done as soon as reasonably possible")
                        { 
                        return L.marker(latlng, {icon:testMarkerBlue}).bindPopup("Latest Condition Information:  <b>" +feature.properties.condition_description +"</b>");}

                    else if (feature.properties.condition_description == "Not working and needs immediate, urgent maintenance")
                        {
                        return L.marker(latlng, {icon:testMarkerBlue}).bindPopup("Latest Condition Information:  <b>" +feature.properties.condition_description +"</b>");}

                    else 
                        {
                        return L.marker(latlng, {icon:testMarkerBlue}).bindPopup(" Latest Condition Information: <b> No condition captured </b>");}
                    },

            }).addTo(mymap);
            // assetPointLayer.addData(assets);

            //change the map zoom so that all the data is shown
            mymap.fitBounds(assetPointLayer.getBounds());
            
        }
//end of the inner function
}); 
}// end of the ajax request 
// end of the getassetPointData function




 
