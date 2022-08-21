//global variables to store data, labels and color for donought chart
var datas = [];
var labels = [];
var color = [];

//function to load the cesium 
function loadVectorLayer(){

            // get the data - NB this assumes that the API is running
            var layerURL = document.location.origin+"/api/geoJSONUserId/"+ user_id+"";
            console.log(layerURL);


            var geoJSONOptions = {
              stroke: Cesium.Color.RED,
                  fill: Cesium.Color.RED ,
                  strokeWidth: 3,
                  markerSymbol: '*',
            }
                        
            $.ajax({url:layerURL ,  crossDomain: true,success: function(result){
              assets = result[0];

  var dataSource = new Cesium.GeoJsonDataSource("Assets");
                  dataSource.clampToGround=false;
                  dataSource._name = "Assets";
                  viewer.dataSources.add(dataSource);
                   dataSource.load(assets,geoJSONOptions).then(function(dataSource){
                    viewer.flyTo(dataSource);})


  var asset = dataSource.entities.values; 

  //Source: https://gis.stackexchange.com/questions/190270/viewing-a-point-geojson-layer-as-markers-in-cesium
            for (var i = 0; i < asset.length; i++) { 
                var entity = asset[i];
                if (entity._properties._condition_description._value=='Element is in very good condition'){
                entity.billboard = undefined;
                entity.point = new Cesium.PointGraphics({
                    color: Cesium.Color.GREEN,
                    pixelSize: 12
                })}


              else if (entity._properties._condition_description._value=='Some aesthetic defects, needs minor repair'){
                entity.billboard = undefined;
                entity.point = new Cesium.PointGraphics({
                    color: Cesium.Color.YELLOW,
                    pixelSize: 12
                })}

              else if (entity._properties._condition_description._value=='Functional degradation of some parts, needs maintenance'){
                entity.billboard = undefined;
                entity.point = new Cesium.PointGraphics({
                    color: Cesium.Color.ORANGE,
                    pixelSize: 12
                })}

              else if (entity._properties._condition_description._value=='Not working and maintenance must be done as soon as reasonably possible'){
                entity.billboard = undefined;
                entity.point = new Cesium.PointGraphics({
                    color: Cesium.Color.PINK,
                    pixelSize: 12
                })}

              else if (entity._properties._condition_description._value=='Not working and needs immediate, urgent maintenance'){
                entity.billboard = undefined;
                entity.point = new Cesium.PointGraphics({
                    color: Cesium.Color.RED,
                    pixelSize: 12
                })}

              else  {
                entity.billboard = undefined;
                entity.point = new Cesium.PointGraphics({
                    color: Cesium.Color.BLACK,
                    pixelSize: 12
                })}

                    }

                    }

                  });

  // source: https://stackoverflow.com/questions/65788440/cesium-trigger-event-when-a-point-is-selected

  viewer.selectedEntityChanged.addEventListener(function(selectedEntity) {
  if (Cesium.defined(selectedEntity)) {
      if (Cesium.defined(selectedEntity.name)) {
        console.log('Selected ' + selectedEntity.name);
      } else {
        console.log('Unknown entity selected.');
      }
  } else {
    console.log('Deselected.');
  }
});
                }


//function to get user Ranking
function userRanking(){

  var baseComputerAddress = document.location.origin; 
    var dataAddress= "/api/userRanking/" + user_id ; 
    var userRankLayer = baseComputerAddress + dataAddress;
        
        $.ajax({url:userRankLayer,async: false, crossDomain:true, success: function(result){
           var ranking;
           ranking = result[0].array_to_json[0].rank;
           //getting the rank from array_to_json 
           console.log(ranking);

           document.getElementById("user_ranking").innerHTML = ranking;       
            // return user ranking;
        
        }//end of the inner function

}); // end of the ajax request 
}// end of the userRanking function


  
// function to tell user how many reports they have submitted when they submit the report
function tellCountSubmission(){
    var baseComputerAddress = document.location.origin; 
    var dataAddress= "/api/userConditionReports/" + user_id+ ""; 
    var URLLayer = baseComputerAddress + dataAddress;
        
    $.ajax({url:URLLayer ,async: false, crossDomain: true,success: function(result){
    console.log(result);
    var count;
    count = result[0].array_to_json[0].num_reports;
    console.log(count);
    
    document.getElementById("condition_rated").innerHTML = count;
        
}
});
}
 

//https://tobiasahlin.com/blog/chartjs-charts-to-get-you-started/
function doughnut_chart(){

var baseComputerAddress = document.location.origin; 
var dataAddress= "/api/geoJSONUserId/"+ user_id+""; 
var URLLayer = baseComputerAddress + dataAddress;

  $.ajax({url:URLLayer,async: false, crossDomain:true, success: function(result){

    data = result[0].features;

  data.forEach(function(d){
  labels.push(d.properties.asset_name)
})

console.log(labels);

data.forEach(function(e){
   
    if(e.properties.condition_description == 'Element is in very good condition')
    {
      
      e.properties.condition_value = 1; 
    }

    else if(e.properties.condition_description == 'Some aesthetic defects, needs minor repair')
    {
      e.properties.condition_value = 2;
      
    }

    else if(e.properties.condition_description == 'Functional degradation of some parts, needs maintenance')
    {
      e.properties.condition_value = 3;
     
    }

    else if(e.properties.condition_description == 'Not working and maintenance must be done as soon as reasonably possible')
    {
      e.properties.condition_value = 4;
      
    }

    else if(e.properties.condition_description == 'Not working and needs immediate, urgent maintenance')
    {
      e.properties.condition_value = 5;
       
    }

    else if (e.properties.condition_description == 'Unknown')
    {
      e.properties.condition_value = 6;
    }
    datas.push(e.properties.condition_value);

})
console.log(datas);


data.forEach(function(f){
  if (f.properties.condition_value == 1) {
      colour = "green";
    }
    else if (f.properties.condition_value ==2){
    colour= "yellow";
  }
  else if (f.properties.condition_value ==3){
    colour= "orange";
  }
  else if (f.properties.condition_value ==4){
    colour= "pink";
  }
  else if (f.properties.condition_value ==5){
    colour= "red";
  }
  else  {
    colour= "gray";
  }

  color.push(colour);
  })
console.log(color);

chart = new Chart(document.getElementById("bar-chartcanvas"), {

    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [
        {
          label: "Condition Value",
          backgroundColor:color ,
          data: datas
        }
      ]
    },
    options: {
      legend: { display : false},
      title: {
        display: true,
        text: 'Assets with their condition values',
        fontSize: 20,
        fontColor: "black",
        fontWeight: "normal"
      },
      //source: http://www.java2s.com/example/javascript/chart.js/handle-click-events-on-pie-charts-in-chartjs.html
      //to add on click functionality
      onClick:function(e){
    var activePoints = chart.getElementsAtEvent(e);
    var selectedIndex = activePoints[0]._index;
    console.log(selectedIndex);
    console.log(labels[selectedIndex]);
    console.log(this.data.datasets[0].data[selectedIndex]);
}
      
    }
});

}});
}


 function getUserId(){
    var baseComputerAddress = document.location.origin; 
    var dataAddress= "/api/getUserId"; 
    var userLayer = baseComputerAddress + dataAddress;

    // here async set to false to that statement you are calling has to complete before the next statement in your function can be called
    // so that the user_id is returned and then user_id can be passed to geoJSONUserId and data for speceific user can be loaded correctly.
    // Source: tackoverflow.com/questions/1478295/what-does-async-false-do-in-jquery-ajax#:~:text=Setting%20async%20to%20false%20means%20the%20instructions%20following%20the%20ajax,for%20the%20request%20to%20complete.

            $.ajax({url:userLayer , async: false, crossDomain: true,success: function(result){
                user_id = result.user_id;

                console.log(user_id); // check that the data is correct
                 document.getElementById("user_id").innerHTML = user_id;
            }
        })
        }

