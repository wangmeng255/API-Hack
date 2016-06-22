"use strict"
$(function() {
	$("#show-dist").change(function() {
		//$(".selectG").get(0).classList.remove("selectG");
		//var district = $("#0" + $(this).val());
		//district.get(0).classList.add("selectG");
		$(".selectG").children().remove();
		var district = $("#0" + $(this).val()).children().clone();
		for(var i=0; i<district.get().length; i++)
			$(".selectG").append(district.get(i));
	});
	$("#add").click(function() {
    var selectOption = $("#show-dist option:selected").clone();
    selectOption.text(selectOption.text() + ", " + $("#year option:selected").val());
    $("#dist").append(selectOption);
    if($("#dist option").length===2) {
        $("input[type='submit']").prop("disabled", false);
        $("#add").prop("disabled", true);
    }
    else $("#add").prop("disabled", false);
    $("#remove").prop("disabled", false);
  });
  $("#remove").click(function() {
    $("#dist option:selected").remove();
    if($("#dist option").length < 2) {
      $("input[type='submit']").prop("disabled", true);
    }
    if($("#dist option").length === 0) {
      $("#remove").prop("disabled", true);
    } else $("#remove").prop("disabled", false);
    $("#add").prop("disabled", false);
  });
	$("form").submit(function(event) {
    	event.preventDefault();

      var submitButt = $("input[type='submit']");
      submitButt.toggleClass("waiting");
      submitButt.prop("disabled", true);
      submitButt.val("");

      var submitArr = [];
      submitArr.push(getsubmitObject($("#dist option:first-child")));
      submitArr.push(getsubmitObject($("#dist option:last-child")));
      getValueofUnits(submitArr, submitButt);
    });

    google.charts.load('current', {'packages':['corechart']});
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
var getsubmitObject = function(tempDist) {
  var tempArr = tempDist.text().split(",");
  var submitObject = {name: tempArr[0], year: tempArr[1].slice(1), id: tempDist.val()};
  return submitObject;
};
function getDistrictData(submitYear, submitDist) {
      return $.ajax({
      url: "//api.census.gov/data/"+ submitYear + "/acs1",
      data: "get=B25075_001E,B25075_001M,B25075_002E,B25075_002M,B25075_003E,B25075_003M," +
      "B25075_004E,B25075_004M,B25075_005E,B25075_005M,B25075_006E,B25075_006M,B25075_007E," +
      "B25075_007M,B25075_008E,B25075_008M,B25075_009E,B25075_009M,B25075_010E,B25075_010M," +
      "B25075_011E,B25075_011M,B25075_012E,B25075_012M,B25075_013E,B25075_013M,B25075_014E," +
      "B25075_014M,B25075_015E,B25075_015M,B25075_016E,B25075_016M,B25075_017E,B25075_017M," +
      "B25075_018E,B25075_018M,B25075_019E,B25075_019M,B25075_020E,B25075_020M,B25075_021E," +
      "B25075_021M,B25075_022E,B25075_022M,B25075_023E,B25075_023M,B25075_024E,B25075_024M," +
      "B25075_025E,B25075_025M&for=school+district+(unified):" + submitDist +
      "&in=state:06&key=e7f1f3b0b196081950597b4723850dbc8156d69b",
      dataType: "json",
      type: "GET"
    });
  }
function getValueofUnits(submitArr, submitButt) {
	$.when(
    getDistrictData(submitArr[0].year, submitArr[0].id.slice(1)),
    getDistrictData(submitArr[1].year, submitArr[1].id.slice(1))
  )
	.done(function(result0, result1) {
    //console.log(result0);
    //console.log(result1);

		$("#data-chart").children().remove();
		if(result0[0][1][2] || result1[0][1][2]) {
			var resultData = [];
			resultData.push(["Price", 
        submitArr[0].name + " in " + submitArr[0].year, 
        submitArr[1].name + " in " + submitArr[1].year]);
      if(!result0[0][1][2]) resultData[0][1] = "Results are null";
      if(!result1[0][1][2]) resultData[0][2] = "Results are null";
			for(var i=2; i<result0[0][0].length-2; i+=2) {
				var temp = [];
				temp.push(label[result0[0][0][i]]);
				temp.push(parseInt(result0[0][1][i]));
				temp.push(parseInt(result1[0][1][i]));
				resultData.push(temp);
			}
	   	drawStuff(resultData, submitArr);
      $("#dist").children().remove();
		}
		else {
			$("#data-chart").append("<p>Sorry, both results are null.</p>");
		}
	})
	.fail(function(jqXHR, error) {
		$('#data-chart').append("<p>" + error + "<p>");
	})
  .always(function() {
    submitButt.toggleClass("waiting");
    submitButt.val("Submit");
    $("#add").prop("disabled", false);
    $("#remove").prop("disabled", true);
  });
}
function drawStuff(resultData, submitArr) {
		var data = google.visualization.arrayToDataTable(resultData);
    var tempStr = "";
    var tempArr = submitArr[0].name.split(" ");
    for(var i=0; i<tempArr.length-3; i++)
      tempStr += tempArr[i] + " ";
    tempStr += "and ";
    tempArr = submitArr[1].name.split(" ");
    for(var i=0; i<tempArr.length-3; i++)
      tempStr += tempArr[i] + " ";
    var chartWidth = 80;
    if($(document).width()<=980) chartWidth = 45;
    var options = {
      width: chartWidth*16,
      height: 500,
      title: "Value of Home in " + tempStr + "Unified School Districts",
      subtitle: submitArr[0].year + " and " + submitArr[1].year,
      vAxis: {title: "Number of Units"},
      hAxis: {title: "Price"},
      seriesType: "bars",
      series: {
        0: { color:"#F9A825"},
        1: { color:"#D0D0D0"}
      }
    };

    var chart = new google.visualization.ComboChart(document.getElementById('data-chart'));
    chart.draw(data, options);
};