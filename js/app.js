"use strict"
$(function() {

  //change browser url
  $.address.init(function(event) {
    $("form").address();
  })
  .change(function(event) {

    //deserialize would reset the inputs in form
    //tempInput record the input selected options
    var tempInput = [];
    tempInput.push($("#show-dist option:selected"));
    tempInput.push($("#year option:selected"));

    //deserialize parameters to the form input value
    $("form").deserialize(event.parameters);

    //restore the selected options
    tempInput[0].get(0).selected = true;
    tempInput[1].get(0).selected = true;
  });

//hightlight seleced district in svg
  $("#show-dist").change(function() {

    //clear the previous selected district
    $(".selectDist").children().remove();

    //copy and paste the selected district
    var district = $("#0" + $(this).val()).children().clone();
    for(var i = 0; i < district.get().length; i++)
      $(".selectDist").append(district.get(i));
  });

  //add button click event
  $("#add").click(function() {
    var selectOption = $("#show-dist option:selected");
    var selectYear = $("#year option:selected");

    // if nothing has been added yet
    if(!$("#dist td").length) { 
      $("input[name='dist1']").val(selectOption.val());
      $("input[name='dist1']").text(selectOption.text());
      $("input[name='year1']").val(selectYear.val());
      $("#dist tr:first-child").append(
        "<td>" + 
          selectOption.text() + 
        "</td>"
      );
      $("#dist tr:first-child").append(
        "<td>" + 
          selectYear.text() + 
        "</td>"
      );
    }// if one district has been added
    else if($("#dist td").length === 2) { 
      $("input[name='dist2']").val(selectOption.val());
      $("input[name='dist2']").text(selectOption.text());
      $("input[name='year2']").val(selectYear.val());
      $("#dist tr:last-child").append(
        "<td>" + 
          selectOption.text() + 
        "</td>"
      );
      $("#dist tr:last-child").append(
        "<td>" + 
          selectYear.text() + 
        "</td>"
      );
    }

    //if two districts are added disable the add button
    //enable the submit button
    if($("#dist td").length === 4) {
      $("input[type='submit']").get(0).disabled = false;
      $("#add").get(0).disabled = true;
    }

    //two districts are already added enable the reset button
    $("#reset").get(0).disabled = false;
  });

  //reset button click event
  $("#reset").click(function() {

    //clear the td in #dist table
    $("#dist td").remove();

    //set reset and submit disable and add enable
    $("#reset").get(0).disabled = true;
    $("#add").get(0).disabled = false;
    $("input[type='submit']").get(0).disabled = true;
  });

  //form submit event
  $("form").submit(function(event) {
    event.preventDefault();

    //change submit button to a waiting picture
    var submitButt = $("input[type='submit']");
    submitButt.toggleClass("waiting");
    submitButt.get(0).disabled = true;
    submitButt.val("");

    //get the district name, id and year
    var submitArr = getsubmitObject($("form").serializeArray());

    //send request to server, get the data and plot chart
    getValueofUnits(submitArr, submitButt);
  });

  //load google charts api
  google.charts.load('current', {'packages':['corechart']});
});

//the variable and their meaning, infromation from census.gov
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

//parse the name, id and year information from serializeArray
var getsubmitObject = function(formArr) {
  var submitObject = [];
  submitObject.push({ 
                      name: $("input[name='dist1']").text(),
                      dist: formArr[0].value.slice(1),
                      year: formArr[2].value
                    });
  submitObject.push({ 
                      name: $("input[name='dist2']").text(),
                      dist: formArr[1].value.slice(1),
                      year: formArr[3].value
                    });
  return submitObject;
};

//ajax
function ajaxRequest(submitYear, submitDist) {
  var code = Object.keys(label);
  return $.ajax({
    url: "//api.census.gov/data/" + submitYear + "/acs1",
    data: "get=" + code.toString() + 
    "&for=school+district+(unified):" + submitDist +
    "&in=state:06&key=e7f1f3b0b196081950597b4723850dbc8156d69b",
    dataType: "json",
    type: "GET"
  });
}

//get the data from server
function getValueofUnits(submitArr, submitButt) {

  //two ajax are sent to server
  $.when(
    ajaxRequest(submitArr[0].year, submitArr[0].dist),
    ajaxRequest(submitArr[1].year, submitArr[1].dist)
  )//both ajax are received
  .done(function(result0, result1) {

    //clear chart area
    $("#data-chart").children().remove();

    //test if the result is null
    if(result0[0][1][2] || result1[0][1][2]) {

      //data array will be converted to google table
      var resultData = [];

      //add the head of data array
      resultData.push(["Price",
        submitArr[0].name + " in " + submitArr[0].year,
        submitArr[1].name + " in " + submitArr[1].year]);

      //if the result is null, change the data head
      if(!result0[0][1][2]) {
        resultData[0][1] = submitArr[0].name + 
                            " is not in "+ submitArr[0].year + 
                            " survey";
      }
      if(!result1[0][1][2]) {
        resultData[0][2] = submitArr[1].name + 
                            " is not in "+ submitArr[1].year + 
                            " survey";
      }

      //add data to array
      for(var i = 2; i < result0[0][0].length - 2; i += 2) {
        var temp = [];
        temp.push(label[result0[0][0][i]]);
        temp.push(parseInt(result0[0][1][i]));
        temp.push(parseInt(result1[0][1][i]));
        resultData.push(temp);
      }

      //draw google chart
      drawStuff(resultData, submitArr);
    }//the data is null
    else {
      $("#data-chart").append(
        "<p>Sorry, both districts are not in the survey.</p>"
      );
    }
  })//show error information
  .fail(function(jqXHR, error) {
    $('#data-chart').append(
      "<p>" + error + "<p>"
    );
  })// disable submit and reset button, clear #dist table and enable add button
  .always(function() {
    submitButt.toggleClass("waiting");
    submitButt.val("Submit");
    $("#dist td").remove();
    $("#add").get(0).disabled =  false;
    $("#reset").get(0).disabled = true;
  });
}

//draw google chart
function drawStuff(resultData, submitArr) {

  //convert array to google datatable
  var data = google.visualization.arrayToDataTable(resultData);

  //add two districts name to chart title
  var tempStr = "";
  var tempArr = submitArr[0].name.split(" ");
  for(var i = 0; i < tempArr.length - 3; i++)
    tempStr += tempArr[i] + " ";
  tempStr += "and ";
  tempArr = submitArr[1].name.split(" ");
  for(var i = 0; i < tempArr.length - 3; i++)
    tempStr += tempArr[i] + " ";

  //responsive chart width
  var chartWidth = $(document).width() * 0.95;

  //set chart options: width, heigh, title, 
  //vertical Axis name, horizontal Axis name
  //seriesType and color
  var options = {
    width: chartWidth,
    height: 500,
    title: "Real Estate Value of Home in " + tempStr + "Unified School Districts",
    vAxis: {title: "Number of Units"},
    hAxis: {title: "Price"},
    seriesType: "bars",
    series: {
      0: { color:"#F9A825"},
      1: { color:"#D0D0D0"}
    }
  };

  //generate chart
  var chart = new google.visualization.ComboChart(document.getElementById('data-chart'));
  chart.draw(data, options);
};
