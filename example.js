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

// LABEL: Plastid
svg.append("text")
    .attr("x", 815)
    .attr("y", 130)
    .attr("font-size", "30px")
    .attr("fill", "#BDAF68")
    .attr("font-family", "Arial")
    .attr("font-weight", "bold")
    .text("Plastid");

// Plastid
svg.append("image")
    .attr("href", "Plastid.svg")    // Specify the path to your image
    .attr("x", -200)            // Position of the image
    .attr("y", -350)            // Position of the image
    .attr("width", 1700)       // Set the width of the image
    .attr("height", 2000);      // Set the height of the image

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
