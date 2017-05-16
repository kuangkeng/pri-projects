window.onload=function(){
	var inputText = 0;

	function doStuff(data) {   
	 

		// Parse and clean data
	    console.log(data); 
	    var orig_to_map = {};
	    var map_to_orig = {};

		for (var i = 0, emp; i < data.length; i++) {
		   d = data[i];
		   orig_to_map[d.original] = d.mapped; 
		   map_to_orig[d.mapped] = d.original;
		}

		console.log(orig_to_map); 
		console.log(map_to_orig);
		// now you have encoding dictionary

		//start encode function
		$("#encodeBtn").click(function(){
		    inputText = $.trim($("#input").val());
		    	sendData();
			
				   
			  	console.log(inputText);
			  	var outputText = "";
			  	var invalidChars = false;

			  	// lookup and map each char of input string
			  	for (var i = 0, len = inputText.length; i < len; i++) {
			    	mapped = orig_to_map[inputText[i]];
			    	if (mapped == null){
    					invalidChars=true;
    					break;
					}
			   		outputText = outputText.concat(mapped);
			    }
			    if (invalidChars== true){
			    	$("#warning").html("You've entered an invalid character. Try again, using letters and numbers.").fadeIn(300).delay(1000).fadeOut(400);
			    	$("#output").text("");

			    }
			    else{ 

					$(function(){
					    $("#input").typed({
					        strings: [outputText],
					        typeSpeed: 30
					    });
					});			    
			    	//$("#input").val(outputText).effect("highlight", {color: 'lightyellow'}, 500);
			    	//$("#output").text(outputText).fadeIn(300);
			    }
			});  // end encode function

		//start decode function 
		$("#decodeBtn").click(function(){
		    inputText = $.trim($("#input").val());
		    	sendData();
 			 	console.log(inputText);
			  	var outputText = "";
			  	var invalidChars = false;

			  	// lookup and map each char of input string
			  	for (var i = 0, len = inputText.length; i < len; i++) {
			    	orig = map_to_orig[inputText[i]];
			    	if (orig == null){
    					invalidChars=true;
    					break;
					}
			   		outputText = outputText.concat(orig);
			    }
			    if (invalidChars== true){
			    	$("#warning").html("You've entered an invalid character. Try again, using letters and numbers.").fadeIn(300).delay(1000).fadeOut(400);
			    	$("#output").text("");

			    }
			    else{  

					$(function(){
					    $("#input").typed({
					        strings: [outputText],
					        typeSpeed: 30
					    });
					});			    	

			    	//$("#input").val(outputText).effect("highlight", {color: 'lightyellow'}, 500);
			    	//$("#output").text(outputText).fadeIn(300);
			    }
			});  // end decode function


	}


	function parseData(url, callBack) {
	    Papa.parse(url, {
	        download: true,
	        header: true,
	        dynamicTyping: true,
	        complete: function(results) {
	            callBack(results.data);
	        }
	    });
	}

	function sendData() {
	  $.getJSON("https://api.ipify.org?format=jsonp&callback=?",
	    function(json) {
	      $.ajax({
	        type: 'POST',
	        url: 'https://docs.google.com/forms/d/e/1FAIpQLSeQ7rjrRpyUoWVAaNUXGAUUZ-ovNmf5f0fL-wnXy_s8fDSewA/formResponse',
	        data: { 
	          "entry.370526988": json.ip,
	          "entry.1246619292": inputText,
	          "entry.332175724": document.referrer,
	        }
	      }); 
	    }
	  );   
	}


	parseData("https://cdn2.pri.org/embeds/2017-01/barbie-encoder/data/coding1.csv", doStuff)
	//parseData("../../data/coding1.csv", doStuff);
}