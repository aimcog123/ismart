// Global variables
margin = width = height = "";
wcOpt = "";
animationDuration = 500;
$(document).ready(function() {

    // Set chart height
    var chart_h = $(window).outerHeight() - $("header").outerHeight(true) - 100;
    $(".chart").css({
        height: chart_h + "px"
    });

    // Set chart margin
    margin = { top: 50, right: 0, bottom: 80, left: 0 };
    width = $(".chart").outerWidth(true) - margin.left - margin.right;
    height = $(".chart").outerHeight(true) - margin.top - margin.bottom;

    // Draw sentiment chart
    //get_sentiment_content();

    // Get sentiment word
    //get_sentiment_word("all");


    // Monitoring 
    $(".monitoring").click(function() {
        
		// Set active class
		$(".monitoring").removeClass("active");
        $(this).addClass("active");
		
		// show the main content
        $(".sentiment-cont, .emotion-cont, .intent-cont").hide();
        $("." + $(this).attr("data-opt") + "-cont").show();

		// show and hide the sidebar contnent
		$(".sidebar .box").hide();
		$(".sidebar .box."+ $(this).attr("data-opt") +"-sidebar").show();	
		
        switch ($(this).attr("data-opt")) {
            case 'emotion':
                 get_emotion_word("all");
				 get_emotion_content('all');
                break;
            case 'intent':
                get_intent_content('all');
                break;
            default:
                get_sentiment_content();
                get_sentiment_word("all");
        }
    });


    // Emotion - Right side bar - click handler
    $(".sentiment-wc").click(function() {
        // Remove all the active class
        $(".sentiment-wc").removeClass("active");
        // Set the active class
        $(this).addClass("active");
        $(".sentiment-wc[data-opt='" + $(this).attr("data-opt") + "']").addClass("active");
        // Get sentiment word
        get_sentiment_word($(this).attr("data-opt"));
        get_sentiment_content($(this).attr("data-opt"));
    });
	
	 $(".emotion-wc").click(function() {
        // Remove all the active class
        $(".emotion-wc").removeClass("active");
        // Set the active class
        $(this).addClass("active");
        $(".emotion-wc[data-opt='" + $(this).attr("data-opt") + "']").addClass("active");
        // Get sentiment word
        get_emotion_word($(this).attr("data-opt"));
		get_emotion_content($(this).attr("data-opt"));
    });
	 
	  $(".intent-wc").click(function() {
        // Remove all the active class
        $(".intent-wc").removeClass("active");
        // Set the active class
        $(this).addClass("active");
        $(".intent-wc[data-opt='" + $(this).attr("data-opt") + "']").addClass("active");
        // Get sentiment word
        get_intent_content($(this).attr("data-opt"));
    });

    $(".monitoring").eq(2).trigger("click");

});

function get_intent_content() {
    var what = $('.test').val();
        var complaint = [],
        needHelp = [],
        praise = [],
        purchase = [],
        others = [];

      if(document.getElementById("selection1").checked == true){
    
    var data = $.get('/test?handle=' + '%23'+what).done(function (data) {
		 var complaint1 = [];
         var needHelp1 = [];
        var praise1 = [];
        var purchase1 = [];
        var others1 = [];

        console.log(data);
		
if ((data === undefined) && (data[0].length == 0)) {
            return null;
        }
		//alert(data[0].length)
		json =data[0]
		
		//obj = JSON.stringify(data[0]);
		//alert(obj);
		//alert(typeof data[0]);
		//obj1= JSON.parse(data[0][1]);
		//alert(obj1.classifier_id);
		//alert(data[0][1]);
        for (var i = 0; i < data[0].length; i++) {
			obj2=JSON.parse(data[0][i]);
			//alert(obj2.classifier_id);
			if (obj2.classes.length > 0) {
				
                obj2.classes.forEach(function(d) {
					//alert(d.class_name);
					if (d["class_name"].toLowerCase() == "complaint") {
						complaint1.push([d["confidence"], i]);
					}
					if (d["class_name"].toLowerCase() == "needhelp") {
						needHelp1.push([d["confidence"], i]);
					}
					if (d["class_name"].toLowerCase() == "praise") {
						praise1.push([d["confidence"], i]);
					}
					if (d["class_name"].toLowerCase() == "purchase") {
						purchase1.push([d["confidence"], i]);
					}
					if (d["class_name"].toLowerCase() == "others") {
						others1.push([d["confidence"], i]);
					}
                });
            }
        }
		//alert("2352555555522#######################");
		complaint = {
            "data": complaint1,
            "label": "Complaint",
            "color": getColor("", 20, "complaint")
        };
		
		
		
        needHelp = {
            "data": needHelp1,
            "label": "NeedHelp",
            "color": getColor("", 20, "needhelp")
        };
		
        praise = {
            "data": praise1,
            "label": "Praise",
            "color": getColor("", 20, "praise")
        };
        purchase = {
            "data": purchase1,
            "label": "Purchase",
            "color": getColor("", 20, "purchase")
        };
        others = {
            "data": others1,
            "label": "Others",
            "color": getColor("", 20, "others")
        };
		
		var iData = [];
 
				iData[0] = complaint;
				iData[1] = needHelp;
				iData[2] = praise;
				iData[3] = purchase;
				iData[4] = others;

		console.log(iData);
        draw_intent_chart(iData);

    });
}
}

/**
 * Function: Draw intent linear chart
 */
function draw_intent_chart(data) {
	
    chart = d3LineWithLegend()
        .xAxis.label('Intent Score')
        .width(width(margin))
        .height(height(margin))
        .yAxis.label('Tweets count');
		
	
    	
	d3.select("#intent-chart").select("svg").remove();
	alert("inside function $%$^$^$");
	

    var svg = d3.select("#intent-chart").append("svg")
        .datum(data)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	alert("bbbbbbbbbbbbbbbbbbinside function $%$^$^$");

    svg.transition().duration(animationDuration)
        .attr("width", width(margin))
        .attr("height", height(margin))
        .call(chart);
    alert("innnnnnnnnnnnnnnnnnnnnnnnnnside function $%$^$^$");

    chart.dispatch.on('showTooltip', function(e) {
		alert("chart function $%$^$^$");
        var offset = $('#intent-chart').offset(), // { left: 0, top: 0 }
            left = e.pos[0] + offset.left,
            top = e.pos[1] + offset.top,
            formatter = d3.format(".04f");
		

        var content = '<h3>' + e.series.label + '</h3>' +
            '<p>' +
            '<span class="value">[' + formatter(e.point[1]) + ', ' + e.point[0] + ']</span>' +
            '</p>';
        alert("inside mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmfunction $%$^$^$");
        nvtooltip.show([left, top], content, "s", -15, e.series.label.toLowerCase());
		alert("inside function lllllllllllllllllllllllllllllll$%$^$^$");
    });

    chart.dispatch.on('hideTooltip', function(e) {
        nvtooltip.cleanup();
		alert("inside functionddddddddddddddddddddddddddddddddddddddddddddddddddd $%$^$^$");
    });

    function width() {
        return $(".main-content #intent-chart.chart").outerWidth(true) - margin.left - margin.right + 200;
		alert("inside function ggggggggggggggggggggggggggggggggggggggggggggggg$%$^$^$");
    }

    function height(margin) {
        return $(".main-content #intent-chart.chart").outerHeight(true) - margin.top - margin.bottom;
		alert("inside function hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh$%$^$^$");
    }

}

