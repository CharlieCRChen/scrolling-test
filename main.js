// const GSheetReader = require('g-sheets-api');

var svg = d3.select("#svg");
var g = svg.append("g").classed("group", true);


function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

posY = 70;
posX_text = ["1%","95%","88%"]
posX_rect = ["15%", "45%", "75%"];
posX_circle = ["20%", "50%", "80%"];
posX_triangle = [200, 500, 800];
posX_star = [200, 500, 800];
colorList = ["#df7d44","#db4677","#5db9e9"];
var round = 1;

let unshuffled1 = [9,18,27,36,45,54,63,72,81,90];

let shuffled1 = unshuffled1
  .map(value => ({ value, sort: Math.random() }))
  .sort((a, b) => a.sort - b.sort)
  .map(({ value }) => value)

let shuffled2 = unshuffled1
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)

insert_symbol_line = shuffled1.shift();

function add_text(i, posY){
    for (let j =0; j<2; j++){
        if (i+1>9 && j==1){
            posX = posX_text[2]
        }
        else{
            posX = posX_text[j]
        }
        g.append("text")
            .classed('noselect', true)
            .attr("x", posX)
            .attr("y", posY)
            .attr("dy", 80)
            .style("font-size", 100)
            .style("fill","#b4b4b4")
            .text(i+1);
    }
}

function add_shapes(insert_symbol_line, show_num=true){
    for (let i =0; i<99; i++){
        if (i == insert_symbol_line){
            //posY = posY + 50;
            var star = d3.symbol()
                .type(d3.symbolStar)
                .size(4000);
            for (let j =0; j<3; j++){
                g.append("path")
                .attr("d", star)
                .classed("star", true)
                .attr("transform", function(d) { return "translate(" + posX_star[j] + "," + (posY+50) + ")"; });
            }
            if (show_num==true){
                add_text(i, posY);
            }
            //posY = posY + 50;
        }
        else{
            choice = getRandomInt(3);
            if (choice == 0){
                g.append("rect")
                    .attr("x", posX_rect[i%3])
                    .attr("y", posY)
                    .attr("width", 100)
                    .attr("height", 100)
                    .attr("fill", colorList[getRandomInt(3)]);
                if (show_num==true){
                        add_text(i, posY);
                }
            }
            else if (choice == 1){
                g.append("circle")
                    .attr("cx", posX_circle[i%3])
                    .attr("cy", posY+50)
                    .attr("r", 50)
                    .attr("fill", colorList[getRandomInt(3)]);
                if (show_num==true){
                        add_text(i, posY);
                }
            }
            else {
                var triangleSize = 95*95/Math.sqrt(3);
                var triangle = d3.symbol()
                    .type(d3.symbolTriangle)
                    .size(triangleSize);
                g.append("path")
                    .attr("d", triangle)
                    .attr("fill", colorList[getRandomInt(3)])
                    .attr("transform", function(d) { return "translate(" + posX_triangle[i%3] + "," + (posY+60) + ")"; });
                if (show_num==true){
                        add_text(i, posY);
                }
            }  
        }
        posY = posY + 100;
    }
}

add_shapes(insert_symbol_line);

var grey_area_size;

d3.select("#grey_area")
    .style("height",function(){
        grey_area_size = (document.getElementById("nav").clientHeight + Math.round(d3.selectAll(".star")._groups[0][0].getBoundingClientRect().width)) +"px";
        return grey_area_size
    })

$( window ).resize(function(){
    d3.select("#grey_area")
    .style("height",function(){
        grey_area_size = (document.getElementById("nav").clientHeight + Math.round(d3.selectAll(".star")._groups[0][0].getBoundingClientRect().width)) +"px";
        return grey_area_size
    })
})

var total_height = window.innerHeight;
var navbar_height = document.getElementById("nav").clientHeight;
var unit = Math.round(d3.selectAll(".star")._groups[0][0].getBoundingClientRect().height)-5;
var virtualBox_height = total_height-navbar_height-1.5*unit;

temp_svg = d3.select("body")
            .append("svg")
            .attr("width", "100%")
            .attr("height", parseInt(virtualBox_height));



var is_timer_start = false;
var begin;
var distance;
distance = parseInt($(".star").offset().top-$( window ).scrollTop())
var FLAG = true
var pre_y = distance;
var mouse_trace_back = 0;
var direction = -1; //-1: scroll down, +1: scroll up
var cum_distance = 0;
var max_backtracking_distance=0;

function update(round,start_time, mouse_trace_back,insert_symbol_line, max_backtracking_distance, FLAG){
    if (FLAG==true){
        var end= parseInt(performance.now());
        var timeSpent= (end-start_time) + "ms";
        console.log("Round: "+ round);
        console.log("Time: "+ timeSpent);
        console.log("Line index: "+ parseInt(insert_symbol_line));
        console.log("Trace back times: "+ (mouse_trace_back));
        console.log("Cumulative Distance: "+ parseInt(cum_distance)+"px");
        console.log("Max Back Tracking Distance: "+ parseInt(max_backtracking_distance)+"px");
        cum_distance = 0;
    }
}

var topValue = 0;
interval = null; 
var START_FLAG = false;

$("#btn-start").click(function(){
    $("#grey_mask").hide();
    START_FLAG = true;
})

$(window).scroll(function() {
    if (START_FLAG==true){
        if (is_timer_start == false){
            begin= parseInt(performance.now());
            is_timer_start = true;
            cum_distance=0;
        }
        var offset = $(".star").offset();
        var y = parseInt(offset.top-$( window ).scrollTop());
        if ((direction==-1) && (y-pre_y>0)){
            mouse_trace_back = mouse_trace_back + 1;
            direction = 1;
        }
        else if ((direction==1) && (y-pre_y<0)){
            mouse_trace_back = mouse_trace_back + 1;
            direction = -1;
        }
        pre_y = y;
        if(interval == null){
            interval = setInterval("test()", 1000);
        }
        topValue = document.documentElement.scrollTop;  
    }
}) 

function test() {  
    var offset = $(".star").offset();
    var y = parseInt(offset.top-$( window ).scrollTop());
    if(document.documentElement.scrollTop == topValue && y>50 && y<100) {
        if (shuffled1.length == 0){
            alert("Test is over.")
        }
        else{
            START_FLAG = false;
            d3.select(".group").remove();
            g = svg.append("g").classed("group", true);
            posY = 70;
            let temp_line_index = insert_symbol_line+1;
            insert_symbol_line = shuffled1.shift();
            add_shapes(insert_symbol_line);
            update(round,begin,mouse_trace_back, temp_line_index, max_backtracking_distance, FLAG);
            round = round + 1;
            d3.select("#num").text(round);
            
            setTimeout(function(){
                mouse_trace_back = -2;
                direction = -1;
                $( window ).scrollTop(0);
            }, 500);
            clearInterval(interval);  
            interval = null; 
            $("#grey_mask").show(); 
        }
    }  
}


function scrollDistance (callback, refresh = 66) {
	if (!callback || typeof callback !== 'function') return;
	let isScrolling, start, end, distance;
	window.addEventListener('scroll', function (event) {
		if (!start) {
			start = window.pageYOffset;
		}
		window.clearTimeout(isScrolling);
		isScrolling = setTimeout(function() {
			end = window.pageYOffset;
			distance = end - start;
			callback(distance, start, end);
			start = null;
			end = null;
			distance = null;
		}, refresh);
	}, false);
}


scrollDistance(function (distance) {
	cum_distance = cum_distance+ Math.abs(distance);
});

// const options = {
//     apiKey: 'AIzaSyDRjA2WBlCY4yRVSDt_dNwv0GUZLq5CT0o',
//     sheetId: '19LBbYg3K7FgTa2BmErkBX1pkz3d1xmGYOkuX9SvS3-k',
//     sheetNumber: 1,
//     sheetName: 'scrolling-test', // if sheetName is supplied, this will take precedence over sheetNumber
//     returnAllResults: false,
//   }

// GSheetReader(
//     options,
//     results => {
//       // do something with the results here
//     },
//     error => {
//       // OPTIONAL: handle errors here
//     }
// );


