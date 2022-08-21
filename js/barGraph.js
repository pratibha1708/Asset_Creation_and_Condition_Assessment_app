//function to plot bar graph of assets with their condition values

function barGraph() { 
document.getElementById("graphWrapper").style.top = "300px"; 
document.getElementById("graphWrapper").style.top="15%"; 

console.log(document.getElementById("graphWrapper").style.top);
var widtha = document.getElementById("graphWrapper").offsetWidth;
var heighta = document.getElementById("graphWrapper").offsetHeight;
console.log(widtha+" "+heighta); 
// // keep the existing HTML as there is a button that is needed 
document.getElementById("graphWrapper").innerHTML=document.getElementById("graphWrapper").innerHTML+'<svg width="'+widtha+'" height="'+heighta+'" id="svg2"></svg></div>'

const svg     = d3.select("#svg2"),
margin  = {top: 40, right: 20, bottom: 100, left: 50},
      width   = +svg.attr("width")  - margin.left - margin.right,
      height  = +svg.attr("height") - margin.top  - margin.bottom,
      x       = d3.scaleBand().range([0, width]).padding(0.2),
      y       = d3.scaleLinear().range([height, 0]).domain([0,100]),
      g       = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    
var baseComputerAddress = document.location.origin; 
var dataAddress= "/api/geoJSONUserId/"+ user_id+""; 
var URLLayer = baseComputerAddress + dataAddress;


d3.json(URLLayer).then(data => {
  data = data[0].features;
  console.log(data);

//Source: https://www.tutorialspoint.com/d3js/d3js_graphs.html

  data.forEach(function(d){
   
    if(d.properties.condition_description == 'Element is in very good condition')
    {
      return d.properties.condition_value = 1;
      
    }

    else if(d.properties.condition_description == 'Some aesthetic defects, needs minor repair')
    {
      return d.properties.condition_value = 2;

      
    }

    else if(d.properties.condition_description == 'Functional degradation of some parts, needs maintenance')
    {
      return d.properties.condition_value = 3;
     
    }

    else if(d.properties.condition_description == 'Not working and maintenance must be done as soon as reasonably possible')
    {
      return d.properties.condition_value = 4;
    }

    else if(d.properties.condition_description == 'Not working and needs immediate, urgent maintenance')
    {
      return d.properties.condition_value = 5;
    }

    else (d.properties.condition_description == 'Unknown')
    {
      return d.properties.condition_value = 6;
    }
});

x.domain(data.map(d => d.properties.asset_name));
y.domain([0, d3.max(data, d => d.properties.condition_value)]);


  g.append("g")
      .attr("class", "axis axis-x")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
        .selectAll("text")  
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-45)" );
            //http://www.d3noob.org/2013/01/how-to-rotate-text-labels-for-x-axis-of.html
     
  g.append("g")
      .attr("class", "axis axis-y")
      .call(d3.axisLeft(y).ticks(6).tickSize(8));

  // var barwidth = (x.range()[1] - x.range()[0]) / data["data"].length

    const tooltip = d3.select("body")
                      .append("div")
                      .attr("id", "tooltip")
                      .style("visibility", "hidden")


  g.selectAll(".bar")
    .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.properties.asset_name))
      .attr("y", d => y(d.properties.condition_value))
      .attr("width", x.bandwidth())
      .attr("height", d => height - y(d.properties.condition_value))
      .attr("class", "bar")
       .attr("data-asset", (d) => d.properties.asset_name)
       .attr("data-condition", (d) => d.properties.condition_value)
       .attr("fill", function(d) {
    if (d.properties.condition_value == 1) {
      return "green";
    }
    else if (d.properties.condition_value ==2){
    return "yellow";
  }
  else if (d.properties.condition_value ==3){
    return "orange";
  }
  else if (d.properties.condition_value ==4){
    return "pink";
  }
  else if (d.properties.condition_value ==5){
    return "red";
  }
  else  {
    return "gray";
  }
  })
       .on("mouseover", function(d){
           tooltip.style("visibility", "visible")
                  .style("left", event.pageX+10+"px")
                  .style("top", event.pageY-80+"px")
                  .attr("data-asset", d.properties.asset_name)
                  .html(d.properties.asset_name + "</br>"  + "Condition: " + d.properties.condition_value + "</br>" + " "+  d.properties.condition_description )
       })
       .on("mousemove", function(){
           tooltip.style("left", event.pageX+10+"px")
       })
       .on("mouseout", function(){
           tooltip.style("visibility", "hidden")
       });
   
//https://blog.risingstack.com/d3-js-tutorial-bar-charts-with-javascript/
// https://marcwie.github.io/blog/responsive-bar-chart-d3/
//https://www.tomordonez.com/d3-bar-chart-title-and-labels/#:~:text=Add%20a%20title%20and%20labels%20to%20a%20bar,the%20transform%20and%20translate%20to%20position%20the%20text.
//to add axis labels

svg.append("text")
   .attr("transform", "translate(" + (widtha/2 ) + " ," + (heighta  ) + ")")
   .style("text-anchor", "middle")
   .style("font-weight", "bold")  
   .text("Asset Name");
svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -(heighta/2))
     .attr("y", 15)
   .style("text-anchor", "middle")
   .style("font-weight", "bold")  
   .text("Condition Value");
svg.append("text")
        .attr("x", margin.left + (width - margin.left - margin.right) / 2)
        .attr("y", margin.top / 2)
        .attr("id", "title")
        .text("Assets with their condition");

})

.catch(err => {
  svg.append("text")         
        .attr("y", 20)
        .attr("text-anchor", "left")  
        .style("font-size", "20px") 
        .style("font-weight", "bold")  
        .text(`Couldn't open the data file: "${err}".`);
});
}


