var chartData;

$(function(){
  $.ajax({

    url: 'http://localhost:3300/randomData',
    type: 'GET',
    success : function(data) {
      chartData = data;
      
      var chartProperties = {
        "caption": "Variation of Random sensor data",
        //"numberprefix": "Rs",
        "xAxisName": "Timeline",
        "yAxisName": "Values"
      };

      var categoriesArray = [{
          "category" : data["categories"]
      }];

      var lineChart = new FusionCharts({
        type: 'msline',
        renderAt: 'chart-location',
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
