d3.csv("Edit_Flux_Values.csv").then(function(data) {
    console.log(data);  // Check the console to see if data is loaded correctly

    data.forEach(d => {
        console.log(`Reaction Name: ${d['Reaction Name']}, Reaction: ${d['Reaction']}, Flux Value: ${d['Flux Value']}`);
        // You can access other columns similarly
    });

}).catch(function(error) {
    console.error('Error loading or parsing CSV file:', error);
});
