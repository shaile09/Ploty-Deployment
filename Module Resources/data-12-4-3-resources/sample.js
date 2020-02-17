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
        var sample_values = data.samples;
        var resultsArray = sample_values.filter(sampledata => sampledata.id == sample);
        var result = resultsArray[0];

        var otu_ids = result.otu_ids;
        var otu_labels = result.otu_labels;
        var samplevalues = result.sample_values;
        var filteredData = otu_ids.slice(0, 10).map(otuID => `OTU${otuID}`).reverse();
        var trace = {
            x: samplevalues.slice(0, 10).reverse(),
            y: filteredData,
            text: otu_labels.slice(0, 10).reverse(),
            orientation: "h",
            type: "bar",
            marker: {
            color: "Pink",
            }
        };
        var data = [trace];
        var layout = {
            title: "<b>Bacterial Species per Sample",
            margin: { t: 30, l: 100 },

        };
        Plotly.newPlot("bar", data, layout);
        //Create bubble chart -- relative frequency of all bacterial species
        var trace1 = {
            x: otu_ids,
            y: samplevalues,
            text: otu_labels,
            type: "scatter",
            mode: 'markers',
            marker: {
                color: otu_ids,
                colorscale: 'Picnic',
                opacity: 0.8,
                size: samplevalues,
                //sizeref: 2.0 * Math.max(samplevalues) / (40**2),
                sizemode: 'diameter'
            }
        };
        var data = [trace1];
        var layout = {
            title: "<b> All the Bacterial Species per Sample",
            xaxis: { title: "OTU ID" },
            showlegend: false,
            height: 600,
            width: 1200
        };
        Plotly.newPlot("bubble", data, layout);
    });
}

init();

//timeseries graph

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
            marker: {size:12, color: "85000"},
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
                colors: [
                    "rgba(49,54,149, 0)",
                    "rgba(69,117,180, .5)",
                    "rgba(116,173,209, .5)",
                    "rgba(171,217,233, .5)",
                    "rgba(224,243,248, .5)",
                    "rgba(254,224,144, .5)",
                    "rgba(253,174,97, .5)",
                    "rgba(244,109,67, .5)",
                    "rgba(215,48,39, .5)",
                    "rgba(165,0,38, 0)",
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
