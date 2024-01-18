function main(){
        
    // Set dimensions and margins (adjust as needed)
    var margin = { top: 20, right: 150, bottom: 70, left: 60 },
    width = 1400 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

// Create SVG element with adjusted dimensions
var svg = d3.select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

   svg
   .append("text")
   .attr("x",10)
   .attr("class", "y label")
 .attr("text-anchor", "end")
 .attr("y", 1)
 .attr("dy", ".75em")
 .attr("transform", "rotate(-90)")
    .style("font-family","Arial")
   .style("font-size","20px")
   .text("Nombre de personnes")

   svg
   .append("text")
   .attr("x",width)
   .attr("y",height+30)
   .style("font-family","Arial")
   .style("font-size","20px")
   .text("Date")

   svg
   .append("rect")
   .attr("fill","red")
   .attr("width","50")
   .attr("height","5")
   .attr("x",width-250)
   .attr("y",15)

   svg
   .append("rect")
   .attr("fill","darkblue")
   .attr("width","50")
   .attr("height","5")
   .attr("x",width-250)
   .attr("y",40)

   svg
   .append("text")
   .attr("x",width - 190)
   .attr("y",25)
   .style("font-family","Arial")
   .style("font-size","20px")
   .text("Personnes tuées quotidiennement ")

   svg
   .append("text")
   .attr("x",width - 190)
   .attr("y",50)
   .style("font-family","Arial")
   .style("font-size","20px")
   .text("Personnes blessées quotidiennement ")





   
//Read the data
   d3.csv("data.csv",
       function(data) {
           
           
           //getting the groups
           const groups = data.map(d => d.Date)
           step = width / (groups.length+1);
           const filteredData = data.filter((_, i) => i % 5 === 0);
           const groupsf = filteredData.map(d => d.Date);
           step = width / (groups.length + 1);
       
           //adding the X axis
           const x = d3.scaleBand()
           .domain(groups)
           .range([0, width])
           .padding([step])

           const xf = d3.scaleBand()
           .domain(groupsf) // Use the original data for X-axis
           .range([0, width])
           .padding([step]);
   
           svg.append("g")
           .attr("transform", "translate(0," + height + ")")
           .call(d3.axisBottom(xf))
           .selectAll("text")
           .style("font-size","14px")
           .style("font-weight","bold")  // Select all the text elements for styling
           .style("text-anchor", "end")
           .attr("dx", "-.8em")
           .attr("dy", ".15em")
           .attr("transform", "rotate(-35)");

           // Add Y axis
           arr1 = data.map(d=>parseInt(d.Daily_Killed_Persons))
           arr2 = data.map(d=>parseInt(d.Daily_Injured_Persons))
           arrf = [Math.max(...arr1), Math.max(...arr2)]
           
           var y = d3.scaleLinear()
           .domain([0, Math.max(...arrf)])
           .range([ height, 0 ]);
           
           svg.append("g")
           .call(d3.axisLeft(y))
           .style("font-size","14px")
           .style("font-weight","bold");

           // Define colors for the lines (adjust as needed)
   const lineColor1 = "darkblue";
   const lineColor2 = "red";

   // Add the lines with appropriate colors and stroke-dasharray
   svg
       .append("path")
       .datum(data)
       .attr("fill", "none")
       .attr("stroke", lineColor1)
       .attr("stroke-width", 1.5)
       .attr("stroke-dasharray", "5,5")  // Dashed line
       .attr("d", d3.line()
           .x(function(d) { return x(d.Date) })
           .y(function(d) { return y(d.Daily_Killed_Persons) })
       );

   svg
       .append("path")
       .datum(data)
       .attr("fill", "none")
       .attr("stroke", lineColor2)
       .attr("stroke-width", 1.5)
       .attr("stroke-linejoin", "round")  // Rounded line
       .attr("d", d3.line()
           .x(function(d) { return x(d.Date) })
           .y(function(d) { return y(d.Daily_Injured_Persons) })
       );

           // Create the circle that travels along the curve of chart
           var focus = svg
           .append('g')
           .append('circle')
           .style("fill", "none")
           .attr("stroke", "rgba(245, 0, 16, 1)")
           .attr('r', 8.5)
           .style("opacity", 0)
           .style("pointer-events","none")

           var focus2 = svg
           .append('g')
           .append('circle')
           .style("fill", "none")
           .attr("stroke", "steelblue")
           .attr('r', 8.5)
           .style("opacity", 0)
           .style("pointer-events","none")

           // Create the text that travels along the curve of chart
           var focusText = svg
           .append('g')
           .append('text')
           .style("opacity", 0)
           .style("font-family","Arial")
           .style("font-weight","bold")
           .attr("text-anchor", "left")
           .attr("alignment-baseline", "middle")
           .style("pointer-events","none")

           var focusText2 = svg
           .append('g')
           .append('text')
           .style("opacity", 0)
           .style("font-family","Arial")
           .style("font-weight","bold")
           .attr("text-anchor", "left")
           .attr("alignment-baseline", "middle")
           .style("pointer-events","none")



           // Create a rect on top of the svg area: this rectangle recovers mouse position
           svg
           .append('rect')
           .style("fill", "none")
           .style("pointer-events", "all")
           .attr('width', width)
           .attr('height', height)
           .on('mouseover', mouseover)
           .on('mousemove', mousemove)
           .on('mouseout', mouseout);


           // What happens when the mouse move -> show the annotations at the right positions.
           function mouseover() {
               focus.style("opacity", 1)
               focusText.style("opacity",1)
               
               focus2.style("opacity", 1)
               focusText2.style("opacity",1)
           }

           function mousemove() {
           // recover coordinate we need
               // var x0 = x.invert(d3.mouse(this)[0]);
               // var i = bisect(data, x0, 1);
               var x0 = d3.mouse(this)[0];
               var i = Math.trunc(x0/step);
               selectedData = data[i];
               
               ykilled = y(selectedData.Daily_Killed_Persons);
               yinjured = y(selectedData.Daily_Injured_Persons);
               spacer = 20
               if(Math.abs(ykilled-yinjured)<20){
                   if(ykilled>=yinjured)
                       yinjured -= spacer
                   else
                       ykilled -= spacer 
               }

               focus
               .attr("cx", x(selectedData.Date))
               .attr("cy", y(selectedData.Daily_Killed_Persons))
               focusText
               .html("Date: " + selectedData.Date + "  : tuées: " + selectedData.Daily_Killed_Persons + " | cummul: " + selectedData.Cumulative_Killed_Persons)
               .attr("x", x(selectedData.Date)+15)
               .attr("y", ykilled)
               
               focus2
               .attr("cx", x(selectedData.Date))
               .attr("cy", y(selectedData.Daily_Injured_Persons))
               focusText2
               .html("Date: " + selectedData.Date + "  : " + "blessées: " + selectedData.Daily_Injured_Persons + " | cummul: " + selectedData.Cumulative_Killed_Persons)
               .attr("x", x(selectedData.Date)+15)
               .attr("y", yinjured)
           }
           function mouseout() {
           focus.style("opacity", 0)
           focusText.style("opacity", 0)

           focus2.style("opacity", 0)
           focusText2.style("opacity", 0)
           }

       }
   )    
}
