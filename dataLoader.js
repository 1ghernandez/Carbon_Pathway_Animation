// Import necessary libraries if not globally available
import * as d3 from "d3";
import * as XLSX from "xlsx";

export function loadAndMergeData() {
    return Promise.all([
        d3.csv("Edit_Flux_Values.csv"), // Load CSV
        fetch("Gloria_Flux_Order.xlsx") // Load Excel
            .then(res => res.arrayBuffer())
            .then(data => {
                const workbook = XLSX.read(data, { type: "array" });
                const sheetName = workbook.SheetNames[0];
                return XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
            })
    ]).then(([csvData, excelData]) => {
        // Merge data
        const mergedData = excelData.map(orderRow => {
            const matchingCsvRow = csvData.find(csvRow => csvRow.Reaction.trim() === orderRow.Reaction.trim());
            if (matchingCsvRow) {
                return {
                    Order: orderRow["Order #"],
                    Group: orderRow.Group,
                    Reaction: orderRow.Reaction,
                    ReactionName: matchingCsvRow["Reaction Name"],
                    FluxValue: matchingCsvRow["Flux Value"],
                    TypeOfReaction: matchingCsvRow["Type of Reaction"],
                    Comments: matchingCsvRow["Comments"] || orderRow.Comments || ""
                };
            } else {
                console.warn(`No match found for reaction: ${orderRow.Reaction}`);
                return null;
            }
        }).filter(row => row !== null);

        console.log("Merged Data:", mergedData); // Debugging log
        return mergedData;
    }).catch(error => {
        console.error('Error loading or merging data:', error);
        return []; // Return empty array in case of an error
    });
}
