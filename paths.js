// * What is inside of ER and what is inside of Vacuole?
// * Do the data points begin their path at different points?
// TODO: 
    // Start paths based on arrows... gonna have to edit a few...

// TODO
    // Starts at ICIT instead of CIT

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
        .attr("stroke", "grey")
        .attr("stroke-width", 2);
    
    // Define significant points on the circle
    const CircleSignificantPoints = [
        { x: circleData.cx + circleData.r * Math.cos(3 * Math.PI / 2), y: circleData.cy + circleData.r * Math.sin(3 * Math.PI / 2), label: "CIT", bidirectional: false},
        { x: circleData.cx + circleData.r * Math.cos(0), y: circleData.cy + circleData.r * Math.sin(0), label: "ICIT", bidirectional: true },
        // Calculate midpoint between the ICIT and SUCC
        {
            x: circleData.cx + circleData.r * Math.cos(Math.PI / 4), // Midpoint angle (45 degrees)
            y: circleData.cy + circleData.r * Math.sin(Math.PI / 4), // Midpoint angle (45 degrees)
            label: "AKG", bidirectional: false
        },
        { x: circleData.cx + circleData.r * Math.cos(Math.PI / 2), y: circleData.cy + circleData.r * Math.sin(Math.PI / 2), label: "SUCC", bidirectional: true },
        { x: circleData.cx + circleData.r * Math.cos(Math.PI), y: circleData.cy + circleData.r * Math.sin(Math.PI), label: "MAL", bidirectional: true },
        // Calculate midpoint between MAL and CIT
        {
            x: circleData.cx + circleData.r * Math.cos((Math.PI + 3 * Math.PI / 2) / 2),
            y: circleData.cy + circleData.r * Math.sin((Math.PI + 3 * Math.PI / 2) / 2),
            label: "OAA", bidirectional: true
        },
      ];

// Rotate the CircleSignificantPoints array to start with "CIT"
const rotateToCIT = (points) => {
    const citIndex = points.findIndex(point => point.label === "CIT");
    return [...points.slice(citIndex), ...points.slice(0, citIndex)];
};

const rotatedCirclePoints = rotateToCIT(CircleSignificantPoints);
    
    // Add significant points to the circle
    svg.selectAll("circle.point")
        .data(rotatedCirclePoints)
        .enter()
        .append("circle")
        .attr("class", "point")
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("r", d => d.well ? 10 : 5)
        .attr("fill", d => d.well ? "black" : "#36ADD4")
    
    // Add labels to the significant points
    svg.selectAll("text.point-label")
        .data(rotatedCirclePoints)
        .enter()
        .append("text")
        .attr("class", "point-label")
        .attr("x", d => d.x + 10)  // Adjust x position for better visibility
        .attr("y", d => d.y)
        .attr("font-size", "17px")
        .attr("font-family", "arial")
        .attr("fill", "black")
        .text(d => d.label);

// Create a line generator 
const lineGeneratorStraight = d3.line() // Straight
    .x(d => d.x)
    .y(d => d.y)
    .curve(d3.curveLinear); // Use curveLinear for straight lines

const lineGeneratorCurved = d3.line() // curved 
    .x(d => d.x)
    .y(d => d.y)
    .curve(d3.curveBasis); // Use a basis curve for smooth curves

const lineGeneratorCircle = d3.line() // curved 
    .x(d => d.x)
    .y(d => d.y)
    .curve(d3.curveBasisClosed); // Use a basis curve for smooth curves

function generateCirclePath(cx, cy, r) {
    const circlePoints = [];
    const numPoints = 100;  // Increase this number for a smoother circle
    for (let i = 0; i <= numPoints; i++) {
        const angle = (i / numPoints) * 2 * Math.PI;
        circlePoints.push({ x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) });
    }
    return circlePoints;
}

// Generate the path points for the circle starting from "CIT"
const generateCirclePathFromCIT = (cx, cy, r) => {
    const pathPoints = rotatedCirclePoints.map(point => ({ x: point.x, y: point.y }));
    const numPoints = 100;
    const circlePathData = lineGeneratorCircle(pathPoints);
    return pathPoints;
};

let currentPathIndex = 0;  // Keep track of the current path index
const animationDuration = 3000;  // Duration for each path animation in milliseconds

console.log("Circle Path: ", generateCirclePathFromCIT(circleData.cx, circleData.cy, circleData.r)); // debugging
        
well = false;
OAA2 = false;
const pathsData = [
    { points: [{ x: 480, y: -50, name: "GLCext", bidirectional: false},      // First point
               { x: 480, y: 100, name: "G6P" }, // Bidirectional?               Second point, and so on... 
               { x: 480, y: 230, name: "F6P", bidirectional: true},   
               { x: 480, y: 400, name: "TP", bidirectional: true},   
               { x: 480, y: 490, name: "3PG", bidirectional: true},      
               { x: 480, y: 620, name: "PEP", bidirectional: false},      
               { x: 480, y: 750, name: "PYRc", bidirectional: false}, 
               { x: 480, y: 875, name: "PYRm"}], // Bidirectional?              final point 
               name: "Blue Path", curve: false },
    { points: [{ x: 480, y: 875, name: "PYRm", bidirectional: false}, 
               { x: 490, y: 940, name: "ACECOA", bidirectional: false}, 
               { x: 600, y: 940, name: "CIT", bidirectional: true}], 
               name: "Red Path", curve: true }, 
    { points: generateCirclePath(circleData.cx, circleData.cy, circleData.r), 
                name: "Circle Path", curve: true },  // Add the circle path}  
    { points: [{ x: 480, y: 100, name: "G6P", bidirectional: false}, 
               { x: 670, y: 100, name: "P5P", bidirectional: true}, 
               { x: 830, y: 100, name: "X5P", bidirectional: true}, 
               { x: 930, y: 100, bidirectional: false}, 
               { x: 930, y: 400, bidirectional: false}, 
               { x: 620, y: 400, bidirectional: false}, 
               { x: 620, y: 200, bidirectional: false}, 
               { x: 670, y: 200, name: "TP", bidirectional: true},
               { x: 830, y: 360, name: "E4P", bidirectional: true}], 
               name: "Green Path-A", curve: false }, 
    { points: [{ x: 670, y: 360, name: "F6P", bidirectional: true},
               { x: 830, y: 200, name: "S7P", bidirectional: true}, 
               { x: 670, y: 100, name: "P5P"},],
                name: "Green Path-B", curve: false }, 
    { points: [{ x: 670, y: 200, name: "TP", bidirectional: true}, 
               { x: 830, y: 100, name: "X5P", bidirectional: true}],
               name: "Green Path-C", curve: false }, 
    { points: [{ x: 670, y: 360, name: "F6P", bidirectional: true},
               { x: 750, y: 420, bidirectional: false},
               { x: 830, y: 360, name: "E4P", bidirectional: true}],
               name: "Green Path-D", curve: true }, 
    { points: [{ x: 670, y: 100, name: "P5P", bidirectional: false}, 
               { x: 670, y: 50, name: "HIS", bidirectional: false}],
               name: "Green Path-E", curve: false }, 
    { points: [{ x: 670, y: 100, bidirectional: false}, 
               { x: 760, y: 50, bidirectional: false}, 
               { x: 800, y: 50, name: "NA", well: true, bidirectional: false}], 
               name: "Green Path-F", curve: false}, 
    { points: [{ x: 480, y: 100, name: "G6P", bidirectional: false}, 
               { x: 290, y: 100, bidirectional: false}, 
               { x: 290, y: 50, name: "WALL", well: true, bidirectional: false}], 
               name: "WALL Well", curve: false}, 
    { points: [{ x: 480, y: 230, name: "F6P", bidirectional: false}, 
               { x: 180, y: 230, name: "MANeff", well: true, bidirectional: false}], 
               name: "MANeff Well", curve: false}, 
    { points: [{ x: 480, y: 400, name: "TP", bidirectional: false}, 
               { x: 230, y: 400, name: "TAG", well: true, bidirectional: false}], 
               name: "TAG Well", curve: false},
    { points: [{ x: 480, y: 490, name: "3PG", bidirectional: false}, 
               { x: 365, y: 490, name: "SER", well: false, bidirectional: false},
               { x: 365, y: 570, name: "SEReff", well: true, bidirectional: false}], 
               name: "SEReff Path", curve: false},
    { points: [{ x: 365, y: 490, name: "SER", bidirectional: true}, 
               { x: 230, y: 490, name: "GLY", well: false, bidirectional: false}, 
               { x: 130, y: 490, name: "GLYeff", well: true, bidirectional: false}], 
               name: "GLYeff Well", curve: false},
    { points: [{ x: 230, y: 490, name: "GLY", well: false, bidirectional: true},
               { x: 230, y: 600, name: "THR", bidrectional: false},
               { x: 230, y: 720, name: "ASP", bidirectional: false},
               { x: 230, y: 830, name: "MET", well: true, bidirectional: false}], 
               name: "GLY to MET", curve: false},
    { points: [{ x: 230, y: 600, name: "THR", bidrectional: false},
               { x: 180, y: 550, bidirectional: false},
               { x: 90, y: 550, name: "THReff", well: true, bidirectional: false}],
               name: "THReff Well", curve: false},
    { points: [{ x: 230, y: 600, name: "THR", bidrectional: false},
               { x: 90, y: 600, name: "ILE", well: true, bidrectional: false},],
               name: "ILE Well", curve: false},
    { points: [{ x: 230, y: 720, name: "ASP", bidirectional: false},
               { x: 120, y: 720, name: "ASPeff", well: true, bidirectional: false}],
               name: "ASPeff Well", curve: false},
    { points: [{ x: 230, y: 720, name: "ASP", bidirectional: true},
               { x: 285, y: 720, bidrectional: true},
               { x: 285, y: 983.9339828220179, bidirectional: true},
               { x: 493.93398282201787, y: 983.9339828220179, name: "OAA", bidirectional: true}],
               name: "ASP to OAA", curve: false},
    { points: [{ x: 230, y: 600, name: "THR", bidrectional: false},
               { x: 50, y: 720, bidirectional: false},
               { x: 50, y: 810, bidirectional: false},
               { x: 230, y: 1090, name: "PROCOA", bidirectional: false},
               { x: 365, y: 1200, name: "METCIT", bidirectional: false},
               { x: 415, y: 1235, name: "IMETCIT",bidirectional: true},
               { x: 500, y: 1280, bidirectional: true},
               { x: 600, y: 1240, name: "SUCC", bidirectional: false}],
                name: "THR to SUCC", curve: true}, 
    { points: [{ x: 493.93398282201787, y: 983.9339828220179, name: "OAA", bidirectional: false},
               { x: 295, y: 1060, bidirectional: false},
               { x: 365, y: 1200, name: "METCIT", bidirectional: false}],
               name: "OAA to METCIT", curve: true},
    { points: [{ x: 500, y: 1265, bidirectional: false},
               { x: 500, y: 1220, name: "PYRm", bidirectional: false}],
                name: "Bottom PYRm Path", curve: false},
    { points: [{ x: 480, y: 620, name: "PEP", bidirectional: false},
               { x: 570, y: 490, bidirectional: false},
               { x: 670, y: 490, name: "PHE", bidirectional: false, well: true}],
               name: "PEP to PHE", curve: false},
    { points: [{ x: 480, y: 620, name: "PEP", bidirectional: false},
               { x: 570, y: 570, bidirectional: false},
               { x: 670, y: 570, name: "TYR", bidirectional: false, well: true}],
               name: "PEP to TYR", curve: false},
    { points: [{ x: 480, y: 620, name: "PEP", bidirectional: true},
               { x: 365, y: 620, bidirectional: true},
               { x: 365, y: 875, bidirectional: true},
               { x: 493.93398282201787, y: 983.9339828220179, name: "OAA", bidirectional: false}],
               name: "PEP to OAA", curve: false},
    { points: [{ x: 480, y: 750, name: "PYRc", bidirectional: false},
               { x: 570, y: 670, bidirectional: false},
               { x: 670, y: 670, name: "ALA", bidirectional: false, well: true}],
               name: "PYRc to ALA", curve: false},
    { points: [{ x: 450, y: 1090, name: "MAL", bidirectional: false},
               { x: 285, y: 990, bidirectional: false},
               { x: 480, y: 875, name: "PYRm", bidirectional: false}],
               name: "MAL to PYRm", curve: true},
    { points: [{ x: 480, y: 875, name: "PYRm", bidirectional: false}, 
               { x: 450, y: 940, bidirectional: false},
               { x: 493.93398282201787, y: 983.9339828220179, name: "OAA", bidirectional: false}],
               name: "PYRm to OAA", curve: true},
    { points: [{ x: 480, y: 875, name: "PYRm", bidirectional: false},
               { x: 670, y: 800, name: "VAL", bidirectional: false},
               { x: 800, y: 800, name: "LEU", bidirectional: false, well: true}],
               name: "PYRm to LEU", curve: false},
    { points: [{ x: 670, y: 800, name: "VAL", bidirectional: false},
               { x: 800, y: 670, name: "VALeff", bidirectional: false, well: true}],
               name: "VAL to VALeff", curve: false},
    { points: [{ x: 600, y: 940, name: "CIT", bidirectional: false},
               { x: 600, y: 860, bidirectional: false},
               { x: 800, y: 850, name: "OAA", bidirectional: false, OAA2: true}],
               name: "CIT to OAA", curve: true},
    { points: [{ x: 620, y: 880, bidirectional: false},
               { x: 800, y: 890, name: "ACECOAc", bidirectional: false},
               { x: 970, y: 890, name: "FA", well: true, bidirectional: false}],
               name: "CIT to FA", curve: false},
    { points: [{ x: 750, y: 1090, name: "ICIT", bidirectional: true},
               { x: 600, y: 1090, name: "GYLX", bidirectional: false},
               { x: 450, y: 1090, name: "MAL", bidirectional: false}],
               name: "ICIT to MAL", curve: false},
    { points: [{ x: 525, y: 1090, bidirectional: false},
               { x: 540, y: 1090},
               { x: 555, y: 1040, name: "ACECOAm", bidirectional: false, well: true}], // ? is this a well??
               name: "ACECOA Curve", curve: true},
    { points: [{ x: 675, y: 1090, bidirectional: false},
               { x: 630, y: 1140},
               { x: 600, y: 1240, name: "SUCC", bidirectional: false}],
               name: "SUCC Curve", curve: true},
    { points: [{ x: 706.0660171779821, y: 1196.066017177982, bidirectional: false, name: "AKG"},
               { x: 800, y: 1100, name: "HCIT", bidirectional: false,},
               { x: 880, y: 1030, name: "LYS", bidirectional: false, well: true}],
               name: "AKG to LYS", curve: false},
    { points: [{ x: 706.0660171779821, y: 1196.066017177982, bidirectional: false, name: "AKG"},
               { x: 830, y: 1196.066017177982, name: "GLU", bidirectional: true},
               { x: 940, y: 1196.066017177982, name: "ARG", bidirectional: true, well: true}],
               name: "AKG to ARG", curve: false},
    { points: [{ x: 830, y: 1196.066017177982, name: "GLU", bidirectional: false},
               { x: 920, y: 1110, name: "PRO", bidirectional: false, well: true}],
               name: "GLU to PRO", curve: false},
    { points: [{ x: 830, y: 1196.066017177982, name: "GLU", bidirectional: false},
               { x: 920, y: 1260, name: "GLUeff", bidirectional: false, well: true}],
                name: "GLU to GLUeff", curve: false},
    { points: [{ x: 830, y: 1260, name: "GLUext", bidirectional: false, well: true},
               { x: 830, y: 1196.066017177982, name: "GLU", bidirectional: false}],
               name: "GLUext to GLU", curve: false}      
];
    
// Create multiple paths
pathsData.forEach((pathData, index) => {

    const lineGenerator = pathData.curve ? lineGeneratorCurved : lineGeneratorStraight;

    // Create the path element
    const path = svg.append("path")
        .datum(pathData.points)
        .attr("d", lineGenerator)
        .attr("fill", "none")
        .attr("stroke", "grey")
        .attr("stroke-width", 2);

    // Add circles and labels only for points with names
    const significantPoints = pathData.points.filter(d => d.name);
    
    // Add points on the path
    svg.selectAll(`.path-point-${index}`)
        .data(significantPoints)
        .enter()
        .append("circle")
        .attr("class", `path-point-${index}`)
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("r", d => d.well ? 10 : 5)
        .attr("fill", d => d.well ? "black" : "#36ADD4")
    
    // Add labels to the points
    svg.selectAll(`.path-label-${index}`)
        .data(significantPoints)
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

        // Create a circle (carbon molecule)
    /*const molecule = svg.append("circle")
    .attr("r", 5)  // Radius of the circle
    .attr("fill", "#63FF48");  // Color of the circle*/
});

console.log("significantPoints:", pathsData); // for debugging
console.log("CircleSignificantPoints:", CircleSignificantPoints); // for debugging
    
function animatePath(pathData, callback) {
    const path = svg.append("path")
        .attr("d", d3.line()
            .curve(d3.curveLinear)
            .x(d => d.x)
            .y(d => d.y)(pathData.points))
        .attr("fill", "none")
        .attr("stroke", "#63FF48")
        .attr("stroke-width", 5);

    const totalLength = path.node().getTotalLength();

    path.attr("stroke-dasharray", `${totalLength} ${totalLength}`)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .duration(animationDuration)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0)
        .on("end", () => {
            path.remove();  // Remove the path after the animation completes
            callback();  // Call the callback function to proceed to the next path
        });
}

function startAnimation() {
    if (currentPathIndex < pathsData.length) {
        animatePath(pathsData[currentPathIndex], () => {
            currentPathIndex++;
            setTimeout(startAnimation, 500);  // Add a 500ms delay before starting the next path animation
        });
    } else {
        currentPathIndex = 0;  // Reset to the first path for continuous loop
        console.log("Start of next Animation.")
        setTimeout(startAnimation, 500);  // Start again after a delay
    }
}

startAnimation();

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
    .attr("x", 160)
    .attr("y", 430)
    .attr("font-size", "30px")
    .attr("fill", "rgb(100% 0% 0%)")
    .attr("font-family", "Arial")
    .attr("font-weight", "bold")
    .text("ER");

// ER
svg.append("image")
    .attr("href", "ER.svg")    // Specify the path to your image
    .attr("x", -10)            // Position of the image
    .attr("y", 220)            // Position of the image
    .attr("width", 550)       // Set the width of the image
    .attr("height", 550)      // Set the height of the image
    .attr("opacity", 0.5);

// LABEL: Mitochondria
svg.append("text")
    .attr("x", 550)
    .attr("y", 1320)
    .attr("font-size", "30px")
    .attr("fill", "rgb(77.6% 77.6% 77.6%)")
    .attr("font-family", "Arial")
    .attr("font-weight", "bold")
    .text("Mitochondria");

// Mitochondria
svg.append("image")
    .attr("href", "Mitochondria.svg")    // Specify the path to your image
    .attr("x", -430)            // Position of the image
    .attr("y", -380)            // Position of the image
    .attr("width", 2200)       // Set the width of the image
    .attr("height", 2050)      // Set the height of the image
    .attr("opacity", 0.5);

// Vacuole 
svg.append("ellipse")
    .attr("cx", 180)  // Position towards the right side
    .attr("cy", 170)          // Position towards the top side
    .attr("rx", 115)          // Radius on x-axis
    .attr("ry", 130)           // Radius on y-axis
    .attr("stroke", "#36ADD4")
    .attr("stroke-width", 3)
    .attr("fill", "none")
    .attr("opacity", 0.5);

// LABEL: Vacuole
svg.append("text")
    .attr("x", 130)
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
