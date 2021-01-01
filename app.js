// 1. Use the D3 library to read in samples.json.
function buildDemos(test) {
    d3.json("samples.json").then((data) => {
        var demographics = data.metadata;
        
        var testData = demographics.filter(testObj => testObj.id == test);
        var filteredData = testData[0];

//Bonus Gauge        
        var trace3 = {
                    type: "pie",
                    showlegend: false,
                    hole: 0.4,
                    rotation: 90,
                    values: [10, 10, 10, 10, 10, 10, 10, 10, 10, 90],
                    text: ["0-1", "1-2", "2-3", "3-4", "4-5", "5-6", "6-7", "7-8", "8-9", ""],
                    direction: "clockwise",
                    textinfo: "text",
                    textposition: "inside",
                    marker: {
                      colors: ["rgba(255,25,140,1.0)", "rgba(255,25,179,1.0)", "rgba(255,25,217,1.0)", "rgba(255,25,255,1.0)", "rgba(217, 25, 255, 1.0)", "rgba(179,25,255,1.0)", "rgba(140, 25, 255, 0.8)", "rgba(102,25,255,1.0)", "rgba(64, 25, 255  , 0.8)", "white"],  
                      labels: ["0-1", "1-2", "2-3", "3-4", "4-5", "5-6", "6-7", "7-8", "8-9", " "],
                      hoverinfo: "labels"
                    }
                  };
                  var scrubsWeek = testData[0].wfreq;  
          
                  var degrees = 10 * scrubsWeek, radius = 0.25
                  var radians = degrees * Math.PI / 94
                  var x = 0.5 - (radius * Math.cos(radians))
                  var y = 0.5 + (radius * Math.sin(radians))
                          
                  var layout3 = {
                    shapes:[{
                        type: 'line',
                        x0: 0.5,
                        y0: 0.5,
                        x1: x,
                        y1: y,
                        line: {
                          color: 'purple',
                          width: 8
                        }
                      }],
                    title: 'Belly Button Washing Frequency',
                    font: {
                      family: 'sans-serif, monospace',
                      size: 12,
                      color: '#9f0fd8'
                    },
                    xaxis: {visible: false, range: [-1, 1]},
                    yaxis: {visible: false, range: [-1, 1]}
                    };
                    
                  var data3 = [trace3];
                  
                  Plotly.newPlot("gauge", data3, layout3);
        
        var PANEL = d3.select("#sample-metadata");
        PANEL.html("");
        
        Object.entries(filteredData).forEach(([key, value]) => {
        PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
});
}

function plotSubject(tests) {
    d3.json("samples.json").then((data) => {
        
        var subject = data.samples;
        
        var testsData = subject.filter(testsObj => testsObj.id == tests);
        var filtersData = testsData[0];
        
        var otuIds = filtersData.otu_ids;
        var otuLabels = filtersData.otu_labels;
        var sampleValues = filtersData.sample_values;

// 2. Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.
// * Use `sample_values` as the values for the bar chart.
// * Use `otu_ids` as the labels for the bar chart.
// * Use `otu_labels` as the hovertext for the chart.
        var trace1 = {
        x: sampleValues.slice(0, 10).reverse(),
        y: otuIds.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
        text: otuLabels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h",
        marker: {
            color: 'rgb(204, 0, 153)',
        },
        
        
        };

        var data1 = [trace1];

        var layout1 = {
            title: "Top 10 Operational Taxonomic Units, OTUs",
            font: {
                family: 'sans-serif, monospace',
                size: 12,
                color: '#9f0fd8'
              },
            xaxis: { title: "Sample Values" },
            yaxis: { title: "OTU IDs" }
        };
        
        Plotly.newPlot("bar", data1, layout1);

        // 3. Create a bubble chart that displays each sample.
        // * Use `otu_ids` for the x values.
        // * Use `sample_values` for the y values.
        // * Use `sample_values` for the marker size.
        // * Use `otu_ids` for the marker colors.
        // * Use `otu_labels` for the text values. 

        var trace2 = {
            x: otuIds,
            y: sampleValues,
            text: otuLabels,
            mode: 'markers',
            marker: {
              color: otuIds,
              colorscale: 'Bluered',
            //   opacity: otuIds,
              size: sampleValues,
              line: {
                color: otuIds,
                colorscale: 'Bluered',
              }
            },
            type: 'scatter'
          };
          
        var data2 = [trace2];
          
        var layout2 = {
            showlegend: false,
            title: "Subject Demographics",
            font: {
                family: 'sans-serif, monospace',
                size: 12,
                color: '#9f0fd8'
              },
            xaxis: { title: "OTU IDs" },
            yaxis: { title: "Sample Values" }
        };
          
          Plotly.newPlot("bubble", data2, layout2);

        })
      }

// 4. Display the sample metadata, i.e., an individual's demographic information.
// 5. Display each key-value pair from the metadata JSON object somewhere on the page.
// 6. Update all of the plots any time that a new sample is selected. 
function init() {
    d3.json("samples.json").then((data) => {

        var testSubject = d3.select("#selDataset");

        data.names.forEach((ids) => {
            testSubject
              .append("option")
              .text(ids)
              .property("value", ids)
          })
      
          subjectOne = data.names[0];
      
          buildDemos(subjectOne);
          plotSubject(subjectOne);
      
        })
      }
      
      function optionChanged(subjectID) {
      
        buildDemos(subjectID);
        plotSubject(subjectID);
      }
      

  init();