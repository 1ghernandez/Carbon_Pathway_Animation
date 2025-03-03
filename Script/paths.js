// * Do the data points begin their path at different points?

const svg = d3.select("#svgContainer");

class Molecule {
    constructor(reaction, fluxValue, normalized) {
        this.reaction = reaction;
        this.fluxValue = fluxValue;
        this.normalized = normalized;
    }
}

// Load the CSV data and return a Promise
function loadMolecules() {
    return d3.csv("./ProvidedData/Flux_Values_for_animation.csv").then(function(data) {
        console.log("Raw CSV data:", data);  // Log raw CSV data DEBUGGING
        console.log("Is data an array?", Array.isArray(data));  // Check if data is an array DEBUGGING

        let allMolecules = [];
        data.forEach(d => {
            // Create a new Molecule object for each row in the CSV
            let molecule = new Molecule(d['Reaction'], d['Flux Value'], d['Normalized']);
            allMolecules.push(molecule);
        });

        console.log("Processed Molecules:", allMolecules);  // Log processed molecules DEBUGGING
        console.log("Is allMolecules an array?", Array.isArray(allMolecules));  // Check if allMolecules is an array DEBUGGING
        return allMolecules;
    }).catch(function(error) {
        console.error('Error loading or parsing CSV file:', error);
        return [];  // Return an empty array in case of error
    });
}

// * BEGIN: Static Elements

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
    .attr("x", 160)
    .attr("y", 430)
    .attr("font-size", "30px")
    .attr("fill", "rgb(100% 0% 0%)")
    .attr("font-family", "Arial")
    .attr("font-weight", "bold")
    .text("ER");

// ER
svg.append("image")
    .attr("href", "./Images/ER.svg")    // Specify the path to your image
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
    .attr("href", "./Images/Mitochondria.svg")    // Specify the path to your image
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

// * END: Static Elements

// * BEGIN: Paths 
    const circleData = {
        cx: 600,          // Center x-coordinate
        cy: 1090,          // Center y-coordinate
        r: 150            // Radius
    };
    
    // Create the circle path
    const circlePath = svg.append("circle")
        .attr("cx", circleData.cx)
        .attr("cy", circleData.cy)
        .attr("r", circleData.r)
        .attr("fill", "none")
        .attr("stroke", "grey")
        .attr("stroke-width", 2)
        .attr("class", "static-circle");  // Add class to identify it
    
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
        // Calculate midpoint between MAL and CIT
        {
            x: circleData.cx + circleData.r * Math.cos((Math.PI + 3 * Math.PI / 2) / 2),
            y: circleData.cy + circleData.r * Math.sin((Math.PI + 3 * Math.PI / 2) / 2),
            label: "OAA", bidirectional: true
        },
        { x: circleData.cx + circleData.r * Math.cos(Math.PI), y: circleData.cy + circleData.r * Math.sin(Math.PI), label: "MAL", bidirectional: true }
      ];
    
    // Add significant points to the circle
    svg.selectAll("circle.point")
        .data(CircleSignificantPoints)
        .enter()
        .append("circle")
        .attr("class", "point static-point circle-point")  // Add more specific classes
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("r", 10)
        .attr("fill", "#36ADD4")  // Always use blue
        .attr("data-type", "static");  // Add data attribute to identify static points
    
    // Add labels to the significant points
    svg.selectAll("text.point-label")
        .data(CircleSignificantPoints)
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
    const startAngle = 3 * Math.PI / 2; // Start from CIT
    for (let i = 0; i <= numPoints; i++) {
        const angle = startAngle + (i / numPoints) * 2 * Math.PI;
        circlePoints.push({ x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) });
    }
    return circlePoints;
}

let currentPathIndex = 0;  // Keep track of the current path index
const animationDuration = 3000;  // Duration for each path animation in milliseconds
const animationDelay = 300;  // Delay between dots in milliseconds
        
well = false;
OAA2 = false;
const pathsData = [
    { points: [{ x: 480, y: -50, name: "GLC.ext", bidirectional: false},      // First point
               { x: 480, y: 100, name: "G6P" }, // Bidirectional?               Second point, and so on... 
               { x: 480, y: 230, name: "F6P", bidirectional: true},   
               { x: 480, y: 400, name: "TP", bidirectional: true},   
               { x: 480, y: 490, name: "3PG", bidirectional: true},      
               { x: 480, y: 620, name: "PEP", bidirectional: false},      
               { x: 480, y: 750, name: "PYR.c", bidirectional: false}, 
               { x: 480, y: 875, name: "PYR.m"}], // Bidirectional?              final point 
               name: "Blue Path", curve: false },
    { points: [{ x: 480, y: 875, name: "PYR.m", bidirectional: false},
               { x: 600, y: 940, name: "CIT", bidirectional: true}], 
               name: "Red Path", curve: true }, 
    { points: generateCirclePath(circleData.cx, circleData.cy, circleData.r), 
                name: "Circle Path", curve: true },  // Add the circle path}  
    { points: [{ x: 480, y: 100, name: "G6P", bidirectional: false}, 
               { x: 670, y: 100, name: "P5P", bidirectional: true}],
               name: "Green Path-sequence1", curve: false }, 
    { points: [{ x: 670, y: 100, name: "P5P", bidirectional: true}, 
                { x: 830, y: 100, name: "X5P", bidirectional: true}], 
                name: "Green Path-sequence2", curve: false },
    { points: [ { x: 830, y: 100, name: "X5P", bidirectional: true}, 
                { x: 930, y: 100, bidirectional: false}], 
                name: "Green Path-sequence4", curve: false }, 
    { points: [ { x: 930, y: 100, bidirectional: false}, 
                { x: 930, y: 400, bidirectional: false}],
                name: "Green Path-sequence5", curve: false }, 
    { points: [ { x: 930, y: 400, bidirectional: false}, 
                { x: 620, y: 400, bidirectional: false}],
                name: "Green Path-sequence6", curve: false }, 
    { points: [ { x: 620, y: 400, bidirectional: false}, 
                { x: 620, y: 200, bidirectional: false}],
                name: "Green Path-sequence7", curve: false }, 
    { points: [ { x: 620, y: 200, bidirectional: false}, 
                { x: 670, y: 200, name: "TP", bidirectional: true}],
                name: "Green Path-sequence8", curve: false }, 
    { points: [ { x: 670, y: 200, name: "TP", bidirectional: true},
                { x: 830, y: 360, name: "E4P", bidirectional: true}], 
                name: "Green Path-sequence9", curve: false }, 
    { points: [{ x: 670, y: 100, name: "P5P"},
               { x: 830, y: 200, name: "S7P", bidirectional: true},
               { x: 670, y: 360, name: "F6P", bidirectional: true}],
                name: "Green Path-sequence10", curve: false }, 
    { points: [{ x: 830, y: 100, name: "X5P", bidirectional: true},
               { x: 670, y: 200, name: "TP", bidirectional: true}],
               name: "Green Path-sequence11", curve: false }, 
    { points: [ { x: 830, y: 360, name: "E4P", bidirectional: true},
                { x: 750, y: 420, bidirectional: false},
                { x: 670, y: 360, name: "F6P", bidirectional: true}],
                name: "Green Path-sequence12", curve: true }, 
    { points: [{ x: 480, y: 100, name: "G6P", bidirectional: false}, 
               { x: 290, y: 100, bidirectional: false}, 
               { x: 290, y: 50, name: "WALL", well: true, bidirectional: false}], 
               name: "WALL Well", curve: false}, 
    { points: [{ x: 480, y: 230, name: "F6P", bidirectional: false}, 
               { x: 180, y: 230, name: "MAN", well: true, bidirectional: false}], 
               name: "MAN Well", curve: false}, 
    { points: [{ x: 480, y: 400, name: "TP", bidirectional: false}, 
               { x: 230, y: 400, name: "TG", well: true, bidirectional: false}], 
               name: "TG Well", curve: false},
    { points: [{ x: 480, y: 490, name: "3PG", bidirectional: false}, 
               { x: 365, y: 490, name: "SER", well: false, bidirectional: false}], 
               name: "SER.eff Path", curve: false},
    { points: [{ x: 365, y: 490, name: "SER", bidirectional: true}, 
               { x: 230, y: 490, name: "GLY", well: false, bidirectional: false}], 
               name: "GLY.eff Well", curve: false},
    { points: [{ x: 230, y: 720, name: "ASP", bidirectional: false},
               { x: 230, y: 600, name: "THR", bidrectional: false},
               { x: 230, y: 490, name: "GLY", well: false, bidirectional: true}], 
               name: "ASP to GLY", curve: false},
    { points: [{ x: 493.93398282201787, y: 983.9339828220179, name: "OAA", bidirectional: true},
               { x: 285, y: 983.9339828220179, bidirectional: true},
               { x: 285, y: 720, bidrectional: true},
               { x: 230, y: 720, name: "ASP", bidirectional: true}],
               name: "ASP to OAA", curve: false},
    { points: [{ x: 230, y: 600, name: "THR", bidrectional: false},
               { x: 50, y: 720, bidirectional: false},
               { x: 50, y: 810, bidirectional: false},
               { x: 230, y: 1090, bidirectional: false},
               { x: 365, y: 1200, name: "METCIT", bidirectional: false},
               { x: 500, y: 1280, bidirectional: true},
               { x: 600, y: 1240, name: "SUCC", bidirectional: false}],
                name: "THR to SUCC", curve: true}, 
    { points: [{ x: 493.93398282201787, y: 983.9339828220179, name: "OAA", bidirectional: false},
               { x: 295, y: 1060, bidirectional: false},
               { x: 365, y: 1200, name: "METCIT", bidirectional: false}],
               name: "OAA to METCIT", curve: true},
    { points: [{ x: 500, y: 1265, bidirectional: false},
               { x: 500, y: 1220, name: "PYR.m", bidirectional: false}],
                name: "Bottom PYRm Path", curve: false},
    { points: [{ x: 480, y: 620, name: "PEP", bidirectional: true},
               { x: 365, y: 620, bidirectional: true},
               { x: 365, y: 875, bidirectional: true},
               { x: 493.93398282201787, y: 983.9339828220179, name: "OAA", bidirectional: false}],
               name: "PEP to OAA", curve: false},
    { points: [{ x: 450, y: 1090, name: "MAL", bidirectional: false},
               { x: 285, y: 990, bidirectional: false},
               { x: 480, y: 875, name: "PYR.m", bidirectional: false}],
               name: "MAL to PYR.m", curve: true},
    { points: [{ x: 600, y: 940, name: "CIT", bidirectional: false},
               { x: 600, y: 860, bidirectional: false},
               { x: 800, y: 850, name: "OAA", bidirectional: false, OAA2: true}],
               name: "CIT to OAA", curve: true},
    { points: [{ x: 620, y: 880, bidirectional: false},
               { x: 800, y: 890, name: "ACECOA.c", bidirectional: false},
               { x: 970, y: 890, name: "Fatty Acids", well: true, bidirectional: false}],
               name: "CIT to Fatty Acids", curve: false},
    { points: [{ x: 750, y: 1090, name: "ICIT", bidirectional: true},
               { x: 600, y: 1090, name: "GYLX", bidirectional: false},
               { x: 450, y: 1090, name: "MAL", bidirectional: false}],
               name: "ICIT to MAL", curve: false},
    { points: [{ x: 525, y: 1090, bidirectional: false},
               { x: 540, y: 1090},
               { x: 555, y: 1040, name: "ACECOA.m", bidirectional: false, well: true}], // ? is this a well??
               name: "ACECOA Curve", curve: true},
    { points: [{ x: 675, y: 1090, bidirectional: false},
               { x: 630, y: 1140},
               { x: 600, y: 1240, name: "SUCC", bidirectional: false}],
               name: "SUCC Curve", curve: true},
    { points: [ { x: 830, y: 1196.066017177982, name: "GLU", bidirectional: true},
                { x: 706.0660171779821, y: 1196.066017177982, name: "AKG", bidirectional: false}],
                name: "GLU to AKG", curve: false},
    { points: [{ x: 830, y: 1400, name: "GLU.ext", bidirectional: false, well: true},
               { x: 830, y: 1196.066017177982, name: "GLU", bidirectional: false}],
               name: "GLU.ext to GLU", curve: false}      
];

const SignificantCoordinates = {
    "GLC.ext": {x: 480, y: -50},
    "G6P": {x: 480, y: 100},
    "F6P": {x: 480, y: 230, greenpath: true},
    "TP": {x: 480, y: 400, greenpath: false},
    "3PG": {x: 480, y: 490},
    "PEP": {x: 480, y: 620},
    "PYR.c": {x: 480, y: 750},
    "PYRm": {x: 480, y: 875},
    "CIT": { x: 600, y: 940 },
    "P5P": {x: 670, y: 100},
    "X5P": {x: 830, y: 100},
    "TP2": {x: 670, y: 200, greenpath: true},
    "E4P": {x: 830, y: 360},
    "S7P": {x: 830, y: 200},
    "WALL": {x: 290, y: 50},
    "MAN": {x: 180, y: 230},
    "TG": {x: 230, y: 400},
    "SER": {x: 365, y: 490},
    "SER.eff": {x: 365, y: 570},
    "GLY": {x: 230, y: 490},
    "THR": {x: 230, y: 600},
    "ASP": {x: 230, y: 720},
    "METCIT": {x: 365, y: 1200},
    "OAA": {x: 493.93398282201787, y: 983.9339828220179, oaa2: false},
    "GLU": {x: 830, y: 1196.066017177982},
    "ARG": {x: 940, y: 1196.066017177982},
    "GLU.ext": {x: 830, y: 1260},
    "SUCC": {x: 600, y: 1240},
    "AKG": {x: 706.0660171779821, y: 1196.066017177982},
    "Fatty Acids": {x: 970, y: 890},
    "GYLX": {x: 600, y: 1090},
    "MAL": {x: 450, y: 1090},
    "ACECOA.m": {x: 555, y: 1040},
    "ACECOA.c": {x: 800, y: 890},
    "ICIT": {x: 750, y: 1090},
    "F6P2": {x: 670, y: 360, greenpath: false},
    "OAA2": {x: 800, y: 850, oaa2: true},
    "PYR.m": {x: 480, y: 875}
};
    
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
    
    // Add points on the path with static-point class
    svg.selectAll(`.path-point-${index}`)
        .data(significantPoints)
        .enter()
        .append("circle")
        .attr("class", `path-point-${index} static-point`)  // Add static-point class
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("r", 10)
        .attr("fill", "#36ADD4");  // Always use blue for static points
    
    // Add labels to the points
    svg.selectAll(`.path-label-${index}`)
        .data(significantPoints)
        .enter()
        .append("text")
        .attr("class", `path-label-${index}`)
        .attr("x", d => {
            // Special handling for ACECOA points
            if (d.name && d.name.includes('ACECOA')) {
                return d.x - 60;  // Adjust x position for ACECOA labels
            }
            return d.x + 10;
        })
        .attr("y", d => {
            // Special handling for ACECOA points
            if (d.name && d.name.includes('ACECOA')) {
                return d.y - 10;  // Adjust y position for ACECOA labels
            }
            return d.y;
        })
        .attr("font-size", "17px")
        .attr("font-family", "arial")
        .attr("fill", "black")
        .text(d => d.name);  // Use the full name, including suffix
});

console.log("significantPoints:", pathsData); // for debugging
console.log("CircleSignificantPoints:", CircleSignificantPoints); // for debugging

// * END: Paths 

// Add these variables near the top with other animation variables
let animationRunning = false;
let isPaused = false;
let activeTransitions = [];
let pausedDots = [];  // Store paused dot positions
let currentAnimation = null;  // Store the current animation timeout
let dotIntervals = [];  // Store all interval IDs for cleanup
let activePaths = [];  // Store all active paths
let currentDots = new Set();  // Add this back - Keep track of active animation dots

// Animation configuration constants
const BASE_ANIMATION_DURATION = 2000;  // Base duration in ms
const ANIMATION_LOOP_TIME = 30000;     // Overall loop time in ms (15 seconds)
const FIXED_DOT_SPACING = 40;          // Fixed spacing between dots in pixels
const MIN_DOTS = 3;                    // Minimum number of dots per path

// Define stopAnimation as a standalone function
function stopAnimation() {
    animationRunning = false;
    
    // Clear all intervals
    dotIntervals.forEach(clearInterval);
    dotIntervals.length = 0;
    
    // Remove all animation dots
    svg.selectAll(".animation-dot").interrupt().remove();
    currentDots.clear();
    
    // Remove all paths
    activePaths.forEach(path => path.remove());
    activePaths.length = 0;
}

// Modify startAnimation to ensure all dots continue for the full 30 seconds
function startAnimation(pathsData, normalizedValues = []) {
    if (!Array.isArray(pathsData)) {
        console.error("pathsData is not an array:", pathsData);
        return;
    }

    // Clean up any previous animation
    if (!isPaused) {
        stopAnimation();
    }
    
    animationRunning = true;
    isPaused = false;
    
    // Reset arrays
    dotIntervals = [];
    activePaths = [];
    
    console.log("Starting new animation cycle at", new Date().toLocaleTimeString());
    
    // Calculate a global emission rate to maintain consistent spacing across ALL paths
    const GLOBAL_SPACING = 60; // Larger value = more spacing between dots
    const ANIMATION_CYCLE_TIME = 30000; // Change to 30 seconds
    
    // Create paths and start emitting dots
    pathsData.forEach((pathData, index) => {
        const normalizedValue = normalizedValues[index] || 0.5; // Default to middle value
        
        // Create the path
        const path = svg.append("path")
            .datum(pathData.points)
            .attr("d", pathData.curve ? lineGeneratorCurved : lineGeneratorStraight)
            .attr("fill", "none")
            .attr("stroke", "none");
            
        activePaths.push(path);
        
        // Create gradient definition
        const gradientId = `sphereGradient-${index}`;
        if (!svg.select(`#${gradientId}`).node()) {
            const gradient = svg.append("defs")
                .append("radialGradient")
                .attr("id", gradientId)
                .attr("cx", "50%")
                .attr("cy", "50%")
                .attr("r", "50%")
                .attr("fx", "30%")
                .attr("fy", "30%");

            gradient.append("stop")
                .attr("offset", "0%")
                .attr("stop-color", "#ffffff")
                .attr("stop-opacity", 0.8);

            gradient.append("stop")
                .attr("offset", "100%")
                .attr("stop-color", "#014f86")
                .attr("stop-opacity", 1);
        }
        
        const pathNode = path.node();
        const totalLength = pathNode.getTotalLength();
        
        // Calculate dot speed based on normalized value
        const speedFactor = Math.max(0.01, normalizedValue);
        
        // Calculate animation duration - inversely proportional to speed
        const animationDuration = BASE_ANIMATION_DURATION / speedFactor;
        
        // Calculate emission interval that ensures consistent dot spacing visually
        // This is now based on how many complete trips a dot can make in the cycle time
        const tripsPerCycle = ANIMATION_CYCLE_TIME / animationDuration;
        const dotsNeeded = Math.max(MIN_DOTS, Math.floor(totalLength / GLOBAL_SPACING));
        
        // Ensure continuous emission by looping dots
        const emissionInterval = animationDuration / dotsNeeded;
        
        console.log(`Path ${index} - Name: ${pathData.name}, Normalized: ${normalizedValue}, Duration: ${animationDuration}ms, Trips: ${tripsPerCycle.toFixed(2)}, Dots: ${dotsNeeded}, Length: ${totalLength}`);
        
        // Function to create and animate a dot
        function createDot() {
            if (!animationRunning) return;
            
            const dot = svg.append("circle")
                .attr("r", 7)
                .attr("fill", `url(#${gradientId})`)
                .attr("class", "animation-dot")
                .attr("data-path-index", index);
                
            // Position dot at start of path
            const startPoint = pathNode.getPointAtLength(0);
            dot.attr("cx", startPoint.x)
               .attr("cy", startPoint.y);
            
            currentDots.add(dot.node());
            
            // Animate the dot along the path
            const transition = dot.transition()
                .duration(animationDuration) // Speed based on normalized value
                .ease(d3.easeLinear)
                .tween("pathTween", () => {
                    return (t) => {
                        if (!animationRunning) return;
                        const point = pathNode.getPointAtLength(t * totalLength);
                        return dot.attr("cx", point.x)
                                 .attr("cy", point.y);
                    };
                })
                .on("end", () => {
                    if (!isPaused) {
                        currentDots.delete(dot.node());
                        dot.remove();
                        
                        // Immediately create a new dot when one finishes
                        // This ensures continuous animation for the full duration
                        if (animationRunning) {
                            createDot();
                        }
                    }
                });
                
            activeTransitions.push(transition);
        }
        
        // Start initial dots
        for (let i = 0; i < dotsNeeded; i++) {
            setTimeout(() => {
                if (animationRunning) {
                    createDot();
                }
            }, i * emissionInterval);
        }
    });
    
    // Set a timeout to restart/stop the animation after 30 seconds
    const animationTimeout = setTimeout(() => {
        if (animationRunning && !isPaused) {
            console.log("Animation cycle complete (30 seconds)");
            
            // Restart animation
            stopAnimation();
            startAnimation(pathsData, normalizedValues);
        }
    }, ANIMATION_CYCLE_TIME); // 30 second animation cycle
    
    currentAnimation = animationTimeout;
    
    return stopAnimation;
}

// Add this function before startAnimation to map specific normalized values to paths
function mapNormalizedValuesToPaths() {
    // Load the flux data first
    return d3.csv("./ProvidedData/Flux_Values_for_animation.csv").then(function(fluxData) {
        // Create a mapping of reaction names to normalized values
        const fluxMap = {};
        fluxData.forEach(d => {
            fluxMap[d.Reaction] = parseFloat(d.Normalized);
        });
        console.log("Loaded flux map:", fluxMap);
        
        // Create an array of normalized values matching the pathsData array order
        const normalizedValues = [];
        
        // Map each path to its corresponding value
        pathsData.forEach((path, index) => {
            let value = 0.5; // Default value
            
            // Map specific paths based on their names or indices
            if (path.name === "Green Path-sequence1") {
                value = fluxMap["G6P -> P5P"] || 0.18;
            } else if (path.name === "Green Path-sequence2") {
                value = fluxMap["P5P -> X5P"] || 0.11;
            } else if (path.name.match(/Green Path-sequence[4-8]/)) {
                // Explicitly set Green Path-sequence4 through Green Path-sequence8 to 0.05
                value = 0.05;
            } else if (path.name === "Green Path-sequence9") {
                value = fluxMap["TP + S7P -> F6P + E4P"] || 0.06;
            } else if (path.name === "Green Path-sequence12") {
                value = fluxMap["X5P + E4P -> F6P + TP"] || 0.05;
            }
            // Add more mappings for other paths as needed
            
            normalizedValues[index] = value;
        });
        
        console.log("Mapped normalized values:", normalizedValues);
        return normalizedValues;
    });
}

// Modify how the animation is started
function startAnimationWithCorrectValues() {
    // Show loading overlay
    toggleLoadingOverlay(true);
    
    // Load normalized values and start animation
    mapNormalizedValuesToPaths().then(normalizedValues => {
        startAnimation(pathsData, normalizedValues);
        // Hide loading overlay
        toggleLoadingOverlay(false);
    }).catch(error => {
        console.error("Error mapping values:", error);
        // Fall back to default animation
        startAnimation(pathsData);
        // Hide loading overlay
        toggleLoadingOverlay(false);
    });
}

// Modify the startPath function to use normalized values
function startPath(allMolecules) {
    if (!Array.isArray(allMolecules)) {
        console.error("allMolecules is not an array:", allMolecules);
        return;
    }

    // Create a mapping of reaction names to normalized values from CSV
    const normalizedMap = new Map();
    
    for (const molecule of allMolecules) {
        const reaction = molecule.reaction;
        const normalized = parseFloat(molecule.normalized) || 0.5;
        
        // Store in map
        normalizedMap.set(reaction, normalized);
        
        // Also store individual components
        if (reaction.includes('->')) {
            const [left, right] = reaction.split('->').map(s => s.trim());
            normalizedMap.set(left, normalized);
            normalizedMap.set(right, normalized);
        } else if (reaction.includes('<->')) {
            const [left, right] = reaction.split('<->').map(s => s.trim());
            normalizedMap.set(left, normalized);
            normalizedMap.set(right, normalized);
        }
    }

    // Generate normalized values array for each path
    let normalizedValues = pathsData.map((path, index) => {
        // Apply explicit mappings first (these take precedence)
        if (path.name === "Green Path-sequence1") {
            return normalizedMap.get("G6P -> P5P") || 0.18;
        } else if (path.name === "Green Path-sequence2") {
            return normalizedMap.get("P5P -> X5P") || 0.11;
        } else if (path.name.match(/Green Path-sequence[4-8]/)) {
            // Explicitly set Green Path-sequence4 through Green Path-sequence8 to 0.05
            return 0.05;
        } else if (path.name === "Green Path-sequence9") {
            return normalizedMap.get("TP + S7P -> F6P + E4P") || 0.06;
        } else if (path.name === "Green Path-sequence10") {
            return normalizedMap.get("P5P + X5P -> S7P + TP") || 0.06;
        } else if (path.name === "Green Path-sequence11") {
            return normalizedMap.get("P5P + X5P -> S7P + TP") || 0.06;
        } else if (path.name === "Green Path-sequence12") {
            return normalizedMap.get("X5P + E4P -> F6P + TP") || 0.05;
        }
        
        // Fall back to generic mappings if no explicit mapping
        if (path.name && normalizedMap.has(path.name)) {
            return normalizedMap.get(path.name);
        }
        
        // If no direct match, try to match by start and end points
        if (path.points && path.points.length >= 2) {
            const start = path.points[0].name;
            const end = path.points[path.points.length - 1].name;
            
            if (start && end) {
                const key = `${start} -> ${end}`;
                if (normalizedMap.has(key)) {
                    return normalizedMap.get(key);
                }
            }
        }
        
        // Default to mid-range if no match
        return 0.5;
    });

    console.log("Normalized values for paths:", normalizedValues);

    // Start the animation with normalized values
    if (pathsData && Array.isArray(pathsData)) {
        startAnimation(pathsData, normalizedValues);
    } else {
        console.error("pathsData is not available:", pathsData);
    }
}

// Modify the processMolecules function
async function processMolecules() {
    try {
        // Show loading at start
        showLoading(true);
        
        const allMolecules = await loadMolecules();
        
        // Hide loading after data is loaded
        showLoading(false);
        
        // Add button event listeners
        document.querySelector('.startButton').addEventListener('click', () => {
            // Always start fresh
            isPaused = false;
            pausedDots = [];
            startPath(allMolecules);
        });

        document.querySelector('.pauseButton').addEventListener('click', function() {
            if (animationRunning) {
                if (!isPaused) {
                    // Pause animation
                    isPaused = true;
                    d3.selectAll(".animation-dot").interrupt();
                    // Save positions of all dots
                    pausedDots = Array.from(currentDots).map(dot => {
                        const d3Dot = d3.select(dot);
                        return {
                            dot: dot,
                            cx: d3Dot.attr("cx"),
                            cy: d3Dot.attr("cy"),
                            pathIndex: d3Dot.attr("data-path-index")
                        };
                    });
                    this.textContent = "Resume";
                } else {
                    // Resume animation
                    isPaused = false;
                    this.textContent = "Pause";
                    
                    // Restart animation for all paths
                    startAnimationWithCorrectValues();
                }
            }
        });

        document.querySelector('.stopButton').addEventListener('click', function() {
            if (animationRunning) {
                stopAnimation();
                document.querySelector('.pauseButton').textContent = "Pause";
                isPaused = false;
            }
        });

    } catch (error) {
        console.error('Error processing molecules:', error);
        // Hide loading if there's an error
        showLoading(false);
    }
}

// Initialize the loading state to hidden when the page loads
document.addEventListener('DOMContentLoaded', () => {
    showLoading(false);
});

function preprocessReaction(reaction) {
    let reactionType = 'unidirectional';
    let separator = '->';

    // Check if the reaction is bidirectional
    if (reaction.includes('<->')) {
        reactionType = 'bidirectional';
        separator = '<->';
    }

    // Split reaction into left and right sides
    const [leftSide, rightSide] = reaction.split(separator).map(side =>
        side.split("+").map(part => part.trim())
    );

    // Identify molecules present on both sides
    const commonMolecules = leftSide.filter(molecule => rightSide.includes(molecule));

    // Remove common molecules from left and right sides
    const filteredLeft = leftSide.filter(molecule => !commonMolecules.includes(molecule));
    const filteredRight = rightSide.filter(molecule => !commonMolecules.includes(molecule));

    return { left: filteredLeft, right: filteredRight, reactionType };
}

function separateParts(molecule, parts, pathsData, reactionType) {
    const { left, right } = parts;

    if (left.length === 0 || right.length === 0) {
        console.warn(`Not enough significant parts for molecule ${molecule.reaction}: left=${left}, right=${right}`);
        return;
    }

    // Create unidirectional path: reactant -> product
    const beginning = left[0].trim();
    const end = right[0].trim();

    if (SignificantCoordinates[beginning] && SignificantCoordinates[end]) {
        console.log(`Creating path for ${beginning} -> ${end}`); // Debugging
        pathsData.push({
            points: [SignificantCoordinates[beginning], SignificantCoordinates[end]],
            bidirectional: reactionType === 'bidirectional'
        });

        // If bidirectional, also create product -> reactant
        if (reactionType === 'bidirectional') {
            console.log(`Creating path for ${end} -> ${beginning}`); // Debugging
            pathsData.push({
                points: [SignificantCoordinates[end], SignificantCoordinates[beginning]],
                bidirectional: true
            });
        }
    }
}

processMolecules().catch(error => {
    console.error("Error in processMolecules:", error);
});

// Example function to move the molecule from start to end
function moveMolecule(start, end) {
    // Implement logic to animate the movement of the molecule from start to end
    console.log(`Moving molecule ${molecule.name} from ${start} to ${end}`); // for debugging
}

// Add progress bar update
function updateProgress(progress) {
    document.querySelector('.progress-bar').style.width = `${progress}%`;
}

// Add loading state handling
function showLoading(show) {
    const overlay = document.querySelector('.loading-overlay');
    overlay.style.display = show ? 'flex' : 'none';
}

// Also add the missing pauseAnimation function to make sure it matches our new approach
function pauseAnimation() {
    isPaused = true;
    animationRunning = false;
    
    // Just stop the animation without removing dots
    if (currentAnimation) {
        clearTimeout(currentAnimation);
    }
    
    // Interrupt all transitions
    d3.selectAll(".animation-dot").interrupt();
}