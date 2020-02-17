function init() {
  var selector = d3.select("#selDataset");

  d3.json("samples.json").then((data) => {
    console.log(data);
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
    optionChanged(sampleNames[0]);
  })
}

// init();

// function optionChanged(newSample) {
//   buildMetadata(newSample);
//   buildCharts(newSample);
// };
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    var PANEL = d3.select("#sample-metadata");

    PANEL.html("");
    PANEL.append("h6").text('id: ' + result.id);
    PANEL.append("h6").text('ethnicity: ' + result.ethnicity);
    PANEL.append("h6").text('gender: ' + result.gender);
    PANEL.append("h6").text('age: ' + result.age);
    PANEL.append("h6").text('location: ' + result.location);
    PANEL.append("h6").text('bbtype: ' + result.bbtype);
    PANEL.append("h6").text('wfreq: ' + result.wfreq);
  });
}

//function for bar charts 
function buildCharts(sample) {
  d3.json("samples.json").then((data) => {
    var samples = data.samples;
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample)
    var sortedresult = resultArray.sort((a, b) => a.sample_values - b.sample_values).reverse();

    var result = sortedresult[0];
    var otu_ids = result.otu_ids;
    var sample_values = result.sample_values;
    var otu_labels = result.otu_labels;
    var otu_ids_string = otu_ids.map(otu_ids => `OTU ${otu_ids}`);

    var wfreq = result.wfreq;
    var trace = {
      x: sample_values.slice(0, 10).reverse(),
      y: otu_ids_string.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h"
    };
    //console.log(otu_ids.slice(0,10));
    //console.log(sample_values.slice(0,10));
    var data = [trace];
    var layout = {
      title: "Top 10 bacterial species (OTUs)",
      // xaxis: { title: "" },
      // yaxis: { title: ""}
      margin: { t: 50, l: 150 }
    };
    Plotly.newPlot("bar", data, layout);
  });
  var bubbleChart = {
    title: "Bacteria Cultures Per Sample",
    margin: {
      t: 0
    },
    hovermode: "closest",
    xaxis: {
      title: "OTU ID"
    },
    margin: {
      t: 30
    }
  };
  
  var databubbles = [{
    x: result.otu_ids,
    y: sample_values,
    text: otu_labels,
    mode: "markers",
    marker: {
      size: sample_values,
      color: otu_ids,
      colorscale: "Earth"
    }
  }];
  
  Plotly.newPlot("bubble", databubbles, bubbleChart)
}

//function for bubblecharts 



// var ylabel = otu_ids.slice(0, 10).map(otuID => 'OTU ${otuID}').reverse();
// var barinfo = [{
//   y: ylabel,
//   x: sample_values.slice(0, 10).reverse(),
//   text: otu_labels(0, 10).reverse(),
//   type: "bar",
//   orientation: "h",
// }];

// var labelsbar = {
//   title: "Top 10 Bacteria Cultures Found",
//   margin: {
//     t: 30,
//     l: 150
//   }
// };

// Plotly.newPlot("bar", databubbles, labelsbar)

// function init() {
//   var selector = d3.select("#selDataset");

//   d3.json("sample.jason").then((data) => {
//     var sampleNames = data.names;

//     sampleNames.forEach((sample) => {
//       selector
//         .append("option")
//         .text(sample)
//         .property("value", sample);
//     });

//     var newvalue = sampleNames[0];
//     buildCharts(newvalue);
//     buildMetadata(newvalue);
//   });
// }

function optionChanged(newSample) {
  buildCharts(newSample);
  buildMetadata(newSample);
}

init();