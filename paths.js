// * Do the data points begin their path at different points?

const svg = d3.select("#svgContainer");

// More thorough initial cleanup
function cleanupEdgeDots() {
    svg.selectAll("circle").each(function() {
        const circle = d3.select(this);
        const cx = parseFloat(circle.attr("cx") || 0);
        const cy = parseFloat(circle.attr("cy") || 0);
        
        // Check if dot is near the container edges
        if (cx <= 10 || cx >= width - 10 || cy <= 10 || cy >= height - 10) {
            circle.remove();
        }
    });
}

// Call both cleanups at initialization
cleanupEdgeDots();

class Molecule {
    constructor(reactionName, reaction, fluxValue, typeReaction, comments) {
        this.reactionName = reactionName;
        this.reaction = reaction;
        this.fluxValue = fluxValue;
        this.typeReaction = typeReaction;
        this.comments = comments;
    }
}

// Load the CSV data and return a Promise
function loadMolecules() {
    return d3.csv("Edit_Flux_Values.csv").then(function(data) {
        console.log("Raw CSV data:", data);  // Log raw CSV data DEBUGGING
        console.log("Is data an array?", Array.isArray(data));  // Check if data is an array DEBUGGING

        let allMolecules = [];
        data.forEach(d => {
            // Create a new Molecule object for each row in the CSV
            let molecule = new Molecule(d['Reaction Name'], d['Reaction'], d['Flux Value'], d['Type of Reaction'], d['comments']);
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
        { x: circleData.cx + circleData.r * Math.cos(Math.PI), y: circleData.cy + circleData.r * Math.sin(Math.PI), label: "MAL", bidirectional: true },
        // Calculate midpoint between MAL and CIT
        {
            x: circleData.cx + circleData.r * Math.cos((Math.PI + 3 * Math.PI / 2) / 2),
            y: circleData.cy + circleData.r * Math.sin((Math.PI + 3 * Math.PI / 2) / 2),
            label: "OAA", bidirectional: true
        },
      ];
    
    // Add significant points to the circle
    svg.selectAll("circle.point")
        .data(CircleSignificantPoints)
        .enter()
        .append("circle")
        .attr("class", "point static-point circle-point")  // Add more specific classes
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("r", d => d.well ? 10 : 5)
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
               { x: 290, y: 50, name: "WALL.eff", well: true, bidirectional: false}], 
               name: "WALL Well", curve: false}, 
    { points: [{ x: 480, y: 230, name: "F6P", bidirectional: false}, 
               { x: 180, y: 230, name: "MAN.eff", well: true, bidirectional: false}], 
               name: "MAN.eff Well", curve: false}, 
    { points: [{ x: 480, y: 400, name: "TP", bidirectional: false}, 
               { x: 230, y: 400, name: "TAG", well: true, bidirectional: false}], 
               name: "TAG Well", curve: false},
    { points: [{ x: 480, y: 490, name: "3PG", bidirectional: false}, 
               { x: 365, y: 490, name: "SER", well: false, bidirectional: false},
               { x: 365, y: 570, name: "SER.eff", well: true, bidirectional: false}], 
               name: "SER.eff Path", curve: false},
    { points: [{ x: 365, y: 490, name: "SER", bidirectional: true}, 
               { x: 230, y: 490, name: "GLY", well: false, bidirectional: false}, 
               { x: 130, y: 490, name: "GLY.eff", well: true, bidirectional: false}], 
               name: "GLY.eff Well", curve: false},
    { points: [{ x: 230, y: 490, name: "GLY", well: false, bidirectional: true},
               { x: 230, y: 600, name: "THR", bidrectional: false},
               { x: 230, y: 720, name: "ASP", bidirectional: false},
               { x: 230, y: 830, name: "MET", well: true, bidirectional: false}], 
               name: "GLY to MET", curve: false},
    { points: [{ x: 230, y: 600, name: "THR", bidrectional: false},
               { x: 180, y: 550, bidirectional: false},
               { x: 90, y: 550, name: "THR.eff", well: true, bidirectional: false}],
               name: "THR.eff Well", curve: false},
    { points: [{ x: 230, y: 600, name: "THR", bidrectional: false},
               { x: 90, y: 600, name: "ILE", well: true, bidrectional: false},],
               name: "ILE Well", curve: false},
    { points: [{ x: 230, y: 720, name: "ASP", bidirectional: false},
               { x: 120, y: 720, name: "ASP.eff", well: true, bidirectional: false}],
               name: "ASP.eff Well", curve: false},
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
               { x: 500, y: 1220, name: "PYR.m", bidirectional: false}],
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
    { points: [{ x: 480, y: 750, name: "PYR.c", bidirectional: false},
               { x: 570, y: 670, bidirectional: false},
               { x: 670, y: 670, name: "ALA", bidirectional: false, well: true}],
               name: "PYR.c ALA", curve: false},
    { points: [{ x: 450, y: 1090, name: "MAL", bidirectional: false},
               { x: 285, y: 990, bidirectional: false},
               { x: 480, y: 875, name: "PYR.m", bidirectional: false}],
               name: "MAL to PYR.m", curve: true},
    { points: [{ x: 480, y: 875, name: "PYR.m", bidirectional: false}, 
               { x: 450, y: 940, bidirectional: false},
               { x: 493.93398282201787, y: 983.9339828220179, name: "OAA", bidirectional: false}],
               name: "PYR.m to OAA", curve: true},
    { points: [{ x: 480, y: 875, name: "PYR.m", bidirectional: false},
               { x: 670, y: 800, name: "VAL", bidirectional: false},
               { x: 800, y: 800, name: "LEU", bidirectional: false, well: true}],
               name: "PYR.m to LEU", curve: false},
    { points: [{ x: 670, y: 800, name: "VAL", bidirectional: false},
               { x: 800, y: 670, name: "VAL.eff", bidirectional: false, well: true}],
               name: "VAL to VAL.eff", curve: false},
    { points: [{ x: 600, y: 940, name: "CIT", bidirectional: false},
               { x: 600, y: 860, bidirectional: false},
               { x: 800, y: 850, name: "OAA", bidirectional: false, OAA2: true}],
               name: "CIT to OAA", curve: true},
    { points: [{ x: 620, y: 880, bidirectional: false},
               { x: 800, y: 890, name: "ACECOA.c", bidirectional: false},
               { x: 970, y: 890, name: "ACECOA.eff", well: true, bidirectional: false}],
               name: "CIT to ACECOA.eff", curve: false},
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
               { x: 920, y: 1260, name: "GLU.eff", bidirectional: false, well: true}],
                name: "GLU to GLU.eff", curve: false},
    { points: [{ x: 830, y: 1260, name: "GLU.ext", bidirectional: false, well: true},
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
    "ACECOA": {x: 490, y: 940},
    "CIT": { x: 600, y: 940 },
    "P5P": {x: 670, y: 100},
    "X5P": {x: 830, y: 100},
    "TP2": {x: 670, y: 200, greenpath: true},
    "E4P": {x: 830, y: 360},
    "S7P": {x: 830, y: 200},
    "HIS": {x: 670, y: 50},
    "NA": {x: 800, y: 50},
    "WALL.eff": {x: 290, y: 50},
    "MAN.eff": {x: 180, y: 230},
    "TAG": {x: 230, y: 400},
    "SER": {x: 365, y: 490},
    "SER.eff": {x: 365, y: 570},
    "GLY": {x: 230, y: 490},
    "GLY.eff": {x: 130, y: 490},
    "THR": {x: 230, y: 600},
    "THR.eff": {x: 90, y: 550},
    "ILE": {x: 90, y: 600},
    "ASP": {x: 230, y: 720},
    "ASP.eff": {x: 120, y: 720},
    "MET": {x: 230, y: 830},
    "PROCOA": {x: 230, y: 1090},
    "METCIT": {x: 365, y: 1200},
    "IMETCIT": {x: 415, y: 1235},
    "VAL": {x: 670, y: 800},
    "VAL.eff": {x: 800, y: 670},
    "OAA": {x: 493.93398282201787, y: 983.9339828220179, oaa2: false},
    "HCIT": {x: 800, y: 1100},
    "LYS": {x: 880, y: 1030},
    "GLU": {x: 830, y: 1196.066017177982},
    "ARG": {x: 940, y: 1196.066017177982},
    "PRO": {x: 920, y: 1110},
    "GLU.eff": {x: 920, y: 1260},
    "GLU.ext": {x: 830, y: 1260},
    "SUCC": {x: 600, y: 1240},
    "AKG": {x: 706.0660171779821, y: 1196.066017177982},
    "ACECOA.eff": {x: 970, y: 890},
    "GYLX": {x: 600, y: 1090},
    "MAL": {x: 450, y: 1090},
    "ACECOA.m": {x: 555, y: 1040},
    "PHE": {x: 670, y: 490},
    "TYR": {x: 670, y: 570},
    "ALA": {x: 670, y: 670},
    "LEU": {x: 800, y: 800},
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
        .attr("r", d => d.well ? 10 : 5)
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

// Add these variables near the top
let animationRunning = false;
let isPaused = false;
let activeTransitions = [];
let pausedDots = [];  // Store paused dot positions
let currentAnimation = null;  // Store the current animation timeout
let currentDots = new Set();  // Keep track of active animation dots

// Add this function at the top level
function cleanupAllDots() {
    // Remove only animation dots and unclassified dots
    svg.selectAll("circle").each(function() {
        const circle = d3.select(this);
        const isStatic = circle.classed("static-point") || 
                        circle.classed("circle-point") || 
                        circle.attr("data-type") === "static";
        
        if (!isStatic) {
            circle.remove();
        }
    });
}

// Modify the animatePath function
function animatePath(pathData, fluxValue, pathIndex, callback) {
    const numberOfDots = Math.min(600, Math.max(1, Math.round(fluxValue || 1)));
    
    const path = svg.append("path")
        .datum(pathData.points)
        .attr("d", pathData.curve ? lineGeneratorCurved : lineGeneratorStraight)
        .attr("fill", "none")
        .attr("stroke", "none");

    const pathNode = path.node();
    const totalLength = pathNode.getTotalLength();

    for (let i = 0; i < numberOfDots; i++) {
        // Get the starting point of the path
        const startPoint = pathNode.getPointAtLength(0);
        
        const dot = svg.append("circle")
            .attr("r", 10)
            .attr("fill", "#63FF48")
            .attr("class", "animation-dot")
            .attr("data-path-index", pathIndex)
            // Set initial position to the start of the path
            .attr("cx", startPoint.x)
            .attr("cy", startPoint.y);

        currentDots.add(dot.node());

        const transition = dot.transition()
            .delay(i * animationDelay)
            .duration(animationDuration)
            .ease(d3.easeLinear)
            .tween("pathTween", () => {
                let pausePosition = null;
                
                return function(t) {
                    if (!animationRunning) {
                        if (!pausePosition) {
                            pausePosition = pathNode.getPointAtLength(t * totalLength);
                            dot.attr("cx", pausePosition.x)
                               .attr("cy", pausePosition.y);
                        }
                        return;
                    }
                    
                    const point = pathNode.getPointAtLength(t * totalLength);
                    return dot.attr("cx", point.x)
                            .attr("cy", point.y);
                };
            })
            .on("end", () => {
                if (!isPaused) {
                    currentDots.delete(dot.node());
                    dot.remove();
                }
                if (i === numberOfDots - 1) {
                    path.remove();
                    if (callback) callback();
                }
            })
            .on("interrupt", () => {
                // Make sure to remove the dot if the transition is interrupted
                if (!isPaused) {
                    currentDots.delete(dot.node());
                    dot.remove();
                }
            });

        activeTransitions.push(transition);
    }
}

// Modify the pauseAnimation function
function pauseAnimation() {
    isPaused = true;
    animationRunning = false;
    
    // Just stop the animation without removing dots
    if (currentAnimation) {
        clearTimeout(currentAnimation);
    }
}

// Modify the stopAnimation function
function stopAnimation() {
    isPaused = false;
    animationRunning = false;
    
    if (currentAnimation) {
        clearTimeout(currentAnimation);
        currentAnimation = null;
    }
    
    // Clear all tracked dots
    currentDots.forEach(dot => {
        d3.select(dot).remove();
    });
    currentDots.clear();
    
    activeTransitions.forEach(transition => {
        if (transition.selection) {
            transition.selection().interrupt();
        }
    });
    activeTransitions = [];
    
    // Additional cleanup for edge dots
    cleanupEdgeDots();
}

// Modify the startAnimation function
function startAnimation(pathsData, fluxValues = []) {
    if (!Array.isArray(pathsData)) {
        console.error("pathsData is not an array:", pathsData);
        return;
    }

    if (!isPaused) {
        stopAnimation();
        cleanupEdgeDots();  // Additional cleanup
    }
    
    animationRunning = true;
    isPaused = false;

    function animate() {
        if (!animationRunning) return;

        pathsData.forEach((pathData, index) => {
            const fluxValue = fluxValues[index] || 1;
            animatePath(pathData, fluxValue, index);
        });

        currentAnimation = setTimeout(() => {
            if (animationRunning) {
                animate();
            }
        }, animationDuration + (pathsData.length * animationDelay));
    }

    animate();
}

// Modify the processMolecules function
async function processMolecules() {
    try {
        // Show loading at start
        showLoading(true);
        
        // Clean up any existing dots when initializing
        cleanupAllDots();
        
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

        document.querySelector('.pauseButton').addEventListener('click', () => {
            pauseAnimation();
        });

        document.querySelector('.stopButton').addEventListener('click', () => {
            stopAnimation();
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

function startPath(allMolecules) {
    if (!Array.isArray(allMolecules)) {
        console.error("allMolecules is not an array:", allMolecules);
        return;
    }

    let fluxValues = [];

    for (const molecule of allMolecules) {
        fluxValues.push(parseFloat(molecule.fluxValue));
    }

    // Start the animation directly here
    if (pathsData && Array.isArray(pathsData)) {
        console.log("Starting animation with pathsData:", pathsData);
        startAnimation(pathsData, fluxValues);
    } else {
        console.error("pathsData is not available:", pathsData);
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