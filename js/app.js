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
	/*var request = {
		get: "B25075_001E,B25075_001M",
		for: "school+district+(unified):" + submitArr[0].value,
		in: "state:06",
		key: "e7f1f3b0b196081950597b4723850dbc8156d69b"
	};*/
	$.ajax({
		url: "http://api.census.gov/data/" + submitArr[1].value + "/acs1?" +
		"get=B25075_001E,B25075_001M&" + "for=school+district+(unified):" +
		submitArr[0].value.slice(1) + "&in=state:06&key=e7f1f3b0b196081950597b4723850dbc8156d69b",
		dataType: "jsonp",
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