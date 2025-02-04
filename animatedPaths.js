import { SVGManager } from './NewPaths.js';
import { 
    lineGenerators, 
    SignificantCoordinates, 
    initialPathsData, 
    generateCirclePath,
    circleData,
    CircleSignificantPoints,
    CONFIG
} from './pathConfig.js';

// Molecule class for data handling
class Molecule {
    constructor(reactionName, reaction, fluxValue, typeReaction, comments) {
        this.reactionName = reactionName;
        this.reaction = reaction;
        this.fluxValue = fluxValue;
        this.typeReaction = typeReaction;
        this.comments = comments;
    }
}

// Class to handle path animations
class PathAnimator {
    constructor(svg) {
        console.log('Path Animator initializing');
        this.svg = svg;
        this.animationConfig = CONFIG.animation;
        this.activeAnimations = new Set();
    }

    animatePath(pathData) {
        // Clean up existing animations for this path
        d3.selectAll(`.animation-dot-${pathData.name}`).remove();
        
        const path = this.svg.append("path")
            .attr("d", d3.line()
                .x(d => d.x)
                .y(d => d.y)(pathData.points))
            .style("opacity", 0);

        const numberOfDots = Math.round(Math.abs(pathData.fluxValue));
        const totalLength = path.node().getTotalLength();
        const animationDuration = 3000;  // Duration for each dot's journey
        
        // Create a single animation cycle
        const createDot = (index) => {
            const dot = this.svg.append("circle")
                .attr("r", 5)
                .attr("fill", "#63FF48")
                .attr("class", `animation-dot-${pathData.name}`);

            const startPoint = path.node().getPointAtLength(0);
            dot.attr("cx", startPoint.x)
               .attr("cy", startPoint.y);

            const animation = dot.transition()
                .duration(animationDuration)
                .ease(d3.easeLinear)
                .tween("pathTween", () => {
                    return (t) => {
                        const point = path.node().getPointAtLength(t * totalLength);
                        dot.attr("cx", point.x)
                           .attr("cy", point.y);
                    };
                })
                .on("end", () => {
                    dot.remove();
                    this.activeAnimations.delete(animation);
                    
                    // Create next dot
                    if (index < numberOfDots - 1) {
                        setTimeout(() => createDot(index + 1), 100);
                    }
                });

            this.activeAnimations.add(animation);
        };

        // Start the first dot
        createDot(0);

        // Clean up path after all dots have finished
        setTimeout(() => path.remove(), animationDuration + (numberOfDots * 100));
    }
}

// Class to handle data processing and reactions
class ReactionProcessor {
    static preprocessReaction(reaction) {
        let reactionType = 'unidirectional';
        let separator = '->';

        if (reaction.includes('<->')) {
            reactionType = 'bidirectional';
            separator = '<->';
        }

        const [leftSide, rightSide] = reaction.split(separator).map(side =>
            side.split("+").map(part => part.trim())
        );

        const commonMolecules = leftSide.filter(molecule => 
            rightSide.includes(molecule)
        );

        const filteredLeft = leftSide.filter(molecule => 
            !commonMolecules.includes(molecule)
        );
        const filteredRight = rightSide.filter(molecule => 
            !commonMolecules.includes(molecule)
        );

        return { left: filteredLeft, right: filteredRight, reactionType };
    }

    static separateParts(molecule, parts, pathsData, reactionType) {
        const { left, right } = parts;

        if (left.length === 0 || right.length === 0) {
            console.warn(`Not enough significant parts for molecule ${molecule.reaction}`);
            return;
        }

        const beginning = left[0].trim();
        const end = right[0].trim();

        if (SignificantCoordinates[beginning] && SignificantCoordinates[end]) {
            pathsData.push({
                points: [SignificantCoordinates[beginning], SignificantCoordinates[end]],
                bidirectional: reactionType === 'bidirectional'
            });

            if (reactionType === 'bidirectional') {
                pathsData.push({
                    points: [SignificantCoordinates[end], SignificantCoordinates[beginning]],
                    bidirectional: true
                });
            }
        }
    }
}

// Main application class
class CarbonPathways {
    constructor() {
        console.log('CarbonPathways initializing...');
        this.svgManager = new SVGManager();
        this.pathAnimator = new PathAnimator(this.svgManager.getSVG());
        this.pathsData = [];
        this.isAnimating = false;
    }

    async initialize() {
        try {
            // Draw all static paths first
            console.log('Drawing static paths...');
            this.drawStaticPaths();
            
            console.log('Loading molecules...');
            const molecules = await this.loadMolecules();
            console.log('Loaded molecules:', molecules);
            
            console.log('Processing molecules...');
            this.processMolecules(molecules);
            console.log('Processed pathsData:', this.pathsData);
            
            console.log('Starting animation...');
            this.startAnimation();
        } catch (error) {
            console.error('Failed to initialize:', error);
        }
    }

    startAnimation() {
        if (this.isAnimating) return;
        this.isAnimating = true;

        // Clean up existing animations
        d3.selectAll(".animation-dot").remove();

        this.pathsData.forEach(pathData => {
            this.pathAnimator.animatePath(pathData);
        });

        // Restart animation with proper timing
        const cycleTime = 3000 + (Math.max(...this.pathsData.map(p => Math.round(Math.abs(p.fluxValue)))) * 300);
        setTimeout(() => {
            this.isAnimating = false;
            this.startAnimation();
        }, cycleTime);
    }

    processMolecules(molecules) {
        // Clear existing pathsData
        this.pathsData = [];
        
        molecules.forEach(molecule => {
            const parts = ReactionProcessor.preprocessReaction(molecule.reaction);
            const beginning = parts.left[0]?.trim();
            const end = parts.right[0]?.trim();

            // Find matching path in initialPathsData
            const matchingPath = initialPathsData.find(path => {
                const pathStart = path.points[0].name;
                const pathEnd = path.points[path.points.length - 1].name;
                return (pathStart === beginning && pathEnd === end) ||
                       (pathStart === end && pathEnd === beginning);
            });

            if (matchingPath && SignificantCoordinates[beginning] && SignificantCoordinates[end]) {
                this.pathsData.push({
                    points: matchingPath.points,  // Use all points from matching path
                    bidirectional: parts.reactionType === 'bidirectional',
                    fluxValue: parseFloat(molecule.fluxValue),
                    name: molecule.reactionName,
                    curve: matchingPath.curve
                });
                console.log('Added path:', molecule.reactionName, 'with flux:', molecule.fluxValue);  // Debug log
            }
        });
        
        console.log('Final processed paths:', this.pathsData);  // Debug log
    }

    drawStaticPaths() {
        // Draw all initial paths
        initialPathsData.forEach(pathData => {
            const lineGenerator = pathData.curve ? 
                lineGenerators.curved : 
                lineGenerators.straight;
                
            this.svgManager.getSVG().append("path")
                .attr("d", lineGenerator(pathData.points))
                .attr("fill", "none")
                .attr("stroke", pathData.bidirectional ? "blue" : "grey")
                .attr("stroke-width", 2)
                .attr("class", "static-path");
        });
    }

    async loadMolecules() {
        try {
            const data = await d3.csv("Edit_Flux_Values.csv");
            return data.map(d => new Molecule(
                d['Reaction Name'],
                d['Reaction'],
                d['Flux Value'],
                d['Type of Reaction'],
                d['comments']
            ));
        } catch (error) {
            console.error('Error loading molecules:', error);
            return [];
        }
    }
}

// Initialize the application
const app = new CarbonPathways();
app.initialize();

export { 
    Molecule, 
    PathAnimator, 
    ReactionProcessor, 
    CarbonPathways
};