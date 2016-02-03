(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

$(document).ready(function () {
	// create HTML stuff
	var createHtmlTonControl = function createHtmlTonControl(nr) {
		var posnr = '1';

		var elContainer = 'ton-control-' + nr;
		var elOutDiv = document.createElement("DIV");
		elOutDiv.setAttribute("class", "col-xs-3");

		var elinputGroup = document.createElement("DIV");
		elinputGroup.setAttribute("class", "input-group-btn");
		elOutDiv.appendChild(elinputGroup);
		// BUTTON
		var textnode = document.createTextNode(" Zahl");
		var btn = document.createElement("BUTTON");
		var sid = 'btn-row' + nr + '-' + posnr;
		btn.setAttribute("id", sid);
		btn.setAttribute("class", "btn btn-info dropdown-toggle");
		btn.appendChild(textnode);
		elinputGroup.appendChild(btn);
		document.getElementById(elContainer).appendChild(elOutDiv);
	};

	//
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

	var readInput = function readInput() {
		var ids = getButtonIds();
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

	var registerInputOnChange = function registerInputOnChange() {
		var ids = getButtonIds();
		for (var i in ids) {
			$(ids[i]).parent().parent().children('input.form-control').change(function () {
				var newdata = redraw(readInput());
				updateGraph(newdata);
			});
		}
	};

	// Listen on Menu entry
	var registerButton = function registerButton() {
		var idArr = getButtonIds();
		var ec = jQuery.Event('change');

		var _loop = function _loop(i) {
			$(idArr[i]).parent().children('ul.dropdown-menu').on('click', function (e) {
				$(idArr[i]).parent().parent().children('input.form-control').attr('value', e.target.text)
				//send change event
				.trigger(ec);
			});
		};

		for (var i in idArr) {
			_loop(i);
		}
	};

	var registerPlayButton = function registerPlayButton() {
		$('#playmusicbtn').on('click', function (e) {

			if (audioContext === null) {
				try {
					window.AudioContext = window.AudioContext || window.webkitAudioContext;
					audioContext = new window.AudioContext();
				} catch (e) {
					console.log("No Web Audio API support");
				}
				var oscillator = audioContext.createOscillator();
				oscillator.frequency.value = 400;
				oscillator.connect(audioContext.destination);
				oscillator.start(0);
				oscillator.stop(.5);
			}
			runSeq = true;
			playMusic();
			//alert('here');
		});
		$('#playmusicbtn').on('touchend', function (e) {

			runSeq = true;
			playMusic();
			//alert('here');
		});
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
	tone0.instrumentNr = 0;
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
	tone1.instrumentNr = 1;
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
	tone2.instrumentNr = 2;
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
	tone3.instrumentNr = 3;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvc2NyaXB0cy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxFQUFFLFFBQUYsRUFBWSxLQUFaLENBQWtCLFlBQVU7O0FBRTVCLEtBQU0sdUJBQXVCLFNBQXZCLG9CQUF1QixDQUFDLEVBQUQsRUFBUTtBQUNwQyxNQUFNLFFBQVEsR0FBUixDQUQ4Qjs7QUFJcEMsTUFBSSxjQUFjLGlCQUFlLEVBQWYsQ0FKa0I7QUFLcEMsTUFBSSxXQUFXLFNBQVMsYUFBVCxDQUF1QixLQUF2QixDQUFYLENBTGdDO0FBTXBDLFdBQVMsWUFBVCxDQUFzQixPQUF0QixFQUErQixVQUEvQixFQU5vQzs7QUFRcEMsTUFBSSxlQUFlLFNBQVMsYUFBVCxDQUF1QixLQUF2QixDQUFmLENBUmdDO0FBU3BDLGVBQWEsWUFBYixDQUEwQixPQUExQixFQUFtQyxpQkFBbkMsRUFUb0M7QUFVcEMsV0FBUyxXQUFULENBQXFCLFlBQXJCOztBQVZvQyxNQVloQyxXQUFXLFNBQVMsY0FBVCxDQUF3QixPQUF4QixDQUFYLENBWmdDO0FBYXBDLE1BQUksTUFBTSxTQUFTLGFBQVQsQ0FBdUIsUUFBdkIsQ0FBTixDQWJnQztBQWNwQyxNQUFJLE1BQUksWUFBVSxFQUFWLEdBQWEsR0FBYixHQUFpQixLQUFqQixDQWQ0QjtBQWVwQyxNQUFJLFlBQUosQ0FBaUIsSUFBakIsRUFBdUIsR0FBdkIsRUFmb0M7QUFnQnBDLE1BQUksWUFBSixDQUFpQixPQUFqQixFQUEwQiw4QkFBMUIsRUFoQm9DO0FBaUJwQyxNQUFJLFdBQUosQ0FBZ0IsUUFBaEIsRUFqQm9DO0FBa0JwQyxlQUFhLFdBQWIsQ0FBeUIsR0FBekIsRUFsQm9DO0FBbUJwQyxXQUFTLGNBQVQsQ0FBd0IsV0FBeEIsRUFBcUMsV0FBckMsQ0FBaUQsUUFBakQsRUFuQm9DO0VBQVI7OztBQUZELEtBMkJ0QixjQUFjLFNBQWQsV0FBYyxDQUFD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RUFERixDQUNLLFFBREwsRUFDZSxZQUFNOztBQUVyQixNQUFJLFdBQVcsRUFBRSxNQUFGLEVBQVUsS0FBVixFQUFYLENBRmlCO0FBR3JCLE1BQUksSUFBSixDQUFTLE9BQVQsRUFBa0IsUUFBbEIsRUFIcUI7RUFBTixDQURmOzs7Ozs7QUE3Y3dCLGVBeWQzQixHQXpkMkI7QUEwZDNCLHlCQTFkMkI7QUEyZDNCLEtBQUksU0FBUyxPQUFPLFdBQVAsQ0FBVCxDQTNkdUI7QUE0ZDNCLGFBQVksTUFBWixFQTVkMkI7QUE2ZDNCLHNCQTdkMkI7QUE4ZDNCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Q0E5ZGlCLENBQWxCO0FBQTRCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG4vLyBjcmVhdGUgSFRNTCBzdHVmZlxuY29uc3QgY3JlYXRlSHRtbFRvbkNvbnRyb2wgPSAobnIpID0+IHtcblx0Y29uc3QgcG9zbnIgPSAnMSc7XG5cdFxuXG5cdGxldCBlbENvbnRhaW5lciA9ICd0b24tY29udHJvbC0nK25yO1xuXHRsZXQgZWxPdXREaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiRElWXCIpO1xuXHRlbE91dERpdi5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImNvbC14cy0zXCIpO1xuXHRcblx0bGV0IGVsaW5wdXRHcm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJESVZcIik7XG5cdGVsaW5wdXRHcm91cC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImlucHV0LWdyb3VwLWJ0blwiKTsgXG5cdGVsT3V0RGl2LmFwcGVuZENoaWxkKGVsaW5wdXRHcm91cCk7XG5cdC8vIEJVVFRPTlxuXHRsZXQgdGV4dG5vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIiBaYWhsXCIpOyBcblx0bGV0IGJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJCVVRUT05cIik7XG5cdGxldCBzaWQ9J2J0bi1yb3cnK25yKyctJytwb3Nucjtcblx0YnRuLnNldEF0dHJpYnV0ZShcImlkXCIsIHNpZCk7XG5cdGJ0bi5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImJ0biBidG4taW5mbyBkcm9wZG93bi10b2dnbGVcIik7XG5cdGJ0bi5hcHBlbmRDaGlsZCh0ZXh0bm9kZSk7XG5cdGVsaW5wdXRHcm91cC5hcHBlbmRDaGlsZChidG4pO1xuXHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlbENvbnRhaW5lcikuYXBwZW5kQ2hpbGQoZWxPdXREaXYpO1xuXG5cbn07XG5cbi8vIFxuY29uc3QgdXBkYXRlR3JhcGggPSAoZGF0YSkgPT4ge1xuXHRsZXQgZ3JwID0gc3ZnLnNlbGVjdEFsbCgnZycpXG5cdCAgICAuZGF0YShkYXRhKTtcblxuXHRsZXQgc2VsZWN0aW9uID0gZ3JwLnNlbGVjdEFsbCgncmVjdCcpLmRhdGEoKGQpID0+IGQpXG5cdFx0LmF0dHIoJ2ZpbGwnLCAoZCxpKSA9PiBsb29rdXBbZFsxXV0pO1xuXG5cdHNlbGVjdGlvbi5lbnRlcigpXG5cdFx0LmFwcGVuZCgncmVjdCcpXG5cdCAgICAuYXR0cigneCcsIChkLCBpKSA9PiAgMjggKiBpKVxuXHQgICAgLmF0dHIoJ3dpZHRoJywgcncpXG5cdCAgICAuYXR0cignaGVpZ2h0JywgcmgpO1xuXG5cdHNlbGVjdGlvbi5leGl0KCkucmVtb3ZlKCk7ICAgIFxufTtcblxuY29uc3QgcmVuZGVyR3JhcGggPSAoZGF0YSkgPT4ge1xuXHQvLyBDcmVhdGUgYSBncm91cCBmb3IgZWFjaCByb3cgaW4gdGhlIGRhdGEgbWF0cml4IGFuZFxuXHQvLyB0cmFuc2xhdGUgdGhlIGdyb3VwIHZlcnRpY2FsbHlcblx0bGV0IGdycCA9IHN2Zy5zZWxlY3RBbGwoJ2cnKVxuXHQgICAgLmRhdGEoZGF0YSlcblx0ICAgIC5lbnRlcigpXG5cdCAgICAuYXBwZW5kKCdnJylcblx0ICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAoZCwgaSkgPT4gJ3RyYW5zbGF0ZSgwLCAnICsgNTQgKiBpICsgJyknKTtcblxuXHQvLyBGb3IgZWFjaCBncm91cCwgY3JlYXRlIGEgc2V0IG9mIHJlY3RhbmdsZXMgYW5kIGJpbmQgXG5cdC8vIHRoZW0gdG8gdGhlIGlubmVyIGFycmF5ICh0aGUgaW5uZXIgYXJyYXkgaXMgYWxyZWFkeVxuXHQvLyBiaW5kZWQgdG8gdGhlIGdyb3VwKVxuXHRncnAuc2VsZWN0QWxsKCdyZWN0Jylcblx0ICAgIC5kYXRhKChkKSA9PiBkKVxuXHQgICAgLmVudGVyKClcblx0ICAgIC5hcHBlbmQoJ3JlY3QnKVxuXHQgICAgICAgIC5hdHRyKCd4JywgKGQsIGkpID0+ICAyOCAqIGkpXG5cdCAgICAgICAgLmF0dHIoJ2ZpbGwnLCAoZCxpKSA9PiBsb29rdXBbZFsxXV0pXG5cdCAgICAgICAgLmF0dHIoJ3dpZHRoJywgcncpXG5cdCAgICAgICAgLmF0dHIoJ2hlaWdodCcsIHJoKTsgICAgIFxuXG5cdC8vTW9kdWxvIDEwIHRpY2tzICAgICAgICBcblx0Z3JwLnNlbGVjdEFsbCgnbGluZScpXG5cdCAgICAuZGF0YSggKGQpID0+IGQpXG5cdCAgICAuZW50ZXIoKS5hcHBlbmQoJ2xpbmUnKVxuXHQgICAgLmZpbHRlcigoZCxpKSA9PiBpJTEwPT09MClcbiAgXHRcdFx0LmF0dHIoJ3gxJywgIChkLCBpKSA9PiAyODAgKiBpKzEpXG4gIFx0XHRcdC5hdHRyKCd5MScsIDIwKVxuICBcdFx0XHQuYXR0cigneDInLCAoZCwgaSkgPT4gMjgwICogaSsxKVxuICBcdFx0XHQuYXR0cigneTInLDQwKVxuICBcdFx0XHQuc3R5bGUoJ3N0cm9rZScsICdibGFjaycpXG4gIFx0XHRcdC5zdHlsZSgnc3Ryb2tlLXdpZHRoJywnMnB4Jyk7ICAgICAgXG5cbiAgXHQvLyBUZXh0IFxuICBcdGdycC5zZWxlY3RBbGwoJ3RleHQnKVxuXHQgICAgLmRhdGEoIChkKSA9PiBkKVxuXHQgICAgLmVudGVyKCkuYXBwZW5kKCd0ZXh0Jylcblx0ICAgIC5maWx0ZXIoKGQsaSkgPT4gaSUxMD09PTApXG5cdCAgICBcdC5hdHRyKCd4JywgKGQsIGkpID0+IHsgcmV0dXJuIDI4MCAqIGkrNTsgfSlcblx0ICAgIFx0LmF0dHIoJ3knLCAnMzgnKSAgXG5cdCAgICBcdC5hdHRyKCdmb250LWZhbWlseScsICdzYW5zLXNlcmlmJykgXG5cdCAgICBcdC50ZXh0KCAoZCwgaSxrKSA9PiBrKjQwK2kqMTArMSk7IFxufTtcblxuLy8gZ2V0IHZhbHVlc1xuY29uc3QgZ2V0QnV0dG9uSWRzID0gKCkgPT4gWycjYnRuLXJvdzEtMScsJyNidG4tcm93MS0yJywnI2J0bi1yb3cxLTMnLCcjYnRuLXJvdzEtNCddO1xuXG5jb25zdCByZWFkSW5wdXQgPSAoKSA9PiB7XG5cdGxldCBpZHMgPSBnZXRCdXR0b25JZHMoKTtcblx0bGV0IG91dCA9IFtdO1xuXHRmb3IgKGxldCBpIGluIGlkcykge1xuXHRcdGxldCBlbHZhbCA9ICQoaWRzW2ldKVxuXHRcdFx0XHRcdFx0LnBhcmVudCgpXG5cdFx0XHRcdFx0XHQucGFyZW50KClcblx0XHRcdFx0XHRcdC5jaGlsZHJlbignaW5wdXQnKVswXTtcblx0XHRsZXQgdmFsID0gMDtcblx0XHRpZiAodHlwZW9mIGVsdmFsICE9PSAndW5kZWZpbmVkJyl7XG5cdFx0XHR2YWwgPSBlbHZhbC52YWx1ZTtcblx0XHR9XG5cdFx0b3V0LnB1c2godmFsKTtcblx0fVxuXHRyZXR1cm4gb3V0O1xufTtcblxuLy8gUmVkcmF3IEdhbWVcbmNvbnN0IHJlZHJhdyA9IChpbnBzdHJhcnIpID0+IHtcblx0bGV0IGlucCA9IFtdO1xuXHQvLyBwYXJzZSBpbnB1dFxuXHRmb3IgKGxldCBpID0gMDsgaSA8IGlucHN0cmFyci5sZW5ndGg7IGkrKyl7XG5cdFx0aW5wLnB1c2gocGFyc2VJbnQoaW5wc3RyYXJyW2ldKSk7XG5cdH07XG5cbiAgICAvLyBpbml0IHZhbHVlc1xuXHRsZXQgdCA9IDEsIC8vIGNvdXQgdmFsdWVcblx0XHRkYXRhID0gW10sXG5cdFx0Y29sLFxuXHRcdG5leHRFdmVudCxcblx0XHR0bXAgPSAwO1xuXG5cdGZvciAobGV0IGkgPSAwOyBpIDwgaW5wLmxlbmd0aDsgaSsrKXtcblx0XHRjb2wgPSBpO1xuXHRcdG5leHRFdmVudCA9IGlucFtjb2xdO1xuXHRcdGlmIChuZXh0RXZlbnQgPiAwKXtcblx0XHRcdGJyZWFrO1xuXHRcdH1cblx0fVxuXG5cdGZvciAobGV0IGsgPSAwOyBrIDwgcm93TjsgayArPSAxKSB7XG5cdFx0bGV0IHJvdyA9IFtdO1xuXHRcdGRhdGEucHVzaChyb3cpO1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgY29sTjsgaSArPTEpe1xuXHRcdFx0aWYgKHQgPT09ICBuZXh0RXZlbnQpe1xuXHRcdFx0XHQvLyBqdW1wIG92ZXIgMCBjb2xvciBlbnRyaWVzXG5cdFx0XHRcdHRtcCA9IGNvbCsxOyAvLyBibGFjayBoYXMgaW5kZXggMFxuXHRcdFx0XHQvLyBpZiBzb21ldGhpbmcgaXMgemVybyBnbyBmdXJ0aGVyXG5cdFx0XHRcdHdoaWxlIChpbnBbKGNvbCsxKSVpbnAubGVuZ3RoXSA8IDEpe1xuXHRcdFx0XHRcdGNvbCA9IChjb2wrMSklaW5wLmxlbmd0aDtcblx0XHRcdFx0fVxuXHRcdFx0XHRuZXh0RXZlbnQgKz0gaW5wWyhjb2wrMSklaW5wLmxlbmd0aF07XG5cdFx0XHRcdGNvbCA9IChjb2wrMSklaW5wLmxlbmd0aDsgLy8gbmV4dCBjb2xvclxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dG1wID0gMDtcblx0XHRcdH1cblx0XHRcdHJvdy5wdXNoKFt0LCB0bXBdKTtcblx0XHRcdHQgPSB0ICsgMTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIGRhdGE7XG59O1xuXG5cbmNvbnN0IGhpZ2hsaWdodEVsICA9IChlbCxjb2wsdGltZSkgPT57XG4gICAkKGVsKS5hdHRyKCBcImZpbGxcIiwgaGxvb2t1cFtjb2xdKTtcbiAgIHNldFRpbWVvdXQoKCkgPT4geyQoZWwpLmF0dHIoIFwiZmlsbFwiLCBsb29rdXBbY29sXSk7fSx0aW1lKjEwMDApO1xuXG59O1xuXG5jb25zdCByZWdpc3RlcklucHV0T25DaGFuZ2UgPSAoKSA9PiB7XG5cdGxldCBpZHMgPSBnZXRCdXR0b25JZHMoKTtcblx0Zm9yIChsZXQgaSBpbiBpZHMpIHtcblx0XHQkKGlkc1tpXSlcblx0XHRcdC5wYXJlbnQoKVxuXHRcdFx0LnBhcmVudCgpXG5cdFx0XHQuY2hpbGRyZW4oJ2lucHV0LmZvcm0tY29udHJvbCcpXG5cdFx0XHQuY2hhbmdlKCgpID0+IHtcblx0XHRcdFx0bGV0IG5ld2RhdGEgPSByZWRyYXcocmVhZElucHV0KCkpO1xuXHRcdFx0XHR1cGRhdGVHcmFwaChuZXdkYXRhKTtcblx0XHRcdH0pO1xuXHR9XG59O1xuXG4vLyBMaXN0ZW4gb24gTWVudSBlbnRyeVxuY29uc3QgcmVnaXN0ZXJCdXR0b24gPSAoKSA9PiB7XG5cdGxldCBpZEFyciA9IGdldEJ1dHRvbklkcygpO1xuXHRsZXQgZWMgPSBqUXVlcnkuRXZlbnQoICdjaGFuZ2UnICk7XG4gICAgZm9yIChsZXQgaSBpbiBpZEFycikge1xuICAgIFx0JChpZEFycltpXSlcblx0XHRcdC5wYXJlbnQoKVxuXHRcdFx0LmNoaWxkcmVuKCd1bC5kcm9wZG93bi1tZW51Jylcblx0XHRcdC5vbignY2xpY2snLCAoZSkgPT4ge1xuXHRcdFx0XHQkKGlkQXJyW2ldKVxuXHRcdFx0XHQucGFyZW50KClcblx0XHRcdFx0LnBhcmVudCgpXG5cdFx0XHRcdC5jaGlsZHJlbignaW5wdXQuZm9ybS1jb250cm9sJylcblx0XHRcdFx0LmF0dHIoJ3ZhbHVlJyxlLnRhcmdldC50ZXh0KVxuXHRcdFx0XHQvL3NlbmQgY2hhbmdlIGV2ZW50XG5cdFx0XHRcdC50cmlnZ2VyKGVjKTtcblx0XHR9KTtcdFxuICAgIH1cbn07XG5cbmNvbnN0IHJlZ2lzdGVyUGxheUJ1dHRvbiA9ICgpID0+IHtcblx0JCgnI3BsYXltdXNpY2J0bicpLm9uKCdjbGljaycsIChlKSA9PiB7XG5cblx0XHRpZiAoYXVkaW9Db250ZXh0ID09PSBudWxsKXtcblx0XHRcdHRyeSB7XG4gICAgXHRcdFx0d2luZG93LkF1ZGlvQ29udGV4dCA9IHdpbmRvdy5BdWRpb0NvbnRleHQgfHwgd2luZG93LndlYmtpdEF1ZGlvQ29udGV4dDtcbiAgICBcdFx0XHRhdWRpb0NvbnRleHQgPSBuZXcgd2luZG93LkF1ZGlvQ29udGV4dCgpO1xuXHRcdFx0fSBjYXRjaCAoZSkge1xuICAgIFx0XHRcdGNvbnNvbGUubG9nKFwiTm8gV2ViIEF1ZGlvIEFQSSBzdXBwb3J0XCIpO1xuXHRcdFx0fVxuXHRcdFx0bGV0IG9zY2lsbGF0b3IgPSBhdWRpb0NvbnRleHQuY3JlYXRlT3NjaWxsYXRvcigpO1xuIFx0XHRcdFx0b3NjaWxsYXRvci5mcmVxdWVuY3kudmFsdWUgPSA0MDA7XG4gXHRcdFx0XHRvc2NpbGxhdG9yLmNvbm5lY3QoYXVkaW9Db250ZXh0LmRlc3RpbmF0aW9uKTtcbiBcdFx0XHRcdG9zY2lsbGF0b3Iuc3RhcnQoMCk7XG4gXHRcdFx0XHRvc2NpbGxhdG9yLnN0b3AoLjUpXG5cdFx0fVxuXHRcdHJ1blNlcSA9IHRydWU7XG5cdFx0cGxheU11c2ljKCk7XG5cdFx0Ly9hbGVydCgnaGVyZScpO1xuXHR9KTtcblx0JCgnI3BsYXltdXNpY2J0bicpLm9uKCd0b3VjaGVuZCcsIChlKSA9PiB7XG5cblx0XHRydW5TZXEgPSB0cnVlO1xuXHRcdHBsYXlNdXNpYygpO1xuXHRcdC8vYWxlcnQoJ2hlcmUnKTtcblx0fSk7XG59O1xuXG5jb25zdCByZWdpc3RlclN0b3BCdXR0b24gPSAoKSA9PiB7XG5cdCQoJyNzdG9wbXVzaWNidG4nKS5vbignY2xpY2snLCAoZSkgPT4ge1xuXHRcdHJ1blNlcSA9IGZhbHNlO1xuXHRcdC8vYWxlcnQoJ2hlcmUnKTtcblx0fSk7XG5cdC8vICQoJyNzdG9wbXVzaWNidG4nKS5vbigndG91Y2hlbmQnLCAoZSkgPT4ge1xuXHQvLyBcdHJ1blNlcSA9IGZhbHNlO1xuXHQvLyBcdC8vYWxlcnQoJ2hlcmUnKTtcblx0Ly8gfSk7XG59O1xuXG4vLyBjb25zdCByZWdpc3RlclBhcmFtZXRlckJ1dHRvbiA9ICgpID0+IHtcbi8vIFx0JCgnI3BhcmFtZXRlcmJ0bicpLm9uKCdjbGljaycsIChlKSA9PiB7XG4vLyBcdFx0bGV0IGVsID0gZDMuc2VsZWN0QWxsKCdyZWN0JylbMF1bNF07XG4vLyBcdFx0bGV0IHRpbWUgPSAwLjk7XG4vLyBcdFx0aGlnaGxpZ2h0RWwoZWwsMCx0aW1lKTtcbi8vIFx0fSk7XG4vLyB9O1xuXG5cbi8vIFBhcmFtZXRlciB3ZXJ0ZSBlaW5sZXNlblxuLy8gJCgnI3BhcmFPc3pidG4nKS5vbignY2xpY2snLCAoZSkgPT4ge1xuLy8gXHRsZXQgczIgPSAkKCdpbnB1dFtuYW1lPXNwZWVkXTpjaGVja2VkJywgJyNwYXJhbWV0ZXJNb2RhbCcpLnZhbCgpO1xuLy8gXHRsZXQgcyA9ICQoJ2lucHV0W25hbWU9b3N6Zm9ybV06Y2hlY2tlZCcsICcjcGFyYW1ldGVyTW9kYWwnKS52YWwoKTtcbi8vIFx0Ly9pZiAoISB0eXBlb2YgcyA9PT0gXCJ1bmRlZmluZWRcIiAmJiAhIHR5cGVvZiBzMiAgPT09IFwidW5kZWZpbmVkXCIpe1xuLy8gXHRpZiAoISBmYWxzZSl7XG4vLyBcdFx0b3NjaWxsYXRvclR5cGUgPSBzO1xuLy8gXHRcdHNvdW5kU3BlZWQgPSBwYXJzZUZsb2F0KHMyKTtcbi8vIFx0XHQkKCcjcGFyYW1ldGVyTW9kYWwnKS5tb2RhbCgnaGlkZScpO1xuLy8gXHR9XG4vLyB9KTtcblxuXG5cbi8vIFNvdW5kIERlZmluaXRpb25cblxuXG5jb25zdCBwbGF5U291bmQgPSAoc3RhcnRUaW1lLCBwaXRjaCwgZHVyYXRpb24sIGdhaW4pID0+IHtcblx0Ly9sZXQgc3RhcnRUaW1lID0gYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lICsgZGVsYXk7XG4gIFx0bGV0IGVuZFRpbWUgPSBzdGFydFRpbWUgKyBkdXJhdGlvbjtcblxuICBcdGxldCBvdXRnYWluID0gYXVkaW9Db250ZXh0LmNyZWF0ZUdhaW4oKTtcbiAgXHRvdXRnYWluLmdhaW4udmFsdWUgPSBnYWluO1xuICBcdG91dGdhaW4uY29ubmVjdChhdWRpb0NvbnRleHQuZGVzdGluYXRpb24pOyBcdFxuXG4gIFx0bGV0IGVudmVsb3BlID0gYXVkaW9Db250ZXh0LmNyZWF0ZUdhaW4oKTtcbiAgXHRlbnZlbG9wZS5jb25uZWN0KG91dGdhaW4pO1xuICBcdGVudmVsb3BlLmdhaW4udmFsdWUgPSAwO1xuICBcdFxuICBcdGVudmVsb3BlLmdhaW4uc2V0VGFyZ2V0QXRUaW1lKDEsIHN0YXJ0VGltZSwgZW52ZWxvcGVTdGFydEVuZFRpbWVbMF0pO1xuICBcdGVudmVsb3BlLmdhaW4uc2V0VGFyZ2V0QXRUaW1lKDAsIGVuZFRpbWUsIGVudmVsb3BlU3RhcnRFbmRUaW1lWzFdKTtcblxuICBcdGxldCBvc2NpbGxhdG9yID0gYXVkaW9Db250ZXh0LmNyZWF0ZU9zY2lsbGF0b3IoKTtcbiAgXHRvc2NpbGxhdG9yLmNvbm5lY3QoZW52ZWxvcGUpO1xuXG4gIFx0b3NjaWxsYXRvci50eXBlID0gb3NjaWxsYXRvclR5cGU7XG4gIFx0b3NjaWxsYXRvci5kZXR1bmUudmFsdWUgPSBwaXRjaCAqIDEwMDtcbiAgXHRvc2NpbGxhdG9yLmZyZXF1ZW5jeS52YWx1ZSA9IDI0MDtcblxuXHRsZXQgdmlicmF0byA9IGF1ZGlvQ29udGV4dC5jcmVhdGVHYWluKCk7XG5cdHZpYnJhdG8uZ2Fpbi52YWx1ZSA9IHZpYnJhdG9nYWluO1xuXHR2aWJyYXRvLmNvbm5lY3Qob3NjaWxsYXRvci5kZXR1bmUpO1xuXG5cdGxldCBsZm8gPSBhdWRpb0NvbnRleHQuY3JlYXRlT3NjaWxsYXRvcigpO1xuXHRsZm8uY29ubmVjdCh2aWJyYXRvKTtcblx0bGZvLmZyZXF1ZW5jeS52YWx1ZSA9bGZvZnJlcTsgXG5cblx0b3NjaWxsYXRvci5zdGFydChzdGFydFRpbWUpO1xuICBcdGxmby5zdGFydChzdGFydFRpbWUpO1xuICBcdG9zY2lsbGF0b3Iuc3RvcChlbmRUaW1lICsyICk7XG4gIFx0bGZvLnN0b3AoZW5kVGltZSArMik7XG5cbn07XG5cbi8vLyBQbGF5IExvb3BcbmNvbnN0IHJ1blNlcXVlbmNlcnMgPSAoKSA9PiB7XG5cdGlmICghcnVuU2VxIHx8IHNvdW5kUXVldWUubGVuZ3RoID09PSAwKXtjb25zb2xlLmxvZyhcInN0b3BcIik7cmV0dXJuO31cblx0bGV0IGN0ID0gYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lO1xuXHR3aGlsZSAoc291bmRRdWV1ZS5sZW5ndGg+MCAmJiBzb3VuZFF1ZXVlWzBdWzBdPCBjdCswLjE1KXtcblx0XHQvL2NvbnNvbGUubG9nKCdjdDonK2N0KydwbGFuZWQgdGltZTonK3NvdW5kUXVldWVbMF1bMF0pO1xuXHRcdGxldCB0b25lID0gc291bmRRdWV1ZS5zcGxpY2UoMCwxKTtcblx0XHQvLyBwbGF5c291bmQgKHN0YXJ0dGltZSwgcGl0Y2gsIGR1cmF0aW9uLCAgICAgICAgICAgICBnYWlpbilcblx0XHRwbGF5U291bmQodG9uZVswXVswXSxzb3VuZHNbdG9uZVswXVsxXV1bMF0sdG9uZVswXVsyXSxzb3VuZHNbdG9uZVswXVsxXV1bMl0pO1x0XHRcblx0XHQvLyBlbGVtZW50ICAgICAgICAgICAgICBjb2xvciAgICAgICBkdXJhdGlvblxuXHRcdGhpZ2hsaWdodEVsKHRvbmVbMF1bM10sdG9uZVswXVsxXSx0b25lWzBdWzJdKTtcblx0fVxuXHRzZXRUaW1lb3V0KHJ1blNlcXVlbmNlcnMsOTApO1xufVxuXG4vLy8gc291bmRzIHN0YXJ0IGhlcmVcbi8vLyBTb3VuZCB2YXJcbmxldCBydW5TZXEgPSB0cnVlO1xubGV0IHNvdW5kUXVldWUgPSBbXTtcblxudmFyIGF1ZGlvQ29udGV4dCA9IG51bGw7XG5cbnRyeSB7XG4gICB3aW5kb3cuQXVkaW9Db250ZXh0ID0gd2luZG93LkF1ZGlvQ29udGV4dHx8d2luZG93LndlYmtpdEF1ZGlvQ29udGV4dDtcbiAgIHZhciBhdWRpb0NvbnRleHQgPSBuZXcgQXVkaW9Db250ZXh0KCk7XG59IGNhdGNoIChlKSB7XG4gICAgY29uc29sZS5sb2coXCJObyBXZWIgQXVkaW8gQVBJIHN1cHBvcnRcIik7XG59XG5cblxuLy9JT1MgU3RhcnQgSU9TSEFDS1xuJCgnYm9keScpLm9uKCd0b3VjaGVuZCcsIChlKSA9PiB7XG5cdC8vYWxlcnQoJ3N0YXJ0IHNvdW5kXG5cdC8vIGNyZWF0ZSBlbXB0eSBidWZmZXJcblx0dmFyIGJ1ZmZlciA9IGF1ZGlvQ29udGV4dC5jcmVhdGVCdWZmZXIoMSwgMSwgMjIwNTApO1xuXHR2YXIgc291cmNlID0gYXVkaW9Db250ZXh0LmNyZWF0ZUJ1ZmZlclNvdXJjZSgpO1xuXHRzb3VyY2UuYnVmZmVyID0gYnVmZmVyO1xuXG5cdC8vIGNvbm5lY3QgdG8gb3V0cHV0ICh5b3VyIHNwZWFrZXJzKVxuXHRzb3VyY2UuY29ubmVjdChhdWRpb0NvbnRleHQuZGVzdGluYXRpb24pO1xuXG5cdC8vIHBsYXkgdGhlIGZpbGVcblx0aWYgKHR5cGVvZiBzb3VyY2Uubm90ZU9uICE9PSAndW5kZWZpbmVkJyl7XG5cdFx0c291cmNlLm5vdGVPbigwKTtcblx0fVxuXHRcblx0Ly8gdmFyIHNyYyA9IG51bGw7XG5cdC8vIHNyYyA9IGF1ZGlvQ29udGV4dC5jcmVhdGVPc2NpbGxhdG9yKCk7XG5cdC8vIHNyYy50eXBlID0gJ3NxdWFyZSc7XG5cdC8vIHNyYy5mcmVxdWVuY3kudmFsdWUgPSA0NDA7XG5cdC8vIHNyYy5jb25uZWN0KGF1ZGlvQ29udGV4dC5kZXN0aW5hdGlvbik7XG5cdC8vIGxldCBjdCA9IGF1ZGlvQ29udGV4dC5jdXJyZW50VGltZTtcblx0Ly8gc3JjLnN0YXJ0KGN0KzAuNSk7XG5cdC8vIHNyYy5zdG9wKGN0KzEuMik7XG59KTtcbi8vSU9TIEVORFxuXG5cbi8vIFNvdW5kIGNvbnN0YW5zdHMgcHJlc2V0c1xubGV0IHRvbmVzID0gW107XG5sZXQgdG9uZTAgPSB7fTtcblx0dG9uZTAubnIgPSAwO1xuXHR0b25lMC5nYWluID0gMC4zO1xuXHR0b25lMC52b2wgPSAnMzAlJztcblx0dG9uZTAuY29sb3IgPSAnIzQ1NDU0NSc7XG5cdHRvbmUwLmhvdmVyID0gJyMwMDAwMDAnO1xuXHR0b25lMC5pbnN0cnVtZW50ID0gJ0EnO1xuXHR0b25lMC5pbnN0cnVtZW50TnIgPSAwO1xuXHR0b25lMC5pZCA9ICdpZy1yb3cxLTAnO1xuXHR0b25lMC52aXNpYmxlID0gdHJ1ZTtcbnRvbmVzLnB1c2godG9uZTApO1xuXG5sZXQgdG9uZTEgPSB7fTtcblx0dG9uZTEubnIgPSAxO1xuXHR0b25lMS5nYWluID0gMC44O1xuXHR0b25lMS52b2wgPSAnODAlJztcblx0dG9uZTEuY29sb3IgPSAnIzI5NkVBQSc7XG5cdHRvbmUxLmhvdmVyID0gJyMwOTRFOEEnO1xuXHR0b25lMS5pbnN0cnVtZW50ID0gJ0InO1xuXHR0b25lMS5pbnN0cnVtZW50TnIgPSAxO1xuXHR0b25lMS5pZCA9ICdpZy1yb3cxLTEnO1xuXHR0b25lMS52aXNpYmxlID0gdHJ1ZTtcbnRvbmVzLnB1c2godG9uZTEpO1xuXG5sZXQgdG9uZTIgPSB7fTtcblx0dG9uZTIubnIgPSAyO1xuXHR0b25lMi5nYWluID0gMC4wO1xuXHR0b25lMi52b2wgPSAnMCUnO1xuXHR0b25lMi5jb2xvciA9ICcjNTQ5MUI1Jztcblx0dG9uZTIuaG92ZXIgPSAnIzA5NEU4QSc7XG5cdHRvbmUyLmluc3RydW1lbnQgPSAnQyc7XG5cdHRvbmUyLmluc3RydW1lbnROciA9IDI7XG5cdHRvbmUyLmlkID0gJ2lnLXJvdzEtMic7XG5cdHRvbmUyLnZpc2libGUgPSBmYWxzZTtcbnRvbmVzLnB1c2godG9uZTIpO1xuXG5sZXQgdG9uZTMgPSB7fTtcblx0dG9uZTMubnIgPSAzO1xuXHR0b25lMy5nYWluID0gMC4wO1xuXHR0b25lMy52b2wgPSAnMCUnO1xuXHR0b25lMy5jb2xvciA9ICcjNTQ5MUI1Jztcblx0dG9uZTMuaG92ZXIgPSAnIzA5NEU4QSc7XG5cdHRvbmUzLmluc3RydW1lbnQgPSAnRCc7XG5cdHRvbmUzLmluc3RydW1lbnROciA9IDM7XG5cdHRvbmUzLmlkID0gJ2lnLXJvdzEtMyc7XG5cdHRvbmUzLnZpc2libGUgPSB0cnVlO1xudG9uZXMucHVzaCh0b25lMyk7XG5cblxubGV0IHNvdW5kU3BlZWQgPSAwLjU7XG5sZXQgdG9uZWR1cmF0aW9uID0gMC4zO1xubGV0IHZpYnJhdG9nYWluID0gMC4zO1xubGV0IGVudmVsb3BlU3RhcnRFbmRUaW1lID0gWzAuMDEsMC4xXTtcbmxldCBsZm9mcmVxID0gNjsgIC8vNVxuLy8gUGFyYW1ldHJpemF0aW9uIG9mIHRoZSA1IHRvbmVzICBQaXRjaCBkdXJhdGlvbiB2b2x1bWUgZ2FpblxuY29uc3Qgc291bmRzID0gW1stMTAsIDAuNSwwLjFdLFszLCAwLjUsMC45XSxbMTAsIDAuNSwwLjldLFsxNSwgMC41LDAuOV0sWzAsIDAuNSwwLjldXTtcbmxldCBvc2NpbGxhdG9yVHlwZSA9ICdzYXd0b290aCc7IC8vJ3NpbmUnOyAvLyAnc2F3dG9vdGgnXG5cblxuLy8vIFNvdW5kIE1ldGhvZHNcbmNvbnN0IHBsYXlNdXNpYyA9ICgpID0+IHtcblx0Ly8gZmlsbCBzb3VuZFF1ZXVlXHRcblx0bGV0IHJlY3RhcnIgPSBkMy5zZWxlY3RBbGwoJ3JlY3QnKS5kYXRhKCk7XG5cdGxldCBlbGFyciA9IGQzLnNlbGVjdEFsbCgncmVjdCcpWzBdO1xuICAgIGxldCBzdGFydFRpbWUgPSBhdWRpb0NvbnRleHQuY3VycmVudFRpbWU7XG4gICAgLy9jb25zb2xlLmxvZygnU3RhcnQnK3N0YXJ0VGltZSk7XG4gICAgc291bmRRdWV1ZSA9W107XG5cdGZvciAobGV0IGk9MDsgaSA8IHJlY3RhcnIubGVuZ3RoOyBpKyspIHtcblx0XHRsZXQgdiA9IHJlY3RhcnJbaV1bMV07XG5cdFx0Ly9wbGF5U291bmQoaSxzb3VuZHNbdl1bMF0sc291bmRzW3ZdWzFdLHNvdW5kc1t2XVsyXSk7XG5cdFx0Ly9hbGVydChpKTtcblx0XHRsZXQgdG1wID0gW107XG5cdFx0dG1wLnB1c2goaSpzb3VuZFNwZWVkK3N0YXJ0VGltZSk7XG5cdFx0dG1wLnB1c2godik7XG5cdFx0dG1wLnB1c2godG9uZWR1cmF0aW9uKTtcblx0XHR0bXAucHVzaChlbGFycltpXSk7XG5cdFx0c291bmRRdWV1ZS5wdXNoKHRtcCk7XG5cdH1cblx0Ly9jb25zb2xlLmxvZygnc3RhcnRzZXF1ZW5jZXInK2F1ZGlvQ29udGV4dC5jdXJyZW50VGltZSk7XG4gICAgcnVuU2VxdWVuY2VycygpO1xufTtcblxuLy8gSW5pdCBTY3JlZW5cblx0Y29uc3Qgd2lkdGggPSAxMjgwLFxuICAgIGhlaWdodCA9IDQ1O1xuICAgIGxldCBzcl92aWV3cG9ydCA9ICcwIDAgJysod2lkdGgrNjApKycgJytoZWlnaHQ7XG4gICAgY29uc3QgZGl2ID0gZDMuc2VsZWN0KCcjY2hhcnQnKSxcbiAgICBzdmcgPSBkaXYuYXBwZW5kKCdzdmcnKVxuICAgICAgICAuYXR0cignd2lkdGgnLCB3aWR0aClcbiAgICAgICAgLmF0dHIoJ2hlaWdodCcsIGhlaWdodClcbiAgICAgICAgLmF0dHIoJ3ZpZXdCb3gnLCBzcl92aWV3cG9ydClcbiAgICAgICAgLmF0dHIoJ3ByZXNlcnZlQXNwZWN0UmF0aW8nLCAneE1pZFlNaWQgbWVldCcpLFxuICAgIC8vZ3JpZCAgICBcbiAgICBydyA9IDIwLFxuICAgIHJoID0gMjAsXG4gICAgcm93TiA9MSxcbiAgICBjb2xOID00OCxcbiAgICAvL2NvbG9yZGVmaW5pdGlvblxuICAgIGxvb2t1cCA9IFsnIzQ1NDU0NScsJyMyOTZFQUEnLCcjNTQ5MUI1JywnIzc5QkVGQScsJyM0NkIwQ0YnXSxcbiAgICBobG9va3VwID0gWycjMDAwMDAwJywnIzA5NEU4QScsJyMwOTRFOEEnLCcjMDk0RThBJywnIzI2OTBBRiddLFxuICAgIC8vIGxvb2t1cCA9IFsnIzQ1NDU0NScsJyMyOTZFQUEnLCcjRDQzRjNBJywnIzVDQjg1QycsJyM0NkIwQ0YnXSxcbiAgICAvLyBobG9va3VwID0gWycjMDAwMDAwJywnIzA5NEU4QScsJyNBNDFGMUEnLCcjM0M5ODNDJywnIzI2OTBBRiddLFxuICAgIHJyYW5nZSA9IGxvb2t1cC5sZW5ndGg7XG5cbiAgICAvLyByZXNwb25zaXZlIGNoYW5nZVxuICAgIGQzLnNlbGVjdCh3aW5kb3cpXG4gICAgXHQub24oXCJyZXNpemVcIiwgKCkgPT4ge1xuICAgIC8vbGV0IHRhcmdldFdpZHRoID0gc3ZnLm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aDtcbiAgICBsZXQgd2luV2lkdGggPSAkKHdpbmRvdykud2lkdGgoKTtcbiAgICBzdmcuYXR0cihcIndpZHRoXCIsIHdpbldpZHRoKTtcbiAgfSk7XG5cbiAgICAvLyBCdWlsZCBIVE1MXG4gICAgLy9jcmVhdGVIdG1sVG9uQ29udHJvbCgnMScpO1xuXG5cblx0Ly8gUmVnaXN0ZXIgQnV0dG9uc1xuXHRyZWdpc3RlckJ1dHRvbigpO1xuXHRyZWdpc3RlcklucHV0T25DaGFuZ2UoKTtcblx0bGV0IG15ZGF0YSA9IHJlZHJhdyhyZWFkSW5wdXQoKSk7XG5cdHJlbmRlckdyYXBoKG15ZGF0YSk7XG5cdHJlZ2lzdGVyUGxheUJ1dHRvbigpO1xuXHRyZWdpc3RlclN0b3BCdXR0b24oKTtcblx0Ly9yZWdpc3RlclBhcmFtZXRlckJ1dHRvbigpO1xuXG5cdFxuXG4vL2lvcyBoYWNrXG4vLyBcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIGZ1bmN0aW9uKCkge1xuXG4vLyBcdC8vIGNyZWF0ZSBlbXB0eSBidWZmZXJcbi8vIFx0dmFyIGJ1ZmZlciA9IGF1ZGlvQ29udGV4dC5jcmVhdGVCdWZmZXIoMSwgMSwgMjIwNTApO1xuLy8gXHR2YXIgc291cmNlID0gYXVkaW9Db250ZXh0LmNyZWF0ZUJ1ZmZlclNvdXJjZSgpO1xuLy8gXHRzb3VyY2UuYnVmZmVyID0gYnVmZmVyO1xuXG4vLyBcdC8vIGNvbm5lY3QgdG8gb3V0cHV0ICh5b3VyIHNwZWFrZXJzKVxuLy8gXHRzb3VyY2UuY29ubmVjdChhdWRpb0NvbnRleHQuZGVzdGluYXRpb24pO1xuXG4vLyBcdC8vIHBsYXkgdGhlIGZpbGVcbi8vIFx0c291cmNlLm5vdGVPbigwKTtcblxuLy8gfSwgZmFsc2UpO1xuXG5cblxuLy8gd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaHN0YXJ0XCIsIGZ1bmN0aW9uICgpe1x0XG4vLyBcdFx0aWYgKGhhZF90b3VjaClcdFx0cmV0dXJuO1x0XHRcbi8vIFx0XHQvLyBwbGF5IGVtcHR5IGJ1ZmZlciB0byB1bm11dGUgYXVkaW9cdFxuLy8gXHRcdHZhciBidWZmZXIgPSBhdWRpb0NvbnRleHQuY3JlYXRlQnVmZmVyKDEsIDEsIDIyMDUwKTtcdFxuLy8gXHRcdHZhciBzb3VyY2UgPSBhdWRpb0NvbnRleHQuY3JlYXRlQnVmZmVyU291cmNlKCk7XHRcbi8vIFx0XHRzb3VyY2UuYnVmZmVyID0gYnVmZmVyO1x0XG4vLyBcdFx0c291cmNlLmNvbm5lY3QoYXVkaW9Db250ZXh0LmRlc3RpbmF0aW9uKTtcdFxuLy8gXHRcdHNvdXJjZS5zdGFydCgwKTtcdFxuLy8gXHRcdGhhZF90b3VjaCA9IHRydWU7XG4vLyBcdFx0YWxlcnQoXCJtaXN0XCIpO1xuLy8gXHR9KTtcblxuXG5cblxuXG59KTtcblxuXG5cbiJdfQ==
