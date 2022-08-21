//to close the graph using button
function closeGraph() { 
  if (graph ==1)
  { 
	document.getElementById("graphWrapper").style.top = "-9999px";   
  graph = 0;} 
  //to remove and add like GIS layer
}


var dailyReportingLayer;

function dailyReporting(){

    var baseComputerAddress = document.location.origin; 
    var dataAddress= "/api/dailyParticipationRates"; 
    var dailyReportingLayer = baseComputerAddress + dataAddress;
        
        $.ajax({url:dailyReportingLayer,async: false,  crossDomain: true, success: function(result){
            
            var json;
            json = result[0].array_to_json;
            console.log(json);
            
        }
//end of the inner function
}); 
}// end of the ajax request 
// end of the daily Reporting Layer function

var graph = 0;
console.log(graph);

function dailyReportingRatesGraph() { 
  if (graph ==0){
document.getElementById("graphWrapper").style.top = "300px"; 
document.getElementById("graphWrapper").style.top="15%"; 
console.log(document.getElementById("graphWrapper").style.top);
var widtha = document.getElementById("graphWrapper").offsetWidth;
var heighta = document.getElementById("graphWrapper").offsetHeight;
console.log(widtha+" "+heighta); 
// keep the existing HTML as there is a button that is needed 
document.getElementById("graphWrapper").innerHTML=document.getElementById("graphWrapper").innerHTML+'<div class="h-75 w-75"><svg width="'+widtha+'" height="'+heighta+'" id="svg1"></svg></div>'

// the code to generate the graph goes here 


const svg     = d3.select("#svg1"),
      margin  = {top: 10, right: 10, bottom:100, left: 50},
      width   = +svg.attr("width")  - margin.left - margin.right,
      height  = +svg.attr("height") - margin.top  - margin.bottom,
      x       = d3.scaleBand().rangeRound([0, width]).padding(0.2),
      y       = d3.scaleLinear().rangeRound([height, 0]),
      y1= d3.scaleLinear().rangeRound([height, 0]),
      g       = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

// defining the address of endpoint which stores the dailyReportingRates
var baseComputerAddress = document.location.origin; 
var dataAddress= "/api/dailyParticipationRates"; 
var dailyReportingLayer = baseComputerAddress + dataAddress;

d3.json(dailyReportingLayer).then(data => {
  data = data[0].array_to_json;
  console.log(data);

//sorting the data week wise
//Source: https://stackoverflow.com/questions/34066752/sort-object-of-weekdays-like-sunday-monday-saturday

  const sorter = {
  "monday": 1,
  "tuesday": 2,
  "wednesday": 3,
  "thursday": 4,
  "friday": 5,
  "saturday": 6,
  "sunday": 7
}

data.sort(function sortByDay(a, b) {
  let day1 = a.day.toLowerCase();
  let day2 = b.day.toLowerCase();
  return sorter[day1] - sorter[day2];
});

console.log(data);


  x.domain(data.map(d => d.day));
  y.domain([0, d3.max(data, d => d.reports_submitted)]);


  g.append("g")
      .attr("class", "axis axis-x")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));


  g.append("g")
      .attr("class", "axis axis-y")
      .call(d3.axisLeft(y).ticks(10).tickSize(8));

      //https://stackoverflow.com/questions/53518370/d3-bar-chart-add-legend
      //to add stacked graph 

  g.selectAll(".bar.reports_submitted")
    .data(data)
    .enter().append("rect")
      .attr("class", "bar reports_submitted")
      .style("fill","#69b3a2")
      .attr("x", d => x(d.day))
      .attr("y", d => y(d.reports_submitted))
      .attr("width", x.bandwidth())
      .attr("height", d => height - y(d.reports_submitted));
      

  g.selectAll(".bar.reports_not_working")
    .data(data)
    .enter().append("rect")
      .attr("class", "bar reports_not_working")
      .style("fill","#404080")
      .attr("x", d => x(d.day))
      .attr("y", d => y(d.reports_not_working))
      .attr("width", x.bandwidth())
      .attr("height", d => height - y(d.reports_not_working));

//https://www.tomordonez.com/d3-bar-chart-title-and-labels/#:~:text=Add%20a%20title%20and%20labels%20to%20a%20bar,the%20transform%20and%20translate%20to%20position%20the%20text.
//to add axis labels

svg.append("text")
   .attr("transform", "translate(" + (widtha/3 ) + " ," + (heighta-60) + ")")
   .style("text-anchor", "middle")
   .text("Days");
svg.append("text")
   .attr("transform", "rotate(-90)")
   .attr("x", -(heighta/2))
   .attr("y", 15)
   .style("text-anchor", "middle")
   .text("Number of reports");
//adding Legend
//Source:
//https://d3-graph-gallery.com/graph/custom_legend.html

svg.append("circle").attr("cx",(widtha/2 + 230)).attr("cy",( heighta - 50)).attr("r", 4).style("fill", "#69b3a2")
svg.append("circle").attr("cx",(widtha/2 + 230)).attr("cy",(heighta -35)).attr("r", 4).style("fill", "#404080")
svg.append("text").attr("x", (widtha/2) +280 ).attr("y", (heighta - 60)).text("Legend").style("font-size", "13px").attr("alignment-baseline","end")
svg.append("text").attr("x",(widtha/2 + 240)).attr("y", (heighta - 45)).text("Reports submitted").style("font-size", "12px").attr("alignment-baseline","end")
svg.append("text").attr("x", (widtha/2 + 240)).attr("y",(heighta - 30)).text("Reports with condition 'not working'").style("font-size", "12px").attr("alignment-baseline","end")
})

.catch(err => { 
  svg.append("text")          
        .attr("y", 20)
        .attr("text-anchor", "left")  
        .style("font-size", "20px") 
        .style("font-weight", "bold")  
        .text(`Couldn't open the data file: "${err}".`);

   
});
graph = 1;}
else if (graph ==1){
  alert("Graph has been already loaded once, can't load it again!")
}
}





