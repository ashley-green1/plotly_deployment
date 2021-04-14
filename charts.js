function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    console.log(data);
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  console.log(newSample);
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    // test output console.log(samples);

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray1 = samples.filter(sampleObj => sampleObj.id == sample);
    // test output console.log(resultArray1);

    //  5. Create a variable that holds the first sample in the array.
    var result1 = resultArray1[0];
    // test output console.log(result1);

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var sampleLabels = result1.otu_ids;
    // test output console.log(sampleLabels);

    var sampleValues = result1.sample_values;
    // test output console.log(sampleValues);

    var hoverText = result1.otu_labels;
    // test output console.log(hover_text);

    // 7. Create the yticks for the bar chart.
    var yticks = sampleLabels.map(label => "OTU " + label).slice(0,10).reverse();
    var xticks = sampleValues.map(val => parseInt(val)).slice(0,10).reverse();
    var chartHoverText = hoverText.slice(0,10).reverse();

    console.log(xticks);
    
    // 8. Create the trace for the bar chart. 
    var barTrace = {
      x: xticks,
      y: yticks,
      type: "bar", orientation: "h"
    };
    
    var barData = [barTrace];
    
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      showticklabels: true,
    }; 
        
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);
  
// -------------------------------------------------------
    // D2.1. Create the trace for the bubble chart.
    var bubbleTrace = {
      x: sampleLabels,
      y: sampleValues,
      text: hoverText,
      mode: 'markers',
      marker: {
        size: sampleValues,
        color: sampleLabels
      }
    };

    var bubbleData = [bubbleTrace];

    // D2.2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Top 10 Bacteria Cultures Per Sample",
      xaxis: {title: "OTU ID"}, 
      hovermode: 'closest',
      hoverlabel: hoverText
    };

    // D2.3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
// --------------------------------------------------------

    // D3.1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata = data.metadata;
    
    // Filter the data for the object with the desired sample number
    var resultArray2 = metadata.filter(sampleObj => sampleObj.id == sample);
        
    // D3.2. Create a variable that holds the first sample in the metadata array.
    var result2 = resultArray2[0];

    // D3.3. Create a variable that holds the washing frequency.
    var  wash_freq = parseInt(result2.wfreq);

    // D3.4. Create the trace for the gauge chart.
    var gaugeData = [ 
      {
        //domain: {x: [0,1], y: [0,1]},
        value: wash_freq,
        title: {text: "Belly Button Washing Frequency<br>Scrubs Per Week"},
        type: "indicator",
        mode: "gauge+number",
        //delta: {reference: 400},
        gauge: {
          axis: {range: [null, 10], tickwidth: 1, tickcolor: "black"},
          bar: {color: "black"},
          bgcolor: "white",
          borderwidth: 2,
          bordercolor: "gray",
          steps: [
            { range: [0, 2], color: "red" },
            { range: [2, 4], color: "orange" },
            { range: [4, 6], color: "yellow" },
            { range: [6, 8], color: "lightgreen" },
            { range: [8, 10], color: "green" }
          ]
        }
      }
    ];
    
    // D3.5. Create the layout for the gauge chart.
    var gaugeLayout = { width: 600, height: 400};
    
    //};

    // D3.6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);
  });


}
