var chartData1;
var chartData2;
var chartData3;

$(function(){
  $.ajax({

    url: 'http://localhost:3300/tempData',
    type: 'GET',
    success : function(data) {
      chartData1 = data;
      
      var chartProperties = {
        "caption": "Variation of temperature sensor data",
        //"numberprefix": "Rs",
        "xAxisName": "Timeline",
        "yAxisName": "Values",
        "showValues": "0"
      };

      var categoriesArray = [{
          "category" : data["categories"]
      }];

      var lineChart = new FusionCharts({
        type: 'msline',
        renderAt: 'chart-location1',
        width: '1000',
        height: '600',
        dataFormat: 'json',
        dataSource: {
          chart: chartProperties,
          categories : categoriesArray,
          dataset : data["dataset"]
        }
      });
      lineChart.render();
    }
  });
});

$(function(){
  $.ajax({

    url: 'http://localhost:3300/MPUData',
    type: 'GET',
    success : function(data) {
      chartData2 = data;
      
      var chartProperties = {
        "caption": "Variation of MPU sensor data",
        //"numberprefix": "Rs",
        "xAxisName": "Timeline",
        "yAxisName": "Values",
        "showValues": "0"
      };

      var categoriesArray = [{
          "category" : data["categories"]
      }];

      var lineChart = new FusionCharts({
        type: 'msline',
        renderAt: 'chart-location2',
        width: '1000',
        height: '600',
        dataFormat: 'json',
        dataSource: {
          chart: chartProperties,
          categories : categoriesArray,
          dataset : data["dataset"]
        }
      });
      lineChart.render();
    }
  });
});

$(function(){
  $.ajax({

    url: 'http://localhost:3300/randomData',
    type: 'GET',
    success : function(data) {
      chartData2 = data;
      
      var chartProperties = {
        "caption": "Variation of random sensor data",
        //"numberprefix": "Rs",
        "xAxisName": "Timeline",
        "yAxisName": "Values",
        "showValues": "0"
      };

      var categoriesArray = [{
          "category" : data["categories"]
      }];

      var lineChart = new FusionCharts({
        type: 'msline',
        renderAt: 'chart-location3',
        width: '1000',
        height: '600',
        dataFormat: 'json',
        dataSource: {
          chart: chartProperties,
          categories : categoriesArray,
          dataset : data["dataset"]
        }
      });
      lineChart.render();
    }
  });
});
