// Constants and Configuration
export const CONFIG = {
    svg: {
        selector: "#svgContainer",
        dimensions: {
            width: 1200,
            height: 1350
        },
        styles: {
            borders: {
                outer: {
                    color: "#7B6F56",
                    width: 3,
                    radius: 20,
                    offset: 2.5
                },
                inner: {
                    color: "#7B6F56",
                    width: 3,
                    radius: 20,
                    offset: 7.5
                }
            },
            background: "white"
        },
        labels: [
            { text: "Cytosol", x: 1050, y: 1325, color: "#7B6F56" },
            { text: "ER", x: 160, y: 430, color: "rgb(100% 0% 0%)" },
            { text: "Mitochondria", x: 550, y: 1320, color: "rgb(77.6% 77.6% 77.6%)" },
            { text: "Vacuole", x: 130, y: 90, color: "#36ADD4" }
        ],
        organelles: {
            er: {
                href: "ER.svg",
                x: -10,
                y: 220,
                width: 550,
                height: 550,
                opacity: 0.5
            },
            mitochondria: {
                href: "Mitochondria.svg",
                x: -430,
                y: -380,
                width: 2200,
                height: 2050,
                opacity: 0.5
            },
            vacuole: {
                cx: 180,
                cy: 170,
                rx: 115,
                ry: 130,
                stroke: "#36ADD4",
                strokeWidth: 3,
                opacity: 0.5
            }
        }, 
        well: false,
        OAA2: false
    },
    animation: {
        duration: 3000,    // Duration of each dot's journey
        dotRadius: 5,      // Size of the dots
        dotColor: "#63FF48"  // Green color for the dots
    }
};
// Add at the top of the file
export const circleData = {
    cx: 600,
    cy: 1090,
    r: 150
};

export const CircleSignificantPoints = [
    { x: circleData.cx + circleData.r * Math.cos(3 * Math.PI / 2), y: circleData.cy + circleData.r * Math.sin(3 * Math.PI / 2), label: "CIT", bidirectional: false},
    { x: circleData.cx + circleData.r * Math.cos(0), y: circleData.cy + circleData.r * Math.sin(0), label: "ICIT", bidirectional: true },
    { x: circleData.cx + circleData.r * Math.cos(Math.PI / 4), y: circleData.cy + circleData.r * Math.sin(Math.PI / 4), label: "AKG", bidirectional: false },
    { x: circleData.cx + circleData.r * Math.cos(Math.PI / 2), y: circleData.cy + circleData.r * Math.sin(Math.PI / 2), label: "SUCC", bidirectional: true },
    { x: circleData.cx + circleData.r * Math.cos(Math.PI), y: circleData.cy + circleData.r * Math.sin(Math.PI), label: "MAL", bidirectional: true },
    { x: circleData.cx + circleData.r * Math.cos((Math.PI + 3 * Math.PI / 2) / 2), y: circleData.cy + circleData.r * Math.sin((Math.PI + 3 * Math.PI / 2) / 2), label: "OAA", bidirectional: true }
];
// Line generators
export const lineGenerators = {
    straight: d3.line()
        .x(d => d.x)
        .y(d => d.y)
        .curve(d3.curveLinear),

    curved: d3.line()
        .x(d => d.x)
        .y(d => d.y)
        .curve(d3.curveBasis),

    circle: d3.line()
        .x(d => d.x)
        .y(d => d.y)
        .curve(d3.curveBasisClosed)
};

// Significant coordinates for all molecules
export const SignificantCoordinates = {
    "GLC.ext": {x: 480, y: -50, well: true},
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

// Path data definitions
export const initialPathsData = [
    // Main glycolysis path
    {
        points: [
            { x: 480, y: -50, name: "GLC.ext", bidirectional: false },
            { x: 480, y: 100, name: "G6P" },
            { x: 480, y: 230, name: "F6P", bidirectional: true },
            { x: 480, y: 400, name: "TP", bidirectional: true },
            { x: 480, y: 490, name: "3PG", bidirectional: true },
            { x: 480, y: 620, name: "PEP", bidirectional: false },
            { x: 480, y: 750, name: "PYR.c", bidirectional: false },
            { x: 480, y: 875, name: "PYR.m" }
        ],
        name: "Glycolysis Path",
        curve: false
    },
    // PYR.m to CIT path
    {
        points: [
            { x: 480, y: 875, name: "PYR.m", bidirectional: false },
            { x: 490, y: 940, name: "ACECOA", bidirectional: false },
            { x: 600, y: 940, name: "CIT", bidirectional: true }
        ],
        name: "PYR.m to CIT",
        curve: true
    },
    // Pentose phosphate pathway
    {
        points: [
            { x: 480, y: 100, name: "G6P", bidirectional: false },
            { x: 670, y: 100, name: "P5P", bidirectional: true },
            { x: 830, y: 100, name: "X5P", bidirectional: true },
            { x: 930, y: 100, bidirectional: false },
            { x: 930, y: 400, bidirectional: false },
            { x: 620, y: 400, bidirectional: false },
            { x: 620, y: 200, bidirectional: false },
            { x: 670, y: 200, name: "TP", bidirectional: true },
            { x: 830, y: 360, name: "E4P", bidirectional: true }
        ],
        name: "Pentose Phosphate Path A",
        curve: false
    },
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
               { x: 830, y: 100, name: "X5P", well: true, bidirectional: true}],
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
               { x: 800, y: 850, name: "OAA2", bidirectional: false}],
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
    { points: [{ x: 706.0660171779821, y: 1196.066017177982, name: "AKG", bidirectional: false},
               { x: 800, y: 1100, name: "HCIT", bidirectional: false},
               { x: 880, y: 1030, name: "LYS", bidirectional: false, well: true}],
               name: "AKG to LYS", curve: false},
    { points: [{ x: 706.0660171779821, y: 1196.066017177982, name: "AKG", bidirectional: false},
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

// Utility functions
export function generateCirclePath(cx, cy, r) {
    const circlePoints = [];
    const numPoints = 100;
    const startAngle = 3 * Math.PI / 2;
    for (let i = 0; i <= numPoints; i++) {
        const angle = startAngle + (i / numPoints) * 2 * Math.PI;
        circlePoints.push({ 
            x: cx + r * Math.cos(angle), 
            y: cy + r * Math.sin(angle) 
        });
    }
    return circlePoints;
}

// Need to update circle configuration:
export const circleConfig = {
    cx: 600,
    cy: 1090,
    r: 150
};