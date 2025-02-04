import { CONFIG } from './pathConfig.js';
import { circleData, CircleSignificantPoints } from './pathConfig.js';
import { initialPathsData } from './pathConfig.js';  // Add this import
import { SignificantCoordinates } from './pathConfig.js';

class SVGManager {
    constructor(config = CONFIG) {
        console.log('SVG Manager initializing');
        this.config = config;
        this.svg = d3.select(config.svg.selector);
        this.tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);
        
        if (!this.svg.node()) {
            throw new Error(`SVG element with selector "${config.svg.selector}" not found`);
        }

        this.tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        this.initializeSVG();
    }
    // Add tooltip methods
    showTooltip(text, event) {
        this.tooltip.transition()
            .duration(200)
            .style("opacity", .9);
        this.tooltip.html(text)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 28) + "px");
    }

    hideTooltip() {
        this.tooltip.transition()
            .duration(500)
            .style("opacity", 0);
    }

    initializeSVG() {
        console.log('Initializing SVG...');
        // Set SVG dimensions and ensure it can show elements outside border
        this.svg
            .attr("width", this.config.svg.dimensions.width)
            .attr("height", this.config.svg.dimensions.height + 100)  // Add extra height
            .attr("viewBox", `0 -100 ${this.config.svg.dimensions.width} ${this.config.svg.dimensions.height + 100}`)  // Include negative space
            .attr("overflow", "visible");

        this.createBorders();
        this.addLabels();
        this.addOrganelles();
        
        // Create TCA cycle circle
        this.createCirclePath(circleData.cx, circleData.cy, circleData.r, CircleSignificantPoints);
    }

    createBorders() {
        const { dimensions, styles } = this.config.svg;
        
        // Outer border
        this.svg.append("rect")
        .attr("x", styles.borders.outer.offset)
        .attr("y", styles.borders.outer.offset)
        .attr("width", dimensions.width - 2 * styles.borders.outer.offset)
        .attr("height", dimensions.height - 2 * styles.borders.outer.offset)
        .attr("fill", "none")
        .attr("stroke", styles.borders.outer.color)
        .attr("stroke-width", styles.borders.outer.width)
        .attr("rx", styles.borders.outer.radius)
        .attr("ry", styles.borders.outer.radius);


        // Create inner border
        this.svg.append("rect")
        .attr("x", styles.borders.inner.offset)
        .attr("y", styles.borders.inner.offset)
        .attr("width", dimensions.width - 2 * styles.borders.inner.offset)
        .attr("height", dimensions.height - 2 * styles.borders.inner.offset)
        .attr("fill", "none")
        .attr("stroke", styles.borders.inner.color)
        .attr("stroke-width", styles.borders.inner.width)
        .attr("rx", styles.borders.inner.radius)
        .attr("ry", styles.borders.inner.radius);
    }

    createBorder({ x, y, width, height, color, radius, strokeWidth, fill = "none" }) {
        return this.svg.append("rect")
            .attr("x", x)
            .attr("y", y)
            .attr("width", width)
            .attr("height", height)
            .attr("fill", fill)
            .attr("stroke", color)
            .attr("stroke-width", strokeWidth)
            .attr("rx", radius)
            .attr("ry", radius);
    }

    addLabels() {
        // Add organelle labels from config
        const { labels } = this.config.svg;
        labels.forEach(label => {
            this.svg.append("text")
                .attr("x", label.x)
                .attr("y", label.y)
                .attr("font-size", "17px")
                .attr("font-family", "arial")
                .attr("fill", label.color)
                .text(label.text);
        });

        // Add point labels from paths
        initialPathsData.forEach(pathData => {
            pathData.points.forEach(point => {
                if (point.name) {
                    this.svg.append("text")
                        .attr("x", point.x + 10)  // Offset text slightly from point
                        .attr("y", point.y)
                        .attr("font-size", "17px")
                        .attr("font-family", "arial")
                        .attr("fill", "black")
                        .text(point.name);
                }
            });
        });
    }

    addOrganelles() {
        const { organelles } = this.config.svg;

        // Add ER
        this.svg.append("image")
            .attr("href", organelles.er.href)
            .attr("x", organelles.er.x)
            .attr("y", organelles.er.y)
            .attr("width", organelles.er.width)
            .attr("height", organelles.er.height)
            .attr("opacity", organelles.er.opacity);

        // Add Mitochondria
        this.svg.append("image")
            .attr("href", organelles.mitochondria.href)
            .attr("x", organelles.mitochondria.x)
            .attr("y", organelles.mitochondria.y)
            .attr("width", organelles.mitochondria.width)
            .attr("height", organelles.mitochondria.height)
            .attr("opacity", organelles.mitochondria.opacity);

        // Add Vacuole
        this.svg.append("ellipse")
            .attr("cx", organelles.vacuole.cx)
            .attr("cy", organelles.vacuole.cy)
            .attr("rx", organelles.vacuole.rx)
            .attr("ry", organelles.vacuole.ry)
            .attr("stroke", organelles.vacuole.stroke)
            .attr("stroke-width", organelles.vacuole.strokeWidth)
            .attr("fill", "none")
            .attr("opacity", organelles.vacuole.opacity);
    }

    createCirclePath(cx, cy, r, points = []) {
        console.log('Creating circle path and points...'); // DEBUG
        
        // Create the circle
        const circle = this.svg.append("circle")
            .attr("cx", cx)
            .attr("cy", cy)
            .attr("r", r)
            .attr("fill", "none")
            .attr("stroke", "grey")
            .attr("stroke-width", 2);

        // Add all the points along the circle
        points.forEach(point => {
            console.log('Adding circle point:', point);  // Debug log
            this.addPoint(point.x, point.y, point.label, point.bidirectional, point.well);
        });

        // Add additional points from initialPathsData
        initialPathsData.forEach(pathData => {
            pathData.points.forEach(point => {
                if (point.name) {
                    console.log('Adding path point:', point);  // Debug log
                    this.addPoint(point.x, point.y, point.name, false, point.well);
                }
            });
        });

        return circle;
    }

    addPoint(x, y, label, bidirectional = false, well = false) {
        console.log('Adding point:', label, 'well:', well);  // Debug log
        
        // Create the dot
        this.svg.append("circle")
            .attr("cx", x)
            .attr("cy", y)
            .attr("r", well ? 10 : 5)
            .attr("fill", well ? "black" : "#36ADD4");

        if (label) {
            // Use displayName if it exists, otherwise use the original label
            const displayLabel = SignificantCoordinates[label]?.displayName || label;
            
            this.svg.append("text")
                .attr("x", x + 10)
                .attr("y", y)
                .attr("font-size", "17px")
                .attr("font-family", "arial")
                .attr("fill", "black")
                .text(displayLabel);
        }
    }

    getSVG() {
        return this.svg;
    }
}

// Initialize SVG manager
const svgManager = new SVGManager();

// Export for use in other files if using modules
export { SVGManager, CONFIG };