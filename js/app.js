startScript("canvas1");

function startScript(canvasId)
{ 
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
		$("#sidebarBtn").css('cursor', 'pointer');
		$("#clearBtn").css('cursor', 'pointer');

		
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

		//$("#playBtn").mouseenter(function(){

		$("#playBtn").hover(function(){
				if($("#playBtn").attr('src')=="./images/playbutton.png"){
					$("#playBtn").attr('src', "./images/play_hover.png");
				}
				else if($("#playBtn").attr('src')=="./images/pause_hover.png"){
					$("#playBtn").attr('src', "./images/pausebutton.png");
				}
				else if($("#playBtn").attr('src')=="./images/pausebutton.png"){
					$("#playBtn").attr('src', "./images/pause_hover.png");
				}
				else{
					$("#playBtn").attr('src', "./images/playbutton.png");
				}
		});

		$("#playBtn").click(function(){
			if($("#playBtn").attr('src')=="./images/play_hover.png"){
				$("#playBtn").attr('src', "./images/pause_hover.png");
				playRecordings();	
			}
			else{
				$("#playBtn").attr('src', "./images/play_hover.png");
				pausePlayback();
			}
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
	
	function stopRecording()
	{
		console.log('stop recording');
		addRecordingButton();
		//$("#recordBtn").prop("value","Record");
		$("#playBtn").show();
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
	}
	
	function startPlayback()
	{
		console.log('start playback');
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
			$("#recordBtn").show();
			$("#pauseBtn").hide();
			$("#clearBtn").show();
			if (currColor && currColor != "")
				drawing.setColor(currColor);
			if (currStrokeSize > 0)
				drawing.setStrokeSize(currStrokeSize);
		}, function() {
			//on pause
			$("#pauseBtn").prop("value","Resume");
			$("#recordBtn").hide();
			$("#playBtn").hide();
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
	}
	
	function resumePlayback()
	{
		console.log('resume playback');
		playbackInterruptCommand = "";
		drawing.resumePlayback(function(){
			$("#pauseBtn").prop("value","Pause");
			$("#pauseBtn").show();
			$("#recordBtn").hide();
			$("#playBtn").show();
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
	    var element = document.createElement("input");
	    //Assign different attributes to the element. 
	    element.type = "button";
	    var num = drawing.recordingsList.length;
	    element.name = num
	    element.value = num;
	    element.onclick = function() { 
	        drawing.recordings = drawing.recordingsList[this.value-1];
	    };

	    var btns = document.getElementById("canvasBtnsDiv");
	    btns.appendChild(element);
	}
}
