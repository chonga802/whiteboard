startScript("canvas1");

function startScript(canvasId)
{ 
	/*var imageColorsSelected=["./images/unselected_red.png", "./images/unselected_blue.png",
	"./images/unselected_green.png", "./images/unselected_purple.png"];*/

	var imageColorsUnselected=["./images/selected_green.png", "./images/selected_blue.png", 
	"./images/selected_red.png", "./images/selected_purple.png"];

	var isRecording = false;
	playbackInterruptCommand = "";
	
	$(document).bind("ready", function()
	{
		$("#pauseBtn").hide();
		$("#undoBtn").hide();
		$("#hidden_sidebar").hide();
		$("#recordBtn").css('cursor', 'pointer');
		$("#pauseBtn").css('cursor', 'pointer');
		$("#playBtn").css('cursor', 'pointer');
		$("#playAllBtn").css('cursor', 'pointer');
		$("#sidebarBtn").css('cursor', 'pointer');
		$("#clearBtn").css('cursor', 'pointer');
		//$("#canvasBtnsDiv>img").css('cursor', 'pointer');


		
		drawing = new RecordableDrawing(canvasId);
		
		$("#undoBtn").click(function(){
			console.log('undoBtn clicked');
			drawing.undo();
		});


		$("#recordBtn").hover(function(){
				if($(this).attr('src')=="./images/recordbutton.png"){
					$(this).attr('src', "./images/record_hover.png");
				}
				else if($(this).attr('src')=="./images/recording.png"){
					$(this).attr('src', "./images/stopbutton.png");
				}
				else if($(this).attr('src')=="./images/stopbutton.png"){
					$(this).attr('src', "./images/recording.png");
				}
				else if($(this).attr('src')=="./images/stopbutton1.png"){
					//do nothing. this is when we're doing pause/resume/stop.
				}
				else{
					$(this).attr('src', "./images/recordbutton.png");
				}
		});

		$("#recordBtn").click(function(){
			console.log('recordBtn clicked');
			if($(this).attr('src')=="./images/record_hover.png"){
				//start recording!
				startRecording();
				$(this).attr('src', "./images/stopbutton.png");
			}
			else if($(this).attr('src', "./images/stopbutton.png") || $(this).attr('src', "./images/stopbutton1.png")){
				//stop recording!
				$(this).attr('src', "./images/record_hover.png");
				stopRecording();
			}
		});

		$("#pauseBtn").click(function(){
			if($("#pauseBtn").attr('src')=="./images/pause_recording.png"){
				$("#pauseBtn").attr('src', "./images/resume_recording.png");
				$("#recordBtn").attr('src', "./images/stopbutton1.png");
				pauseRecording();
			}
			else if($("#pauseBtn").attr('src')=="./images/resume_recording.png"){
				$("#recordBtn").attr('src', "./images/recording.png");
				$("#pauseBtn").attr('src', "./images/pause_recording.png");
				//resume recording!
				resumeRecording();
				
			}		
	
		});

		$("#playBtn").mouseenter(function(){
			if($("#playBtn").attr('src')=="./images/playbutton.png"){
				$("#playBtn").attr('src', "./images/play_hover.png");
			}
			else if($("#playBtn").attr('src')=="./images/pausebutton.png"){
				$("#playBtn").attr('src', "./images/pause_hover.png");
			}
		});

		$("#playBtn").mouseleave(function(){
			if($("#playBtn").attr('src')=="./images/play_hover.png"){
				$("#playBtn").attr('src', "./images/playbutton.png");
			}
			else if($("#playBtn").attr('src')=="./images/pause_hover.png"){
				$("#playBtn").attr('src', "./images/pausebutton.png");
			}
		});


		$("#playBtn").click(function(){

			if($("#playBtn").attr('src')=="./images/play_hover.png"){
				$("#playBtn").attr('src', "./images/pause_hover.png");
				if($("#playBtn").prop("value","Play")){
					playRecordings();	
				}
				else if($("#playBtn").prop("value","Resume")){
					resumePlayback();
				}
			}
			else{
				$("#playBtn").attr('src', "./images/play_hover.png");
				pausePlayback();
			}
			
		});

		$("#playAllBtn").click(function(){
			console.log("playing all recordings");
			playAllRecordings();
		});

		$("#sidebarBtn").click(function(){
			if($("#sidebar").width() < 100){
				$("#sidebar").animate({'width':'150', 'left':'-=100'});
			}
			else{
				$("#sidebar").animate({'width':'50', 'left':'+=100'});
			}
			$("#hidden_sidebar").toggle(600);
		});


		function playRecordings()
		{
			//drawing.recordings = drawing.recordingsList[num];
			if (drawing.recordings.length == 0)
			{
				alert("No recording to play");
				$("#playBtn").attr('src', "./images/playbutton_hover.png");

				return;
			}
			var btnTxt = $("#playBtn").prop("value");
			if (btnTxt == 'Stop')
				stopPlayback();
			else
				startPlayback();			
		}
		
		$("#clearBtn").click(function(){
			console.log('clearBtn clicked');
			drawing.clearCanvas();			
		});

		
		$("#colorsDiv .colorbox").click(function(){
			console.log('color selected');
			$("#colorsDiv .colorbox").removeClass("selectedColor");
			$(this).addClass("selectedColor");
			drawing.setColor($(this).css("background-color"));
		});
		
		$(".stroke").click(function(){
			console.log('stroke selected');
			$(".stroke_selected").removeClass("stroke_selected");
			$(this).addClass("stroke_selected");
			var size = $(this).css("border-radius");
			drawing.setStrokeSize(parseInt(size));
		});
		
		var size = parseInt($(".stroke_selected").css("border-radius"));
		if (size > 0)
			drawing.setStrokeSize(size);
	});
	

	function playAllRecordings()
	{
		//drawing.recordings = drawing.recordingsList[num];
		if (drawing.recordings.length == 0)
		{
			alert("No recording to play");
			return;
		}
		else{
			r=0;
			while(r<drawing.recordingsList.length){
				drawing.recordings=drawing.recordingsList[r];
				console.log(r);
				startPlayback();
				w=0;
				while(w<100){
					console.log("w"); 	
					console.log(w);
					w++;
				}
				r++;
			}
		}
				
	}

	function stopRecording()
	{
		console.log('stop recording');
		addRecordingButton();
		//$("#recordBtn").prop("value","Record");
		$("#playBtn").show();
		$("#playAllBtn").show();
		$("#pauseBtn").attr('src', "./images/pause_recording.png");
		$("#undoBtn").hide();
		$("#pauseBtn").hide();
		$("#clearBtn").show();

		drawing.stopRecording();
		isRecording = false;
	}
	
	function startRecording()
	{
		console.log('start recording');
		//$("#recordBtn").prop("value","Stop");
		$("#playBtn").hide();
		$("#playAllBtn").hide();
		$("#pauseBtn").show();
		$("#clearBtn").hide();
		$("#undoBtn").show();
		
		drawing.startRecording();
		isRecording = true;
		//set current color
		var color = $("#colorsDiv .selectedColor").css("background-color");
		var strokesize = parseInt($(".stroke_selected").css("border-radius"));
		drawing.setColor(color);
		drawing.setStrokeSize(strokesize);
	}
	
	function stopPlayback()
	{
		console.log('stop playback');
		playbackInterruptCommand = "stop";	
		drawing.isPlaying = false;	
		drawing.translateX = 0;
		drawing.translateY = 0;	
	}
	
	function startPlayback()
	{
		console.log('start playback');
		drawing.isPlaying = true;
		var currColor = $("#colorsDiv .selectedColor").css("background-color");
		var currStrokeSize = parseInt($(".stroke_selected").css("border-radius"));
		
		drawing.playRecording(function() {
			//on playback start
			$("#playBtn").prop("value","Stop");
			$("#recordBtn").hide();
			//$("#pauseBtn").show();
			$("#clearBtn").hide();
			playbackInterruptCommand = "";
		}, function(){
			//on playback end
			$("#playBtn").prop("value","Play");
			$("#playBtn").attr('src', "./images/playbutton.png");
			$("#playBtn").show();
			$("#playAllBtn").show();
			$("#recordBtn").show();
			$("#pauseBtn").hide();
			$("#clearBtn").show();
			if (currColor && currColor != "")
				drawing.setColor(currColor);
			if (currStrokeSize > 0)
				drawing.setStrokeSize(currStrokeSize);
		}, function() {
			//on pause
			$("#playBtn").prop("value","Resume");
			$("#recordBtn").hide();
			//$("#playBtn").hide();
			$("#clearBtn").hide();
		}, function() {
			//status callback
			return playbackInterruptCommand;
		});
	}
	
	function pausePlayback()
	{
		console.log('pause playback');
		playbackInterruptCommand = "pause";
		$("#playBtn").attr('src', "./images/play_hover.png");
	}
	
	function resumePlayback()
	{
		console.log('resume playback');
		playbackInterruptCommand = "";
		drawing.resumePlayback(function(){
			$("#playBtn").prop("value","Pause");
			$("#pauseBtn").show();
			$("#recordBtn").hide();
			$("#playBtn").show();
			$("#playAllBtn").show();
			$("#clearBtn").hide();
		});
	}
	
	function pauseRecording()
	{
		console.log('pause recording');
		drawing.pauseRecording();
		$("#pauseBtn").prop("value","Resume");
	}
	
	function resumeRecording()
	{
		console.log('record recording');
		drawing.resumeRecording();
		$("#pauseBtn").prop("value","Pause");
	}

	function addRecordingButton() {
		console.log('add recording button');
		//add recordings to list of recordings saved
		drawing.recordingsList.push(drawing.recordings);
	    //Create an input type dynamically.   
	    var element=document.createElement("img");

	    //element.setAttribute('src', "./images/playback_unselected.png");
	    
	   	var num = drawing.recordingsList.length;
	   	var temp=num%(imageColorsUnselected.length);
	   	element.setAttribute('src', imageColorsUnselected[temp]);
	   	element.setAttribute('height', '80');
	    element.setAttribute('width', 'auto');
	    element.id=num;
	    element.value=num;
	    var t = document.createTextNode(num);
	    element.appendChild(t);
	    element.onclick = function() { 
	    	//show vs. hide images??
	        drawing.recordings = drawing.recordingsList[this.value-1];
	        //$("#" + i).setAttribute('src', "./images/playback_unselected");
	        //element.setAttribute('src', "./images/playback_selected.png");
	        for(var i=1; i<=drawing.recordingsList.length; i++){
	        	if(i == this.value){
	        		$("#" + i).attr('src', "./images/selected_orange.png");
					//$("#" + i).attr('src', imageColorsSelected[i%(imageColorsUnselected.length)]);
				}
				else
	       			$("#" + i).attr('src', imageColorsUnselected[i%(imageColorsUnselected.length)]);
			}
	    };

	    var btns = document.getElementById("canvasBtnsDiv");
	    btns.appendChild(element);
	}
}
