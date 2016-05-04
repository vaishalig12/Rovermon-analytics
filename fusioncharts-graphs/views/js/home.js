function _oldreadJson(){
    var xmlhttp = new XMLHttpRequest();
    var url = "http://localhost:8080/home";
    var myArr,
        i;
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            myArr = JSON.parse(xmlhttp.responseText);
            //            for(i=0; i<myArr.dataset.length-2;i++) {
            ////                plotDonut(myArr.dataset[i]);
            //            }
            plotMeter(myArr.dataset[3]);
            initMap(myArr.dataset[4]);
            LiveChart('temperature', myArr.temperature);
            LiveChart('voltage', myArr.voltage);
            LiveChart('WPT',myArr.WPT);
            Batterymeter();
        }
    }
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function readJson(){
    var xmlhttp = new XMLHttpRequest();
    var url = "http://localhost:3000/sensor/data";
    var myArr,
        i;
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            myArr = JSON.parse(xmlhttp.responseText);
            //            for(i=0; i<myArr.dataset.length-2;i++) {
            ////                plotDonut(myArr.dataset[i]);
            //            }
            //plotMeter(myArr.dataset[3]);
            //initMap(myArr.dataset[4]);
            //LiveChart('temperature', myArr.temperature);
            //LiveChart('voltage', myArr.voltage);
            //LiveChart('WPT',myArr.WPT);
            LiveChart('Random', myArr["random"]["value"]);
            //Batterymeter();
        }
    }
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function plotMeter(data) {
    var dataset = Array(),
        data_objs = data.data,
        data_tooltip = data.tooltip,
        container = data.container;
    for(var i=0; i<data_objs.length; i++) {
        dataset.push([data_objs[i].name, parseInt(data_objs[i].value)]);
    }
    Meter(container,data_tooltip,dataset);  
}

//google API in WIP
function initMap(data) {
    var long = parseFloat(data.data[0].longitude),
        latd = parseFloat(data.data[0].latitude),
        positionX = parseFloat(data.data[0].posX),
        positionY = parseFloat(data.data[0].posY);
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 8
    });
}

/*function LiveChart1() {
    var chart= new Highcharts.Chart({
        chart: {
            type: 'spline',
            animation: Highcharts.svg, // don't animate in old IE
            marginRight: 10,
            events: {
                load: function () {

                    // set up the updating of the chart each second
                    var series = this.series[0];
                    setInterval(function () {
                        var x = (new Date()).getTime(), // current time
                            y = Math.random();
                        series.addPoint([x, y], true, true);
                    }, 1000);
                }
            },
            renderTo: voltage,
        },
        title: {
            text: ''
        },
        xAxis: {
            type: 'datetime',
            tickPixelInterval: 150
        },
        yAxis: {
            title: {
                text: 'Value',
                color: '#FFFFF'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            formatter: function () {
                return '<b>' + this.series.name + '</b><br/>' +
                    Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                    Highcharts.numberFormat(this.y, 2);
            }
        },
        legend: {
            enabled: false
        },
        exporting: {
            enabled: false
        },
        series: [{
            name: 'Random data',
            data: (function () {
                // generate an array of random data
                var data = [],
                    time = (new Date()).getTime(),
                    i;

                for (i = -19; i <= 0; i += 1) {
                    data.push({
                        x: time + i * 1000,
                        y: Math.random()
                    });
                }
                return data;
            }())
        }]
    });
}; */

function Meter(container, series_name1, series_data1) {

    var chart2= new Highcharts.Chart({

        chart: {
            type: 'gauge',
            renderTo: container,
            backgroundColor:null,
            plotBackgroundColor: null,
            plotBackgroundImage: null,
            plotBorderWidth: 0,
            plotShadow: false
        },

        title: {
            text: ''
        },
        exporting: {
            buttons: {
                contextButton: {
                    enabled: false
                }
            }
        },
        pane: {
            startAngle: -150,
            endAngle: 150,
            background: [{
                backgroundColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                    stops: [
                        [0, '#FFF'],
                        [1, '#333']
                    ]
                },
                borderWidth: 0,
                outerRadius: '109%'
            }, {
                backgroundColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                    stops: [
                        [0, '#333'],
                        [1, '#FFF']
                    ]
                },
                borderWidth: 1,
                outerRadius: '107%'
            }, {
                // default background
            }, {
                backgroundColor: '#DDD',
                borderWidth: 0,
                outerRadius: '105%',
                innerRadius: '103%'
            }]
        },

        // the value axis
        yAxis: {
            min: 0,
            max: 200,

            minorTickInterval: 'auto',
            minorTickWidth: 1,
            minorTickLength: 10,
            minorTickPosition: 'inside',
            minorTickColor: '#666',

            tickPixelInterval: 30,
            tickWidth: 2,
            tickPosition: 'inside',
            tickLength: 10,
            tickColor: '#666',
            labels: {
                step: 2,
                rotation: 'auto'
            },
            title: {
                text: 'km/h'
            },
            plotBands: [{
                from: 0,
                to: 120,
                color: '#55BF3B' // green
            }, {
                from: 120,
                to: 160,
                color: '#DDDF0D' // yellow
            }, {
                from: 160,
                to: 200,
                color: '#DF5353' // red
            }]
        },

        series: [{
            name: series_name1,
            data: series_data1,
            tooltip: {
                valueSuffix: ' km/h'
            }
        }]

    },
                                     // Add some life
                                     function (chart) {
        if (!chart.renderer.forExport) {
            setInterval(function () {
                var point = chart.series[0].points[0],
                    newVal,
                    inc = Math.round((Math.random() - 0.5) * 20);

                newVal = point.y + inc;
                if (newVal < 0 || newVal > 200) {
                    newVal = point.y - inc;
                }

                point.update(newVal);

            }, 3000);
        }
    });
};

function LiveChart(sensor_name, sensor_data) {
    var chart= new Highcharts.Chart({
        chart: {
            type: 'spline',
            animation: Highcharts.svg, // don't animate in old IE
            marginRight: 10,
            events: {
                load: function () {

                    // set up the updating of the chart each second
                    var series = this.series[0];
                    setInterval(function () {
                        var x = (new Date()).getTime(), // current time
                            y = Math.random();
                        series.addPoint([x, y], true, true);
                    }, 1000);
                }
            },
            renderTo: sensor_name,
             backgroundColor: {
                linearGradient: { x1: 0, y1: 1, x2: 1, y2: 1 },
                stops: [
                    [0, 'rgb(56,20,46)'],
                    [1, 'rgb(139,44,64)']
                ]
            },
        },
        title: {
            text: ''
        },
        xAxis: {
            type: 'datetime',
            tickPixelInterval: 150
        },
        yAxis: {
            title: {
                text: 'Value'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            formatter: function () {
                return '<b>' + this.series.name + '</b><br/>' +
                    Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                    Highcharts.numberFormat(this.y, 2);
            }
        },
        legend: {
            enabled: false
        },
        exporting: {
            enabled: false
        },
        series: [{
            name: sensor_name,
            data: /* to change data: [time, data] */
            (function () {
                // generate an array of random data
                var data = [],
                    time = (new Date()).getTime(),
                    i;

                for (i = -19; i <= 0; i += 1) {
                    data.push({
                        x: time + i * 1000,
                        y: sensor_data
                    });
                }
                return data;
            }())
        }]
    });
};
/*function LiveChart2() {
    var chart= new Highcharts.Chart({
        chart: {
            type: 'spline',
            animation: Highcharts.svg, // don't animate in old IE
            marginRight: 10,
            events: {
                load: function () {

                    // set up the updating of the chart each second
                    var series = this.series[0];
                    setInterval(function () {
                        var x = (new Date()).getTime(), // current time
                            y = Math.random();
                        series.addPoint([x, y], true, true);
                    }, 1000);
                }
            },
            renderTo: 'container_4',
             backgroundColor: {
                linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
                stops: [
                    [0, 'rgb(90,93,113)'],
                    [1, 'rgb(199,160,149)']
                ]
            },
        },
        title: {
            text: ''
        },
        xAxis: {
            type: 'datetime',
            tickPixelInterval: 150
        },
        yAxis: {
            title: {
                text: 'Value'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            formatter: function () {
                return '<b>' + this.series.name + '</b><br/>' +
                    Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                    Highcharts.numberFormat(this.y, 2);
            }
        },
        legend: {
            enabled: false
        },
        exporting: {
            enabled: false
        },
        series: [{
            name: 'Random data',
            data: (function () {
                // generate an array of random data
                var data = [],
                    time = (new Date()).getTime(),
                    i;

                for (i = -19; i <= 0; i += 1) {
                    data.push({
                        x: time + i * 1000,
                        y: Math.random()
                    });
                }
                return data;
            }())
        }]
    });
}; */

function Batterymeter(){

    var gaugeOptions = {

        chart: {
            type: 'solidgauge',
             backgroundColor: {
                linearGradient: { x1: 1, y1: 0, x2: 1, y2: 1 },
                stops: [
                   [0, 'rgb(56,20,46)'],
                    [1, 'rgb(139,44,64)']
                ]
            },
        },
        exporting: {
            enabled: false
        },
        title: null,

        pane: {
            center: ['50%', '65%'],
            size: '100%',
            startAngle: -90,
            endAngle: 90,
            background: {
                backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
                innerRadius: '60%',
                outerRadius: '100%',
                shape: 'arc'
            }
        },

        tooltip: {
            enabled: false
        },

        // the value axis
        yAxis: {
            stops: [
                [0.1, '#55BF3B'], // green
                [0.5, '#DDDF0D'], // yellow
                [0.9, '#DF5353'] // red
            ],
            lineWidth: 0,
            minorTickInterval: null,
            tickPixelInterval: 400,
            tickWidth: 0,
            title: {
                y: -70
            },
            labels: {
                y: 16
            }
        },

        plotOptions: {
            solidgauge: {
                dataLabels: {
                    y: 5,
                    borderWidth: 0,
                    useHTML: true
                }
            }
        }
    };

    // The speed gauge
    $('#container_bat').highcharts(Highcharts.merge(gaugeOptions, {
        yAxis: {
            min: 0,
            max: 200,
            title: {
                text: ''
            }
        },

        credits: {
            enabled: false
        },

        series: [{
            name: 'Speed',
            data: [90],
            dataLabels: {
                format: '<div style="text-align:center"><span style="font-size:25px;color:' +
                ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}</span><br/>' +
                '<span style="font-size:12px;color:silver">volts</span></div>'
            },
            tooltip: {
                valueSuffix: 'volts'
            }
        }]

    }));


    // Bring life to the dials
    setTimeout(function () {
        // Speed
        var chart = $('#container_bat').highcharts(),
            point,
            newVal,
            inc;

        if (chart) {
            point = chart.series[0].points[0];
            inc = Math.round((Math.random() - 0.5) * 100);
            newVal = point.y + inc;

            if (newVal < 0 || newVal > 200) {
                newVal = point.y - inc;
            }

            point.update(newVal);
        }

    }, 2000);

}

