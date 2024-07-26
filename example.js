const svg = d3.select("#svgContainer");

// SVG dimensions
const width = 1200;
const height = 1350;

// Create the outer rectangle (for the outer border)
svg.append("rect")
    .attr("x", 2.5)                     // Position to offset for the double border effect
    .attr("y", 2.5)                     // Position to offset for the double border effect
    .attr("width", width - 5)           // Adjust width for border size
    .attr("height", height - 5)         // Adjust height for border size
    .attr("fill", "none")
    .attr("stroke", "#7B6F56")          // Outer border color
    .attr("stroke-width", 3)            // Outer border width
    .attr("rx", 20)                     // Rounded corners radius on x-axis
    .attr("ry", 20);                    // Rounded corners radius on y-axis

// Create the inner rectangle (for the inner border and fill)
svg.append("rect")
    .attr("x", 7.5)                     // Position to offset for the double border effect
    .attr("y", 7.5)                     // Position to offset for the double border effect
    .attr("width", width - 15)          // Adjust width for border size
    .attr("height", height - 15)        // Adjust height for border size
    .attr("fill", "white")          // Background color
    .attr("stroke", "#7B6F56")          // Inner border color
    .attr("stroke-width", 3)            // Inner border width
    .attr("rx", 20)                     // Rounded corners radius on x-axis
    .attr("ry", 20);                    // Rounded corners radius on y-axis


const pathsData = [
    { points: [{ x: 480, y: -50, name: "GLCext"},      // First point
               { x: 480, y: 100, name: "G6P" },      // Second point, and so on... 
               { x: 480, y: 230, name: "F6P"},   
               { x: 480, y: 360, name: "TP"},   
               { x: 480, y: 490, name: "3PG"},      
               { x: 480, y: 620, name: "PEP" },      
               { x: 480, y: 750, name: "PYRc" }],     // final point 
               name: "Path 1" },
    { points: [{ x: 480, y: 875, name: "PYRm"}, 
               { x: 490, y: 940, name: "ACECOA" }, 
               { x: 600, y: 940, name: "CIT" }], 
               name: "Path 2" }
];
    
// Create a line generator with a curve
const lineGenerator = d3.line()
    .x(d => d.x)
    .y(d => d.y)
    .curve(d3.curveBasis); // Use a basis curve for smooth curves
    
// Create multiple paths
pathsData.forEach((pathData, index) => {
    // Create the path element
    svg.append("path")
        .datum(pathData.points)
        .attr("d", lineGenerator)
        .attr("fill", "none")
        .attr("stroke", index % 2 ? "blue" : "green")
        .attr("stroke-width", 2);
    
    // Add points on the path
    svg.selectAll(`.path-point-${index}`)
        .data(pathData.points)
        .enter()
        .append("circle")
        .attr("class", `path-point-${index}`)
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("r", 5)
        .attr("fill", "red");
    
    // Add labels to the points
    svg.selectAll(`.path-label-${index}`)
        .data(pathData.points)
        .enter()
        .append("text")
        .attr("class", `path-label-${index}`)
        .attr("x", d => d.x + 10)
        .attr("y", d => d.y)
        .attr("font-size", "17px")
        .attr("font-family", "arial")
        .attr("fill", "black")
        .text((d, i) => pathData.name + " " + (i + 1))
        .text(d => d.name);
});

const circleData = {
    cx: 600,          // Center x-coordinate
    cy: 1090,          // Center y-coordinate
    r: 150            // Radius
};

// Create the circle path
svg.append("circle")
    .attr("cx", circleData.cx)
    .attr("cy", circleData.cy)
    .attr("r", circleData.r)
    .attr("fill", "none")
    .attr("stroke", "blue")
    .attr("stroke-width", 2);

// Define significant points on the circle
const significantPoints = [
    { x: circleData.cx + circleData.r * Math.cos(0), y: circleData.cy + circleData.r * Math.sin(0), label: "ICIT" },
    // Calculate midpoint between the second and third points
    {
        x: circleData.cx + circleData.r * Math.cos(Math.PI / 4), // Midpoint angle (45 degrees)
        y: circleData.cy + circleData.r * Math.sin(Math.PI / 4), // Midpoint angle (45 degrees)
        label: "AKG"
    },
    { x: circleData.cx + circleData.r * Math.cos(Math.PI / 2), y: circleData.cy + circleData.r * Math.sin(Math.PI / 2), label: "SUCC" },
    { x: circleData.cx + circleData.r * Math.cos(Math.PI), y: circleData.cy + circleData.r * Math.sin(Math.PI), label: "MAL" },
    // Calculate midpoint between MAL and CIT
    {
        x: circleData.cx + circleData.r * Math.cos((Math.PI + 3 * Math.PI / 2) / 2),
        y: circleData.cy + circleData.r * Math.sin((Math.PI + 3 * Math.PI / 2) / 2),
        label: "OAA"
    },
    { x: circleData.cx + circleData.r * Math.cos(3 * Math.PI / 2), y: circleData.cy + circleData.r * Math.sin(3 * Math.PI / 2), label: "CIT" }
];

// Add significant points to the circle
svg.selectAll("circle.point")
    .data(significantPoints)
    .enter()
    .append("circle")
    .attr("class", "point")
    .attr("cx", d => d.x)
    .attr("cy", d => d.y)
    .attr("r", 5)
    .attr("fill", "red");

// Add labels to the significant points
svg.selectAll("text.point-label")
    .data(significantPoints)
    .enter()
    .append("text")
    .attr("class", "point-label")
    .attr("x", d => d.x + 10)  // Adjust x position for better visibility
    .attr("y", d => d.y)
    .attr("font-size", "17px")
    .attr("font-family", "arial")
    .attr("fill", "black")
    .text(d => d.label);
    

// LABEL: Cytosol
svg.append("text")
    .attr("x", 1050)
    .attr("y", 1325)
    .attr("font-size", "30px")
    .attr("fill", "#7B6F56")
    .attr("font-family", "Arial")
    .attr("font-weight", "bold")
    .text("Cytosol");

// LABEL: ER
svg.append("text")
    .attr("x", 240)
    .attr("y", 460)
    .attr("font-size", "30px")
    .attr("fill", "rgb(100% 0% 0%)")
    .attr("font-family", "Arial")
    .attr("font-weight", "bold")
    .text("ER");

// ER
svg.append("image")
    .attr("href", "ER.svg")    // Specify the path to your image
    .attr("x", -227)            // Position of the image
    .attr("y", 200)            // Position of the image
    .attr("width", 1000)       // Set the width of the image
    .attr("height", 800);      // Set the height of the image

// LABEL: Mitochondria
svg.append("text")
    .attr("x", 525)
    .attr("y", 1270)
    .attr("font-size", "30px")
    .attr("fill", "rgb(77.6% 77.6% 77.6%)")
    .attr("font-family", "Arial")
    .attr("font-weight", "bold")
    .text("Mitochondria");

// Mitochondria
svg.append("image")
    .attr("href", "Mitochondria.svg")    // Specify the path to your image
    .attr("x", -300)            // Position of the image
    .attr("y", -350)            // Position of the image
    .attr("width", 1900)       // Set the width of the image
    .attr("height", 2000);      // Set the height of the image

// Vacuole 
svg.append("ellipse")
    .attr("cx", 225)  // Position towards the right side
    .attr("cy", 170)          // Position towards the top side
    .attr("rx", 115)          // Radius on x-axis
    .attr("ry", 130)           // Radius on y-axis
    .attr("stroke", "#36ADD4")
    .attr("stroke-width", 3)
    .attr("fill", "none");

// LABEL: Vacuole
svg.append("text")
    .attr("x", 171)
    .attr("y", 90)
    .attr("font-size", "30px")
    .attr("fill", "#36ADD4")
    .attr("font-family", "Arial")
    .attr("font-weight", "bold")
    .text("Vacuole");

// Create static circles representing carbon
/*const carbonData = [
    { cx: 150, cy: 150, radius: 10 },
    { cx: 250, cy: 250, radius: 10 },
    { cx: 350, cy: 350, radius: 10 }
];

svg.selectAll("circle")
    .data(carbonData)
    .enter()
    .append("circle")
    .attr("cx", d => d.cx)
    .attr("cy", d => d.cy)
    .attr("r", d => d.radius)
    .attr("fill", "black");*/
