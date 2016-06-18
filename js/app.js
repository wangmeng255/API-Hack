"use strict"
$(function() {
	$("#dist").change(function() {
		//$(".selectG").get(0).classList.remove("selectG");
		//var district = $("#0" + $(this).val());
		//district.get(0).classList.add("selectG");
		$(".selectG").find("path").remove();
		var district = $("#0" + $(this).val()).clone();
		$(".selectG").append(district.find("path").get(0));
		//console.log($("select[name='dist'] option"));
	});
	
	$("form").submit(function(event) {
    	event.preventDefault();
    	getValueofUnits($(this).serializeArray());
    });
    google.charts.load('current', {'packages':['bar']});
    //This call back will call the drawChart() 
    //as soon as the visulization library is loaded, 
    //(but I didn't wanted it, i wanted to call it on button click).
	//google.charts.setOnLoadCallback(drawStuff);
});
var label = {
	B25075_001E: "Total",
	B25075_001M: "Margin of Error",
	B25075_002E: "Less than $10,000",
	B25075_002M: "Margin of Error",
	B25075_003E: "$10,000 to $14,999",
	B25075_003M: "Margin of Error",
	B25075_004E: "$15,000 to $19,999",
	B25075_004M: "Margin of Error",
	B25075_005E: "$20,000 to $24,999",
	B25075_005M: "Margin of Error",
	B25075_006E: "$25,000 to $29,999",
	B25075_006M: "Margin of Error",
	B25075_007E: "$30,000 to $34,999",
	B25075_007M: "Margin of Error",
	B25075_008E: "$35,000 to $39,999",
	B25075_008M: "Margin of Error",
	B25075_009E: "$40,000 to $49,999",
	B25075_009M: "Margin of Error",
    B25075_010E: "$50,000 to $59,999",
	B25075_010M: "Margin of Error",
	B25075_011E: "$60,000 to $69,999",
	B25075_011M: "Margin of Error",
	B25075_012E: "$70,000 to $79,999",
	B25075_012M: "Margin of Error",
	B25075_013E: "$80,000 to $89,999",
	B25075_013M: "Margin of Error",
	B25075_014E: "$90,000 to $99,999",
	B25075_014M: "Margin of Error",
	B25075_015E: "$100,000 to $124,999",
	B25075_015M: "Margin of Error",
	B25075_016E: "$125,000 to $149,999",
	B25075_016M: "Margin of Error",
	B25075_017E: "$150,000 to $174,999",
	B25075_017M: "Margin of Error",
	B25075_018E: "$175,000 to $199,999",
	B25075_018M: "Margin of Error",
	B25075_019E: "$200,000 to $249,999",
	B25075_019M: "Margin of Error",
	B25075_020E: "$250,000 to $299,999",
	B25075_020M: "Margin of Error",
	B25075_021E: "$300,000 to $399,999",
	B25075_021M: "Margin of Error",
	B25075_022E: "$400,000 to $499,999",
	B25075_022M: "Margin of Error",
	B25075_023E: "$500,000 to $749,999",
	B25075_023M: "Margin of Error",
	B25075_024E: "$750,000 to $999,999",
	B25075_024M: "Margin of Error",
	B25075_025E: "$1,000,000 or more",
	B25075_025M: "Margin of Error"
};
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
		//console.log(result);
		$('#data-chart').children().remove();
		if(result) {
			if(result[1][2]) {
				var resultData = [];
				resultData.push(["Price", "Number of Units", "Margin of Error"]);
				for(var i=2; i<result[0].length-2; i+=2) {
					var temp = [];
					temp.push(label[result[0][i]]);
					temp.push(parseInt(result[1][i]));
					temp.push(parseInt(result[1][i+1]));
					resultData.push(temp);
				}
				//console.log(resultData);
	    		drawStuff(resultData, submitArr);
			}
			else {
				$('#data-chart').append("<p>Sorry, results are null.</p>");
			}
		}
		else {
			$('#data-chart').append("<p>This district is not in " + submitArr[1].value + " survey.</p>");
		}
	})
	.fail(function(jqXHR, error) {
		$('#data-chart').append("<p>" + error + "<p>");
	});
}
function drawStuff(resultData, submitArr) {
		var data = google.visualization.arrayToDataTable(resultData);
        var options = {
          width: 80*16,
          height: 500,
          chart: {
            title: 'Value of Home in ' + $("option[value=" + submitArr[0].value+"]").text(),
            subtitle: 'California Unified School District, ' + submitArr[1].value
          },
          series: {
            0: { axis: 'Number of Units' }, // Bind series 0 to an axis named 'distance'.
            1: { axis: 'Margin of Error' } // Bind series 1 to an axis named 'brightness'.
          },
          colors: ['#F9A825', '#B0B0B0']
        };

      var chart = new google.charts.Bar(document.getElementById('data-chart'));
      chart.draw(data, options);
    };