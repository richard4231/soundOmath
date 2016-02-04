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
	var updateGraph = function updateGraph(data, svg, lookup) {
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

	var renderGraph = function renderGraph(data, svg, lookup) {
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
	//const getButtonIds = () => ['#btn-row1-1','#btn-row1-2','#btn-row1-3','#btn-row1-4'];

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
				var tmp = parseInt(e.target.parentElement.parentElement.getAttribute('nr'));
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

	// Register Volumen button
	var registerVolumeButton = function registerVolumeButton() {
		var ids = [];
		// TODO use as parameter later
		var row = 1;
		var s = '';

		for (var i = 1; i < 4; i++) {
			s = '#btn-row' + row + '-' + i + '-volume';
			ids.push(s);
		}
		// let ec = jQuery.Event( 'change' );

		var _loop4 = function _loop4(i) {
			$(ids[i]).parent().children('ul.dropdown-menu').on('click', function (e) {
				$(ids[i]).parent().parent().children('input.form-control:eq( 2 )').attr('value', e.target.text);

				// do parameter change
				// index have to survive :)
				var tmp = parseInt(e.target.parentElement.parentElement.getAttribute('nr'));

				tones[tmp].vol = e.target.text;
				tones[tmp].gain = parseInt(e.target.text) * 1.0 / 100;
				//send change event
				//.trigger(ec);
			});
		};

		for (var i in ids) {
			_loop4(i);
		}
	};

	var registerBlackVolumeButton = function registerBlackVolumeButton() {
		var ids = [];
		// TODO use as parameter later
		var row = 1;
		var s = '#btn-row1-0-volume';
		ids.push(s);

		// let ec = jQuery.Event( 'change' );

		var _loop5 = function _loop5(i) {
			$(ids[i]).parent().children('ul.dropdown-menu').on('click', function (e) {
				$(ids[i]).parent().parent().children('input.form-control:eq( 1 )').attr('value', e.target.text);

				tones[0].vol = e.target.text;
				tones[0].gain = parseInt(e.target.text) * 1.0 / 100;

				// do parameter change

				//send change event
				//.trigger(ec);
			});
		};

		for (var i in ids) {
			_loop5(i);
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

	var playSound = function playSound(startTime, pitchNr, duration, gainOld) {
		//let startTime = audioContext.currentTime + delay;
		var endTime = startTime + duration;
		var pitch = sounds[pitchNr][0];
		var gain = tones[pitchNr].gain;

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
			var item = soundQueue.splice(0, 1);
			// playsound (starttime, pitch, duration,             gaiin)
			//playSound(item[0][0],sounds[item[0][1]][0],item[0][2],tones[item[0][1]].gain);		

			playSound(item[0][0], item[0][1], item[0][2], tones[item[0][1]].gain);
			// element              color       duration
			highlightEl(item[0][3], item[0][1], item[0][2]);
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
	var tones = [{
		'nr': 0,
		'gain': 0.1,
		'vol': '10%',
		'color': '#454545',
		'hover': '#000000',
		'instrument': 'D3',
		'id': 'ig-row1-0',
		'visible': true
	}, {
		'nr': 1,
		'gain': 0.8,
		'vol': '80%',
		'color': '#296EAA',
		'hover': '#094E8A',
		'instrument': 'E3',
		'id': 'ig-row1-1',
		'visible': true
	}, {
		'nr': 2,
		'gain': 0.0,
		'vol': '0%',
		'color': '#5491B5',
		'hover': '#094E8A',
		'instrument': 'F3',
		'id': 'ig-row1-2',
		'visible': false
	}, {
		'nr': 3,
		'gain': 0.0,
		'vol': '0%',
		'color': '#5491B5',
		'hover': '#094E8A',
		'instrument': 'G3',
		'id': 'ig-row1-3',
		'visible': false
	}];

	// sounds
	var notes = {
		'D3': {
			'freq': 440,
			'detune': -700
		},
		'E3': {
			'freq': 440,
			'detune': -500
		},
		'F3': {
			'freq': 440,
			'detune': -400
		},
		'G3': {
			'freq': 440,
			'detune': -200
		},
		'A4': {
			'freq': 440,
			'detune': 0
		},
		'B4': {
			'freq': 440,
			'detune': 200
		},
		'C4': {
			'freq': 440,
			'detune': 300
		},
		'D4': {
			'freq': 440,
			'detune': 500
		},
		'E4': {
			'freq': 440,
			'detune': 700
		},
		'F4': {
			'freq': 440,
			'detune': 800
		},
		'G4': {
			'freq': 440,
			'detune': 1000
		}
	};

	var soundSpeed = 0.5;
	var toneduration = 0.3;
	var vibratogain = 0.3;
	var envelopeStartEndTime = [0.01, 0.1];
	var lfofreq = 6; //5
	// Parametrization of the 5 tones  Pitch duration volume gain
	// Debricated to be removed
	// first ist black sound
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
	var initd3js = function initd3js(elId) {
		var width = 1280,
		    height = 45;
		var sr_viewport = '0 0 ' + (width + 70) + ' ' + height;
		var div = d3.select(elId),
		    svg = div.append('svg').attr('width', width).attr('height', height).attr('viewBox', sr_viewport).attr('preserveAspectRatio', 'xMidYMid meet');
		// responsive change
		d3.select(window).on("resize", function () {
			//let targetWidth = svg.node().getBoundingClientRect().width;
			var winWidth = $(window).width();
			svg.attr("width", winWidth);
		});

		return svg;
	};

	// Constants

	var rw = 20,
	    rh = 20,
	    rowN = 1,
	    colN = 48,
	   
	//colordefinition
	lookupblue = ['#454545', '#296EAA', '#5491B5', '#79BEFA', '#46B0CF'],
	    hlookup = ['#000000', '#094E8A', '#094E8A', '#094E8A', '#2690AF'];
	// lookup = ['#454545','#296EAA','#D43F3A','#5CB85C','#46B0CF'],
	// hlookup = ['#000000','#094E8A','#A41F1A','#3C983C','#2690AF'],
	//rrange = lookup.length;

	// bind data and render d3js
	var svg = initd3js('#chart');
	var mydata = redraw(readInput());
	renderGraph(mydata, svg, lookupblue);

	var svggreen = initd3js('#chart-2');
	var mydataGreen = redraw(readInput());
	renderGraph(mydataGreen, svggreen, lookupblue);

	var svgred = initd3js('#chart-3');
	var mydataRed = redraw(readInput());
	renderGraph(mydataRed, svgred, lookupblue);

	// Register Buttons
	registerButton();
	registerTonButton();
	registerBlackTonButton();
	registerInputOnChange();
	registerVolumeButton();
	registerBlackVolumeButton();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvc2NyaXB0cy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxFQUFFLFFBQUYsRUFBWSxLQUFaLENBQWtCLFlBQVU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEyQjVCLEtBQU0sY0FBYyxTQUFkLFdBQWMsQ0FBQyxJQUFELEVBQU0sR0FBTixFQUFVLE1BQVYsRUFBcUI7QUFDeEMsTUFBSSxNQUFNLElBQUksU0FBSixDQUFjLEdBQWQsRUFDTCxJQURLLENBQ0EsSUFEQSxDQUFOLENBRG9DOztBQUl4QyxNQUFJLFlBQVksSUFBSSxTQUFKLENBQWMsTUFBZCxFQUFzQixJQUF0QixDQUEyQixVQUFDLENBQUQ7VUFBTztHQUFQLENBQTNCLENBQ2QsSUFEYyxDQUNULE1BRFMsRUFDRCxVQUFDLENBQUQsRUFBRyxDQUFIO1VBQVMsT0FBTyxFQUFFLENBQUYsQ0FBUDtHQUFULENBRFgsQ0FKb0M7O0FBT3hDLFlBQVUsS0FBVixHQUNFLE1BREYsQ0FDUyxNQURULEVBRUssSUFGTCxDQUVVLEdBRlYsRUFFZSxVQUFDLENBQUQsRUFBSSxDQUFKO1VBQVcsS0FBSyxDQUFMO0dBQVgsQ0FGZixDQUdLLElBSEwsQ0FHVSxPQUhWLEVBR21CLEVBSG5CLEVBSUssSUFKTCxDQUlVLFFBSlYsRUFJb0IsRUFKcEIsRUFQd0M7O0FBYXhDLFlBQVUsSUFBVixHQUFpQixNQUFqQixHQWJ3QztFQUFyQixDQTNCUTs7QUEyQzVCLEtBQU0sY0FBYyxTQUFkLFdBQWMsQ0FBQyxJQUFELEVBQU0sR0FBTixFQUFVLE1BQVYsRUFBcUI7OztBQUd4QyxNQUFJLE1BQU0sSUFBSSxTQUFKLENBQWMsR0FBZCxFQUNMLElBREssQ0FDQSxJQURBLEVBRUwsS0FGSyxHQUdMLE1BSEssQ0FHRSxHQUhGLEVBSUwsSUFKSyxDQUlBLFdBSkEsRUFJYSxVQUFDLENBQUQsRUFBSSxDQUFKO1VBQVUs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QixFQUErQixTQUEvQixFQUF5QyxTQUF6QyxDQUFiO0tBQ0EsVUFBVSxDQUFDLFNBQUQsRUFBVyxTQUFYLEVBQXFCLFNBQXJCLEVBQStCLFNBQS9CLEVBQXlDLFNBQXpDLENBQVY7Ozs7OztBQWpxQndCLEtBdXFCbEIsTUFBTSxTQUFTLFFBQVQsQ0FBTixDQXZxQmtCO0FBd3FCeEIsS0FBSSxTQUFTLE9BQU8sV0FBUCxDQUFULENBeHFCb0I7QUF5cUIzQixhQUFZLE1BQVosRUFBbUIsR0FBbkIsRUFBdUIsVUFBdkIsRUF6cUIyQjs7QUEycUJ4QixLQUFNLFdBQVcsU0FBUyxVQUFULENBQVgsQ0EzcUJrQjtBQTRxQnhCLEtBQUksY0FBYyxPQUFPLFdBQVAsQ0FBZCxDQTVxQm9CO0FBNnFCM0IsYUFBWSxXQUFaLEVBQXdCLFFBQXhCLEVBQWlDLFVBQWpDLEVBN3FCMkI7O0FBK3FCeEIsS0FBTSxTQUFTLFNBQVMsVUFBVCxDQUFULENBL3FCa0I7QUFnckJ4QixLQUFJLFlBQVksT0FBTyxXQUFQLENBQVosQ0FockJvQjtBQWlyQjNCLGFBQVksU0FBWixFQUFzQixNQUF0QixFQUE2QixVQUE3Qjs7O0FBanJCMkIsZUFxckIzQixHQXJyQjJCO0FBc3JCM0IscUJBdHJCMkI7QUF1ckIzQiwwQkF2ckIyQjtBQXdyQjNCLHlCQXhyQjJCO0FBeXJCM0Isd0JBenJCMkI7QUEwckIzQiw2QkExckIyQjtBQTJyQjNCLHNCQTNyQjJCO0FBNHJCM0I7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztDQTVyQmlCLENBQWxCO0FBQTRCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG4vLyBjcmVhdGUgSFRNTCBzdHVmZlxuLy8gY29uc3QgY3JlYXRlSHRtbFRvbkNvbnRyb2wgPSAobnIpID0+IHtcbi8vIFx0Y29uc3QgcG9zbnIgPSAnMSc7XG5cdFxuXG4vLyBcdGxldCBlbENvbnRhaW5lciA9ICd0b24tY29udHJvbC0nK25yO1xuLy8gXHRsZXQgZWxPdXREaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiRElWXCIpO1xuLy8gXHRlbE91dERpdi5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImNvbC14cy0zXCIpO1xuXHRcbi8vIFx0bGV0IGVsaW5wdXRHcm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJESVZcIik7XG4vLyBcdGVsaW5wdXRHcm91cC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImlucHV0LWdyb3VwLWJ0blwiKTsgXG4vLyBcdGVsT3V0RGl2LmFwcGVuZENoaWxkKGVsaW5wdXRHcm91cCk7XG4vLyBcdC8vIEJVVFRPTlxuLy8gXHRsZXQgdGV4dG5vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIiBaYWhsXCIpOyBcbi8vIFx0bGV0IGJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJCVVRUT05cIik7XG4vLyBcdGxldCBzaWQ9J2J0bi1yb3cnK25yKyctJytwb3Nucjtcbi8vIFx0YnRuLnNldEF0dHJpYnV0ZShcImlkXCIsIHNpZCk7XG4vLyBcdGJ0bi5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImJ0biBidG4taW5mbyBkcm9wZG93bi10b2dnbGVcIik7XG4vLyBcdGJ0bi5hcHBlbmRDaGlsZCh0ZXh0bm9kZSk7XG4vLyBcdGVsaW5wdXRHcm91cC5hcHBlbmRDaGlsZChidG4pO1xuLy8gXHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlbENvbnRhaW5lcikuYXBwZW5kQ2hpbGQoZWxPdXREaXYpO1xuXG5cbi8vIH07XG5cbi8vIEQzSlNcbmNvbnN0IHVwZGF0ZUdyYXBoID0gKGRhdGEsc3ZnLGxvb2t1cCkgPT4ge1xuXHRsZXQgZ3JwID0gc3ZnLnNlbGVjdEFsbCgnZycpXG5cdCAgICAuZGF0YShkYXRhKTtcblxuXHRsZXQgc2VsZWN0aW9uID0gZ3JwLnNlbGVjdEFsbCgncmVjdCcpLmRhdGEoKGQpID0+IGQpXG5cdFx0LmF0dHIoJ2ZpbGwnLCAoZCxpKSA9PiBsb29rdXBbZFsxXV0pO1xuXG5cdHNlbGVjdGlvbi5lbnRlcigpXG5cdFx0LmFwcGVuZCgncmVjdCcpXG5cdCAgICAuYXR0cigneCcsIChkLCBpKSA9PiAgMjggKiBpKVxuXHQgICAgLmF0dHIoJ3dpZHRoJywgcncpXG5cdCAgICAuYXR0cignaGVpZ2h0JywgcmgpO1xuXG5cdHNlbGVjdGlvbi5leGl0KCkucmVtb3ZlKCk7ICAgIFxufTtcblxuY29uc3QgcmVuZGVyR3JhcGggPSAoZGF0YSxzdmcsbG9va3VwKSA9PiB7XG5cdC8vIENyZWF0ZSBhIGdyb3VwIGZvciBlYWNoIHJvdyBpbiB0aGUgZGF0YSBtYXRyaXggYW5kXG5cdC8vIHRyYW5zbGF0ZSB0aGUgZ3JvdXAgdmVydGljYWxseVxuXHRsZXQgZ3JwID0gc3ZnLnNlbGVjdEFsbCgnZycpXG5cdCAgICAuZGF0YShkYXRhKVxuXHQgICAgLmVudGVyKClcblx0ICAgIC5hcHBlbmQoJ2cnKVxuXHQgICAgLmF0dHIoJ3RyYW5zZm9ybScsIChkLCBpKSA9PiAndHJhbnNsYXRlKDAsICcgKyA1NCAqIGkgKyAnKScpO1xuXG5cdC8vIEZvciBlYWNoIGdyb3VwLCBjcmVhdGUgYSBzZXQgb2YgcmVjdGFuZ2xlcyBhbmQgYmluZCBcblx0Ly8gdGhlbSB0byB0aGUgaW5uZXIgYXJyYXkgKHRoZSBpbm5lciBhcnJheSBpcyBhbHJlYWR5XG5cdC8vIGJpbmRlZCB0byB0aGUgZ3JvdXApXG5cdGdycC5zZWxlY3RBbGwoJ3JlY3QnKVxuXHQgICAgLmRhdGEoKGQpID0+IGQpXG5cdCAgICAuZW50ZXIoKVxuXHQgICAgLmFwcGVuZCgncmVjdCcpXG5cdCAgICAgICAgLmF0dHIoJ3gnLCAoZCwgaSkgPT4gIDI4ICogaSlcblx0ICAgICAgICAuYXR0cignZmlsbCcsIChkLGkpID0+IGxvb2t1cFtkWzFdXSlcblx0ICAgICAgICAuYXR0cignd2lkdGgnLCBydylcblx0ICAgICAgICAuYXR0cignaGVpZ2h0JywgcmgpOyAgICAgXG5cblx0Ly9Nb2R1bG8gMTAgdGlja3MgICAgICAgIFxuXHRncnAuc2VsZWN0QWxsKCdsaW5lJylcblx0ICAgIC5kYXRhKCAoZCkgPT4gZClcblx0ICAgIC5lbnRlcigpLmFwcGVuZCgnbGluZScpXG5cdCAgICAuZmlsdGVyKChkLGkpID0+IGklMTA9PT0wKVxuICBcdFx0XHQuYXR0cigneDEnLCAgKGQsIGkpID0+IDI4MCAqIGkrMSlcbiAgXHRcdFx0LmF0dHIoJ3kxJywgMjApXG4gIFx0XHRcdC5hdHRyKCd4MicsIChkLCBpKSA9PiAyODAgKiBpKzEpXG4gIFx0XHRcdC5hdHRyKCd5MicsNDApXG4gIFx0XHRcdC5zdHlsZSgnc3Ryb2tlJywgJ2JsYWNrJylcbiAgXHRcdFx0LnN0eWxlKCdzdHJva2Utd2lkdGgnLCcycHgnKTsgICAgICBcblxuICBcdC8vIFRleHQgXG4gIFx0Z3JwLnNlbGVjdEFsbCgndGV4dCcpXG5cdCAgICAuZGF0YSggKGQpID0+IGQpXG5cdCAgICAuZW50ZXIoKS5hcHBlbmQoJ3RleHQnKVxuXHQgICAgLmZpbHRlcigoZCxpKSA9PiBpJTEwPT09MClcblx0ICAgIFx0LmF0dHIoJ3gnLCAoZCwgaSkgPT4geyByZXR1cm4gMjgwICogaSs1OyB9KVxuXHQgICAgXHQuYXR0cigneScsICczOCcpICBcblx0ICAgIFx0LmF0dHIoJ2ZvbnQtZmFtaWx5JywgJ3NhbnMtc2VyaWYnKSBcblx0ICAgIFx0LnRleHQoIChkLCBpLGspID0+IGsqNDAraSoxMCsxKTsgXG59O1xuXG4vLyBnZXQgdmFsdWVzXG4vL2NvbnN0IGdldEJ1dHRvbklkcyA9ICgpID0+IFsnI2J0bi1yb3cxLTEnLCcjYnRuLXJvdzEtMicsJyNidG4tcm93MS0zJywnI2J0bi1yb3cxLTQnXTtcblxuLy8gcmVhZHMgUGFyYW1ldGVyIFRvbiBaYWhsIGZvciByb3cgb25lXG5jb25zdCByZWFkSW5wdXQgPSAoKSA9PiB7XG5cdGxldCBpZHMgPSBbXTtcblx0Ly8gVE9ETyB1c2UgYXMgcGFyYW1ldGVyIGxhdGVyXG5cdGxldCByb3cgPSAxO1xuXHRsZXQgcz0nJztcblx0Zm9yIChsZXQgaSA9IDE7IGkgPCA0OyBpKyspe1xuXHRcdHMgPSAnI2J0bi1yb3cnK3JvdysnLScraTtcblx0XHRpZHMucHVzaChzKTtcblx0fSBcblxuXHRsZXQgb3V0ID0gW107XG5cdGZvciAobGV0IGkgaW4gaWRzKSB7XG5cdFx0bGV0IGVsdmFsID0gJChpZHNbaV0pXG5cdFx0XHRcdFx0XHQucGFyZW50KClcblx0XHRcdFx0XHRcdC5wYXJlbnQoKVxuXHRcdFx0XHRcdFx0LmNoaWxkcmVuKCdpbnB1dCcpWzBdO1xuXHRcdGxldCB2YWwgPSAwO1xuXHRcdGlmICh0eXBlb2YgZWx2YWwgIT09ICd1bmRlZmluZWQnKXtcblx0XHRcdHZhbCA9IGVsdmFsLnZhbHVlO1xuXHRcdH1cblx0XHRvdXQucHVzaCh2YWwpO1xuXHR9XG5cdHJldHVybiBvdXQ7XG59O1xuXG4vLyBSZWRyYXcgR2FtZVxuY29uc3QgcmVkcmF3ID0gKGlucHN0cmFycikgPT4ge1xuXHRsZXQgaW5wID0gW107XG5cdC8vIHBhcnNlIGlucHV0XG5cdGZvciAobGV0IGkgPSAwOyBpIDwgaW5wc3RyYXJyLmxlbmd0aDsgaSsrKXtcblx0XHRpbnAucHVzaChwYXJzZUludChpbnBzdHJhcnJbaV0pKTtcblx0fTtcblxuICAgIC8vIGluaXQgdmFsdWVzXG5cdGxldCB0ID0gMSwgLy8gY291dCB2YWx1ZVxuXHRcdGRhdGEgPSBbXSxcblx0XHRjb2wsXG5cdFx0bmV4dEV2ZW50LFxuXHRcdHRtcCA9IDA7XG5cblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBpbnAubGVuZ3RoOyBpKyspe1xuXHRcdGNvbCA9IGk7XG5cdFx0bmV4dEV2ZW50ID0gaW5wW2NvbF07XG5cdFx0aWYgKG5leHRFdmVudCA+IDApe1xuXHRcdFx0YnJlYWs7XG5cdFx0fVxuXHR9XG5cblx0Zm9yIChsZXQgayA9IDA7IGsgPCByb3dOOyBrICs9IDEpIHtcblx0XHRsZXQgcm93ID0gW107XG5cdFx0ZGF0YS5wdXNoKHJvdyk7XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBjb2xOOyBpICs9MSl7XG5cdFx0XHRpZiAodCA9PT0gIG5leHRFdmVudCl7XG5cdFx0XHRcdC8vIGp1bXAgb3ZlciAwIGNvbG9yIGVudHJpZXNcblx0XHRcdFx0dG1wID0gY29sKzE7IC8vIGJsYWNrIGhhcyBpbmRleCAwXG5cdFx0XHRcdC8vIGlmIHNvbWV0aGluZyBpcyB6ZXJvIGdvIGZ1cnRoZXJcblx0XHRcdFx0d2hpbGUgKGlucFsoY29sKzEpJWlucC5sZW5ndGhdIDwgMSl7XG5cdFx0XHRcdFx0Y29sID0gKGNvbCsxKSVpbnAubGVuZ3RoO1xuXHRcdFx0XHR9XG5cdFx0XHRcdG5leHRFdmVudCArPSBpbnBbKGNvbCsxKSVpbnAubGVuZ3RoXTtcblx0XHRcdFx0Y29sID0gKGNvbCsxKSVpbnAubGVuZ3RoOyAvLyBuZXh0IGNvbG9yXG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0bXAgPSAwO1xuXHRcdFx0fVxuXHRcdFx0cm93LnB1c2goW3QsIHRtcF0pO1xuXHRcdFx0dCA9IHQgKyAxO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gZGF0YTtcbn07XG5cblxuY29uc3QgaGlnaGxpZ2h0RWwgID0gKGVsLGNvbCx0aW1lKSA9PntcbiAgICQoZWwpLmF0dHIoIFwiZmlsbFwiLCBobG9va3VwW2NvbF0pO1xuICAgc2V0VGltZW91dCgoKSA9PiB7JChlbCkuYXR0ciggXCJmaWxsXCIsIGxvb2t1cFtjb2xdKTt9LHRpbWUqMTAwMCk7XG5cbn07XG5cbi8vQ0hBTkdFIG9uIFRPTiBJbnB1dCBpcyBhcHBsaWVkXG5jb25zdCByZWdpc3RlcklucHV0T25DaGFuZ2UgPSAoKSA9PiB7XG5cdGxldCBpZHMgPSBbXTtcblx0Ly8gVE9ETyB1c2UgYXMgcGFyYW1ldGVyIGxhdGVyXG5cdGxldCByb3cgPSAxO1xuXHRsZXQgcz0nJztcblx0Zm9yIChsZXQgaSA9IDE7IGkgPCA0OyBpKyspe1xuXHRcdHMgPSAnI2J0bi1yb3cnK3JvdysnLScraTtcblx0XHRpZHMucHVzaChzKTtcblx0fSBcblxuXHRmb3IgKGxldCBpIGluIGlkcykge1xuXHRcdCQoaWRzW2ldKVxuXHRcdFx0LnBhcmVudCgpXG5cdFx0XHQucGFyZW50KClcblx0XHRcdC5jaGlsZHJlbignaW5wdXQuZm9ybS1jb250cm9sJylcblx0XHRcdC5jaGFuZ2UoKCkgPT4ge1xuXHRcdFx0XHRsZXQgbmV3ZGF0YSA9IHJlZHJhdyhyZWFkSW5wdXQoKSk7XG5cdFx0XHRcdHVwZGF0ZUdyYXBoKG5ld2RhdGEpO1xuXHRcdFx0fSk7XG5cdH1cbn07XG5cbi8vIFJlZ2lzdGVyIGNvdW50IEJ1dHRvblxuY29uc3QgcmVnaXN0ZXJCdXR0b24gPSAoKSA9PiB7XG5cdGxldCBpZHMgPSBbXTtcblx0Ly8gVE9ETyB1c2UgYXMgcGFyYW1ldGVyIGxhdGVyXG5cdGxldCByb3cgPSAxO1xuXHRsZXQgcz0nJztcblx0Zm9yIChsZXQgaSA9IDE7IGkgPCA0OyBpKyspe1xuXHRcdHMgPSAnI2J0bi1yb3cnK3JvdysnLScraTtcblx0XHRpZHMucHVzaChzKTtcblx0fSBcblx0bGV0IGVjID0galF1ZXJ5LkV2ZW50KCAnY2hhbmdlJyApO1xuICAgIGZvciAobGV0IGkgaW4gaWRzKSB7XG4gICAgXHQkKGlkc1tpXSlcblx0XHRcdC5wYXJlbnQoKVxuXHRcdFx0LmNoaWxkcmVuKCd1bC5kcm9wZG93bi1tZW51Jylcblx0XHRcdC5vbignY2xpY2snLCAoZSkgPT4ge1xuXHRcdFx0XHQkKGlkc1tpXSlcblx0XHRcdFx0LnBhcmVudCgpXG5cdFx0XHRcdC5wYXJlbnQoKVxuXHRcdFx0XHQuY2hpbGRyZW4oJ2lucHV0LmZvcm0tY29udHJvbDpmaXJzdCcpXG5cdFx0XHRcdC5hdHRyKCd2YWx1ZScsZS50YXJnZXQudGV4dClcblx0XHRcdFx0Ly9zZW5kIGNoYW5nZSBldmVudFxuXHRcdFx0XHQudHJpZ2dlcihlYyk7XG5cdFx0fSk7XHRcbiAgICB9XG59O1xuXG5cbi8vIFJlZ2lzdGVyIFRvbiBidXR0b25cbmNvbnN0IHJlZ2lzdGVyVG9uQnV0dG9uID0gKCkgPT4ge1xuXHRsZXQgaWRzID0gW107XG5cdC8vIFRPRE8gdXNlIGFzIHBhcmFtZXRlciBsYXRlclxuXHRsZXQgcm93ID0gMTtcblx0bGV0IHM9Jyc7XG5cblx0Zm9yIChsZXQgaSA9IDE7IGkgPCA0OyBpKyspe1xuXHRcdHMgPSAnI2J0bi1yb3cnK3JvdysnLScraSsnLXRvbic7XG5cdFx0aWRzLnB1c2gocyk7XG5cdH0gXG5cdC8vIGxldCBlYyA9IGpRdWVyeS5FdmVudCggJ2NoYW5nZScgKTtcbiAgICBmb3IgKGxldCBpIGluIGlkcykge1xuICAgIFx0JChpZHNbaV0pXG5cdFx0XHQucGFyZW50KClcblx0XHRcdC5jaGlsZHJlbigndWwuZHJvcGRvd24tbWVudScpXG5cdFx0XHQub24oJ2NsaWNrJywgKGUpID0+IHtcblx0XHRcdFx0JChpZHNbaV0pXG5cdFx0XHRcdC5wYXJlbnQoKVxuXHRcdFx0XHQucGFyZW50KClcblx0XHRcdFx0LmNoaWxkcmVuKCdpbnB1dC5mb3JtLWNvbnRyb2w6ZXEoIDEgKScpXG5cdFx0XHRcdC5hdHRyKCd2YWx1ZScsZS50YXJnZXQudGV4dCk7XG5cdFx0XHRcdFxuXHRcdFx0XHQvLyBkbyBwYXJhbWV0ZXIgY2hhbmdlXG5cdFx0XHRcdC8vIGluZGV4IGhhdmUgdG8gc3Vydml2ZSA6KVxuXHRcdFx0ICAgIGxldCB0bXAgPSBwYXJzZUludChlLnRhcmdldC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQuZ2V0QXR0cmlidXRlKCducicpKTtcblx0XHRcdFx0dG9uZXNbdG1wXS5pbnN0cnVtZW50ID0gZS50YXJnZXQudGV4dDtcblx0XHRcdFx0Ly9zZW5kIGNoYW5nZSBldmVudFxuXHRcdFx0XHQvLy50cmlnZ2VyKGVjKTtcblx0XHR9KTtcdFxuICAgIH1cbn07XG5cbmNvbnN0IHJlZ2lzdGVyQmxhY2tUb25CdXR0b24gPSAoKSA9PiB7XG5cdGxldCBpZHMgPSBbXTtcblx0Ly8gVE9ETyB1c2UgYXMgcGFyYW1ldGVyIGxhdGVyXG5cdGxldCByb3cgPSAxO1xuXHRsZXQgcyA9ICcjYnRuLXJvdzEtMC10b24nO1xuXHRpZHMucHVzaChzKTtcblx0XG5cdC8vIGxldCBlYyA9IGpRdWVyeS5FdmVudCggJ2NoYW5nZScgKTtcbiAgICBmb3IgKGxldCBpIGluIGlkcykge1xuICAgIFx0JChpZHNbaV0pXG5cdFx0XHQucGFyZW50KClcblx0XHRcdC5jaGlsZHJlbigndWwuZHJvcGRvd24tbWVudScpXG5cdFx0XHQub24oJ2NsaWNrJywgKGUpID0+IHtcblx0XHRcdFx0JChpZHNbaV0pXG5cdFx0XHRcdC5wYXJlbnQoKVxuXHRcdFx0XHQucGFyZW50KClcblx0XHRcdFx0LmNoaWxkcmVuKCdpbnB1dC5mb3JtLWNvbnRyb2w6Zmlyc3QnKVxuXHRcdFx0XHQuYXR0cigndmFsdWUnLGUudGFyZ2V0LnRleHQpO1xuXG5cdFx0XHRcdHRvbmVzWzBdLmluc3RydW1lbnQgPSBlLnRhcmdldC50ZXh0O1xuXHRcdFx0XHRcblx0XHRcdFx0Ly8gZG8gcGFyYW1ldGVyIGNoYW5nZVxuXG5cdFx0XHRcdC8vc2VuZCBjaGFuZ2UgZXZlbnRcblx0XHRcdFx0Ly8udHJpZ2dlcihlYyk7XG5cdFx0fSk7XHRcblxuICAgIH1cbn07XG5cblxuLy8gUmVnaXN0ZXIgVm9sdW1lbiBidXR0b25cbmNvbnN0IHJlZ2lzdGVyVm9sdW1lQnV0dG9uID0gKCkgPT4ge1xuXHRsZXQgaWRzID0gW107XG5cdC8vIFRPRE8gdXNlIGFzIHBhcmFtZXRlciBsYXRlclxuXHRsZXQgcm93ID0gMTtcblx0bGV0IHM9Jyc7XG5cblx0Zm9yIChsZXQgaSA9IDE7IGkgPCA0OyBpKyspe1xuXHRcdHMgPSAnI2J0bi1yb3cnK3JvdysnLScraSsnLXZvbHVtZSc7XG5cdFx0aWRzLnB1c2gocyk7XG5cdH0gXG5cdC8vIGxldCBlYyA9IGpRdWVyeS5FdmVudCggJ2NoYW5nZScgKTtcbiAgICBmb3IgKGxldCBpIGluIGlkcykge1xuICAgIFx0JChpZHNbaV0pXG5cdFx0XHQucGFyZW50KClcblx0XHRcdC5jaGlsZHJlbigndWwuZHJvcGRvd24tbWVudScpXG5cdFx0XHQub24oJ2NsaWNrJywgKGUpID0+IHtcblx0XHRcdFx0JChpZHNbaV0pXG5cdFx0XHRcdC5wYXJlbnQoKVxuXHRcdFx0XHQucGFyZW50KClcblx0XHRcdFx0LmNoaWxkcmVuKCdpbnB1dC5mb3JtLWNvbnRyb2w6ZXEoIDIgKScpXG5cdFx0XHRcdC5hdHRyKCd2YWx1ZScsZS50YXJnZXQudGV4dCk7XG5cdFx0XHRcdFxuXHRcdFx0XHQvLyBkbyBwYXJhbWV0ZXIgY2hhbmdlXG5cdFx0XHRcdC8vIGluZGV4IGhhdmUgdG8gc3Vydml2ZSA6KVxuXHRcdFx0ICAgIGxldCB0bXAgPSBwYXJzZUludChlLnRhcmdldC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQuZ2V0QXR0cmlidXRlKCducicpKTtcblxuXHRcdFx0XHR0b25lc1t0bXBdLnZvbCA9IGUudGFyZ2V0LnRleHQ7XG5cdFx0XHRcdHRvbmVzW3RtcF0uZ2FpbiA9IHBhcnNlSW50KGUudGFyZ2V0LnRleHQpKjEuMC8xMDA7XG5cdFx0XHRcdC8vc2VuZCBjaGFuZ2UgZXZlbnRcblx0XHRcdFx0Ly8udHJpZ2dlcihlYyk7XG5cdFx0fSk7XHRcbiAgICB9XG59O1xuXG5jb25zdCByZWdpc3RlckJsYWNrVm9sdW1lQnV0dG9uID0gKCkgPT4ge1xuXHRsZXQgaWRzID0gW107XG5cdC8vIFRPRE8gdXNlIGFzIHBhcmFtZXRlciBsYXRlclxuXHRsZXQgcm93ID0gMTtcblx0bGV0IHMgPSAnI2J0bi1yb3cxLTAtdm9sdW1lJztcblx0aWRzLnB1c2gocyk7XG5cdFxuXHQvLyBsZXQgZWMgPSBqUXVlcnkuRXZlbnQoICdjaGFuZ2UnICk7XG4gICAgZm9yIChsZXQgaSBpbiBpZHMpIHtcbiAgICBcdCQoaWRzW2ldKVxuXHRcdFx0LnBhcmVudCgpXG5cdFx0XHQuY2hpbGRyZW4oJ3VsLmRyb3Bkb3duLW1lbnUnKVxuXHRcdFx0Lm9uKCdjbGljaycsIChlKSA9PiB7XG5cdFx0XHRcdCQoaWRzW2ldKVxuXHRcdFx0XHQucGFyZW50KClcblx0XHRcdFx0LnBhcmVudCgpXG5cdFx0XHRcdC5jaGlsZHJlbignaW5wdXQuZm9ybS1jb250cm9sOmVxKCAxICknKVxuXHRcdFx0XHQuYXR0cigndmFsdWUnLGUudGFyZ2V0LnRleHQpO1xuXG5cdFx0XHRcdHRvbmVzWzBdLnZvbCA9IGUudGFyZ2V0LnRleHQ7XG5cdFx0XHRcdHRvbmVzWzBdLmdhaW4gPSBwYXJzZUludChlLnRhcmdldC50ZXh0KSoxLjAvMTAwO1xuXHRcdFx0XHRcblx0XHRcdFx0Ly8gZG8gcGFyYW1ldGVyIGNoYW5nZVxuXG5cdFx0XHRcdC8vc2VuZCBjaGFuZ2UgZXZlbnRcblx0XHRcdFx0Ly8udHJpZ2dlcihlYyk7XG5cdFx0fSk7XHRcblxuICAgIH1cbn07XG5cbmNvbnN0IHJlZ2lzdGVyUGxheUJ1dHRvbiA9ICgpID0+IHtcblx0JCgnI3BsYXltdXNpY2J0bicpLm9uKCdjbGljaycsIChlKSA9PiB7XG5cdFx0Ly8gaXBob25lIGhhY2tcblx0XHQvLyBpZiAoYXVkaW9Db250ZXh0ID09PSBudWxsKXtcblx0XHQvLyBcdHRyeSB7XG4gIC8vICAgXHRcdFx0d2luZG93LkF1ZGlvQ29udGV4dCA9IHdpbmRvdy5BdWRpb0NvbnRleHQgfHwgd2luZG93LndlYmtpdEF1ZGlvQ29udGV4dDtcbiAgLy8gICBcdFx0XHRhdWRpb0NvbnRleHQgPSBuZXcgd2luZG93LkF1ZGlvQ29udGV4dCgpO1xuXHRcdC8vIFx0fSBjYXRjaCAoZSkge1xuICAvLyAgIFx0XHRcdGNvbnNvbGUubG9nKFwiTm8gV2ViIEF1ZGlvIEFQSSBzdXBwb3J0XCIpO1xuXHRcdC8vIFx0fVxuXHRcdC8vIFx0bGV0IG9zY2lsbGF0b3IgPSBhdWRpb0NvbnRleHQuY3JlYXRlT3NjaWxsYXRvcigpO1xuIFx0Ly8gXHRcdFx0b3NjaWxsYXRvci5mcmVxdWVuY3kudmFsdWUgPSA0MDA7XG4gXHQvLyBcdFx0XHRvc2NpbGxhdG9yLmNvbm5lY3QoYXVkaW9Db250ZXh0LmRlc3RpbmF0aW9uKTtcbiBcdC8vIFx0XHRcdG9zY2lsbGF0b3Iuc3RhcnQoMCk7XG4gXHQvLyBcdFx0XHRvc2NpbGxhdG9yLnN0b3AoLjUpXG5cdFx0Ly8gfVxuXHRcdHJ1blNlcSA9IHRydWU7XG5cdFx0cGxheU11c2ljKCk7XG5cdFx0Ly9hbGVydCgnaGVyZScpO1xuXHR9KTtcblx0Ly8gJCgnI3BsYXltdXNpY2J0bicpLm9uKCd0b3VjaGVuZCcsIChlKSA9PiB7XG5cblx0Ly8gXHRydW5TZXEgPSB0cnVlO1xuXHQvLyBcdHBsYXlNdXNpYygpO1xuXHQvLyBcdC8vYWxlcnQoJ2hlcmUnKTtcblx0Ly8gfSk7XG59O1xuXG5jb25zdCByZWdpc3RlclN0b3BCdXR0b24gPSAoKSA9PiB7XG5cdCQoJyNzdG9wbXVzaWNidG4nKS5vbignY2xpY2snLCAoZSkgPT4ge1xuXHRcdHJ1blNlcSA9IGZhbHNlO1xuXHRcdC8vYWxlcnQoJ2hlcmUnKTtcblx0fSk7XG5cdC8vICQoJyNzdG9wbXVzaWNidG4nKS5vbigndG91Y2hlbmQnLCAoZSkgPT4ge1xuXHQvLyBcdHJ1blNlcSA9IGZhbHNlO1xuXHQvLyBcdC8vYWxlcnQoJ2hlcmUnKTtcblx0Ly8gfSk7XG59O1xuXG4vLyBjb25zdCByZWdpc3RlclBhcmFtZXRlckJ1dHRvbiA9ICgpID0+IHtcbi8vIFx0JCgnI3BhcmFtZXRlcmJ0bicpLm9uKCdjbGljaycsIChlKSA9PiB7XG4vLyBcdFx0bGV0IGVsID0gZDMuc2VsZWN0QWxsKCdyZWN0JylbMF1bNF07XG4vLyBcdFx0bGV0IHRpbWUgPSAwLjk7XG4vLyBcdFx0aGlnaGxpZ2h0RWwoZWwsMCx0aW1lKTtcbi8vIFx0fSk7XG4vLyB9O1xuXG5cbi8vIFBhcmFtZXRlciB3ZXJ0ZSBlaW5sZXNlblxuLy8gJCgnI3BhcmFPc3pidG4nKS5vbignY2xpY2snLCAoZSkgPT4ge1xuLy8gXHRsZXQgczIgPSAkKCdpbnB1dFtuYW1lPXNwZWVkXTpjaGVja2VkJywgJyNwYXJhbWV0ZXJNb2RhbCcpLnZhbCgpO1xuLy8gXHRsZXQgcyA9ICQoJ2lucHV0W25hbWU9b3N6Zm9ybV06Y2hlY2tlZCcsICcjcGFyYW1ldGVyTW9kYWwnKS52YWwoKTtcbi8vIFx0Ly9pZiAoISB0eXBlb2YgcyA9PT0gXCJ1bmRlZmluZWRcIiAmJiAhIHR5cGVvZiBzMiAgPT09IFwidW5kZWZpbmVkXCIpe1xuLy8gXHRpZiAoISBmYWxzZSl7XG4vLyBcdFx0b3NjaWxsYXRvclR5cGUgPSBzO1xuLy8gXHRcdHNvdW5kU3BlZWQgPSBwYXJzZUZsb2F0KHMyKTtcbi8vIFx0XHQkKCcjcGFyYW1ldGVyTW9kYWwnKS5tb2RhbCgnaGlkZScpO1xuLy8gXHR9XG4vLyB9KTtcblxuXG5cbi8vIFNvdW5kIERlZmluaXRpb25cblxuXG5jb25zdCBwbGF5U291bmQgPSAoc3RhcnRUaW1lLCBwaXRjaE5yLCBkdXJhdGlvbiwgZ2Fpbk9sZCkgPT4ge1xuXHQvL2xldCBzdGFydFRpbWUgPSBhdWRpb0NvbnRleHQuY3VycmVudFRpbWUgKyBkZWxheTtcbiAgXHRsZXQgZW5kVGltZSA9IHN0YXJ0VGltZSArIGR1cmF0aW9uO1xuICBcdGxldCBwaXRjaCA9IHNvdW5kc1twaXRjaE5yXVswXTtcbiAgXHRsZXQgZ2FpbiA9IHRvbmVzW3BpdGNoTnJdLmdhaW47XG5cbiAgXHRsZXQgb3V0Z2FpbiA9IGF1ZGlvQ29udGV4dC5jcmVhdGVHYWluKCk7XG4gIFx0b3V0Z2Fpbi5nYWluLnZhbHVlID0gZ2FpbjtcbiAgXHRvdXRnYWluLmNvbm5lY3QoYXVkaW9Db250ZXh0LmRlc3RpbmF0aW9uKTsgXHRcblxuICBcdGxldCBlbnZlbG9wZSA9IGF1ZGlvQ29udGV4dC5jcmVhdGVHYWluKCk7XG4gIFx0ZW52ZWxvcGUuY29ubmVjdChvdXRnYWluKTtcbiAgXHRlbnZlbG9wZS5nYWluLnZhbHVlID0gMDtcbiAgXHRcbiAgXHRlbnZlbG9wZS5nYWluLnNldFRhcmdldEF0VGltZSgxLCBzdGFydFRpbWUsIGVudmVsb3BlU3RhcnRFbmRUaW1lWzBdKTtcbiAgXHRlbnZlbG9wZS5nYWluLnNldFRhcmdldEF0VGltZSgwLCBlbmRUaW1lLCBlbnZlbG9wZVN0YXJ0RW5kVGltZVsxXSk7XG5cbiAgXHRsZXQgb3NjaWxsYXRvciA9IGF1ZGlvQ29udGV4dC5jcmVhdGVPc2NpbGxhdG9yKCk7XG4gIFx0b3NjaWxsYXRvci5jb25uZWN0KGVudmVsb3BlKTtcblxuICBcdG9zY2lsbGF0b3IudHlwZSA9IG9zY2lsbGF0b3JUeXBlO1xuICBcdG9zY2lsbGF0b3IuZGV0dW5lLnZhbHVlID0gcGl0Y2ggKiAxMDA7XG4gIFx0b3NjaWxsYXRvci5mcmVxdWVuY3kudmFsdWUgPSAyNDA7XG5cblx0bGV0IHZpYnJhdG8gPSBhdWRpb0NvbnRleHQuY3JlYXRlR2FpbigpO1xuXHR2aWJyYXRvLmdhaW4udmFsdWUgPSB2aWJyYXRvZ2Fpbjtcblx0dmlicmF0by5jb25uZWN0KG9zY2lsbGF0b3IuZGV0dW5lKTtcblxuXHRsZXQgbGZvID0gYXVkaW9Db250ZXh0LmNyZWF0ZU9zY2lsbGF0b3IoKTtcblx0bGZvLmNvbm5lY3QodmlicmF0byk7XG5cdGxmby5mcmVxdWVuY3kudmFsdWUgPWxmb2ZyZXE7IFxuXG5cdG9zY2lsbGF0b3Iuc3RhcnQoc3RhcnRUaW1lKTtcbiAgXHRsZm8uc3RhcnQoc3RhcnRUaW1lKTtcbiAgXHRvc2NpbGxhdG9yLnN0b3AoZW5kVGltZSArMiApO1xuICBcdGxmby5zdG9wKGVuZFRpbWUgKzIpO1xuXG59O1xuXG4vLy8gUGxheSBMb29wXG5jb25zdCBydW5TZXF1ZW5jZXJzID0gKCkgPT4ge1xuXHRpZiAoIXJ1blNlcSB8fCBzb3VuZFF1ZXVlLmxlbmd0aCA9PT0gMCl7Y29uc29sZS5sb2coXCJzdG9wXCIpO3JldHVybjt9XG5cdGxldCBjdCA9IGF1ZGlvQ29udGV4dC5jdXJyZW50VGltZTtcblx0d2hpbGUgKHNvdW5kUXVldWUubGVuZ3RoPjAgJiYgc291bmRRdWV1ZVswXVswXTwgY3QrMC4xNSl7XG5cdFx0Ly9jb25zb2xlLmxvZygnY3Q6JytjdCsncGxhbmVkIHRpbWU6Jytzb3VuZFF1ZXVlWzBdWzBdKTtcblx0XHRsZXQgaXRlbSA9IHNvdW5kUXVldWUuc3BsaWNlKDAsMSk7XG5cdFx0Ly8gcGxheXNvdW5kIChzdGFydHRpbWUsIHBpdGNoLCBkdXJhdGlvbiwgICAgICAgICAgICAgZ2FpaW4pXG5cdFx0Ly9wbGF5U291bmQoaXRlbVswXVswXSxzb3VuZHNbaXRlbVswXVsxXV1bMF0saXRlbVswXVsyXSx0b25lc1tpdGVtWzBdWzFdXS5nYWluKTtcdFx0XG5cdFxuXHRcdHBsYXlTb3VuZChpdGVtWzBdWzBdLGl0ZW1bMF1bMV0saXRlbVswXVsyXSx0b25lc1tpdGVtWzBdWzFdXS5nYWluKTtcdFx0XG5cdFx0Ly8gZWxlbWVudCAgICAgICAgICAgICAgY29sb3IgICAgICAgZHVyYXRpb25cblx0XHRoaWdobGlnaHRFbChpdGVtWzBdWzNdLGl0ZW1bMF1bMV0saXRlbVswXVsyXSk7XG5cdH1cblx0c2V0VGltZW91dChydW5TZXF1ZW5jZXJzLDkwKTtcbn1cblxuLy8vIHNvdW5kcyBzdGFydCBoZXJlXG4vLy8gU291bmQgdmFyXG5sZXQgcnVuU2VxID0gdHJ1ZTtcbmxldCBzb3VuZFF1ZXVlID0gW107XG5cbnZhciBhdWRpb0NvbnRleHQgPSBudWxsO1xuXG50cnkge1xuICAgd2luZG93LkF1ZGlvQ29udGV4dCA9IHdpbmRvdy5BdWRpb0NvbnRleHR8fHdpbmRvdy53ZWJraXRBdWRpb0NvbnRleHQ7XG4gICB2YXIgYXVkaW9Db250ZXh0ID0gbmV3IEF1ZGlvQ29udGV4dCgpO1xufSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUubG9nKFwiTm8gV2ViIEF1ZGlvIEFQSSBzdXBwb3J0XCIpO1xufVxuXG5cbi8vSU9TIFN0YXJ0IElPU0hBQ0tcbiQoJ2JvZHknKS5vbigndG91Y2hlbmQnLCAoZSkgPT4ge1xuXHQvL2FsZXJ0KCdzdGFydCBzb3VuZFxuXHQvLyBjcmVhdGUgZW1wdHkgYnVmZmVyXG5cdHZhciBidWZmZXIgPSBhdWRpb0NvbnRleHQuY3JlYXRlQnVmZmVyKDEsIDEsIDIyMDUwKTtcblx0dmFyIHNvdXJjZSA9IGF1ZGlvQ29udGV4dC5jcmVhdGVCdWZmZXJTb3VyY2UoKTtcblx0c291cmNlLmJ1ZmZlciA9IGJ1ZmZlcjtcblxuXHQvLyBjb25uZWN0IHRvIG91dHB1dCAoeW91ciBzcGVha2Vycylcblx0c291cmNlLmNvbm5lY3QoYXVkaW9Db250ZXh0LmRlc3RpbmF0aW9uKTtcblxuXHQvLyBwbGF5IHRoZSBmaWxlXG5cdGlmICh0eXBlb2Ygc291cmNlLm5vdGVPbiAhPT0gJ3VuZGVmaW5lZCcpe1xuXHRcdHNvdXJjZS5ub3RlT24oMCk7XG5cdH1cblx0XG5cdC8vIHZhciBzcmMgPSBudWxsO1xuXHQvLyBzcmMgPSBhdWRpb0NvbnRleHQuY3JlYXRlT3NjaWxsYXRvcigpO1xuXHQvLyBzcmMudHlwZSA9ICdzcXVhcmUnO1xuXHQvLyBzcmMuZnJlcXVlbmN5LnZhbHVlID0gNDQwO1xuXHQvLyBzcmMuY29ubmVjdChhdWRpb0NvbnRleHQuZGVzdGluYXRpb24pO1xuXHQvLyBsZXQgY3QgPSBhdWRpb0NvbnRleHQuY3VycmVudFRpbWU7XG5cdC8vIHNyYy5zdGFydChjdCswLjUpO1xuXHQvLyBzcmMuc3RvcChjdCsxLjIpO1xufSk7XG4vL0lPUyBFTkRcblxuXG4vLyBTb3VuZCBjb25zdGFuc3RzIHByZXNldHNcbmxldCB0b25lcyA9IFt7XG5cdCducic6MCxcblx0J2dhaW4nOjAuMSxcblx0J3ZvbCc6JzEwJScsXG5cdCdjb2xvcic6JyM0NTQ1NDUnLFxuXHQnaG92ZXInOicjMDAwMDAwJyxcblx0J2luc3RydW1lbnQnOidEMycsXG5cdCdpZCc6J2lnLXJvdzEtMCcsXG5cdCd2aXNpYmxlJzp0cnVlXG59LFxue1xuXHQnbnInOjEsXG5cdCdnYWluJzowLjgsXG5cdCd2b2wnOic4MCUnLFxuXHQnY29sb3InOicjMjk2RUFBJyxcblx0J2hvdmVyJzonIzA5NEU4QScsXG5cdCdpbnN0cnVtZW50JzonRTMnLFxuXHQnaWQnOidpZy1yb3cxLTEnLFxuXHQndmlzaWJsZSc6dHJ1ZVxufSxcbntcblx0J25yJzoyLFxuXHQnZ2Fpbic6MC4wLFxuXHQndm9sJzonMCUnLFxuXHQnY29sb3InOicjNTQ5MUI1Jyxcblx0J2hvdmVyJzonIzA5NEU4QScsXG5cdCdpbnN0cnVtZW50JzonRjMnLFxuXHQnaWQnOidpZy1yb3cxLTInLFxuXHQndmlzaWJsZSc6ZmFsc2Vcbn0sXG57XG5cdCducic6Myxcblx0J2dhaW4nOjAuMCxcblx0J3ZvbCc6JzAlJyxcblx0J2NvbG9yJzonIzU0OTFCNScsXG5cdCdob3Zlcic6JyMwOTRFOEEnLFxuXHQnaW5zdHJ1bWVudCc6J0czJyxcblx0J2lkJzonaWctcm93MS0zJyxcblx0J3Zpc2libGUnOmZhbHNlXG59XTtcblxuXG4vLyBzb3VuZHNcbmxldCBub3RlcyA9IHtcblx0J0QzJzoge1xuXHRcdCdmcmVxJzogNDQwLFxuXHRcdCdkZXR1bmUnOiAtNzAwXG5cdH0sXG5cdCdFMyc6IHtcblx0XHQnZnJlcSc6IDQ0MCxcblx0XHQnZGV0dW5lJzogLTUwMFxuXHR9LCBcblx0J0YzJzoge1xuXHRcdCdmcmVxJzogNDQwLFxuXHRcdCdkZXR1bmUnOiAtNDAwXG5cdH0sXG5cdCdHMyc6IHtcblx0XHQnZnJlcSc6IDQ0MCxcblx0XHQnZGV0dW5lJzogLTIwMFxuXHR9LFxuXHQnQTQnOiB7XG5cdFx0J2ZyZXEnOiA0NDAsXG5cdFx0J2RldHVuZSc6IDBcblx0fSxcblx0J0I0Jzoge1xuXHRcdCdmcmVxJzogNDQwLFxuXHRcdCdkZXR1bmUnOiAyMDBcblx0fSxcblx0J0M0Jzoge1xuXHRcdCdmcmVxJzogNDQwLFxuXHRcdCdkZXR1bmUnOiAzMDBcblx0fSxcblx0J0Q0Jzoge1xuXHRcdCdmcmVxJzogNDQwLFxuXHRcdCdkZXR1bmUnOiA1MDBcblx0fSxcblx0J0U0Jzoge1xuXHRcdCdmcmVxJzogNDQwLFxuXHRcdCdkZXR1bmUnOiA3MDBcblx0fSxcblx0J0Y0Jzoge1xuXHRcdCdmcmVxJzogNDQwLFxuXHRcdCdkZXR1bmUnOiA4MDBcblx0fSxcblx0J0c0Jzoge1xuXHRcdCdmcmVxJzogNDQwLFxuXHRcdCdkZXR1bmUnOiAxMDAwXG5cdH1cbn07XG5cblxuXG5sZXQgc291bmRTcGVlZCA9IDAuNTtcbmxldCB0b25lZHVyYXRpb24gPSAwLjM7XG5sZXQgdmlicmF0b2dhaW4gPSAwLjM7XG5sZXQgZW52ZWxvcGVTdGFydEVuZFRpbWUgPSBbMC4wMSwwLjFdO1xubGV0IGxmb2ZyZXEgPSA2OyAgLy81XG4vLyBQYXJhbWV0cml6YXRpb24gb2YgdGhlIDUgdG9uZXMgIFBpdGNoIGR1cmF0aW9uIHZvbHVtZSBnYWluXG4vLyBEZWJyaWNhdGVkIHRvIGJlIHJlbW92ZWRcbi8vIGZpcnN0IGlzdCBibGFjayBzb3VuZFxuY29uc3Qgc291bmRzID0gW1stMTAsIDAuNSwwLjFdLFszLCAwLjUsMC45XSxbMTAsIDAuNSwwLjldLFsxNSwgMC41LDAuOV0sWzAsIDAuNSwwLjldXTtcbmxldCBvc2NpbGxhdG9yVHlwZSA9ICdzYXd0b290aCc7IC8vJ3NpbmUnOyAvLyAnc2F3dG9vdGgnXG5cblxuLy8vIFNvdW5kIE1ldGhvZHNcbmNvbnN0IHBsYXlNdXNpYyA9ICgpID0+IHtcblx0Ly8gZmlsbCBzb3VuZFF1ZXVlXHRcblx0bGV0IHJlY3RhcnIgPSBkMy5zZWxlY3RBbGwoJ3JlY3QnKS5kYXRhKCk7XG5cdGxldCBlbGFyciA9IGQzLnNlbGVjdEFsbCgncmVjdCcpWzBdO1xuICAgIGxldCBzdGFydFRpbWUgPSBhdWRpb0NvbnRleHQuY3VycmVudFRpbWU7XG4gICAgLy9jb25zb2xlLmxvZygnU3RhcnQnK3N0YXJ0VGltZSk7XG4gICAgc291bmRRdWV1ZSA9W107XG5cdGZvciAobGV0IGk9MDsgaSA8IHJlY3RhcnIubGVuZ3RoOyBpKyspIHtcblx0XHRsZXQgdiA9IHJlY3RhcnJbaV1bMV07XG5cdFx0Ly9wbGF5U291bmQoaSxzb3VuZHNbdl1bMF0sc291bmRzW3ZdWzFdLHNvdW5kc1t2XVsyXSk7XG5cdFx0Ly9hbGVydChpKTtcblx0XHRsZXQgdG1wID0gW107XG5cdFx0dG1wLnB1c2goaSpzb3VuZFNwZWVkK3N0YXJ0VGltZSk7XG5cdFx0dG1wLnB1c2godik7XG5cdFx0dG1wLnB1c2godG9uZWR1cmF0aW9uKTtcblx0XHR0bXAucHVzaChlbGFycltpXSk7XG5cdFx0c291bmRRdWV1ZS5wdXNoKHRtcCk7XG5cdH1cblx0Ly9jb25zb2xlLmxvZygnc3RhcnRzZXF1ZW5jZXInK2F1ZGlvQ29udGV4dC5jdXJyZW50VGltZSk7XG4gICAgcnVuU2VxdWVuY2VycygpO1xufTtcblxuLy8gSW5pdCBTY3JlZW5cbmNvbnN0IGluaXRkM2pzID0gKGVsSWQpID0+IHtcblx0Y29uc3Qgd2lkdGggPSAxMjgwLFxuICAgIGhlaWdodCA9IDQ1O1xuICAgIGxldCBzcl92aWV3cG9ydCA9ICcwIDAgJysod2lkdGgrNzApKycgJytoZWlnaHQ7XG4gICAgY29uc3QgZGl2ID0gZDMuc2VsZWN0KGVsSWQpLFxuXHRzdmcgPSBkaXYuYXBwZW5kKCdzdmcnKVxuICAgICAgICAuYXR0cignd2lkdGgnLCB3aWR0aClcbiAgICAgICAgLmF0dHIoJ2hlaWdodCcsIGhlaWdodClcbiAgICAgICAgLmF0dHIoJ3ZpZXdCb3gnLCBzcl92aWV3cG9ydClcbiAgICAgICAgLmF0dHIoJ3ByZXNlcnZlQXNwZWN0UmF0aW8nLCAneE1pZFlNaWQgbWVldCcpO1xuICAgIC8vIHJlc3BvbnNpdmUgY2hhbmdlXG4gICAgZDMuc2VsZWN0KHdpbmRvdylcbiAgICBcdC5vbihcInJlc2l6ZVwiLCAoKSA9PiB7XG5cdCAgICAvL2xldCB0YXJnZXRXaWR0aCA9IHN2Zy5ub2RlKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGg7XG5cdCAgICBsZXQgd2luV2lkdGggPSAkKHdpbmRvdykud2lkdGgoKTtcblx0ICAgIHN2Zy5hdHRyKFwid2lkdGhcIiwgd2luV2lkdGgpO1xuICBcdH0pO1xuXG4gICAgcmV0dXJuIHN2Zztcbn07XG5cblxuICAgIC8vIENvbnN0YW50c1xuXG4gICAgY29uc3QgcncgPSAyMCxcbiAgICByaCA9IDIwLFxuICAgIHJvd04gPTEsXG4gICAgY29sTiA9NDgsXG4gICAgLy9jb2xvcmRlZmluaXRpb25cbiAgICBsb29rdXBibHVlID0gWycjNDU0NTQ1JywnIzI5NkVBQScsJyM1NDkxQjUnLCcjNzlCRUZBJywnIzQ2QjBDRiddLFxuICAgIGhsb29rdXAgPSBbJyMwMDAwMDAnLCcjMDk0RThBJywnIzA5NEU4QScsJyMwOTRFOEEnLCcjMjY5MEFGJ107XG4gICAgLy8gbG9va3VwID0gWycjNDU0NTQ1JywnIzI5NkVBQScsJyNENDNGM0EnLCcjNUNCODVDJywnIzQ2QjBDRiddLFxuICAgIC8vIGhsb29rdXAgPSBbJyMwMDAwMDAnLCcjMDk0RThBJywnI0E0MUYxQScsJyMzQzk4M0MnLCcjMjY5MEFGJ10sXG4gICAgLy9ycmFuZ2UgPSBsb29rdXAubGVuZ3RoO1xuXG4gICAgLy8gYmluZCBkYXRhIGFuZCByZW5kZXIgZDNqc1xuICAgIGNvbnN0IHN2ZyA9IGluaXRkM2pzKCcjY2hhcnQnKTtcbiAgICBsZXQgbXlkYXRhID0gcmVkcmF3KHJlYWRJbnB1dCgpKTtcblx0cmVuZGVyR3JhcGgobXlkYXRhLHN2Zyxsb29rdXBibHVlKTtcblxuICAgIGNvbnN0IHN2Z2dyZWVuID0gaW5pdGQzanMoJyNjaGFydC0yJyk7XG4gICAgbGV0IG15ZGF0YUdyZWVuID0gcmVkcmF3KHJlYWRJbnB1dCgpKTtcblx0cmVuZGVyR3JhcGgobXlkYXRhR3JlZW4sc3ZnZ3JlZW4sbG9va3VwYmx1ZSk7XG5cbiAgICBjb25zdCBzdmdyZWQgPSBpbml0ZDNqcygnI2NoYXJ0LTMnKTtcbiAgICBsZXQgbXlkYXRhUmVkID0gcmVkcmF3KHJlYWRJbnB1dCgpKTtcblx0cmVuZGVyR3JhcGgobXlkYXRhUmVkLHN2Z3JlZCxsb29rdXBibHVlKTtcdFxuXG5cblx0Ly8gUmVnaXN0ZXIgQnV0dG9uc1xuXHRyZWdpc3RlckJ1dHRvbigpO1xuXHRyZWdpc3RlclRvbkJ1dHRvbigpO1xuXHRyZWdpc3RlckJsYWNrVG9uQnV0dG9uKCk7XG5cdHJlZ2lzdGVySW5wdXRPbkNoYW5nZSgpO1xuXHRyZWdpc3RlclZvbHVtZUJ1dHRvbigpO1xuXHRyZWdpc3RlckJsYWNrVm9sdW1lQnV0dG9uKCk7XG5cdHJlZ2lzdGVyUGxheUJ1dHRvbigpO1xuXHRyZWdpc3RlclN0b3BCdXR0b24oKTtcblx0Ly9yZWdpc3RlclBhcmFtZXRlckJ1dHRvbigpO1xuXG5cdFxuXG4vL2lvcyBoYWNrXG4vLyBcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIGZ1bmN0aW9uKCkge1xuXG4vLyBcdC8vIGNyZWF0ZSBlbXB0eSBidWZmZXJcbi8vIFx0dmFyIGJ1ZmZlciA9IGF1ZGlvQ29udGV4dC5jcmVhdGVCdWZmZXIoMSwgMSwgMjIwNTApO1xuLy8gXHR2YXIgc291cmNlID0gYXVkaW9Db250ZXh0LmNyZWF0ZUJ1ZmZlclNvdXJjZSgpO1xuLy8gXHRzb3VyY2UuYnVmZmVyID0gYnVmZmVyO1xuXG4vLyBcdC8vIGNvbm5lY3QgdG8gb3V0cHV0ICh5b3VyIHNwZWFrZXJzKVxuLy8gXHRzb3VyY2UuY29ubmVjdChhdWRpb0NvbnRleHQuZGVzdGluYXRpb24pO1xuXG4vLyBcdC8vIHBsYXkgdGhlIGZpbGVcbi8vIFx0c291cmNlLm5vdGVPbigwKTtcblxuLy8gfSwgZmFsc2UpO1xuXG5cblxuLy8gd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaHN0YXJ0XCIsIGZ1bmN0aW9uICgpe1x0XG4vLyBcdFx0aWYgKGhhZF90b3VjaClcdFx0cmV0dXJuO1x0XHRcbi8vIFx0XHQvLyBwbGF5IGVtcHR5IGJ1ZmZlciB0byB1bm11dGUgYXVkaW9cdFxuLy8gXHRcdHZhciBidWZmZXIgPSBhdWRpb0NvbnRleHQuY3JlYXRlQnVmZmVyKDEsIDEsIDIyMDUwKTtcdFxuLy8gXHRcdHZhciBzb3VyY2UgPSBhdWRpb0NvbnRleHQuY3JlYXRlQnVmZmVyU291cmNlKCk7XHRcbi8vIFx0XHRzb3VyY2UuYnVmZmVyID0gYnVmZmVyO1x0XG4vLyBcdFx0c291cmNlLmNvbm5lY3QoYXVkaW9Db250ZXh0LmRlc3RpbmF0aW9uKTtcdFxuLy8gXHRcdHNvdXJjZS5zdGFydCgwKTtcdFxuLy8gXHRcdGhhZF90b3VjaCA9IHRydWU7XG4vLyBcdFx0YWxlcnQoXCJtaXN0XCIpO1xuLy8gXHR9KTtcblxuXG5cblxuXG59KTtcblxuXG5cbiJdfQ==
