const svg = d3.select("#svgContainer");

class Molecule {
    constructor(reaction, fluxValue, normalized) {
        this.reaction = reaction;
        this.fluxValue = fluxValue;
        this.normalized = normalized;
    }
}

// Load the CSV data and return a promise
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
const animationDuration = 2000;  // Duration for each path animation in milliseconds
const animationDelay = 300;  // Delay between dots in milliseconds
        
well = false;
OAA2 = false;
const pathsData = [
    { points: [{ x: 480, y: -50, name: "GLC.ext", bidirectional: false},      // First point
               { x: 480, y: 100, name: "G6P" }],
               name: "GLC.ext -> G6P", curve: false },
    { points: [ { x: 480, y: 100, name: "G6P" }, 
                { x: 480, y: 230, name: "F6P", bidirectional: true}], 
                name: "G6P -> F6P", curve: false },
    { points: [ { x: 480, y: 230, name: "F6P", bidirectional: true},   
                { x: 480, y: 400, name: "TP", bidirectional: true}],
                name: "F6P -> TP", curve: false },
    { points: [ { x: 480, y: 400, name: "TP", bidirectional: true},   
                { x: 480, y: 490, name: "3PG", bidirectional: true}], // final point 
                name: "TP -> 3PG", curve: false },
    { points: [ { x: 480, y: 490, name: "3PG", bidirectional: true},      
                { x: 480, y: 620, name: "PEP", bidirectional: false}], // final point 
                name: "3PG -> PEP", curve: false },
    { points: [ { x: 480, y: 620, name: "PEP", bidirectional: false},      
                { x: 480, y: 750, name: "PYR.c", bidirectional: false}], // final point 
                name: "PEP -> PYR.c", curve: false },
    { points: [ { x: 480, y: 750, name: "PYR.c", bidirectional: false}, 
                { x: 480, y: 875, name: "PYR.m"}], // final point 
                name: "PYR.c -> PYR.m", curve: false },
    { points: [{ x: 480, y: 875, name: "PYR.m", bidirectional: false},
               { x: 600, y: 940, name: "CIT", bidirectional: true}], 
               name: "PYR.m -> CIT", curve: true }, 
    { points: [ {x: 600, y: 940, name: "CIT"}, // TODO: figure out why there are two sets of dots coming out of this point. One is fast and the other is the slow correct one. 
                { x: 600, y: 860}, 
                { x: 800, y: 850, name: "OAA"}], 
                name: "CIT -> ACECOA.c + OAA", curve: true }, 
    { points: [ { x: 620, y: 880, bidirectional: false},
                { x: 800, y: 890, name: "ACECOA.c", bidirectional: true}], 
                name: "CIT -> ACECOA.c + OAA", curve: true }, 
    { points: generateCirclePath(circleData.cx, circleData.cy, circleData.r), 
                name: "Circle Path", curve: true },  // Add the circle path}  
    { points: [{ x: 480, y: 100, name: "G6P", bidirectional: false}, 
               { x: 670, y: 100, name: "P5P", bidirectional: true}],
               name: "G6P -> P5P", curve: false }, 
    { points: [ { x: 670, y: 100, name: "P5P", bidirectional: true}, 
                { x: 830, y: 100, name: "X5P", bidirectional: true}], 
                name: "P5P -> X5P", curve: false },
    { points: [ { x: 830, y: 100, name: "X5P", bidirectional: true}, 
                { x: 930, y: 100, bidirectional: false}], 
                name: "X5P + E4P -> F6P + TP", curve: false }, 
    { points: [ { x: 930, y: 100, bidirectional: false}, 
                { x: 930, y: 400, bidirectional: false}],
                name: "X5P + E4P -> F6P + TP", curve: false }, 
    { points: [ { x: 930, y: 400, bidirectional: false}, 
                { x: 620, y: 400, bidirectional: false}],
                name: "X5P + E4P -> F6P + TP", curve: false }, 
    { points: [ { x: 620, y: 400, bidirectional: false}, 
                { x: 620, y: 200, bidirectional: false}],
                name: "X5P + E4P -> F6P + TP", curve: false }, 
    { points: [ { x: 620, y: 200, bidirectional: false}, 
                { x: 670, y: 200, name: "TP", bidirectional: true}],
                name: "X5P + E4P -> F6P + TP", curve: false }, 
    { points: [ { x: 670, y: 200, name: "TP", bidirectional: true},
                { x: 830, y: 360, name: "E4P", bidirectional: true}], 
                name: "TP + S7P -> F6P + E4P", curve: false }, 
    { points: [{ x: 670, y: 100, name: "P5P"},
               { x: 830, y: 200, name: "S7P", bidirectional: true}],
                name: "P5P + X5P -> S7P + TP", curve: false }, 
    { points: [ { x: 830, y: 200, name: "S7P", bidirectional: true},
                { x: 670, y: 360, name: "F6P", bidirectional: true}],
                     name: "TP + S7P -> F6P + E4P", curve: false }, 
    { points: [{ x: 830, y: 100, name: "X5P", bidirectional: true},
               { x: 670, y: 200, name: "TP", bidirectional: true}],
               name: "X5P + E4P -> F6P + TP", curve: false }, 
    { points: [ { x: 830, y: 360, name: "E4P", bidirectional: true},
                { x: 750, y: 420, bidirectional: false},
                { x: 670, y: 360, name: "F6P", bidirectional: true}],
                name: "X5P + E4P -> F6P + TP", curve: true }, 
    { points: [{ x: 480, y: 100, name: "G6P", bidirectional: false}, 
               { x: 290, y: 100, bidirectional: false}, 
               { x: 290, y: 50, name: "WALL", well: true, bidirectional: false}], 
               name: "G6P -> WALL", curve: false}, 
    { points: [{ x: 480, y: 230, name: "F6P", bidirectional: false}, 
               { x: 180, y: 230, name: "MAN", well: true, bidirectional: false}], 
               name: "F6P -> MAN", curve: false}, 
    { points: [{ x: 480, y: 400, name: "TP", bidirectional: false}, 
               { x: 230, y: 400, name: "TG", well: true, bidirectional: false}], 
               name: "TP -> TG", curve: false},
    { points: [{ x: 480, y: 490, name: "3PG", bidirectional: false}, 
               { x: 365, y: 490, name: "SER", well: false, bidirectional: false}], 
               name: "3PG -> SER", curve: false},
    { points: [{ x: 365, y: 490, name: "SER", bidirectional: true}, 
               { x: 230, y: 490, name: "GLY", well: false, bidirectional: false}], 
               name: "SER -> GLY", curve: false},
    { points: [{ x: 230, y: 720, name: "ASP", bidirectional: false},
               { x: 230, y: 600, name: "THR", bidrectional: false}], 
               name: "ASP -> THR", curve: false},
    { points: [{ x: 230, y: 600, name: "THR", bidrectional: false},
                { x: 230, y: 490, name: "GLY", well: false, bidirectional: true}], 
                name: "THR -> GLY", curve: false},
    { points: [{ x: 493.93398282201787, y: 983.9339828220179, name: "OAA", bidirectional: true},
               { x: 285, y: 983.9339828220179, bidirectional: true},
               { x: 285, y: 720, bidrectional: true},
               { x: 230, y: 720, name: "ASP", bidirectional: true}],
               name: "OAA -> ASP", curve: true},
    { points: [{ x: 230, y: 600, name: "THR", bidrectional: false},
               //{ x: 50, y: 720, bidirectional: false},
               { x: 90, y: 810, bidirectional: false},
               { x: 365, y: 1200, name: "METCIT", bidirectional: false}],
                name: "THR + OAA -> METCIT"}, 
    { points: [ { x: 365, y: 1200, name: "METCIT", bidirectional: false},
                { x: 500, y: 1280, bidirectional: true},
                { x: 600, y: 1240, name: "SUCC", bidirectional: false}],
                    name: "METCIT -> PYR.m + SUCC", curve: true}, 
    { points: [{ x: 493.93398282201787, y: 983.9339828220179, name: "OAA", bidirectional: false},
               { x: 295, y: 1060, bidirectional: false},
               { x: 365, y: 1200, name: "METCIT", bidirectional: false}],
               name: "THR + OAA -> METCIT", curve: true},
    /*{ points: [{ x: 500, y: 1265, bidirectional: false},
               { x: 500, y: 1220, name: "PYR.m", bidirectional: false}],
                name: "MAL -> PYR.m", curve: false},*/
    { points: [{ x: 480, y: 620, name: "PEP", bidirectional: true},
               { x: 365, y: 620, bidirectional: true},
               { x: 365, y: 875, bidirectional: true},
               { x: 493.93398282201787, y: 983.9339828220179, name: "OAA", bidirectional: false}],
               name: "OAA -> PEP", curve: false},
    { points: [{ x: 450, y: 1090, name: "MAL", bidirectional: false},
               { x: 285, y: 990, bidirectional: false},
               { x: 480, y: 875, name: "PYR.m", bidirectional: false}],
               name: "MAL -> PYR.m", curve: true},
    { points: [{ x: 800, y: 890, name: "ACECOA.c", bidirectional: false},
               { x: 970, y: 890, name: "Fatty Acids", well: true, bidirectional: false}],
               name: "ACECOA.c -> Fatty Acids", curve: false},
    { points: [{ x: 750, y: 1090, name: "ICIT", bidirectional: true},
               { x: 600, y: 1090, name: "GYLX", bidirectional: false}],
               name: "ICIT -> GLYX + SUCC", curve: false},
    { points: [ { x: 600, y: 1090, name: "GYLX", bidirectional: false},
                { x: 450, y: 1090, name: "MAL", bidirectional: false}],
                name: "GLYX + ACECOA.m -> MAL", curve: false},
    { points: [ { x: 555, y: 1040, name: "ACECOA.m", bidirectional: false, well: true},
                { x: 540, y: 1090},
                { x: 525, y: 1090, bidirectional: false}],
               name: "GLYX + ACECOA.m -> MAL", curve: true},
    { points: [{ x: 675, y: 1090, bidirectional: false},
               { x: 630, y: 1140},
               { x: 600, y: 1240, name: "SUCC", bidirectional: false}],
               name: "ICIT -> GLYX + SUCC", curve: true},
    { points: [ { x: 830, y: 1196.066017177982, name: "GLU", bidirectional: true},
                { x: 706.0660171779821, y: 1196.066017177982, name: "AKG", bidirectional: false}],
                name: "GLU -> AKG", curve: false},
    { points: [{ x: 830, y: 1400, name: "GLU.ext", bidirectional: false, well: true},
               { x: 830, y: 1196.066017177982, name: "GLU", bidirectional: false}],
               name: "GLU.ext -> GLU", curve: false},
    { points: [ { x: 500, y: 1260, bidirectional: false},
                { x: 500, y: 1220, name: "PYR.m", bidirectional: false}],
                 name: "METCIT -> PYR.m + SUCC", curve: false},  
];

const SignificantCoordinates = {
    "GLC.ext": {x: 480, y: -50},
    "G6P": {x: 480, y: 100},
    "F6P": {x: 480, y: 230, greenpath: true},
    "TP": {x: 480, y: 400, greenpath: false},
    "3PG": {x: 480, y: 490},
    "PEP": {x: 480, y: 620},
    "PYR.c": {x: 480, y: 750},
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
    "PYR.m": {x: 510, y: 1220}
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

    // Add a special debug log for the TG Well path
    if (pathData.name === "TG Well" || (pathData.points && 
        pathData.points.length >= 2 && 
        pathData.points[0].name === "TP" && 
        pathData.points[pathData.points.length-1].name === "TG")) {
        console.log(`DEBUG: Found TG Well path at index ${index}`, pathData);
    }
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
const ANIMATION_LOOP_TIME = 120000;     // Overall loop time in ms 
const FIXED_DOT_SPACING = 40;          // Fixed spacing between dots in pixels
const MIN_DOTS = 3;                    // Minimum number of dots per path

// Add a global speed multiplier constant near the top of the file with other constants
//const GLOBAL_SPEED_MULTIPLIER = 2.0; // Adjust this value to make the entire animation faster or slower

// Define stopAnimation as a standalone function
function stopAnimation() {
    // Set the flag first to prevent any new animations
    animationRunning = false;
    
    // Important: Clear the master timeout first
    if (currentAnimation) {
        clearTimeout(currentAnimation);
        currentAnimation = null;
    }
    
    // Clear all intervals
    dotIntervals.forEach(clearInterval);
    dotIntervals = [];
    
    // Remove all animation dots
    svg.selectAll(".animation-dot").interrupt().remove();
    currentDots.clear();
    
    // Remove all paths
    activePaths.forEach(path => path.remove());
    activePaths = [];

    console.log("Animation completely stopped and cleaned up");
}

// Modify startAnimation to use more consistent timeout handling
function startAnimation(pathsData, normalizedValues = []) {
    // First completely reset animation state
    // Clear any lingering state
    if (currentAnimation) {
        clearTimeout(currentAnimation);
        currentAnimation = null;
    }
    
    // Ensure all intervals are cleared
    dotIntervals.forEach(clearInterval);
    dotIntervals = [];
    
    // Clear all existing dots
    svg.selectAll(".animation-dot").interrupt().remove();
    currentDots.clear();
    
    // Remove existing paths
    activePaths.forEach(path => path.remove());
    activePaths = [];
    
    // Only now set animation to running
    animationRunning = true;
    isPaused = false;
    
    console.log("Starting fresh animation cycle at", new Date().toLocaleTimeString());
    
    // Using fixed spacing for consistent visual appearance
    const GLOBAL_SPACING = 60; // Pixels between dots
    const ANIMATION_CYCLE_TIME = 30000; // 30 seconds
    
    // Track the master animation cycle
    let cycleStartTime = Date.now();
    
    // Create all paths first
    pathsData.forEach((pathData, index) => {
        // Get the normalized value for this path
        let normalizedValue = normalizedValues[index];
        
        // Apply the global speed multiplier to make everything faster/slower
        // while maintaining relative speeds between paths
        normalizedValue = normalizedValue;
        
        // Important fix: Set a higher minimum speed for very slow paths
        // This ensures even the slowest paths (like TP -> TG) are visible
        const MIN_SPEED = 0.01; // Minimum speed to ensure visibility
        normalizedValue = Math.max(MIN_SPEED, normalizedValue);
        
        // Log the original and adjusted normalized values for debugging
        console.log(`Path ${index} - ${pathData.name}: Original normalized value = ${normalizedValues[index]}, After multiplier = ${normalizedValue}`);
        
        // Create path element
        const path = svg.append("path")
            .datum(pathData.points)
            .attr("d", pathData.curve ? lineGeneratorCurved : lineGeneratorStraight)
            .attr("fill", "none")
            .attr("stroke", "none");
        
        activePaths.push(path);
        
        // Get the path length to adjust speed for curved paths
        const pathNode = path.node();
        const totalLength = pathNode.getTotalLength();
        
        // Adjust speed for curved paths - they need to be slower to appear at the same speed
        if (pathData.curve) {
            // Calculate a speed adjustment factor based on path length
            // For curved paths, we slow down the animation proportionally to how much longer the path is
            // compared to a typical straight path
            const TYPICAL_STRAIGHT_PATH_LENGTH = 200; // Approximate average length of straight paths
            const lengthRatio = totalLength / TYPICAL_STRAIGHT_PATH_LENGTH;
            
            // Apply a curve adjustment factor - curved paths should move slower
            // The more the path deviates from a straight line, the more we slow it down
            const curveAdjustmentFactor = Math.min(0.7, 1.0 / lengthRatio);
            normalizedValue = normalizedValue * curveAdjustmentFactor;
            
            console.log(`Adjusted speed for curved path ${pathData.name}: original=${normalizedValues[index]}, after multiplier=${normalizedValue}, final=${normalizedValue}, length=${totalLength}`);
        }
        
        // Create gradient
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
        
        // Calculate dot speed based on normalized value
        // Higher normalized value = faster animation = lower duration
        const speedFactor = normalizedValue; // Use normalized value directly as speed factor
        
        // NEW: Calculate animation duration based on both normalized value AND path length
        // This ensures that longer paths with the same normalized value don't appear to move faster
        // We use a standard reference length to calibrate speeds
        const REFERENCE_LENGTH = 150; // A reference path length for calibration
        const lengthAdjustment = totalLength / REFERENCE_LENGTH;
        const animationDuration = (BASE_ANIMATION_DURATION / speedFactor) * lengthAdjustment;
        
        // Calculate exactly how many dots we need for this path
        const dotsNeeded = Math.max(MIN_DOTS, Math.ceil(totalLength / GLOBAL_SPACING));
        
        console.log(`Path ${index} - ${pathData.name}: Normalized value = ${normalizedValue}, Path length = ${totalLength}, Length adjustment = ${lengthAdjustment}, Animation duration = ${animationDuration}ms`);
        
        // We'll use a single interval for each path, with consistent timing
        // This ensures dots are always created at the exact same rate
        const pathInterval = setInterval(() => {
            if (!animationRunning) {
                clearInterval(pathInterval);
                return;
            }
            
            // Create a new dot
            const dot = svg.append("circle")
                .attr("r", 7)
                .attr("fill", `url(#${gradientId})`)
                .attr("class", "animation-dot")
                .attr("data-path-index", index)
                .attr("data-normalized", normalizedValue); // Store normalized value for debugging
            
            // Position dot at start of path
            const startPoint = pathNode.getPointAtLength(0);
            dot.attr("cx", startPoint.x)
               .attr("cy", startPoint.y);
            
            currentDots.add(dot.node());
            
            // Animate the dot along the path with exact timing based on normalized value
            const transition = dot.transition()
                .duration(animationDuration) // This duration is now properly calculated from normalized value
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
                    }
                });
            
            activeTransitions.push(transition);
            
        }, animationDuration / dotsNeeded); // Perfect timing to maintain spacing
        
        dotIntervals.push(pathInterval);
    });
    
    // Master timeout needs to be more resilient
    const animationTimeout = setTimeout(() => {
        // Only restart if this is still the current animation
        if (animationRunning && !isPaused && currentAnimation === animationTimeout) {
            console.log("Animation cycle complete - planned restart");
            
            // Store current state
            const wasRunning = animationRunning;
            
            // Complete cleanup
            animationRunning = false;
            
            // Clear intervals first
            dotIntervals.forEach(clearInterval);
            dotIntervals = [];
            
            // Remove dots
            svg.selectAll(".animation-dot").interrupt().remove();
            currentDots.clear();
            
            // Remove paths
            activePaths.forEach(path => path.remove());
            activePaths = [];
            
            // Clear reference to this timeout
            currentAnimation = null;
            
            // Wait longer to ensure complete cleanup
            setTimeout(() => {
                if (wasRunning) {
                    console.log("Planned restart with fresh state");
                    startAnimation(pathsData, normalizedValues);
                }
            }, 200); // Increased delay for more reliable cleanup
        } else {
            console.log("Animation cycle complete but not restarting (was manually stopped)");
        }
    }, ANIMATION_LOOP_TIME);
    
    // Store reference to the current animation timeout
    currentAnimation = animationTimeout;
    
    return stopAnimation;
}

// Simplified mapping function that directly matches path names to reaction names
function mapPathsToNormalizedValues() {
    return d3.csv("./ProvidedData/Flux_Values_for_animation.csv").then(function(fluxData) {
        // Create a mapping of reaction names to normalized values
        const fluxMap = {};
        fluxData.forEach(d => {
            fluxMap[d.Reaction] = parseFloat(d.Normalized);
        });
        console.log("Loaded flux map:", fluxMap);
        
        // Map each path to its corresponding normalized value
        const normalizedValues = pathsData.map((path, index) => {
            // Direct match by path name
            if (path.name && fluxMap[path.name]) {
                console.log(`Path ${index} - ${path.name} matched directly: ${fluxMap[path.name]}`);
                return fluxMap[path.name];
            }
            
            // If no direct match, try to match by endpoints
            if (path.points && path.points.length >= 2) {
                const startPoint = path.points[0].name;
                const endPoint = path.points[path.points.length - 1].name;
                
                if (startPoint && endPoint) {
                    // Try direct mapping
                    const directKey = `${startPoint} -> ${endPoint}`;
                    if (fluxMap[directKey]) {
                        console.log(`Path ${index} matched by endpoints: ${directKey}`);
                        return fluxMap[directKey];
                    }
                    
                    // Try reverse mapping (for bidirectional reactions)
                    const reverseKey = `${endPoint} -> ${startPoint}`;
                    if (fluxMap[reverseKey]) {
                        console.log(`Path ${index} matched by reverse endpoints: ${reverseKey}`);
                        return fluxMap[reverseKey];
                    }
                }
            }

            // Default value if no match found
            console.log(`Path ${index} - ${path.name || "unnamed"} has no match, using default value`);
            return 0.5;
        });

        return normalizedValues;
    });
}

// Add this function to handle the loading overlay
function toggleLoadingOverlay(show) {
    const overlay = document.querySelector('.loading-overlay');
    if (overlay) {
        overlay.style.display = show ? 'flex' : 'none';
    }
}

// Update the startAnimationWithCorrectValues function to use showLoading instead
function startAnimationWithCorrectValues() {
    // Show loading overlay
    showLoading(true);
    
    // Load normalized values and start animation
    mapPathsToNormalizedValues().then(normalizedValues => {
        startAnimation(pathsData, normalizedValues);
        // Hide loading overlay
        showLoading(false);
    }).catch(error => {
        console.error("Error mapping values:", error);
        // Fall back to default animation
        startAnimation(pathsData);
        // Hide loading overlay
        showLoading(false);
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
        // First try exact path name matches
        if (path.name === "Green Path-sequence1") {
            return normalizedMap.get("G6P -> P5P") || 0.18;
        } else if (path.name === "Green Path-sequence2") {
            return normalizedMap.get("P5P -> X5P") || 0.11;
        } else if (path.name.match(/Green Path-sequence[4-8]/)) {
            return 0.05;
        } else if (path.name === "Green Path-sequence9") {
            return normalizedMap.get("TP + S7P -> F6P + E4P") || 0.06;
        } else if (path.name === "Green Path-sequence10") {
            return normalizedMap.get("P5P + X5P -> S7P + TP") || 0.06;
        } else if (path.name === "Green Path-sequence11") {
            return normalizedMap.get("P5P + X5P -> S7P + TP") || 0.06;
        } else if (path.name === "Green Path-sequence12") {
            return normalizedMap.get("X5P + E4P -> F6P + TP") || 0.05;
        } else if (path.name === "TG Well") {
            return normalizedMap.get("TP -> TG") || 0.01;
        }
        
        // If not matched by name, check by path points
        if (path.points && path.points.length >= 2) {
            const startPoint = path.points[0];
            const endPoint = path.points[path.points.length - 1];
            
            // Check for TP -> TG path specifically
            if (startPoint.name === "TP" && endPoint.name === "TG") {
                return normalizedMap.get("TP -> TG") || 0.01;
            }
        }
        
        // Fall back to generic mappings if no match
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
        document.querySelector('.startButton').addEventListener('click', function() {
            startAnimationWithCorrectValues();
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
document.addEventListener('DOMContentLoaded', function() {
    // Update the startButton event listener
    document.querySelector('.startButton').addEventListener('click', function() {
        startAnimationWithCorrectValues();
    });
    
    // Rest of your event listeners remain the same
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

// Function to generate arc points between two points on a circle
function generateArcPoints(startPoint, endPoint, cx, cy, r, numPoints = 20) {
    const arcPoints = [];
    
    // Calculate angles for start and end points
    const startAngle = Math.atan2(startPoint.y - cy, startPoint.x - cx);
    let endAngle = Math.atan2(endPoint.y - cy, endPoint.x - cx);
    
    // Ensure we go the shorter way around the circle
    if (Math.abs(endAngle - startAngle) > Math.PI) {
        if (endAngle > startAngle) {
            endAngle -= 2 * Math.PI;
        } else {
            endAngle += 2 * Math.PI;
        }
    }
    
    // Generate points along the arc
    for (let i = 0; i <= numPoints; i++) {
        const t = i / numPoints;
        const angle = startAngle * (1 - t) + endAngle * t;
        arcPoints.push({
            x: cx + r * Math.cos(angle),
            y: cy + r * Math.sin(angle)
        });
    }
    
    return arcPoints;
}


// Also remove the full circle path if it exists
for (let i = pathsData.length - 1; i >= 0; i--) {
    if (pathsData[i].name === "Circle Path") {
        pathsData.splice(i, 1);
    }
}

// Add circle segments with arc paths
const circleSegments = [
    { start: CircleSignificantPoints[0], end: CircleSignificantPoints[1], name: "CIT -> ICIT" },
    { start: CircleSignificantPoints[1], end: CircleSignificantPoints[2], name: "ICIT -> AKG" },
    { start: CircleSignificantPoints[2], end: CircleSignificantPoints[3], name: "AKG -> SUCC" },
    { start: CircleSignificantPoints[3], end: CircleSignificantPoints[5], name: "SUCC -> MAL" },
    { start: CircleSignificantPoints[5], end: CircleSignificantPoints[4], name: "MAL -> OAA" },
    { start: CircleSignificantPoints[4], end: CircleSignificantPoints[0], name: "OAA -> CIT" }
];

// Add circle segments to pathsData
circleSegments.forEach(segment => {
    const arcPoints = generateArcPoints(
        segment.start, 
        segment.end, 
        circleData.cx, 
        circleData.cy, 
        circleData.r,
        30  // More points for smoother arc
    );
    
    // Add labels to first and last points
    arcPoints[0].name = segment.start.label;
    arcPoints[arcPoints.length - 1].name = segment.end.label;
    
    pathsData.push({
        points: arcPoints,
        name: segment.name,
        curve: true  // Use curve for smoother path
    });
});