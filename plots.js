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

// call out what happens when the option are changed 
function optionChanged(newSample) {
    buildMetadata(newSample);
    buildCharts(newSample);
    buildGauge(newSample);
};

function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
        var metadata = data.metadata;
        var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];
        var PANEL = d3.select("#sample-metadata");

        PANEL.html("");
        PANEL.append("h6").text('ID: ' + result.id);
        PANEL.append("h6").text('ETHNICITY: ' + result.ethnicity);
        PANEL.append("h6").text('GENDER: ' + result.gender);
        PANEL.append("h6").text('AGE: ' + result.age);
        PANEL.append("h6").text('LOCATION: ' + result.location);
        PANEL.append("h6").text('BBTYPE: ' + result.bbtype);
        PANEL.append("h6").text('WFREQ: ' + result.wfreq);
    });
};

function buildCharts(sample) {
    d3.json("samples.json").then((data) => {
        var valuesamples = data.samples;
        var newarray = valuesamples.filter(sampledata => sampledata.id == sample);
        var result = newarray[0];
// Build the bar graph 
        var otu_ids = result.otu_ids;
        var otu_labels = result.otu_labels;
        var samplevalues = result.sample_values;
        var Filterdata = otu_ids.slice(0, 10).map(otuID => `OTU${otuID}`).reverse();
        var tracedata = {
            x: samplevalues.slice(0, 10).reverse(),
            y: Filterdata,
            text: otu_labels.slice(0, 10).reverse(),
            orientation: "h",
            type: "bar",
            marker: {
            color: "Green",
            }
        };
        var data = [tracedata];
        var layout = {
            title: "<b>Bacterial Species per Sample </b> <br> Top 10 bacterial species (OTUs)",
            margin: { t: 50, l: 150 },
        };
        Plotly.newPlot("bar", data, layout);
//Build bubble charts 
        var tracesample = {
            x: otu_ids,
            y: samplevalues,
            text: otu_labels,
            type: "scatter",
            mode: 'markers',
            marker: {
                color: otu_ids,
                colorscale: 'Greens',
                opacity: 0.8,
                size: samplevalues,
                sizemode: 'diameter'
            }
        };
        var data = [tracesample];
        var chartlayout = {
            title: "<b> All the Bacterial Species per Sample",
            xaxis: { title: "OTU ID" },
            showlegend: false,
            height: 600,
            width: 1200
        };
        Plotly.newPlot("bubble", data, chartlayout);
    });
}

init();

//timeseries graph - Gauge Graph

function buildGauge(wfreq) {
    //frequencey between 0 and 180
    var level = parseFloat(wfreq) * 20;

    //math calculations for the meter point using MathPI
    var degrees = 180 - level;
    var radius = 0.5;
    var radians = (degrees * Math.PI)/180;
    var x = radius * Math.cos(radians);
    var y = radius * Math.sin(radians);

    // creating main path
    var mainPath = "M -.0 -0.05 L .0 0.05 L";
    var paX = String(x);
    var space = " ";
    var paY = String(y);
    var pathEnd = "Z";
    var path = mainPath.concat(paX, space, paY, pathEnd);

    var newdata = [
        {
            type: "scatter",
            x: [0],
            y: [0],
            marker: {size:11, color: "85000"},
            showlegend: false,
            name: "Freq",
            text: level,
            hoverinfo: "text+name"
        },
        {
            values: [50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50],
            rotation: 90, 
            text: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
            textinfo: "text",
            textposition: "inside",
            marker: {
                //Specify the colors for this graph 
                colors: [
                    "rgba(0, 105, 11, .5)",
                    "rgba(10, 120, 22, .5)",
                    "rgba(14, 127, 0, .5)",
                    "rgba(110, 154, 22, .5)",
                    "rgba(170, 202, 42, .5)",
                    "rgba(202, 209, 95, .5)",
                    "rgba(210, 206, 145, .5)",
                    "rgba(232, 226, 202, .5)",
                    "rgba(240, 230, 215, .5)",
                    "rgba(255, 255, 255, 0)",
                ]
            },
        labels: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
        hoverinfo: "label",
        hole: 0.5,
        type: "pie",
        showlegend: false
        },

    ];
    var layout = {
        shapes: [
            {
                type: "path",
                path: path,
                fillcolor: "850000",
                line: {
                    color: "850000"
                }
            }
        ],
        title: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week",
        height: 500,
        width: 500,
        xaxis: {
            zeroline: false,
            showticklabels: false,
            showgrid: false,
            range: [-1,1]
        },
        yaxis: {
            zeroline: false,
            showticklabels: false,
            showgrid: false,
            range: [-1,1]
        }
    };
    var GaugE = document.getElementById("gauge");
    Plotly.newPlot(GaugE,newdata,layout);
}