(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

$(document).ready(function () {
	// create HTML stuff
	// const createHtmlTonControl = (nr) => {
	// 	const posnr = '1';

	// 	let elContainer = 'ton-control-'+nr;
	// 	let elOutDiv = document.createElement("DIV");
	// 	elOutDiv.setAttribute("class", "col-xs-3");

	// 	let elinputGroup = document.createElement("DIV");
	// 	elinputGroup.setAttribute("class", "input-group-btn");
	// 	elOutDiv.appendChild(elinputGroup);
	// 	// BUTTON
	// 	let textnode = document.createTextNode(" Zahl");
	// 	let btn = document.createElement("BUTTON");
	// 	let sid='btn-row'+nr+'-'+posnr;
	// 	btn.setAttribute("id", sid);
	// 	btn.setAttribute("class", "btn btn-info dropdown-toggle");
	// 	btn.appendChild(textnode);
	// 	elinputGroup.appendChild(btn);
	// 	document.getElementById(elContainer).appendChild(elOutDiv);

	// };

	// D3JS
	var updateGraph = function updateGraph(data) {
		var grp = svg.selectAll('g').data(data);

		var selection = grp.selectAll('rect').data(function (d) {
			return d;
		}).attr('fill', function (d, i) {
			return lookup[d[1]];
		});

		selection.enter().append('rect').attr('x', function (d, i) {
			return 28 * i;
		}).attr('width', rw).attr('height', rh);

		selection.exit().remove();
	};

	var renderGraph = function renderGraph(data) {
		// Create a group for each row in the data matrix and
		// translate the group vertically
		var grp = svg.selectAll('g').data(data).enter().append('g').attr('transform', function (d, i) {
			return 'translate(0, ' + 54 * i + ')';
		});

		// For each group, create a set of rectangles and bind
		// them to the inner array (the inner array is already
		// binded to the group)
		grp.selectAll('rect').data(function (d) {
			return d;
		}).enter().append('rect').attr('x', function (d, i) {
			return 28 * i;
		}).attr('fill', function (d, i) {
			return lookup[d[1]];
		}).attr('width', rw).attr('height', rh);

		//Modulo 10 ticks       
		grp.selectAll('line').data(function (d) {
			return d;
		}).enter().append('line').filter(function (d, i) {
			return i % 10 === 0;
		}).attr('x1', function (d, i) {
			return 280 * i + 1;
		}).attr('y1', 20).attr('x2', function (d, i) {
			return 280 * i + 1;
		}).attr('y2', 40).style('stroke', 'black').style('stroke-width', '2px');

		// Text
		grp.selectAll('text').data(function (d) {
			return d;
		}).enter().append('text').filter(function (d, i) {
			return i % 10 === 0;
		}).attr('x', function (d, i) {
			return 280 * i + 5;
		}).attr('y', '38').attr('font-family', 'sans-serif').text(function (d, i, k) {
			return k * 40 + i * 10 + 1;
		});
	};

	// get values
	var getButtonIds = function getButtonIds() {
		return ['#btn-row1-1', '#btn-row1-2', '#btn-row1-3', '#btn-row1-4'];
	};

	// reads Parameter Ton Zahl for row one
	var readInput = function readInput() {
		var ids = [];
		// TODO use as parameter later
		var row = 1;
		var s = '';
		for (var i = 1; i < 4; i++) {
			s = '#btn-row' + row + '-' + i;
			ids.push(s);
		}

		var out = [];
		for (var i in ids) {
			var elval = $(ids[i]).parent().parent().children('input')[0];
			var val = 0;
			if (typeof elval !== 'undefined') {
				val = elval.value;
			}
			out.push(val);
		}
		return out;
	};

	// Redraw Game
	var redraw = function redraw(inpstrarr) {
		var inp = [];
		// parse input
		for (var i = 0; i < inpstrarr.length; i++) {
			inp.push(parseInt(inpstrarr[i]));
		};

		// init values
		var t = 1,
		    // cout value
		data = [],
		    col = undefined,
		    nextEvent = undefined,
		    tmp = 0;

		for (var i = 0; i < inp.length; i++) {
			col = i;
			nextEvent = inp[col];
			if (nextEvent > 0) {
				break;
			}
		}

		for (var k = 0; k < rowN; k += 1) {
			var row = [];
			data.push(row);
			for (var i = 0; i < colN; i += 1) {
				if (t === nextEvent) {
					// jump over 0 color entries
					tmp = col + 1; // black has index 0
					// if something is zero go further
					while (inp[(col + 1) % inp.length] < 1) {
						col = (col + 1) % inp.length;
					}
					nextEvent += inp[(col + 1) % inp.length];
					col = (col + 1) % inp.length; // next color
				} else {
						tmp = 0;
					}
				row.push([t, tmp]);
				t = t + 1;
			}
		}
		return data;
	};

	var highlightEl = function highlightEl(el, col, time) {
		$(el).attr("fill", hlookup[col]);
		setTimeout(function () {
			$(el).attr("fill", lookup[col]);
		}, time * 1000);
	};

	//CHANGE on TON Input is applied
	var registerInputOnChange = function registerInputOnChange() {
		var ids = [];
		// TODO use as parameter later
		var row = 1;
		var s = '';
		for (var i = 1; i < 4; i++) {
			s = '#btn-row' + row + '-' + i;
			ids.push(s);
		}

		for (var i in ids) {
			$(ids[i]).parent().parent().children('input.form-control').change(function () {
				var newdata = redraw(readInput());
				updateGraph(newdata);
			});
		}
	};

	// Register count Button
	var registerButton = function registerButton() {
		var ids = [];
		// TODO use as parameter later
		var row = 1;
		var s = '';
		for (var i = 1; i < 4; i++) {
			s = '#btn-row' + row + '-' + i;
			ids.push(s);
		}
		var ec = jQuery.Event('change');

		var _loop = function _loop(i) {
			$(ids[i]).parent().children('ul.dropdown-menu').on('click', function (e) {
				$(ids[i]).parent().parent().children('input.form-control:first').attr('value', e.target.text)
				//send change event
				.trigger(ec);
			});
		};

		for (var i in ids) {
			_loop(i);
		}
	};

	// Register Ton button
	var registerTonButton = function registerTonButton() {
		var ids = [];
		// TODO use as parameter later
		var row = 1;
		var s = '';

		for (var i = 1; i < 4; i++) {
			s = '#btn-row' + row + '-' + i + '-ton';
			ids.push(s);
		}
		// let ec = jQuery.Event( 'change' );

		var _loop2 = function _loop2(i) {
			$(ids[i]).parent().children('ul.dropdown-menu').on('click', function (e) {
				$(ids[i]).parent().parent().children('input.form-control:eq( 1 )').attr('value', e.target.text);

				// do parameter change
				// index have to survive :)
				var tmp = i + 1 + (row - 1) * 2;
				tones[tmp].instrument = e.target.text;
				//send change event
				//.trigger(ec);
			});
		};

		for (var i in ids) {
			_loop2(i);
		}
	};

	var registerBlackTonButton = function registerBlackTonButton() {
		var ids = [];
		// TODO use as parameter later
		var row = 1;
		var s = '#btn-row1-0-ton';
		ids.push(s);

		// let ec = jQuery.Event( 'change' );

		var _loop3 = function _loop3(i) {
			$(ids[i]).parent().children('ul.dropdown-menu').on('click', function (e) {
				$(ids[i]).parent().parent().children('input.form-control:first').attr('value', e.target.text);

				tones[0].instrument = e.target.text;

				// do parameter change

				//send change event
				//.trigger(ec);
			});
		};

		for (var i in ids) {
			_loop3(i);
		}
	};

	var registerPlayButton = function registerPlayButton() {
		$('#playmusicbtn').on('click', function (e) {
			// iphone hack
			// if (audioContext === null){
			// 	try {
			//   			window.AudioContext = window.AudioContext || window.webkitAudioContext;
			//   			audioContext = new window.AudioContext();
			// 	} catch (e) {
			//   			console.log("No Web Audio API support");
			// 	}
			// 	let oscillator = audioContext.createOscillator();
			// 			oscillator.frequency.value = 400;
			// 			oscillator.connect(audioContext.destination);
			// 			oscillator.start(0);
			// 			oscillator.stop(.5)
			// }
			runSeq = true;
			playMusic();
			//alert('here');
		});
		// $('#playmusicbtn').on('touchend', (e) => {

		// 	runSeq = true;
		// 	playMusic();
		// 	//alert('here');
		// });
	};

	var registerStopButton = function registerStopButton() {
		$('#stopmusicbtn').on('click', function (e) {
			runSeq = false;
			//alert('here');
		});
		// $('#stopmusicbtn').on('touchend', (e) => {
		// 	runSeq = false;
		// 	//alert('here');
		// });
	};

	// const registerParameterButton = () => {
	// 	$('#parameterbtn').on('click', (e) => {
	// 		let el = d3.selectAll('rect')[0][4];
	// 		let time = 0.9;
	// 		highlightEl(el,0,time);
	// 	});
	// };

	// Parameter werte einlesen
	// $('#paraOszbtn').on('click', (e) => {
	// 	let s2 = $('input[name=speed]:checked', '#parameterModal').val();
	// 	let s = $('input[name=oszform]:checked', '#parameterModal').val();
	// 	//if (! typeof s === "undefined" && ! typeof s2  === "undefined"){
	// 	if (! false){
	// 		oscillatorType = s;
	// 		soundSpeed = parseFloat(s2);
	// 		$('#parameterModal').modal('hide');
	// 	}
	// });

	// Sound Definition

	var playSound = function playSound(startTime, pitch, duration, gain) {
		//let startTime = audioContext.currentTime + delay;
		var endTime = startTime + duration;

		var outgain = audioContext.createGain();
		outgain.gain.value = gain;
		outgain.connect(audioContext.destination);

		var envelope = audioContext.createGain();
		envelope.connect(outgain);
		envelope.gain.value = 0;

		envelope.gain.setTargetAtTime(1, startTime, envelopeStartEndTime[0]);
		envelope.gain.setTargetAtTime(0, endTime, envelopeStartEndTime[1]);

		var oscillator = audioContext.createOscillator();
		oscillator.connect(envelope);

		oscillator.type = oscillatorType;
		oscillator.detune.value = pitch * 100;
		oscillator.frequency.value = 240;

		var vibrato = audioContext.createGain();
		vibrato.gain.value = vibratogain;
		vibrato.connect(oscillator.detune);

		var lfo = audioContext.createOscillator();
		lfo.connect(vibrato);
		lfo.frequency.value = lfofreq;

		oscillator.start(startTime);
		lfo.start(startTime);
		oscillator.stop(endTime + 2);
		lfo.stop(endTime + 2);
	};

	/// Play Loop
	var runSequencers = function runSequencers() {
		if (!runSeq || soundQueue.length === 0) {
			console.log("stop");return;
		}
		var ct = audioContext.currentTime;
		while (soundQueue.length > 0 && soundQueue[0][0] < ct + 0.15) {
			//console.log('ct:'+ct+'planed time:'+soundQueue[0][0]);
			var tone = soundQueue.splice(0, 1);
			// playsound (starttime, pitch, duration,             gaiin)
			playSound(tone[0][0], sounds[tone[0][1]][0], tone[0][2], sounds[tone[0][1]][2]);
			// element              color       duration
			highlightEl(tone[0][3], tone[0][1], tone[0][2]);
		}
		setTimeout(runSequencers, 90);
	};

	/// sounds start here
	/// Sound var
	var runSeq = true;
	var soundQueue = [];

	var audioContext = null;

	try {
		window.AudioContext = window.AudioContext || window.webkitAudioContext;
		var audioContext = new AudioContext();
	} catch (e) {
		console.log("No Web Audio API support");
	}

	//IOS Start IOSHACK
	$('body').on('touchend', function (e) {
		//alert('start sound
		// create empty buffer
		var buffer = audioContext.createBuffer(1, 1, 22050);
		var source = audioContext.createBufferSource();
		source.buffer = buffer;

		// connect to output (your speakers)
		source.connect(audioContext.destination);

		// play the file
		if (typeof source.noteOn !== 'undefined') {
			source.noteOn(0);
		}

		// var src = null;
		// src = audioContext.createOscillator();
		// src.type = 'square';
		// src.frequency.value = 440;
		// src.connect(audioContext.destination);
		// let ct = audioContext.currentTime;
		// src.start(ct+0.5);
		// src.stop(ct+1.2);
	});
	//IOS END

	// Sound constansts presets
	var tones = [];
	var tone0 = {};
	tone0.nr = 0;
	tone0.gain = 0.3;
	tone0.vol = '30%';
	tone0.color = '#454545';
	tone0.hover = '#000000';
	tone0.instrument = 'A';
	tone0.id = 'ig-row1-0';
	tone0.visible = true;
	tones.push(tone0);

	var tone1 = {};
	tone1.nr = 1;
	tone1.gain = 0.8;
	tone1.vol = '80%';
	tone1.color = '#296EAA';
	tone1.hover = '#094E8A';
	tone1.instrument = 'B';
	tone1.id = 'ig-row1-1';
	tone1.visible = true;
	tones.push(tone1);

	var tone2 = {};
	tone2.nr = 2;
	tone2.gain = 0.0;
	tone2.vol = '0%';
	tone2.color = '#5491B5';
	tone2.hover = '#094E8A';
	tone2.instrument = 'C';
	tone2.id = 'ig-row1-2';
	tone2.visible = false;
	tones.push(tone2);

	var tone3 = {};
	tone3.nr = 3;
	tone3.gain = 0.0;
	tone3.vol = '0%';
	tone3.color = '#5491B5';
	tone3.hover = '#094E8A';
	tone3.instrument = 'D';
	tone3.id = 'ig-row1-3';
	tone3.visible = true;
	tones.push(tone3);

	var soundSpeed = 0.5;
	var toneduration = 0.3;
	var vibratogain = 0.3;
	var envelopeStartEndTime = [0.01, 0.1];
	var lfofreq = 6; //5
	// Parametrization of the 5 tones  Pitch duration volume gain
	var sounds = [[-10, 0.5, 0.1], [3, 0.5, 0.9], [10, 0.5, 0.9], [15, 0.5, 0.9], [0, 0.5, 0.9]];
	var oscillatorType = 'sawtooth'; //'sine'; // 'sawtooth'

	/// Sound Methods
	var playMusic = function playMusic() {
		// fill soundQueue	
		var rectarr = d3.selectAll('rect').data();
		var elarr = d3.selectAll('rect')[0];
		var startTime = audioContext.currentTime;
		//console.log('Start'+startTime);
		soundQueue = [];
		for (var i = 0; i < rectarr.length; i++) {
			var v = rectarr[i][1];
			//playSound(i,sounds[v][0],sounds[v][1],sounds[v][2]);
			//alert(i);
			var tmp = [];
			tmp.push(i * soundSpeed + startTime);
			tmp.push(v);
			tmp.push(toneduration);
			tmp.push(elarr[i]);
			soundQueue.push(tmp);
		}
		//console.log('startsequencer'+audioContext.currentTime);
		runSequencers();
	};

	// Init Screen
	var width = 1280,
	    height = 45;
	var sr_viewport = '0 0 ' + (width + 60) + ' ' + height;
	var div = d3.select('#chart'),
	    svg = div.append('svg').attr('width', width).attr('height', height).attr('viewBox', sr_viewport).attr('preserveAspectRatio', 'xMidYMid meet'),
	   
	//grid   
	rw = 20,
	    rh = 20,
	    rowN = 1,
	    colN = 48,
	   
	//colordefinition
	lookup = ['#454545', '#296EAA', '#5491B5', '#79BEFA', '#46B0CF'],
	    hlookup = ['#000000', '#094E8A', '#094E8A', '#094E8A', '#2690AF'],
	   
	// lookup = ['#454545','#296EAA','#D43F3A','#5CB85C','#46B0CF'],
	// hlookup = ['#000000','#094E8A','#A41F1A','#3C983C','#2690AF'],
	rrange = lookup.length;

	// responsive change
	d3.select(window).on("resize", function () {
		//let targetWidth = svg.node().getBoundingClientRect().width;
		var winWidth = $(window).width();
		svg.attr("width", winWidth);
	});

	// Build HTML
	//createHtmlTonControl('1');

	// Register Buttons
	registerButton();
	registerTonButton();
	registerBlackTonButton();
	registerInputOnChange();
	var mydata = redraw(readInput());
	renderGraph(mydata);
	registerPlayButton();
	registerStopButton();
	//registerParameterButton();

	//ios hack
	// 	window.addEventListener('touchend', function() {

	// 	// create empty buffer
	// 	var buffer = audioContext.createBuffer(1, 1, 22050);
	// 	var source = audioContext.createBufferSource();
	// 	source.buffer = buffer;

	// 	// connect to output (your speakers)
	// 	source.connect(audioContext.destination);

	// 	// play the file
	// 	source.noteOn(0);

	// }, false);

	// window.addEventListener("touchstart", function (){	
	// 		if (had_touch)		return;		
	// 		// play empty buffer to unmute audio	
	// 		var buffer = audioContext.createBuffer(1, 1, 22050);	
	// 		var source = audioContext.createBufferSource();	
	// 		source.buffer = buffer;	
	// 		source.connect(audioContext.destination);	
	// 		source.start(0);	
	// 		had_touch = true;
	// 		alert("mist");
	// 	});
});

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvc2NyaXB0cy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxFQUFFLFFBQUYsRUFBWSxLQUFaLENBQWtCLFlBQVU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEyQjVCLEtBQU0sY0FBYyxTQUFkLFdBQWMsQ0FBQyxJQUFELEVBQVU7QUFDN0IsTUFBSSxNQUFNLElBQUksU0FBSixDQUFjLEdBQWQsRUFDTCxJQURLLENBQ0EsSUFEQSxDQUFOLENBRHlCOztBQUk3QixNQUFJLFlBQVksSUFBSSxTQUFKLENBQWMsTUFBZCxFQUFzQixJQUF0QixDQUEyQixVQUFDLENBQUQ7VUFBTztHQUFQLENBQTNCLENBQ2QsSUFEYyxDQUNULE1BRFMsRUFDRCxVQUFDLENBQUQsRUFBRyxDQUFIO1VBQVMsT0FBTyxFQUFFLENBQUYsQ0FBUDtHQUFULENBRFgsQ0FKeUI7O0FBTzdCLFlBQVUsS0FBVixHQUNFLE1BREYsQ0FDUyxNQURULEVBRUssSUFGTCxDQUVVLEdBRlYsRUFFZSxVQUFDLENBQUQsRUFBSSxDQUFKO1VBQVcsS0FBSyxDQUFMO0dBQVgsQ0FGZixDQUdLLElBSEwsQ0FHVSxPQUhWLEVBR21CLEVBSG5CLEVBSUssSUFKTCxDQUlVLFFBSlYsRUFJb0IsRUFKcEIsRUFQNkI7O0FBYTdCLFlBQVUsSUFBVixHQUFpQixNQUFqQixHQWI2QjtFQUFWLENBM0JROztBQTJDNUIsS0FBTSxjQUFjLFNBQWQsV0FBYyxDQUFDLElBQUQsRUFBVTs7O0FBRzdCLE1BQUksTUFBTSxJQUFJLFNBQUosQ0FBYyxHQUFkLEVBQ0wsSUFESyxDQUNBLElBREEsRUFFTCxLQUZLLEdBR0wsTUFISyxDQUdFLEdBSEYsRUFJTCxJQUpLLENBSUEsV0FKQSxFQUlhLFVBQUMsQ0FBRCxFQUFJLENBQUo7VUFBVSxrQkFBa0IsS0FBSyxDQUFMLEdBQVMsR0FBM0I7R0FBVixDQUpuQjs7Ozs7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IGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuLy8gY3JlYXRlIEhUTUwgc3R1ZmZcbi8vIGNvbnN0IGNyZWF0ZUh0bWxUb25Db250cm9sID0gKG5yKSA9PiB7XG4vLyBcdGNvbnN0IHBvc25yID0gJzEnO1xuXHRcblxuLy8gXHRsZXQgZWxDb250YWluZXIgPSAndG9uLWNvbnRyb2wtJytucjtcbi8vIFx0bGV0IGVsT3V0RGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIkRJVlwiKTtcbi8vIFx0ZWxPdXREaXYuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJjb2wteHMtM1wiKTtcblx0XG4vLyBcdGxldCBlbGlucHV0R3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiRElWXCIpO1xuLy8gXHRlbGlucHV0R3JvdXAuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJpbnB1dC1ncm91cC1idG5cIik7IFxuLy8gXHRlbE91dERpdi5hcHBlbmRDaGlsZChlbGlucHV0R3JvdXApO1xuLy8gXHQvLyBCVVRUT05cbi8vIFx0bGV0IHRleHRub2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoXCIgWmFobFwiKTsgXG4vLyBcdGxldCBidG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiQlVUVE9OXCIpO1xuLy8gXHRsZXQgc2lkPSdidG4tcm93JytucisnLScrcG9zbnI7XG4vLyBcdGJ0bi5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBzaWQpO1xuLy8gXHRidG4uc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJidG4gYnRuLWluZm8gZHJvcGRvd24tdG9nZ2xlXCIpO1xuLy8gXHRidG4uYXBwZW5kQ2hpbGQodGV4dG5vZGUpO1xuLy8gXHRlbGlucHV0R3JvdXAuYXBwZW5kQ2hpbGQoYnRuKTtcbi8vIFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWxDb250YWluZXIpLmFwcGVuZENoaWxkKGVsT3V0RGl2KTtcblxuXG4vLyB9O1xuXG4vLyBEM0pTXG5jb25zdCB1cGRhdGVHcmFwaCA9IChkYXRhKSA9PiB7XG5cdGxldCBncnAgPSBzdmcuc2VsZWN0QWxsKCdnJylcblx0ICAgIC5kYXRhKGRhdGEpO1xuXG5cdGxldCBzZWxlY3Rpb24gPSBncnAuc2VsZWN0QWxsKCdyZWN0JykuZGF0YSgoZCkgPT4gZClcblx0XHQuYXR0cignZmlsbCcsIChkLGkpID0+IGxvb2t1cFtkWzFdXSk7XG5cblx0c2VsZWN0aW9uLmVudGVyKClcblx0XHQuYXBwZW5kKCdyZWN0Jylcblx0ICAgIC5hdHRyKCd4JywgKGQsIGkpID0+ICAyOCAqIGkpXG5cdCAgICAuYXR0cignd2lkdGgnLCBydylcblx0ICAgIC5hdHRyKCdoZWlnaHQnLCByaCk7XG5cblx0c2VsZWN0aW9uLmV4aXQoKS5yZW1vdmUoKTsgICAgXG59O1xuXG5jb25zdCByZW5kZXJHcmFwaCA9IChkYXRhKSA9PiB7XG5cdC8vIENyZWF0ZSBhIGdyb3VwIGZvciBlYWNoIHJvdyBpbiB0aGUgZGF0YSBtYXRyaXggYW5kXG5cdC8vIHRyYW5zbGF0ZSB0aGUgZ3JvdXAgdmVydGljYWxseVxuXHRsZXQgZ3JwID0gc3ZnLnNlbGVjdEFsbCgnZycpXG5cdCAgICAuZGF0YShkYXRhKVxuXHQgICAgLmVudGVyKClcblx0ICAgIC5hcHBlbmQoJ2cnKVxuXHQgICAgLmF0dHIoJ3RyYW5zZm9ybScsIChkLCBpKSA9PiAndHJhbnNsYXRlKDAsICcgKyA1NCAqIGkgKyAnKScpO1xuXG5cdC8vIEZvciBlYWNoIGdyb3VwLCBjcmVhdGUgYSBzZXQgb2YgcmVjdGFuZ2xlcyBhbmQgYmluZCBcblx0Ly8gdGhlbSB0byB0aGUgaW5uZXIgYXJyYXkgKHRoZSBpbm5lciBhcnJheSBpcyBhbHJlYWR5XG5cdC8vIGJpbmRlZCB0byB0aGUgZ3JvdXApXG5cdGdycC5zZWxlY3RBbGwoJ3JlY3QnKVxuXHQgICAgLmRhdGEoKGQpID0+IGQpXG5cdCAgICAuZW50ZXIoKVxuXHQgICAgLmFwcGVuZCgncmVjdCcpXG5cdCAgICAgICAgLmF0dHIoJ3gnLCAoZCwgaSkgPT4gIDI4ICogaSlcblx0ICAgICAgICAuYXR0cignZmlsbCcsIChkLGkpID0+IGxvb2t1cFtkWzFdXSlcblx0ICAgICAgICAuYXR0cignd2lkdGgnLCBydylcblx0ICAgICAgICAuYXR0cignaGVpZ2h0JywgcmgpOyAgICAgXG5cblx0Ly9Nb2R1bG8gMTAgdGlja3MgICAgICAgIFxuXHRncnAuc2VsZWN0QWxsKCdsaW5lJylcblx0ICAgIC5kYXRhKCAoZCkgPT4gZClcblx0ICAgIC5lbnRlcigpLmFwcGVuZCgnbGluZScpXG5cdCAgICAuZmlsdGVyKChkLGkpID0+IGklMTA9PT0wKVxuICBcdFx0XHQuYXR0cigneDEnLCAgKGQsIGkpID0+IDI4MCAqIGkrMSlcbiAgXHRcdFx0LmF0dHIoJ3kxJywgMjApXG4gIFx0XHRcdC5hdHRyKCd4MicsIChkLCBpKSA9PiAyODAgKiBpKzEpXG4gIFx0XHRcdC5hdHRyKCd5MicsNDApXG4gIFx0XHRcdC5zdHlsZSgnc3Ryb2tlJywgJ2JsYWNrJylcbiAgXHRcdFx0LnN0eWxlKCdzdHJva2Utd2lkdGgnLCcycHgnKTsgICAgICBcblxuICBcdC8vIFRleHQgXG4gIFx0Z3JwLnNlbGVjdEFsbCgndGV4dCcpXG5cdCAgICAuZGF0YSggKGQpID0+IGQpXG5cdCAgICAuZW50ZXIoKS5hcHBlbmQoJ3RleHQnKVxuXHQgICAgLmZpbHRlcigoZCxpKSA9PiBpJTEwPT09MClcblx0ICAgIFx0LmF0dHIoJ3gnLCAoZCwgaSkgPT4geyByZXR1cm4gMjgwICogaSs1OyB9KVxuXHQgICAgXHQuYXR0cigneScsICczOCcpICBcblx0ICAgIFx0LmF0dHIoJ2ZvbnQtZmFtaWx5JywgJ3NhbnMtc2VyaWYnKSBcblx0ICAgIFx0LnRleHQoIChkLCBpLGspID0+IGsqNDAraSoxMCsxKTsgXG59O1xuXG4vLyBnZXQgdmFsdWVzXG5jb25zdCBnZXRCdXR0b25JZHMgPSAoKSA9PiBbJyNidG4tcm93MS0xJywnI2J0bi1yb3cxLTInLCcjYnRuLXJvdzEtMycsJyNidG4tcm93MS00J107XG5cbi8vIHJlYWRzIFBhcmFtZXRlciBUb24gWmFobCBmb3Igcm93IG9uZVxuY29uc3QgcmVhZElucHV0ID0gKCkgPT4ge1xuXHRsZXQgaWRzID0gW107XG5cdC8vIFRPRE8gdXNlIGFzIHBhcmFtZXRlciBsYXRlclxuXHRsZXQgcm93ID0gMTtcblx0bGV0IHM9Jyc7XG5cdGZvciAobGV0IGkgPSAxOyBpIDwgNDsgaSsrKXtcblx0XHRzID0gJyNidG4tcm93Jytyb3crJy0nK2k7XG5cdFx0aWRzLnB1c2gocyk7XG5cdH0gXG5cblx0bGV0IG91dCA9IFtdO1xuXHRmb3IgKGxldCBpIGluIGlkcykge1xuXHRcdGxldCBlbHZhbCA9ICQoaWRzW2ldKVxuXHRcdFx0XHRcdFx0LnBhcmVudCgpXG5cdFx0XHRcdFx0XHQucGFyZW50KClcblx0XHRcdFx0XHRcdC5jaGlsZHJlbignaW5wdXQnKVswXTtcblx0XHRsZXQgdmFsID0gMDtcblx0XHRpZiAodHlwZW9mIGVsdmFsICE9PSAndW5kZWZpbmVkJyl7XG5cdFx0XHR2YWwgPSBlbHZhbC52YWx1ZTtcblx0XHR9XG5cdFx0b3V0LnB1c2godmFsKTtcblx0fVxuXHRyZXR1cm4gb3V0O1xufTtcblxuLy8gUmVkcmF3IEdhbWVcbmNvbnN0IHJlZHJhdyA9IChpbnBzdHJhcnIpID0+IHtcblx0bGV0IGlucCA9IFtdO1xuXHQvLyBwYXJzZSBpbnB1dFxuXHRmb3IgKGxldCBpID0gMDsgaSA8IGlucHN0cmFyci5sZW5ndGg7IGkrKyl7XG5cdFx0aW5wLnB1c2gocGFyc2VJbnQoaW5wc3RyYXJyW2ldKSk7XG5cdH07XG5cbiAgICAvLyBpbml0IHZhbHVlc1xuXHRsZXQgdCA9IDEsIC8vIGNvdXQgdmFsdWVcblx0XHRkYXRhID0gW10sXG5cdFx0Y29sLFxuXHRcdG5leHRFdmVudCxcblx0XHR0bXAgPSAwO1xuXG5cdGZvciAobGV0IGkgPSAwOyBpIDwgaW5wLmxlbmd0aDsgaSsrKXtcblx0XHRjb2wgPSBpO1xuXHRcdG5leHRFdmVudCA9IGlucFtjb2xdO1xuXHRcdGlmIChuZXh0RXZlbnQgPiAwKXtcblx0XHRcdGJyZWFrO1xuXHRcdH1cblx0fVxuXG5cdGZvciAobGV0IGsgPSAwOyBrIDwgcm93TjsgayArPSAxKSB7XG5cdFx0bGV0IHJvdyA9IFtdO1xuXHRcdGRhdGEucHVzaChyb3cpO1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgY29sTjsgaSArPTEpe1xuXHRcdFx0aWYgKHQgPT09ICBuZXh0RXZlbnQpe1xuXHRcdFx0XHQvLyBqdW1wIG92ZXIgMCBjb2xvciBlbnRyaWVzXG5cdFx0XHRcdHRtcCA9IGNvbCsxOyAvLyBibGFjayBoYXMgaW5kZXggMFxuXHRcdFx0XHQvLyBpZiBzb21ldGhpbmcgaXMgemVybyBnbyBmdXJ0aGVyXG5cdFx0XHRcdHdoaWxlIChpbnBbKGNvbCsxKSVpbnAubGVuZ3RoXSA8IDEpe1xuXHRcdFx0XHRcdGNvbCA9IChjb2wrMSklaW5wLmxlbmd0aDtcblx0XHRcdFx0fVxuXHRcdFx0XHRuZXh0RXZlbnQgKz0gaW5wWyhjb2wrMSklaW5wLmxlbmd0aF07XG5cdFx0XHRcdGNvbCA9IChjb2wrMSklaW5wLmxlbmd0aDsgLy8gbmV4dCBjb2xvclxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dG1wID0gMDtcblx0XHRcdH1cblx0XHRcdHJvdy5wdXNoKFt0LCB0bXBdKTtcblx0XHRcdHQgPSB0ICsgMTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIGRhdGE7XG59O1xuXG5cbmNvbnN0IGhpZ2hsaWdodEVsICA9IChlbCxjb2wsdGltZSkgPT57XG4gICAkKGVsKS5hdHRyKCBcImZpbGxcIiwgaGxvb2t1cFtjb2xdKTtcbiAgIHNldFRpbWVvdXQoKCkgPT4geyQoZWwpLmF0dHIoIFwiZmlsbFwiLCBsb29rdXBbY29sXSk7fSx0aW1lKjEwMDApO1xuXG59O1xuXG4vL0NIQU5HRSBvbiBUT04gSW5wdXQgaXMgYXBwbGllZFxuY29uc3QgcmVnaXN0ZXJJbnB1dE9uQ2hhbmdlID0gKCkgPT4ge1xuXHRsZXQgaWRzID0gW107XG5cdC8vIFRPRE8gdXNlIGFzIHBhcmFtZXRlciBsYXRlclxuXHRsZXQgcm93ID0gMTtcblx0bGV0IHM9Jyc7XG5cdGZvciAobGV0IGkgPSAxOyBpIDwgNDsgaSsrKXtcblx0XHRzID0gJyNidG4tcm93Jytyb3crJy0nK2k7XG5cdFx0aWRzLnB1c2gocyk7XG5cdH0gXG5cblx0Zm9yIChsZXQgaSBpbiBpZHMpIHtcblx0XHQkKGlkc1tpXSlcblx0XHRcdC5wYXJlbnQoKVxuXHRcdFx0LnBhcmVudCgpXG5cdFx0XHQuY2hpbGRyZW4oJ2lucHV0LmZvcm0tY29udHJvbCcpXG5cdFx0XHQuY2hhbmdlKCgpID0+IHtcblx0XHRcdFx0bGV0IG5ld2RhdGEgPSByZWRyYXcocmVhZElucHV0KCkpO1xuXHRcdFx0XHR1cGRhdGVHcmFwaChuZXdkYXRhKTtcblx0XHRcdH0pO1xuXHR9XG59O1xuXG4vLyBSZWdpc3RlciBjb3VudCBCdXR0b25cbmNvbnN0IHJlZ2lzdGVyQnV0dG9uID0gKCkgPT4ge1xuXHRsZXQgaWRzID0gW107XG5cdC8vIFRPRE8gdXNlIGFzIHBhcmFtZXRlciBsYXRlclxuXHRsZXQgcm93ID0gMTtcblx0bGV0IHM9Jyc7XG5cdGZvciAobGV0IGkgPSAxOyBpIDwgNDsgaSsrKXtcblx0XHRzID0gJyNidG4tcm93Jytyb3crJy0nK2k7XG5cdFx0aWRzLnB1c2gocyk7XG5cdH0gXG5cdGxldCBlYyA9IGpRdWVyeS5FdmVudCggJ2NoYW5nZScgKTtcbiAgICBmb3IgKGxldCBpIGluIGlkcykge1xuICAgIFx0JChpZHNbaV0pXG5cdFx0XHQucGFyZW50KClcblx0XHRcdC5jaGlsZHJlbigndWwuZHJvcGRvd24tbWVudScpXG5cdFx0XHQub24oJ2NsaWNrJywgKGUpID0+IHtcblx0XHRcdFx0JChpZHNbaV0pXG5cdFx0XHRcdC5wYXJlbnQoKVxuXHRcdFx0XHQucGFyZW50KClcblx0XHRcdFx0LmNoaWxkcmVuKCdpbnB1dC5mb3JtLWNvbnRyb2w6Zmlyc3QnKVxuXHRcdFx0XHQuYXR0cigndmFsdWUnLGUudGFyZ2V0LnRleHQpXG5cdFx0XHRcdC8vc2VuZCBjaGFuZ2UgZXZlbnRcblx0XHRcdFx0LnRyaWdnZXIoZWMpO1xuXHRcdH0pO1x0XG4gICAgfVxufTtcblxuXG4vLyBSZWdpc3RlciBUb24gYnV0dG9uXG5jb25zdCByZWdpc3RlclRvbkJ1dHRvbiA9ICgpID0+IHtcblx0bGV0IGlkcyA9IFtdO1xuXHQvLyBUT0RPIHVzZSBhcyBwYXJhbWV0ZXIgbGF0ZXJcblx0bGV0IHJvdyA9IDE7XG5cdGxldCBzPScnO1xuXG5cdGZvciAobGV0IGkgPSAxOyBpIDwgNDsgaSsrKXtcblx0XHRzID0gJyNidG4tcm93Jytyb3crJy0nK2krJy10b24nO1xuXHRcdGlkcy5wdXNoKHMpO1xuXHR9IFxuXHQvLyBsZXQgZWMgPSBqUXVlcnkuRXZlbnQoICdjaGFuZ2UnICk7XG4gICAgZm9yIChsZXQgaSBpbiBpZHMpIHtcbiAgICBcdCQoaWRzW2ldKVxuXHRcdFx0LnBhcmVudCgpXG5cdFx0XHQuY2hpbGRyZW4oJ3VsLmRyb3Bkb3duLW1lbnUnKVxuXHRcdFx0Lm9uKCdjbGljaycsIChlKSA9PiB7XG5cdFx0XHRcdCQoaWRzW2ldKVxuXHRcdFx0XHQucGFyZW50KClcblx0XHRcdFx0LnBhcmVudCgpXG5cdFx0XHRcdC5jaGlsZHJlbignaW5wdXQuZm9ybS1jb250cm9sOmVxKCAxICknKVxuXHRcdFx0XHQuYXR0cigndmFsdWUnLGUudGFyZ2V0LnRleHQpO1xuXHRcdFx0XHRcblx0XHRcdFx0Ly8gZG8gcGFyYW1ldGVyIGNoYW5nZVxuXHRcdFx0XHQvLyBpbmRleCBoYXZlIHRvIHN1cnZpdmUgOilcblx0XHRcdCAgICBsZXQgdG1wID0gaSsxKyhyb3ctMSkqMjtcblx0XHRcdFx0dG9uZXNbdG1wXS5pbnN0cnVtZW50ID0gZS50YXJnZXQudGV4dDtcblx0XHRcdFx0Ly9zZW5kIGNoYW5nZSBldmVudFxuXHRcdFx0XHQvLy50cmlnZ2VyKGVjKTtcblx0XHR9KTtcdFxuICAgIH1cbn07XG5cbmNvbnN0IHJlZ2lzdGVyQmxhY2tUb25CdXR0b24gPSAoKSA9PiB7XG5cdGxldCBpZHMgPSBbXTtcblx0Ly8gVE9ETyB1c2UgYXMgcGFyYW1ldGVyIGxhdGVyXG5cdGxldCByb3cgPSAxO1xuXHRsZXQgcyA9ICcjYnRuLXJvdzEtMC10b24nO1xuXHRpZHMucHVzaChzKTtcblx0XG5cdC8vIGxldCBlYyA9IGpRdWVyeS5FdmVudCggJ2NoYW5nZScgKTtcbiAgICBmb3IgKGxldCBpIGluIGlkcykge1xuICAgIFx0JChpZHNbaV0pXG5cdFx0XHQucGFyZW50KClcblx0XHRcdC5jaGlsZHJlbigndWwuZHJvcGRvd24tbWVudScpXG5cdFx0XHQub24oJ2NsaWNrJywgKGUpID0+IHtcblx0XHRcdFx0JChpZHNbaV0pXG5cdFx0XHRcdC5wYXJlbnQoKVxuXHRcdFx0XHQucGFyZW50KClcblx0XHRcdFx0LmNoaWxkcmVuKCdpbnB1dC5mb3JtLWNvbnRyb2w6Zmlyc3QnKVxuXHRcdFx0XHQuYXR0cigndmFsdWUnLGUudGFyZ2V0LnRleHQpO1xuXG5cdFx0XHRcdHRvbmVzWzBdLmluc3RydW1lbnQgPSBlLnRhcmdldC50ZXh0O1xuXHRcdFx0XHRcblx0XHRcdFx0Ly8gZG8gcGFyYW1ldGVyIGNoYW5nZVxuXG5cdFx0XHRcdC8vc2VuZCBjaGFuZ2UgZXZlbnRcblx0XHRcdFx0Ly8udHJpZ2dlcihlYyk7XG5cdFx0fSk7XHRcblxuICAgIH1cbn07XG5cblxuY29uc3QgcmVnaXN0ZXJQbGF5QnV0dG9uID0gKCkgPT4ge1xuXHQkKCcjcGxheW11c2ljYnRuJykub24oJ2NsaWNrJywgKGUpID0+IHtcblx0XHQvLyBpcGhvbmUgaGFja1xuXHRcdC8vIGlmIChhdWRpb0NvbnRleHQgPT09IG51bGwpe1xuXHRcdC8vIFx0dHJ5IHtcbiAgLy8gICBcdFx0XHR3aW5kb3cuQXVkaW9Db250ZXh0ID0gd2luZG93LkF1ZGlvQ29udGV4dCB8fCB3aW5kb3cud2Via2l0QXVkaW9Db250ZXh0O1xuICAvLyAgIFx0XHRcdGF1ZGlvQ29udGV4dCA9IG5ldyB3aW5kb3cuQXVkaW9Db250ZXh0KCk7XG5cdFx0Ly8gXHR9IGNhdGNoIChlKSB7XG4gIC8vICAgXHRcdFx0Y29uc29sZS5sb2coXCJObyBXZWIgQXVkaW8gQVBJIHN1cHBvcnRcIik7XG5cdFx0Ly8gXHR9XG5cdFx0Ly8gXHRsZXQgb3NjaWxsYXRvciA9IGF1ZGlvQ29udGV4dC5jcmVhdGVPc2NpbGxhdG9yKCk7XG4gXHQvLyBcdFx0XHRvc2NpbGxhdG9yLmZyZXF1ZW5jeS52YWx1ZSA9IDQwMDtcbiBcdC8vIFx0XHRcdG9zY2lsbGF0b3IuY29ubmVjdChhdWRpb0NvbnRleHQuZGVzdGluYXRpb24pO1xuIFx0Ly8gXHRcdFx0b3NjaWxsYXRvci5zdGFydCgwKTtcbiBcdC8vIFx0XHRcdG9zY2lsbGF0b3Iuc3RvcCguNSlcblx0XHQvLyB9XG5cdFx0cnVuU2VxID0gdHJ1ZTtcblx0XHRwbGF5TXVzaWMoKTtcblx0XHQvL2FsZXJ0KCdoZXJlJyk7XG5cdH0pO1xuXHQvLyAkKCcjcGxheW11c2ljYnRuJykub24oJ3RvdWNoZW5kJywgKGUpID0+IHtcblxuXHQvLyBcdHJ1blNlcSA9IHRydWU7XG5cdC8vIFx0cGxheU11c2ljKCk7XG5cdC8vIFx0Ly9hbGVydCgnaGVyZScpO1xuXHQvLyB9KTtcbn07XG5cbmNvbnN0IHJlZ2lzdGVyU3RvcEJ1dHRvbiA9ICgpID0+IHtcblx0JCgnI3N0b3BtdXNpY2J0bicpLm9uKCdjbGljaycsIChlKSA9PiB7XG5cdFx0cnVuU2VxID0gZmFsc2U7XG5cdFx0Ly9hbGVydCgnaGVyZScpO1xuXHR9KTtcblx0Ly8gJCgnI3N0b3BtdXNpY2J0bicpLm9uKCd0b3VjaGVuZCcsIChlKSA9PiB7XG5cdC8vIFx0cnVuU2VxID0gZmFsc2U7XG5cdC8vIFx0Ly9hbGVydCgnaGVyZScpO1xuXHQvLyB9KTtcbn07XG5cbi8vIGNvbnN0IHJlZ2lzdGVyUGFyYW1ldGVyQnV0dG9uID0gKCkgPT4ge1xuLy8gXHQkKCcjcGFyYW1ldGVyYnRuJykub24oJ2NsaWNrJywgKGUpID0+IHtcbi8vIFx0XHRsZXQgZWwgPSBkMy5zZWxlY3RBbGwoJ3JlY3QnKVswXVs0XTtcbi8vIFx0XHRsZXQgdGltZSA9IDAuOTtcbi8vIFx0XHRoaWdobGlnaHRFbChlbCwwLHRpbWUpO1xuLy8gXHR9KTtcbi8vIH07XG5cblxuLy8gUGFyYW1ldGVyIHdlcnRlIGVpbmxlc2VuXG4vLyAkKCcjcGFyYU9zemJ0bicpLm9uKCdjbGljaycsIChlKSA9PiB7XG4vLyBcdGxldCBzMiA9ICQoJ2lucHV0W25hbWU9c3BlZWRdOmNoZWNrZWQnLCAnI3BhcmFtZXRlck1vZGFsJykudmFsKCk7XG4vLyBcdGxldCBzID0gJCgnaW5wdXRbbmFtZT1vc3pmb3JtXTpjaGVja2VkJywgJyNwYXJhbWV0ZXJNb2RhbCcpLnZhbCgpO1xuLy8gXHQvL2lmICghIHR5cGVvZiBzID09PSBcInVuZGVmaW5lZFwiICYmICEgdHlwZW9mIHMyICA9PT0gXCJ1bmRlZmluZWRcIil7XG4vLyBcdGlmICghIGZhbHNlKXtcbi8vIFx0XHRvc2NpbGxhdG9yVHlwZSA9IHM7XG4vLyBcdFx0c291bmRTcGVlZCA9IHBhcnNlRmxvYXQoczIpO1xuLy8gXHRcdCQoJyNwYXJhbWV0ZXJNb2RhbCcpLm1vZGFsKCdoaWRlJyk7XG4vLyBcdH1cbi8vIH0pO1xuXG5cblxuLy8gU291bmQgRGVmaW5pdGlvblxuXG5cbmNvbnN0IHBsYXlTb3VuZCA9IChzdGFydFRpbWUsIHBpdGNoLCBkdXJhdGlvbiwgZ2FpbikgPT4ge1xuXHQvL2xldCBzdGFydFRpbWUgPSBhdWRpb0NvbnRleHQuY3VycmVudFRpbWUgKyBkZWxheTtcbiAgXHRsZXQgZW5kVGltZSA9IHN0YXJ0VGltZSArIGR1cmF0aW9uO1xuXG4gIFx0bGV0IG91dGdhaW4gPSBhdWRpb0NvbnRleHQuY3JlYXRlR2FpbigpO1xuICBcdG91dGdhaW4uZ2Fpbi52YWx1ZSA9IGdhaW47XG4gIFx0b3V0Z2Fpbi5jb25uZWN0KGF1ZGlvQ29udGV4dC5kZXN0aW5hdGlvbik7IFx0XG5cbiAgXHRsZXQgZW52ZWxvcGUgPSBhdWRpb0NvbnRleHQuY3JlYXRlR2FpbigpO1xuICBcdGVudmVsb3BlLmNvbm5lY3Qob3V0Z2Fpbik7XG4gIFx0ZW52ZWxvcGUuZ2Fpbi52YWx1ZSA9IDA7XG4gIFx0XG4gIFx0ZW52ZWxvcGUuZ2Fpbi5zZXRUYXJnZXRBdFRpbWUoMSwgc3RhcnRUaW1lLCBlbnZlbG9wZVN0YXJ0RW5kVGltZVswXSk7XG4gIFx0ZW52ZWxvcGUuZ2Fpbi5zZXRUYXJnZXRBdFRpbWUoMCwgZW5kVGltZSwgZW52ZWxvcGVTdGFydEVuZFRpbWVbMV0pO1xuXG4gIFx0bGV0IG9zY2lsbGF0b3IgPSBhdWRpb0NvbnRleHQuY3JlYXRlT3NjaWxsYXRvcigpO1xuICBcdG9zY2lsbGF0b3IuY29ubmVjdChlbnZlbG9wZSk7XG5cbiAgXHRvc2NpbGxhdG9yLnR5cGUgPSBvc2NpbGxhdG9yVHlwZTtcbiAgXHRvc2NpbGxhdG9yLmRldHVuZS52YWx1ZSA9IHBpdGNoICogMTAwO1xuICBcdG9zY2lsbGF0b3IuZnJlcXVlbmN5LnZhbHVlID0gMjQwO1xuXG5cdGxldCB2aWJyYXRvID0gYXVkaW9Db250ZXh0LmNyZWF0ZUdhaW4oKTtcblx0dmlicmF0by5nYWluLnZhbHVlID0gdmlicmF0b2dhaW47XG5cdHZpYnJhdG8uY29ubmVjdChvc2NpbGxhdG9yLmRldHVuZSk7XG5cblx0bGV0IGxmbyA9IGF1ZGlvQ29udGV4dC5jcmVhdGVPc2NpbGxhdG9yKCk7XG5cdGxmby5jb25uZWN0KHZpYnJhdG8pO1xuXHRsZm8uZnJlcXVlbmN5LnZhbHVlID1sZm9mcmVxOyBcblxuXHRvc2NpbGxhdG9yLnN0YXJ0KHN0YXJ0VGltZSk7XG4gIFx0bGZvLnN0YXJ0KHN0YXJ0VGltZSk7XG4gIFx0b3NjaWxsYXRvci5zdG9wKGVuZFRpbWUgKzIgKTtcbiAgXHRsZm8uc3RvcChlbmRUaW1lICsyKTtcblxufTtcblxuLy8vIFBsYXkgTG9vcFxuY29uc3QgcnVuU2VxdWVuY2VycyA9ICgpID0+IHtcblx0aWYgKCFydW5TZXEgfHwgc291bmRRdWV1ZS5sZW5ndGggPT09IDApe2NvbnNvbGUubG9nKFwic3RvcFwiKTtyZXR1cm47fVxuXHRsZXQgY3QgPSBhdWRpb0NvbnRleHQuY3VycmVudFRpbWU7XG5cdHdoaWxlIChzb3VuZFF1ZXVlLmxlbmd0aD4wICYmIHNvdW5kUXVldWVbMF1bMF08IGN0KzAuMTUpe1xuXHRcdC8vY29uc29sZS5sb2coJ2N0OicrY3QrJ3BsYW5lZCB0aW1lOicrc291bmRRdWV1ZVswXVswXSk7XG5cdFx0bGV0IHRvbmUgPSBzb3VuZFF1ZXVlLnNwbGljZSgwLDEpO1xuXHRcdC8vIHBsYXlzb3VuZCAoc3RhcnR0aW1lLCBwaXRjaCwgZHVyYXRpb24sICAgICAgICAgICAgIGdhaWluKVxuXHRcdHBsYXlTb3VuZCh0b25lWzBdWzBdLHNvdW5kc1t0b25lWzBdWzFdXVswXSx0b25lWzBdWzJdLHNvdW5kc1t0b25lWzBdWzFdXVsyXSk7XHRcdFxuXHRcdC8vIGVsZW1lbnQgICAgICAgICAgICAgIGNvbG9yICAgICAgIGR1cmF0aW9uXG5cdFx0aGlnaGxpZ2h0RWwodG9uZVswXVszXSx0b25lWzBdWzFdLHRvbmVbMF1bMl0pO1xuXHR9XG5cdHNldFRpbWVvdXQocnVuU2VxdWVuY2Vycyw5MCk7XG59XG5cbi8vLyBzb3VuZHMgc3RhcnQgaGVyZVxuLy8vIFNvdW5kIHZhclxubGV0IHJ1blNlcSA9IHRydWU7XG5sZXQgc291bmRRdWV1ZSA9IFtdO1xuXG52YXIgYXVkaW9Db250ZXh0ID0gbnVsbDtcblxudHJ5IHtcbiAgIHdpbmRvdy5BdWRpb0NvbnRleHQgPSB3aW5kb3cuQXVkaW9Db250ZXh0fHx3aW5kb3cud2Via2l0QXVkaW9Db250ZXh0O1xuICAgdmFyIGF1ZGlvQ29udGV4dCA9IG5ldyBBdWRpb0NvbnRleHQoKTtcbn0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLmxvZyhcIk5vIFdlYiBBdWRpbyBBUEkgc3VwcG9ydFwiKTtcbn1cblxuXG4vL0lPUyBTdGFydCBJT1NIQUNLXG4kKCdib2R5Jykub24oJ3RvdWNoZW5kJywgKGUpID0+IHtcblx0Ly9hbGVydCgnc3RhcnQgc291bmRcblx0Ly8gY3JlYXRlIGVtcHR5IGJ1ZmZlclxuXHR2YXIgYnVmZmVyID0gYXVkaW9Db250ZXh0LmNyZWF0ZUJ1ZmZlcigxLCAxLCAyMjA1MCk7XG5cdHZhciBzb3VyY2UgPSBhdWRpb0NvbnRleHQuY3JlYXRlQnVmZmVyU291cmNlKCk7XG5cdHNvdXJjZS5idWZmZXIgPSBidWZmZXI7XG5cblx0Ly8gY29ubmVjdCB0byBvdXRwdXQgKHlvdXIgc3BlYWtlcnMpXG5cdHNvdXJjZS5jb25uZWN0KGF1ZGlvQ29udGV4dC5kZXN0aW5hdGlvbik7XG5cblx0Ly8gcGxheSB0aGUgZmlsZVxuXHRpZiAodHlwZW9mIHNvdXJjZS5ub3RlT24gIT09ICd1bmRlZmluZWQnKXtcblx0XHRzb3VyY2Uubm90ZU9uKDApO1xuXHR9XG5cdFxuXHQvLyB2YXIgc3JjID0gbnVsbDtcblx0Ly8gc3JjID0gYXVkaW9Db250ZXh0LmNyZWF0ZU9zY2lsbGF0b3IoKTtcblx0Ly8gc3JjLnR5cGUgPSAnc3F1YXJlJztcblx0Ly8gc3JjLmZyZXF1ZW5jeS52YWx1ZSA9IDQ0MDtcblx0Ly8gc3JjLmNvbm5lY3QoYXVkaW9Db250ZXh0LmRlc3RpbmF0aW9uKTtcblx0Ly8gbGV0IGN0ID0gYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lO1xuXHQvLyBzcmMuc3RhcnQoY3QrMC41KTtcblx0Ly8gc3JjLnN0b3AoY3QrMS4yKTtcbn0pO1xuLy9JT1MgRU5EXG5cblxuLy8gU291bmQgY29uc3RhbnN0cyBwcmVzZXRzXG5sZXQgdG9uZXMgPSBbXTtcbmxldCB0b25lMCA9IHt9O1xuXHR0b25lMC5uciA9IDA7XG5cdHRvbmUwLmdhaW4gPSAwLjM7XG5cdHRvbmUwLnZvbCA9ICczMCUnO1xuXHR0b25lMC5jb2xvciA9ICcjNDU0NTQ1Jztcblx0dG9uZTAuaG92ZXIgPSAnIzAwMDAwMCc7XG5cdHRvbmUwLmluc3RydW1lbnQgPSAnQSc7XG5cdHRvbmUwLmlkID0gJ2lnLXJvdzEtMCc7XG5cdHRvbmUwLnZpc2libGUgPSB0cnVlO1xudG9uZXMucHVzaCh0b25lMCk7XG5cbmxldCB0b25lMSA9IHt9O1xuXHR0b25lMS5uciA9IDE7XG5cdHRvbmUxLmdhaW4gPSAwLjg7XG5cdHRvbmUxLnZvbCA9ICc4MCUnO1xuXHR0b25lMS5jb2xvciA9ICcjMjk2RUFBJztcblx0dG9uZTEuaG92ZXIgPSAnIzA5NEU4QSc7XG5cdHRvbmUxLmluc3RydW1lbnQgPSAnQic7XG5cdHRvbmUxLmlkID0gJ2lnLXJvdzEtMSc7XG5cdHRvbmUxLnZpc2libGUgPSB0cnVlO1xudG9uZXMucHVzaCh0b25lMSk7XG5cbmxldCB0b25lMiA9IHt9O1xuXHR0b25lMi5uciA9IDI7XG5cdHRvbmUyLmdhaW4gPSAwLjA7XG5cdHRvbmUyLnZvbCA9ICcwJSc7XG5cdHRvbmUyLmNvbG9yID0gJyM1NDkxQjUnO1xuXHR0b25lMi5ob3ZlciA9ICcjMDk0RThBJztcblx0dG9uZTIuaW5zdHJ1bWVudCA9ICdDJztcblx0dG9uZTIuaWQgPSAnaWctcm93MS0yJztcblx0dG9uZTIudmlzaWJsZSA9IGZhbHNlO1xudG9uZXMucHVzaCh0b25lMik7XG5cbmxldCB0b25lMyA9IHt9O1xuXHR0b25lMy5uciA9IDM7XG5cdHRvbmUzLmdhaW4gPSAwLjA7XG5cdHRvbmUzLnZvbCA9ICcwJSc7XG5cdHRvbmUzLmNvbG9yID0gJyM1NDkxQjUnO1xuXHR0b25lMy5ob3ZlciA9ICcjMDk0RThBJztcblx0dG9uZTMuaW5zdHJ1bWVudCA9ICdEJztcblx0dG9uZTMuaWQgPSAnaWctcm93MS0zJztcblx0dG9uZTMudmlzaWJsZSA9IHRydWU7XG50b25lcy5wdXNoKHRvbmUzKTtcblxuXG5sZXQgc291bmRTcGVlZCA9IDAuNTtcbmxldCB0b25lZHVyYXRpb24gPSAwLjM7XG5sZXQgdmlicmF0b2dhaW4gPSAwLjM7XG5sZXQgZW52ZWxvcGVTdGFydEVuZFRpbWUgPSBbMC4wMSwwLjFdO1xubGV0IGxmb2ZyZXEgPSA2OyAgLy81XG4vLyBQYXJhbWV0cml6YXRpb24gb2YgdGhlIDUgdG9uZXMgIFBpdGNoIGR1cmF0aW9uIHZvbHVtZSBnYWluXG5jb25zdCBzb3VuZHMgPSBbWy0xMCwgMC41LDAuMV0sWzMsIDAuNSwwLjldLFsxMCwgMC41LDAuOV0sWzE1LCAwLjUsMC45XSxbMCwgMC41LDAuOV1dO1xubGV0IG9zY2lsbGF0b3JUeXBlID0gJ3Nhd3Rvb3RoJzsgLy8nc2luZSc7IC8vICdzYXd0b290aCdcblxuXG4vLy8gU291bmQgTWV0aG9kc1xuY29uc3QgcGxheU11c2ljID0gKCkgPT4ge1xuXHQvLyBmaWxsIHNvdW5kUXVldWVcdFxuXHRsZXQgcmVjdGFyciA9IGQzLnNlbGVjdEFsbCgncmVjdCcpLmRhdGEoKTtcblx0bGV0IGVsYXJyID0gZDMuc2VsZWN0QWxsKCdyZWN0JylbMF07XG4gICAgbGV0IHN0YXJ0VGltZSA9IGF1ZGlvQ29udGV4dC5jdXJyZW50VGltZTtcbiAgICAvL2NvbnNvbGUubG9nKCdTdGFydCcrc3RhcnRUaW1lKTtcbiAgICBzb3VuZFF1ZXVlID1bXTtcblx0Zm9yIChsZXQgaT0wOyBpIDwgcmVjdGFyci5sZW5ndGg7IGkrKykge1xuXHRcdGxldCB2ID0gcmVjdGFycltpXVsxXTtcblx0XHQvL3BsYXlTb3VuZChpLHNvdW5kc1t2XVswXSxzb3VuZHNbdl1bMV0sc291bmRzW3ZdWzJdKTtcblx0XHQvL2FsZXJ0KGkpO1xuXHRcdGxldCB0bXAgPSBbXTtcblx0XHR0bXAucHVzaChpKnNvdW5kU3BlZWQrc3RhcnRUaW1lKTtcblx0XHR0bXAucHVzaCh2KTtcblx0XHR0bXAucHVzaCh0b25lZHVyYXRpb24pO1xuXHRcdHRtcC5wdXNoKGVsYXJyW2ldKTtcblx0XHRzb3VuZFF1ZXVlLnB1c2godG1wKTtcblx0fVxuXHQvL2NvbnNvbGUubG9nKCdzdGFydHNlcXVlbmNlcicrYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lKTtcbiAgICBydW5TZXF1ZW5jZXJzKCk7XG59O1xuXG4vLyBJbml0IFNjcmVlblxuXHRjb25zdCB3aWR0aCA9IDEyODAsXG4gICAgaGVpZ2h0ID0gNDU7XG4gICAgbGV0IHNyX3ZpZXdwb3J0ID0gJzAgMCAnKyh3aWR0aCs2MCkrJyAnK2hlaWdodDtcbiAgICBjb25zdCBkaXYgPSBkMy5zZWxlY3QoJyNjaGFydCcpLFxuICAgIHN2ZyA9IGRpdi5hcHBlbmQoJ3N2ZycpXG4gICAgICAgIC5hdHRyKCd3aWR0aCcsIHdpZHRoKVxuICAgICAgICAuYXR0cignaGVpZ2h0JywgaGVpZ2h0KVxuICAgICAgICAuYXR0cigndmlld0JveCcsIHNyX3ZpZXdwb3J0KVxuICAgICAgICAuYXR0cigncHJlc2VydmVBc3BlY3RSYXRpbycsICd4TWlkWU1pZCBtZWV0JyksXG4gICAgLy9ncmlkICAgIFxuICAgIHJ3ID0gMjAsXG4gICAgcmggPSAyMCxcbiAgICByb3dOID0xLFxuICAgIGNvbE4gPTQ4LFxuICAgIC8vY29sb3JkZWZpbml0aW9uXG4gICAgbG9va3VwID0gWycjNDU0NTQ1JywnIzI5NkVBQScsJyM1NDkxQjUnLCcjNzlCRUZBJywnIzQ2QjBDRiddLFxuICAgIGhsb29rdXAgPSBbJyMwMDAwMDAnLCcjMDk0RThBJywnIzA5NEU4QScsJyMwOTRFOEEnLCcjMjY5MEFGJ10sXG4gICAgLy8gbG9va3VwID0gWycjNDU0NTQ1JywnIzI5NkVBQScsJyNENDNGM0EnLCcjNUNCODVDJywnIzQ2QjBDRiddLFxuICAgIC8vIGhsb29rdXAgPSBbJyMwMDAwMDAnLCcjMDk0RThBJywnI0E0MUYxQScsJyMzQzk4M0MnLCcjMjY5MEFGJ10sXG4gICAgcnJhbmdlID0gbG9va3VwLmxlbmd0aDtcblxuICAgIC8vIHJlc3BvbnNpdmUgY2hhbmdlXG4gICAgZDMuc2VsZWN0KHdpbmRvdylcbiAgICBcdC5vbihcInJlc2l6ZVwiLCAoKSA9PiB7XG4gICAgLy9sZXQgdGFyZ2V0V2lkdGggPSBzdmcubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoO1xuICAgIGxldCB3aW5XaWR0aCA9ICQod2luZG93KS53aWR0aCgpO1xuICAgIHN2Zy5hdHRyKFwid2lkdGhcIiwgd2luV2lkdGgpO1xuICB9KTtcblxuICAgIC8vIEJ1aWxkIEhUTUxcbiAgICAvL2NyZWF0ZUh0bWxUb25Db250cm9sKCcxJyk7XG5cblxuXHQvLyBSZWdpc3RlciBCdXR0b25zXG5cdHJlZ2lzdGVyQnV0dG9uKCk7XG5cdHJlZ2lzdGVyVG9uQnV0dG9uKCk7XG5cdHJlZ2lzdGVyQmxhY2tUb25CdXR0b24oKTtcblx0cmVnaXN0ZXJJbnB1dE9uQ2hhbmdlKCk7XG5cdGxldCBteWRhdGEgPSByZWRyYXcocmVhZElucHV0KCkpO1xuXHRyZW5kZXJHcmFwaChteWRhdGEpO1xuXHRyZWdpc3RlclBsYXlCdXR0b24oKTtcblx0cmVnaXN0ZXJTdG9wQnV0dG9uKCk7XG5cdC8vcmVnaXN0ZXJQYXJhbWV0ZXJCdXR0b24oKTtcblxuXHRcblxuLy9pb3MgaGFja1xuLy8gXHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCBmdW5jdGlvbigpIHtcblxuLy8gXHQvLyBjcmVhdGUgZW1wdHkgYnVmZmVyXG4vLyBcdHZhciBidWZmZXIgPSBhdWRpb0NvbnRleHQuY3JlYXRlQnVmZmVyKDEsIDEsIDIyMDUwKTtcbi8vIFx0dmFyIHNvdXJjZSA9IGF1ZGlvQ29udGV4dC5jcmVhdGVCdWZmZXJTb3VyY2UoKTtcbi8vIFx0c291cmNlLmJ1ZmZlciA9IGJ1ZmZlcjtcblxuLy8gXHQvLyBjb25uZWN0IHRvIG91dHB1dCAoeW91ciBzcGVha2Vycylcbi8vIFx0c291cmNlLmNvbm5lY3QoYXVkaW9Db250ZXh0LmRlc3RpbmF0aW9uKTtcblxuLy8gXHQvLyBwbGF5IHRoZSBmaWxlXG4vLyBcdHNvdXJjZS5ub3RlT24oMCk7XG5cbi8vIH0sIGZhbHNlKTtcblxuXG5cbi8vIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hzdGFydFwiLCBmdW5jdGlvbiAoKXtcdFxuLy8gXHRcdGlmIChoYWRfdG91Y2gpXHRcdHJldHVybjtcdFx0XG4vLyBcdFx0Ly8gcGxheSBlbXB0eSBidWZmZXIgdG8gdW5tdXRlIGF1ZGlvXHRcbi8vIFx0XHR2YXIgYnVmZmVyID0gYXVkaW9Db250ZXh0LmNyZWF0ZUJ1ZmZlcigxLCAxLCAyMjA1MCk7XHRcbi8vIFx0XHR2YXIgc291cmNlID0gYXVkaW9Db250ZXh0LmNyZWF0ZUJ1ZmZlclNvdXJjZSgpO1x0XG4vLyBcdFx0c291cmNlLmJ1ZmZlciA9IGJ1ZmZlcjtcdFxuLy8gXHRcdHNvdXJjZS5jb25uZWN0KGF1ZGlvQ29udGV4dC5kZXN0aW5hdGlvbik7XHRcbi8vIFx0XHRzb3VyY2Uuc3RhcnQoMCk7XHRcbi8vIFx0XHRoYWRfdG91Y2ggPSB0cnVlO1xuLy8gXHRcdGFsZXJ0KFwibWlzdFwiKTtcbi8vIFx0fSk7XG5cblxuXG5cblxufSk7XG5cblxuXG4iXX0=
