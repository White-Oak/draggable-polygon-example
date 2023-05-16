import Flatten from 'flatten-js';
import * as d3 from 'd3'

function setup(){
  let {point, segment, circle, arc, Polygon, svg} = Flatten;
  const width = 480
  const height = 480
  let pw = width/48;
  let ph = height/48;

  let points = [point(12*pw,12*ph), point(12*pw, 36*ph),
                   point(24*pw, 24*ph), point(36*pw, 36*ph),
                   point(38*pw, 12*ph)]
  let circles = points.map( (p) => circle(p, 10) )
  // Create new polygon
  let polygon = new Polygon()
  polygon.addFace(points);
  
  let stage = d3.select(document.getElementById("stage"));

  // Add svg element to svg stage container
  let circles_svg = circles.reduce( (acc,shape) => acc += shape.svg({className:"circle",fill:"lightcyan",fillOpacity:0.4}), "");
  stage.html(polygon.svg({className:"polygon",fill:"green"}) + circles_svg);
  
  stage.selectAll(".circle")                          // Select all elements to be dragged
    .data(points)
    .call(d3.drag()
          .on("drag",dragged));               // Attach callback to drag event

  return stage.node()
  
  // "Drag" event callback 
  function dragged(event, data) {
    // Update model.point by new mouse coordinate
    data.x = event.x;
    data.y = event.y;
    let selected_element = d3.select(this);
    update(selected_element, data);                   // Update stage
  }
  
  // Update stage after model changed
  function update(elem, data) {
    // Update current circle element
    elem
      .attr("cx", data.x)
      .attr("cy", data.y);
      
    d3.selectAll(".polygon").remove();
    let polygon = new Polygon()
    polygon.addFace(points);
      
    stage.insert('svg', '.circle').html( polygon.svg({className:"polygon",fill:"green"}))
  }
}

setup();