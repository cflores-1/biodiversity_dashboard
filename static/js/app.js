
// loads in our data when the page loads
function buildMetadata() {

    // First, need to use D3 library to read the json file
    d3.json("http://localhost:8000/samples.json").then((data) => {
        window.data = data;

        //check using console.log
        console.log(data);
        var data = data;

        //Dropdown menu with ID numbers
        var idList = data.names;

        //create loop to loop through ID's
        for (var i = 0; i < idList.length; i++) {
            selectBox = d3.select("#selDataset");
            selectBox.append("option").text(idList[i]);
        }

        //Default
        updatePlots(0)

    });
}


//To update plots
function updatePlots(index) {
        
        //Arrays for horizontal bar chart and gauge chart
        //
        var sampleOTUs = window.data.samples[index].otu_ids;
        console.log(sampleOTUs);
        var sampleFrequency = window.data.samples[index].sample_values;
        var otuLabels = window.data.samples[index].otu_labels;

        var washFrequency = window.data.metadata[+index].wfreq;
        console.log(washFrequency);
    
        //Demographic data
        var demoKeys = Object.keys(window.data.metadata[index]);
        var demoValues = Object.keys(window.data.metadata[index]);
        var demoData = d3.select('#sample-metadata');

        //clear demo data
        demoData.html("");

        //create loop
        for (var i = 0; i < demoKeys.length; i++) {

            demoData.append("p").text(`${demoKeys[i]}: ${demoValues[i]}`);
        };

        //use reverse function to cut and reverse data for bar chart
        var tenOTUS = sampleOTUs.slice(0,10).reverse();
        var tenFrequency = sampleFrequency.slice(0,10).reverse();
        var tenToolTips = window.data.samples[0].otu_labels.slice(0,10).reverse();
        var tenLabels = tenOTUS.map((otu => "OTU" + otu));
        var reversedLabels = tenLabels.reverse();

        //trace
        var traceOne = {
            x:tenFrequency,
            y:reversedLabels,
            text:tenToolTips,
            name: "",
            type:"bar",
            orientation:"h"
        };

        //data
        var barData = [traceOne];

        //layout
        var layout = {
            title: "Top 10 OTU's",
            margin: {
                l: 75,
                r: 75,
                t: 75,
                b: 50
            }
        };

        //Plot with id 
        Plotly.newPlot("bar", barData, layout);

        //trace
        traceTwo = {
            x:sampleOTUs,
            y:sampleFrequency,
            text: otuLabels,
            mode:'markers',
            marker: {
                color: sampleOTUs,
                opacity: [1, 0.5, 0.5, 0.5],
                size: sampleFrequency
            }
        }

        //data
        var bubbleData = [traceTwo];

        //Apply layout
        var layout = {
            title: 'OTU Frequency',
            showlegend: false,
            height: 500,
            width: 800
        }
        
        //plot to the div tag 
        Plotly.newPlot("bubble", bubbleData, layout)

        //creating the bubble chart
        var traceThree = [{
            domain: {x: [0, 1], y:[0,1]},
            type: "indicator",
            mode: "gauge+number",
            value: washFrequency,
            title: { text: "Belly Button Wash/Week"},
            gauge: {
                axis: { range: [0,9], tickwidth:0.5, tickcolor: "black" },
                bar: { color: "gray" },
                bgcolor: "white",
                borderwidth: 2,
                bordercolor: "transparent",
                steps: [
                    { range: [0,1], color: "blue" },
                    { range: [1,2], color: "blue" },
                    { range: [2,3], color: "green" },
                    { range: [3,4], color: "green" },
                    { range: [4,5], color: "yellow" },
                    { range: [5,6], color: "yellow" },
                    { range: [6,7], color: "orange" },
                    { range: [7,8], color: "orange" },
                    { range: [8,9], color: "red" }
                ],
            }
        }];

        gaugeData = traceThree;

        var layout = {
            width: 500,
            height: 500,
            margin: { t:0, b:0}
        };

        Plotly.newPlot("gauge", gaugeData, layout);
    }

    //refresh data when you click on button
    d3.selectAll("#selDataset").on("change", refreshData);

    function refreshData() {
        var dropdown = d3.select("#selDataset");

        var ID = dropdown.property("value");
        console.log(ID);

        console.log(data)

        //loop
        for (var i = 0; i < data.names.length; i++) {
            if (ID === data.names[i]) {
                //
                updatePlots(i);
                return
            }
        }
    }


//load initial data
buildMetadata()
