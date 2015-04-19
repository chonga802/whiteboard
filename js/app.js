startScript("canvas1");

function startScript(canvasId)
{ 
	var isRecording = false;
	playbackInterruptCommand = "";
	
	$(document).bind("ready", function()
	{
		$("#pauseBtn").hide();
		//$("#playBtn").hide();
		
		drawing = new RecordableDrawing(canvasId);
		
		$("#recordBtn").click(function(){
			console.log('recordBtn clicked');
			var btnTxt = $("#recordBtn").prop("value");
			if (btnTxt == 'Stop')
				stopRecording();
			else
				startRecording();
		});
		
		$("#playBtn").click(playRecordings);

		function playRecordings()
		{
			//drawing.recordings = drawing.recordingsList[num];
			if (drawing.recordings.length == 0)
			{
				alert("No recording to play");
				return;
			}
			var btnTxt = $("#playBtn").prop("value");
			if (btnTxt == 'Stop')
				stopPlayback();
			else
				startPlayback();			
		}
		
		$("#pauseBtn").click(function(){
			console.log('pauseBtn clicked');
			var btnTxt = $("#pauseBtn").prop("value");
			if (btnTxt == 'Pause')
			{
				if (isRecording)
					pauseRecording();
				else
					pausePlayback();
			} else if (btnTxt == 'Resume')
			{
				if (isRecording)
					resumeRecording();
				else
					resumePlayback();
			}
		});
		$("#clearBtn").click(function(){
			console.log('clearBtn clicked');
			drawing.clearCanvas();			
		});
	
		$("#serializeBtn").click(function() {
			console.log('serializeBtn clicked');
			var serResult = serializeDrawing(drawing);
			if (serResult != null)
			{
				$("#serDataTxt").val(serResult);
				showSerializerDiv();
			} else
			{
				alert("Error serializing data");
			}
		});


		$("#okBtn").click(function(){
			console.log('okBtn clicked');
			var serTxt = $("#serDataTxt").val();
			var result = deserializeDrawing(serTxt);
			if (result == null)
				result = "Error : Unknown error in deserializing the data";
			if (result instanceof Array == false)
			{
				$("#serDataTxt").val(result.toString());
				showSerializerDiv(false);
				return;
			} 
			else
			{
				//data is successfully deserialize
				drawing.recordings = result;
				//set drawing property of each recording
				for (var i = 0; i < result.length; i++)
					result[i].drawing = drawing;
				hideSerializerDiv();
				playRecordings();
			}
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
			drawing.setStokeSize(parseInt(size));
		});
		
		var size = parseInt($(".stroke_selected").css("border-radius"));
		if (size > 0)
			drawing.setStokeSize(size);
	});
	
	function stopRecording()
	{
		console.log('stop recording');
		addButton();
		$("#recordBtn").prop("value","Record");
		$("#playBtn").show();
		$("#pauseBtn").hide();
		$("#clearBtn").show();
		
		drawing.stopRecording();
		isRecording = false;
	}
	
	function startRecording()
	{
		console.log('start recording');
		$("#recordBtn").prop("value","Stop");
		$("#playBtn").hide();
		$("#pauseBtn").show();
		$("#clearBtn").hide();
		
		drawing.startRecording();
		isRecording = true;
		//set curent color
		var color = $("#colorsDiv .selectedColor").css("background-color");
		var strokesize = parseInt($(".stroke_selected").css("border-radius"));
		drawing.setColor(color);
		drawing.setStokeSize(strokesize);
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
			$("#pauseBtn").show();
			$("#clearBtn").hide();
			playbackInterruptCommand = "";
		}, function(){
			//on playback end
			$("#playBtn").prop("value","Play");
			$("#playBtn").show();
			$("#recordBtn").show();
			$("#pauseBtn").hide();
			$("#clearBtn").show();
			if (currColor && currColor != "")
				drawing.setColor(currColor);
			if (currStrokeSize > 0)
				drawing.setStokeSize(currStrokeSize);
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

	function addButton() {
		console.log('add button');
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
