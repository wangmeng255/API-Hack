$(function() {
	$("#dist").change(function() {
		$(".selectG").get(0).classList.remove("selectG");
		$("#0" + $(this).val()).get(0).classList.add("selectG");
	});
	google.charts.load('current', {'packages':['bar']});
    google.charts.setOnLoadCallback(drawStuff);
	
	$("form").submit(function(event) {
    	event.preventDefault();
    	getValueofUnits($(this).serializeArray());
    });

	function drawStuff() {
        var data = new google.visualization.arrayToDataTable([
          ['Galaxy', 'Distance', 'Brightness'],
          ['Canis Major Dwarf', 8000, 23.3],
          ['Sagittarius Dwarf', 24000, 4.5],
          ['Ursa Major II Dwarf', 30000, 14.3],
          ['Lg. Magellanic Cloud', 50000, 0.9],
          ['Bootes I', 60000, 13.1]
        ]);

        var options = {
          width: 900,
          chart: {
            title: 'Nearby galaxies',
            subtitle: 'distance on the left, brightness on the right'
          },
          series: {
            0: { axis: 'distance' }, // Bind series 0 to an axis named 'distance'.
            1: { axis: 'brightness' } // Bind series 1 to an axis named 'brightness'.
          },
          axes: {
            y: {
              distance: {label: 'parsecs'}, // Left y-axis.
              brightness: {side: 'right', label: 'apparent magnitude'} // Right y-axis.
            }
          }
        };

      var chart = new google.charts.Bar(document.getElementById('dual_y_div'));
      chart.draw(data, options);
    };

});
function getValueofUnits(submitArr) {
	$.ajax({
		url: "//api.census.gov/data/"+ submitArr[1].value + "/acs1",
		data: "get=B25075_001E,B25075_001M,B25075_002E,B25075_002M,B25075_003E,B25075_003M," +
		"B25075_004E,B25075_004M,B25075_005E,B25075_005M,B25075_006E,B25075_006M,B25075_007E," +
		"B25075_007M,B25075_008E,B25075_008M,B25075_009E,B25075_009M,B25075_010E,B25075_010M," +
		"B25075_011E,B25075_011M,B25075_012E,B25075_012M,B25075_013E,B25075_013M,B25075_014E," +
		"B25075_014M,B25075_015E,B25075_015M,B25075_016E,B25075_016M,B25075_017E,B25075_017M," +
		"B25075_018E,B25075_018M,B25075_019E,B25075_019M,B25075_020E,B25075_020M,B25075_021E," +
		"B25075_021M,B25075_022E,B25075_022M,B25075_023E,B25075_023M,B25075_024E,B25075_024M," +
		"B25075_025E,B25075_025M&for=school+district+(unified):" + submitArr[0].value.slice(1) +
		"&in=state:06&key=e7f1f3b0b196081950597b4723850dbc8156d69b",
		dataType: "json",
		type: "GET"
	})
	.done(function(result) {
		console.log(result);
	})
	.fail(function(jqXHR, error) {
		var errorElem = showError(error);
		$('.data-chart').append(errorElem);
	});
}