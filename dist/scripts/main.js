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
	var readInput = function readInput(row) {
		var ids = [];
		// TODO use as parameter later
		if (typeof row === 'undefined') {
			alert('row is undefined');
		}
		// let row = 1;
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

	//TODO FIX TABLES
	var highlightEl = function highlightEl(el, col, time) {
		$(el).attr("fill", hlookup[col]);
		setTimeout(function () {
			$(el).attr("fill", lookup[col]);
		}, time * 1000);
	};

	//CHANGE on TON Input is applied
	var registerInputOnChange = function registerInputOnChange(row, svg, lookup) {
		var ids = [];
		// TODO use as parameter later
		// let row = 1;
		var s = '';
		for (var i = 1; i < 4; i++) {
			s = '#btn-row' + row + '-' + i;
			ids.push(s);
		}

		for (var i in ids) {
			$(ids[i]).parent().parent().children('input.form-control').change(function () {
				var newdata = redraw(readInput(row));
				updateGraph(newdata, svg, lookup);
			});
		}
	};

	// Register count Button
	var registerButton = function registerButton(row) {
		var ids = [];
		// TODO use as parameter later
		//let row = 1;
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
	var registerTonButton = function registerTonButton(row) {
		var ids = [];
		// TODO use as parameter later
		//let row = 1;
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
	var registerVolumeButton = function registerVolumeButton(row) {
		var ids = [];
		// TODO use as parameter later
		//let row = 1;
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
		// 'color':'#454545',
		// 'hover':'#000000',
		'instrument': 'D3',
		'id': 'ig-row1-0',
		'visible': true
	}, {
		'nr': 1,
		'gain': 0.8,
		'vol': '80%',
		// 'color':'#296EAA',
		// 'hover':'#094E8A',
		'instrument': 'E3',
		'id': 'ig-row1-1',
		'visible': true
	}, {
		'nr': 2,
		'gain': 0.0,
		'vol': '0%',
		// 'color':'#5491B5',
		// 'hover':'#094E8A',
		'instrument': 'F3',
		'id': 'ig-row1-2',
		'visible': false
	}, {
		'nr': 3,
		'gain': 0.0,
		'vol': '0%',
		// 'color':'#5491B5',
		// 'hover':'#094E8A',
		'instrument': 'G3',
		'id': 'ig-row1-3',
		'visible': false
	}, {
		'nr': 4,
		'gain': 0.5,
		'vol': '50%',
		// 'color':'#5491B5',
		// 'hover':'#094E8A',
		'instrument': 'A4',
		'id': 'ig-row2-1',
		'visible': false
	}, {
		'nr': 5,
		'gain': 0.0,
		'vol': '0%',
		// 'color':'#5491B5',
		// 'hover':'#094E8A',
		'instrument': 'B4',
		'id': 'ig-row2-2',
		'visible': false
	}, {
		'nr': 6,
		'gain': 0.0,
		'vol': '0%',
		// 'color':'#5491B5',
		// 'hover':'#094E8A',
		'instrument': 'C4',
		'id': 'ig-row2-3',
		'visible': false
	}, {
		'nr': 7,
		'gain': 0.3,
		'vol': '30%',
		// 'color':'#5491B5',
		// 'hover':'#094E8A',
		'instrument': 'D4',
		'id': 'ig-row3-1',
		'visible': false
	}, {
		'nr': 8,
		'gain': 0.0,
		'vol': '0%',
		// 'color':'#5491B5',
		// 'hover':'#094E8A',
		'instrument': 'E4',
		'id': 'ig-row3-2',
		'visible': false
	}, {
		'nr': 9,
		'gain': 0.0,
		'vol': '0%',
		// 'color':'#5491B5',
		// 'hover':'#094E8A',
		'instrument': 'F4',
		'id': 'ig-row3-3',
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

		return svg;
	};

	// Constants

	var rw = 20,
	    rh = 20,
	    rowN = 1,
	    colN = 48,
	   
	//colordefinition
	lookupblue = ['#454545', '#296EAA', '#5491B5', '#79BEFA'],
	    lookupgreen = ['#454545', '#4BA84B', '#547249', '#1F6241'],
	    lookupred = ['#454545', '#DB3833', '#B30B0B', '#A1123F'],
	    hlookup = ['#000000', '#094E8A', '#094E8A', '#094E8A'];
	// lookup = ['#454545','#296EAA','#D43F3A','#5CB85C','#46B0CF'],
	// hlookup = ['#000000','#094E8A','#A41F1A','#3C983C','#2690AF'],
	//rrange = lookup.length;

	// bind data and render d3js
	var svg = initd3js('#chart');
	var mydata = redraw(readInput(1));
	renderGraph(mydata, svg, lookupblue);

	var svggreen = initd3js('#chart-2');
	var mydataGreen = redraw(readInput(2));
	renderGraph(mydataGreen, svggreen, lookupgreen);

	var svgred = initd3js('#chart-3');
	var mydataRed = redraw(readInput(3));
	renderGraph(mydataRed, svgred, lookupred);

	// responsive change
	d3.select(window).on('resize', function () {
		//let targetWidth = svg.node().getBoundingClientRect().width;
		var winWidth = $(window).width();
		svg.attr("width", winWidth);
		svggreen.attr("width", winWidth);
		svgred.attr("width", winWidth);
	});
	//Triger resize Event
	var tmpw = $(window).width();
	svg.attr('width', tmpw);
	svggreen.attr('width', tmpw);
	svgred.attr('width', tmpw);

	// Register Buttons
	// blackbutton only one registration
	registerBlackVolumeButton();
	registerBlackTonButton();

	// Register 3 rows V Button
	[1, 2, 3].map(registerButton);
	[1, 2, 3].map(registerTonButton);
	[1, 2, 3].map(registerVolumeButton);

	registerInputOnChange(1, svg, lookupblue);
	registerInputOnChange(2, svggreen, lookupgreen);
	registerInputOnChange(3, svgred, lookupred);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvc2NyaXB0cy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxFQUFFLFFBQUYsRUFBWSxLQUFaLENBQWtCLFlBQVU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEyQjVCLEtBQU0sY0FBYyxTQUFkLFdBQWMsQ0FBQyxJQUFELEVBQU0sR0FBTixFQUFVLE1BQVYsRUFBcUI7QUFDeEMsTUFBSSxNQUFNLElBQUksU0FBSixDQUFjLEdBQWQsRUFDTCxJQURLLENBQ0EsSUFEQSxDQUFOLENBRG9DOztBQUl4QyxNQUFJLFlBQVksSUFBSSxTQUFKLENBQWMsTUFBZCxFQUFzQixJQUF0QixDQUEyQixVQUFDLENBQUQ7VUFBTztHQUFQLENBQTNCLENBQ2QsSUFEYyxDQUNULE1BRFMsRUFDRCxVQUFDLENBQUQsRUFBRyxDQUFIO1VBQVMsT0FBTyxFQUFFLENBQUYsQ0FBUDtHQUFULENBRFgsQ0FKb0M7O0FBT3hDLFlBQVUsS0FBVixHQUNFLE1BREYsQ0FDUyxNQURULEVBRUssSUFGTCxDQUVVLEdBRlYsRUFFZSxVQUFDLENBQUQsRUFBSSxDQUFKO1VBQVcsS0FBSyxDQUFMO0dBQVgsQ0FGZixDQUdLLElBSEwsQ0FHVSxPQUhWLEVBR21CLEVBSG5CLEVBSUssSUFKTCxDQUlVLFFBSlYsRUFJb0IsRUFKcEIsRUFQd0M7O0FBYXhDLFlBQVUsSUFBVixHQUFpQixNQUFqQixHQWJ3QztFQUFyQixDQTNCUTs7QUEyQzVCLEtBQU0sY0FBYyxTQUFkLFdBQWMsQ0FBQyxJQUFELEVBQU0sR0FBTixFQUFVLE1BQVYsRUFBcUI7OztBQUd4QyxNQUFJLE1BQU0sSUFBSSxTQUFKLENBQWMsR0FBZCxFQUNMLElBREssQ0FDQSxJQURBLEVBRUwsS0FGSyxHQUdMLE1BSEssQ0FHRSxHQUhGLEVBSUwsSUFKSyxDQUlBLFdBSkEsRUFJYSxVQUFDLENBQUQsRUFBSSxDQUFKO1VBQVUs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U0FBTSxLQUFOOzs7QUFHQSxnQkFBYSxJQUFiO0FBQ0EsUUFBSyxXQUFMO0FBQ0EsYUFBVSxJQUFWO0VBUlcsRUFVWjtBQUNDLFFBQUssQ0FBTDtBQUNBLFVBQU8sR0FBUDtBQUNBLFNBQU0sS0FBTjs7O0FBR0EsZ0JBQWEsSUFBYjtBQUNBLFFBQUssV0FBTDtBQUNBLGFBQVUsSUFBVjtFQWxCVyxFQW9CWjtBQUNDLFFBQUssQ0FBTDtBQUNBLFVBQU8sR0FBUDtBQUNBLFNBQU0sSUFBTjs7O0FBR0EsZ0JBQWEsSUFBYjtBQUNBLFFBQUssV0FBTDtBQUNBLGFBQVUsS0FBVjtFQTVCVyxFQThCWjtBQUNDLFFBQUssQ0FBTDtBQUNBLFVBQU8sR0FBUDtBQUNBLFNBQU0sSUFBTjs7O0FBR0EsZ0JBQWEsSUFBYjtBQUNBLFFBQUssV0FBTDtBQUNBLGFBQVUsS0FBVjtFQXRDVyxFQXdDWjtBQUNDLFFBQUssQ0FBTDtBQUNBLFVBQU8sR0FBUDtBQUNBLFNBQU0sS0FBTjs7O0FBR0EsZ0JBQWEsSUFBYjtBQUNBLFFBQUssV0FBTDtBQUNBLGFBQVUsS0FBVjtFQWhEVyxFQWtEWjtBQUNDLFFBQUssQ0FBTDtBQUNBLFVBQU8sR0FBUDtBQUNBLFNBQU0sSUFBTjs7O0FBR0EsZ0JBQWEsSUFBYjtBQUNBLFFBQUssV0FBTDtBQUNBLGFBQVUsS0FBVjtFQTFEVyxFQTREWjtBQUNDLFFBQUssQ0FBTDtBQUNBLFVBQU8sR0FBUDtBQUNBLFNBQU0sSUFBTjs7O0FBR0EsZ0JBQWEsSUFBYjtBQUNBLFFBQUssV0FBTDtBQUNBLGFBQVUsS0FBVjtFQXBFVyxFQXNFWjtBQUNDLFFBQUssQ0FBTDtBQUNBLFVBQU8sR0FBUDtBQUNBLFNBQU0sS0FBTjs7O0FBR0EsZ0JBQWEsSUFBYjtBQUNBLFFBQUssV0FBTDtBQUNBLGFBQVUsS0FBVjtFQTlFVyxFQWdGWjtBQUNDLFFBQUssQ0FBTDtBQUNBLFVBQU8sR0FBUDtBQUNBLFNBQU0sSUFBTjs7O0FBR0EsZ0JBQWEsSUFBYjtBQUNBLFFBQUssV0FBTDtBQUNBLGFBQVUsS0FBVjtFQXhG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LEVBdndCMkI7QUF3d0IzQix1QkFBc0IsQ0FBdEIsRUFBd0IsTUFBeEIsRUFBK0IsU0FBL0IsRUF4d0IyQjs7QUEyd0IzQixzQkEzd0IyQjtBQTR3QjNCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Q0E1d0JpQixDQUFsQjtBQUE0QiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuLy8gY3JlYXRlIEhUTUwgc3R1ZmZcbi8vIGNvbnN0IGNyZWF0ZUh0bWxUb25Db250cm9sID0gKG5yKSA9PiB7XG4vLyBcdGNvbnN0IHBvc25yID0gJzEnO1xuXHRcblxuLy8gXHRsZXQgZWxDb250YWluZXIgPSAndG9uLWNvbnRyb2wtJytucjtcbi8vIFx0bGV0IGVsT3V0RGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIkRJVlwiKTtcbi8vIFx0ZWxPdXREaXYuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJjb2wteHMtM1wiKTtcblx0XG4vLyBcdGxldCBlbGlucHV0R3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiRElWXCIpO1xuLy8gXHRlbGlucHV0R3JvdXAuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJpbnB1dC1ncm91cC1idG5cIik7IFxuLy8gXHRlbE91dERpdi5hcHBlbmRDaGlsZChlbGlucHV0R3JvdXApO1xuLy8gXHQvLyBCVVRUT05cbi8vIFx0bGV0IHRleHRub2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoXCIgWmFobFwiKTsgXG4vLyBcdGxldCBidG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiQlVUVE9OXCIpO1xuLy8gXHRsZXQgc2lkPSdidG4tcm93JytucisnLScrcG9zbnI7XG4vLyBcdGJ0bi5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBzaWQpO1xuLy8gXHRidG4uc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJidG4gYnRuLWluZm8gZHJvcGRvd24tdG9nZ2xlXCIpO1xuLy8gXHRidG4uYXBwZW5kQ2hpbGQodGV4dG5vZGUpO1xuLy8gXHRlbGlucHV0R3JvdXAuYXBwZW5kQ2hpbGQoYnRuKTtcbi8vIFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWxDb250YWluZXIpLmFwcGVuZENoaWxkKGVsT3V0RGl2KTtcblxuXG4vLyB9O1xuXG4vLyBEM0pTXG5jb25zdCB1cGRhdGVHcmFwaCA9IChkYXRhLHN2Zyxsb29rdXApID0+IHtcblx0bGV0IGdycCA9IHN2Zy5zZWxlY3RBbGwoJ2cnKVxuXHQgICAgLmRhdGEoZGF0YSk7XG5cblx0bGV0IHNlbGVjdGlvbiA9IGdycC5zZWxlY3RBbGwoJ3JlY3QnKS5kYXRhKChkKSA9PiBkKVxuXHRcdC5hdHRyKCdmaWxsJywgKGQsaSkgPT4gbG9va3VwW2RbMV1dKTtcblxuXHRzZWxlY3Rpb24uZW50ZXIoKVxuXHRcdC5hcHBlbmQoJ3JlY3QnKVxuXHQgICAgLmF0dHIoJ3gnLCAoZCwgaSkgPT4gIDI4ICogaSlcblx0ICAgIC5hdHRyKCd3aWR0aCcsIHJ3KVxuXHQgICAgLmF0dHIoJ2hlaWdodCcsIHJoKTtcblxuXHRzZWxlY3Rpb24uZXhpdCgpLnJlbW92ZSgpOyAgICBcbn07XG5cbmNvbnN0IHJlbmRlckdyYXBoID0gKGRhdGEsc3ZnLGxvb2t1cCkgPT4ge1xuXHQvLyBDcmVhdGUgYSBncm91cCBmb3IgZWFjaCByb3cgaW4gdGhlIGRhdGEgbWF0cml4IGFuZFxuXHQvLyB0cmFuc2xhdGUgdGhlIGdyb3VwIHZlcnRpY2FsbHlcblx0bGV0IGdycCA9IHN2Zy5zZWxlY3RBbGwoJ2cnKVxuXHQgICAgLmRhdGEoZGF0YSlcblx0ICAgIC5lbnRlcigpXG5cdCAgICAuYXBwZW5kKCdnJylcblx0ICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAoZCwgaSkgPT4gJ3RyYW5zbGF0ZSgwLCAnICsgNTQgKiBpICsgJyknKTtcblxuXHQvLyBGb3IgZWFjaCBncm91cCwgY3JlYXRlIGEgc2V0IG9mIHJlY3RhbmdsZXMgYW5kIGJpbmQgXG5cdC8vIHRoZW0gdG8gdGhlIGlubmVyIGFycmF5ICh0aGUgaW5uZXIgYXJyYXkgaXMgYWxyZWFkeVxuXHQvLyBiaW5kZWQgdG8gdGhlIGdyb3VwKVxuXHRncnAuc2VsZWN0QWxsKCdyZWN0Jylcblx0ICAgIC5kYXRhKChkKSA9PiBkKVxuXHQgICAgLmVudGVyKClcblx0ICAgIC5hcHBlbmQoJ3JlY3QnKVxuXHQgICAgICAgIC5hdHRyKCd4JywgKGQsIGkpID0+ICAyOCAqIGkpXG5cdCAgICAgICAgLmF0dHIoJ2ZpbGwnLCAoZCxpKSA9PiBsb29rdXBbZFsxXV0pXG5cdCAgICAgICAgLmF0dHIoJ3dpZHRoJywgcncpXG5cdCAgICAgICAgLmF0dHIoJ2hlaWdodCcsIHJoKTsgICAgIFxuXG5cdC8vTW9kdWxvIDEwIHRpY2tzICAgICAgICBcblx0Z3JwLnNlbGVjdEFsbCgnbGluZScpXG5cdCAgICAuZGF0YSggKGQpID0+IGQpXG5cdCAgICAuZW50ZXIoKS5hcHBlbmQoJ2xpbmUnKVxuXHQgICAgLmZpbHRlcigoZCxpKSA9PiBpJTEwPT09MClcbiAgXHRcdFx0LmF0dHIoJ3gxJywgIChkLCBpKSA9PiAyODAgKiBpKzEpXG4gIFx0XHRcdC5hdHRyKCd5MScsIDIwKVxuICBcdFx0XHQuYXR0cigneDInLCAoZCwgaSkgPT4gMjgwICogaSsxKVxuICBcdFx0XHQuYXR0cigneTInLDQwKVxuICBcdFx0XHQuc3R5bGUoJ3N0cm9rZScsICdibGFjaycpXG4gIFx0XHRcdC5zdHlsZSgnc3Ryb2tlLXdpZHRoJywnMnB4Jyk7ICAgICAgXG5cbiAgXHQvLyBUZXh0IFxuICBcdGdycC5zZWxlY3RBbGwoJ3RleHQnKVxuXHQgICAgLmRhdGEoIChkKSA9PiBkKVxuXHQgICAgLmVudGVyKCkuYXBwZW5kKCd0ZXh0Jylcblx0ICAgIC5maWx0ZXIoKGQsaSkgPT4gaSUxMD09PTApXG5cdCAgICBcdC5hdHRyKCd4JywgKGQsIGkpID0+IHsgcmV0dXJuIDI4MCAqIGkrNTsgfSlcblx0ICAgIFx0LmF0dHIoJ3knLCAnMzgnKSAgXG5cdCAgICBcdC5hdHRyKCdmb250LWZhbWlseScsICdzYW5zLXNlcmlmJykgXG5cdCAgICBcdC50ZXh0KCAoZCwgaSxrKSA9PiBrKjQwK2kqMTArMSk7IFxufTtcblxuLy8gZ2V0IHZhbHVlc1xuLy9jb25zdCBnZXRCdXR0b25JZHMgPSAoKSA9PiBbJyNidG4tcm93MS0xJywnI2J0bi1yb3cxLTInLCcjYnRuLXJvdzEtMycsJyNidG4tcm93MS00J107XG5cbi8vIHJlYWRzIFBhcmFtZXRlciBUb24gWmFobCBmb3Igcm93IG9uZVxuY29uc3QgcmVhZElucHV0ID0gKHJvdykgPT4ge1xuXHRsZXQgaWRzID0gW107XG5cdC8vIFRPRE8gdXNlIGFzIHBhcmFtZXRlciBsYXRlclxuXHRpZiAodHlwZW9mIHJvdyA9PT0gJ3VuZGVmaW5lZCcpe1xuXHRcdGFsZXJ0ICgncm93IGlzIHVuZGVmaW5lZCcpO1xuXHR9XG5cdC8vIGxldCByb3cgPSAxO1xuXHRsZXQgcz0nJztcblx0Zm9yIChsZXQgaSA9IDE7IGkgPCA0OyBpKyspe1xuXHRcdHMgPSAnI2J0bi1yb3cnK3JvdysnLScraTtcblx0XHRpZHMucHVzaChzKTtcblx0fSBcblxuXHRsZXQgb3V0ID0gW107XG5cdGZvciAobGV0IGkgaW4gaWRzKSB7XG5cdFx0bGV0IGVsdmFsID0gJChpZHNbaV0pXG5cdFx0XHRcdFx0XHQucGFyZW50KClcblx0XHRcdFx0XHRcdC5wYXJlbnQoKVxuXHRcdFx0XHRcdFx0LmNoaWxkcmVuKCdpbnB1dCcpWzBdO1xuXHRcdGxldCB2YWwgPSAwO1xuXHRcdGlmICh0eXBlb2YgZWx2YWwgIT09ICd1bmRlZmluZWQnKXtcblx0XHRcdHZhbCA9IGVsdmFsLnZhbHVlO1xuXHRcdH1cblx0XHRvdXQucHVzaCh2YWwpO1xuXHR9XG5cdHJldHVybiBvdXQ7XG59O1xuXG4vLyBSZWRyYXcgR2FtZVxuY29uc3QgcmVkcmF3ID0gKGlucHN0cmFycikgPT4ge1xuXHRsZXQgaW5wID0gW107XG5cdC8vIHBhcnNlIGlucHV0XG5cdGZvciAobGV0IGkgPSAwOyBpIDwgaW5wc3RyYXJyLmxlbmd0aDsgaSsrKXtcblx0XHRpbnAucHVzaChwYXJzZUludChpbnBzdHJhcnJbaV0pKTtcblx0fTtcblxuICAgIC8vIGluaXQgdmFsdWVzXG5cdGxldCB0ID0gMSwgLy8gY291dCB2YWx1ZVxuXHRcdGRhdGEgPSBbXSxcblx0XHRjb2wsXG5cdFx0bmV4dEV2ZW50LFxuXHRcdHRtcCA9IDA7XG5cblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBpbnAubGVuZ3RoOyBpKyspe1xuXHRcdGNvbCA9IGk7XG5cdFx0bmV4dEV2ZW50ID0gaW5wW2NvbF07XG5cdFx0aWYgKG5leHRFdmVudCA+IDApe1xuXHRcdFx0YnJlYWs7XG5cdFx0fVxuXHR9XG5cblx0Zm9yIChsZXQgayA9IDA7IGsgPCByb3dOOyBrICs9IDEpIHtcblx0XHRsZXQgcm93ID0gW107XG5cdFx0ZGF0YS5wdXNoKHJvdyk7XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBjb2xOOyBpICs9MSl7XG5cdFx0XHRpZiAodCA9PT0gIG5leHRFdmVudCl7XG5cdFx0XHRcdC8vIGp1bXAgb3ZlciAwIGNvbG9yIGVudHJpZXNcblx0XHRcdFx0dG1wID0gY29sKzE7IC8vIGJsYWNrIGhhcyBpbmRleCAwXG5cdFx0XHRcdC8vIGlmIHNvbWV0aGluZyBpcyB6ZXJvIGdvIGZ1cnRoZXJcblx0XHRcdFx0d2hpbGUgKGlucFsoY29sKzEpJWlucC5sZW5ndGhdIDwgMSl7XG5cdFx0XHRcdFx0Y29sID0gKGNvbCsxKSVpbnAubGVuZ3RoO1xuXHRcdFx0XHR9XG5cdFx0XHRcdG5leHRFdmVudCArPSBpbnBbKGNvbCsxKSVpbnAubGVuZ3RoXTtcblx0XHRcdFx0Y29sID0gKGNvbCsxKSVpbnAubGVuZ3RoOyAvLyBuZXh0IGNvbG9yXG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0bXAgPSAwO1xuXHRcdFx0fVxuXHRcdFx0cm93LnB1c2goW3QsIHRtcF0pO1xuXHRcdFx0dCA9IHQgKyAxO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gZGF0YTtcbn07XG5cbi8vVE9ETyBGSVggVEFCTEVTXG5jb25zdCBoaWdobGlnaHRFbCAgPSAoZWwsY29sLHRpbWUpID0+e1xuICAgJChlbCkuYXR0ciggXCJmaWxsXCIsIGhsb29rdXBbY29sXSk7XG4gICBzZXRUaW1lb3V0KCgpID0+IHskKGVsKS5hdHRyKCBcImZpbGxcIiwgbG9va3VwW2NvbF0pO30sdGltZSoxMDAwKTtcblxufTtcblxuLy9DSEFOR0Ugb24gVE9OIElucHV0IGlzIGFwcGxpZWRcbmNvbnN0IHJlZ2lzdGVySW5wdXRPbkNoYW5nZSA9IChyb3csc3ZnLGxvb2t1cCkgPT4ge1xuXHRsZXQgaWRzID0gW107XG5cdC8vIFRPRE8gdXNlIGFzIHBhcmFtZXRlciBsYXRlclxuXHQvLyBsZXQgcm93ID0gMTtcblx0bGV0IHM9Jyc7XG5cdGZvciAobGV0IGkgPSAxOyBpIDwgNDsgaSsrKXtcblx0XHRzID0gJyNidG4tcm93Jytyb3crJy0nK2k7XG5cdFx0aWRzLnB1c2gocyk7XG5cdH0gXG5cblx0Zm9yIChsZXQgaSBpbiBpZHMpIHtcblx0XHQkKGlkc1tpXSlcblx0XHRcdC5wYXJlbnQoKVxuXHRcdFx0LnBhcmVudCgpXG5cdFx0XHQuY2hpbGRyZW4oJ2lucHV0LmZvcm0tY29udHJvbCcpXG5cdFx0XHQuY2hhbmdlKCgpID0+IHtcblx0XHRcdFx0bGV0IG5ld2RhdGEgPSByZWRyYXcocmVhZElucHV0KHJvdykpO1xuXHRcdFx0XHR1cGRhdGVHcmFwaChuZXdkYXRhLHN2Zyxsb29rdXApO1xuXHRcdFx0fSk7XG5cdH1cbn07XG5cbi8vIFJlZ2lzdGVyIGNvdW50IEJ1dHRvblxuY29uc3QgcmVnaXN0ZXJCdXR0b24gPSAocm93KSA9PiB7XG5cdGxldCBpZHMgPSBbXTtcblx0Ly8gVE9ETyB1c2UgYXMgcGFyYW1ldGVyIGxhdGVyXG5cdC8vbGV0IHJvdyA9IDE7XG5cdGxldCBzPScnO1xuXHRmb3IgKGxldCBpID0gMTsgaSA8IDQ7IGkrKyl7XG5cdFx0cyA9ICcjYnRuLXJvdycrcm93KyctJytpO1xuXHRcdGlkcy5wdXNoKHMpO1xuXHR9IFxuXHRsZXQgZWMgPSBqUXVlcnkuRXZlbnQoICdjaGFuZ2UnICk7XG4gICAgZm9yIChsZXQgaSBpbiBpZHMpIHtcbiAgICBcdCQoaWRzW2ldKVxuXHRcdFx0LnBhcmVudCgpXG5cdFx0XHQuY2hpbGRyZW4oJ3VsLmRyb3Bkb3duLW1lbnUnKVxuXHRcdFx0Lm9uKCdjbGljaycsIChlKSA9PiB7XG5cdFx0XHRcdCQoaWRzW2ldKVxuXHRcdFx0XHQucGFyZW50KClcblx0XHRcdFx0LnBhcmVudCgpXG5cdFx0XHRcdC5jaGlsZHJlbignaW5wdXQuZm9ybS1jb250cm9sOmZpcnN0Jylcblx0XHRcdFx0LmF0dHIoJ3ZhbHVlJyxlLnRhcmdldC50ZXh0KVxuXHRcdFx0XHQvL3NlbmQgY2hhbmdlIGV2ZW50XG5cdFx0XHRcdC50cmlnZ2VyKGVjKTtcblx0XHR9KTtcdFxuICAgIH1cbn07XG5cblxuLy8gUmVnaXN0ZXIgVG9uIGJ1dHRvblxuY29uc3QgcmVnaXN0ZXJUb25CdXR0b24gPSAocm93KSA9PiB7XG5cdGxldCBpZHMgPSBbXTtcblx0Ly8gVE9ETyB1c2UgYXMgcGFyYW1ldGVyIGxhdGVyXG5cdC8vbGV0IHJvdyA9IDE7XG5cdGxldCBzPScnO1xuXG5cdGZvciAobGV0IGkgPSAxOyBpIDwgNDsgaSsrKXtcblx0XHRzID0gJyNidG4tcm93Jytyb3crJy0nK2krJy10b24nO1xuXHRcdGlkcy5wdXNoKHMpO1xuXHR9IFxuXHQvLyBsZXQgZWMgPSBqUXVlcnkuRXZlbnQoICdjaGFuZ2UnICk7XG4gICAgZm9yIChsZXQgaSBpbiBpZHMpIHtcbiAgICBcdCQoaWRzW2ldKVxuXHRcdFx0LnBhcmVudCgpXG5cdFx0XHQuY2hpbGRyZW4oJ3VsLmRyb3Bkb3duLW1lbnUnKVxuXHRcdFx0Lm9uKCdjbGljaycsIChlKSA9PiB7XG5cdFx0XHRcdCQoaWRzW2ldKVxuXHRcdFx0XHQucGFyZW50KClcblx0XHRcdFx0LnBhcmVudCgpXG5cdFx0XHRcdC5jaGlsZHJlbignaW5wdXQuZm9ybS1jb250cm9sOmVxKCAxICknKVxuXHRcdFx0XHQuYXR0cigndmFsdWUnLGUudGFyZ2V0LnRleHQpO1xuXHRcdFx0XHRcblx0XHRcdFx0Ly8gZG8gcGFyYW1ldGVyIGNoYW5nZVxuXHRcdFx0XHQvLyBpbmRleCBoYXZlIHRvIHN1cnZpdmUgOilcblx0XHRcdCAgICBsZXQgdG1wID0gcGFyc2VJbnQoZS50YXJnZXQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LmdldEF0dHJpYnV0ZSgnbnInKSk7XG5cdFx0XHRcdHRvbmVzW3RtcF0uaW5zdHJ1bWVudCA9IGUudGFyZ2V0LnRleHQ7XG5cdFx0XHRcdC8vc2VuZCBjaGFuZ2UgZXZlbnRcblx0XHRcdFx0Ly8udHJpZ2dlcihlYyk7XG5cdFx0fSk7XHRcbiAgICB9XG59O1xuXG5jb25zdCByZWdpc3RlckJsYWNrVG9uQnV0dG9uID0gKCkgPT4ge1xuXHRsZXQgaWRzID0gW107XG5cdC8vIFRPRE8gdXNlIGFzIHBhcmFtZXRlciBsYXRlclxuXHRsZXQgcm93ID0gMTtcblx0bGV0IHMgPSAnI2J0bi1yb3cxLTAtdG9uJztcblx0aWRzLnB1c2gocyk7XG5cdFxuXHQvLyBsZXQgZWMgPSBqUXVlcnkuRXZlbnQoICdjaGFuZ2UnICk7XG4gICAgZm9yIChsZXQgaSBpbiBpZHMpIHtcbiAgICBcdCQoaWRzW2ldKVxuXHRcdFx0LnBhcmVudCgpXG5cdFx0XHQuY2hpbGRyZW4oJ3VsLmRyb3Bkb3duLW1lbnUnKVxuXHRcdFx0Lm9uKCdjbGljaycsIChlKSA9PiB7XG5cdFx0XHRcdCQoaWRzW2ldKVxuXHRcdFx0XHQucGFyZW50KClcblx0XHRcdFx0LnBhcmVudCgpXG5cdFx0XHRcdC5jaGlsZHJlbignaW5wdXQuZm9ybS1jb250cm9sOmZpcnN0Jylcblx0XHRcdFx0LmF0dHIoJ3ZhbHVlJyxlLnRhcmdldC50ZXh0KTtcblxuXHRcdFx0XHR0b25lc1swXS5pbnN0cnVtZW50ID0gZS50YXJnZXQudGV4dDtcblx0XHRcdFx0XG5cdFx0XHRcdC8vIGRvIHBhcmFtZXRlciBjaGFuZ2VcblxuXHRcdFx0XHQvL3NlbmQgY2hhbmdlIGV2ZW50XG5cdFx0XHRcdC8vLnRyaWdnZXIoZWMpO1xuXHRcdH0pO1x0XG5cbiAgICB9XG59O1xuXG5cbi8vIFJlZ2lzdGVyIFZvbHVtZW4gYnV0dG9uXG5jb25zdCByZWdpc3RlclZvbHVtZUJ1dHRvbiA9IChyb3cpID0+IHtcblx0bGV0IGlkcyA9IFtdO1xuXHQvLyBUT0RPIHVzZSBhcyBwYXJhbWV0ZXIgbGF0ZXJcblx0Ly9sZXQgcm93ID0gMTtcblx0bGV0IHM9Jyc7XG5cblx0Zm9yIChsZXQgaSA9IDE7IGkgPCA0OyBpKyspe1xuXHRcdHMgPSAnI2J0bi1yb3cnK3JvdysnLScraSsnLXZvbHVtZSc7XG5cdFx0aWRzLnB1c2gocyk7XG5cdH0gXG5cdC8vIGxldCBlYyA9IGpRdWVyeS5FdmVudCggJ2NoYW5nZScgKTtcbiAgICBmb3IgKGxldCBpIGluIGlkcykge1xuICAgIFx0JChpZHNbaV0pXG5cdFx0XHQucGFyZW50KClcblx0XHRcdC5jaGlsZHJlbigndWwuZHJvcGRvd24tbWVudScpXG5cdFx0XHQub24oJ2NsaWNrJywgKGUpID0+IHtcblx0XHRcdFx0JChpZHNbaV0pXG5cdFx0XHRcdC5wYXJlbnQoKVxuXHRcdFx0XHQucGFyZW50KClcblx0XHRcdFx0LmNoaWxkcmVuKCdpbnB1dC5mb3JtLWNvbnRyb2w6ZXEoIDIgKScpXG5cdFx0XHRcdC5hdHRyKCd2YWx1ZScsZS50YXJnZXQudGV4dCk7XG5cdFx0XHRcdFxuXHRcdFx0XHQvLyBkbyBwYXJhbWV0ZXIgY2hhbmdlXG5cdFx0XHRcdC8vIGluZGV4IGhhdmUgdG8gc3Vydml2ZSA6KVxuXHRcdFx0ICAgIGxldCB0bXAgPSBwYXJzZUludChlLnRhcmdldC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQuZ2V0QXR0cmlidXRlKCducicpKTtcblxuXHRcdFx0XHR0b25lc1t0bXBdLnZvbCA9IGUudGFyZ2V0LnRleHQ7XG5cdFx0XHRcdHRvbmVzW3RtcF0uZ2FpbiA9IHBhcnNlSW50KGUudGFyZ2V0LnRleHQpKjEuMC8xMDA7XG5cdFx0XHRcdC8vc2VuZCBjaGFuZ2UgZXZlbnRcblx0XHRcdFx0Ly8udHJpZ2dlcihlYyk7XG5cdFx0fSk7XHRcbiAgICB9XG59O1xuXG5jb25zdCByZWdpc3RlckJsYWNrVm9sdW1lQnV0dG9uID0gKCkgPT4ge1xuXHRsZXQgaWRzID0gW107XG5cdC8vIFRPRE8gdXNlIGFzIHBhcmFtZXRlciBsYXRlclxuXHRsZXQgcm93ID0gMTtcblx0bGV0IHMgPSAnI2J0bi1yb3cxLTAtdm9sdW1lJztcblx0aWRzLnB1c2gocyk7XG5cdFxuXHQvLyBsZXQgZWMgPSBqUXVlcnkuRXZlbnQoICdjaGFuZ2UnICk7XG4gICAgZm9yIChsZXQgaSBpbiBpZHMpIHtcbiAgICBcdCQoaWRzW2ldKVxuXHRcdFx0LnBhcmVudCgpXG5cdFx0XHQuY2hpbGRyZW4oJ3VsLmRyb3Bkb3duLW1lbnUnKVxuXHRcdFx0Lm9uKCdjbGljaycsIChlKSA9PiB7XG5cdFx0XHRcdCQoaWRzW2ldKVxuXHRcdFx0XHQucGFyZW50KClcblx0XHRcdFx0LnBhcmVudCgpXG5cdFx0XHRcdC5jaGlsZHJlbignaW5wdXQuZm9ybS1jb250cm9sOmVxKCAxICknKVxuXHRcdFx0XHQuYXR0cigndmFsdWUnLGUudGFyZ2V0LnRleHQpO1xuXG5cdFx0XHRcdHRvbmVzWzBdLnZvbCA9IGUudGFyZ2V0LnRleHQ7XG5cdFx0XHRcdHRvbmVzWzBdLmdhaW4gPSBwYXJzZUludChlLnRhcmdldC50ZXh0KSoxLjAvMTAwO1xuXHRcdFx0XHRcblx0XHRcdFx0Ly8gZG8gcGFyYW1ldGVyIGNoYW5nZVxuXG5cdFx0XHRcdC8vc2VuZCBjaGFuZ2UgZXZlbnRcblx0XHRcdFx0Ly8udHJpZ2dlcihlYyk7XG5cdFx0fSk7XHRcblxuICAgIH1cbn07XG5cbmNvbnN0IHJlZ2lzdGVyUGxheUJ1dHRvbiA9ICgpID0+IHtcblx0JCgnI3BsYXltdXNpY2J0bicpLm9uKCdjbGljaycsIChlKSA9PiB7XG5cdFx0Ly8gaXBob25lIGhhY2tcblx0XHQvLyBpZiAoYXVkaW9Db250ZXh0ID09PSBudWxsKXtcblx0XHQvLyBcdHRyeSB7XG4gIC8vICAgXHRcdFx0d2luZG93LkF1ZGlvQ29udGV4dCA9IHdpbmRvdy5BdWRpb0NvbnRleHQgfHwgd2luZG93LndlYmtpdEF1ZGlvQ29udGV4dDtcbiAgLy8gICBcdFx0XHRhdWRpb0NvbnRleHQgPSBuZXcgd2luZG93LkF1ZGlvQ29udGV4dCgpO1xuXHRcdC8vIFx0fSBjYXRjaCAoZSkge1xuICAvLyAgIFx0XHRcdGNvbnNvbGUubG9nKFwiTm8gV2ViIEF1ZGlvIEFQSSBzdXBwb3J0XCIpO1xuXHRcdC8vIFx0fVxuXHRcdC8vIFx0bGV0IG9zY2lsbGF0b3IgPSBhdWRpb0NvbnRleHQuY3JlYXRlT3NjaWxsYXRvcigpO1xuIFx0Ly8gXHRcdFx0b3NjaWxsYXRvci5mcmVxdWVuY3kudmFsdWUgPSA0MDA7XG4gXHQvLyBcdFx0XHRvc2NpbGxhdG9yLmNvbm5lY3QoYXVkaW9Db250ZXh0LmRlc3RpbmF0aW9uKTtcbiBcdC8vIFx0XHRcdG9zY2lsbGF0b3Iuc3RhcnQoMCk7XG4gXHQvLyBcdFx0XHRvc2NpbGxhdG9yLnN0b3AoLjUpXG5cdFx0Ly8gfVxuXHRcdHJ1blNlcSA9IHRydWU7XG5cdFx0cGxheU11c2ljKCk7XG5cdFx0Ly9hbGVydCgnaGVyZScpO1xuXHR9KTtcblx0Ly8gJCgnI3BsYXltdXNpY2J0bicpLm9uKCd0b3VjaGVuZCcsIChlKSA9PiB7XG5cblx0Ly8gXHRydW5TZXEgPSB0cnVlO1xuXHQvLyBcdHBsYXlNdXNpYygpO1xuXHQvLyBcdC8vYWxlcnQoJ2hlcmUnKTtcblx0Ly8gfSk7XG59O1xuXG5jb25zdCByZWdpc3RlclN0b3BCdXR0b24gPSAoKSA9PiB7XG5cdCQoJyNzdG9wbXVzaWNidG4nKS5vbignY2xpY2snLCAoZSkgPT4ge1xuXHRcdHJ1blNlcSA9IGZhbHNlO1xuXHRcdC8vYWxlcnQoJ2hlcmUnKTtcblx0fSk7XG5cdC8vICQoJyNzdG9wbXVzaWNidG4nKS5vbigndG91Y2hlbmQnLCAoZSkgPT4ge1xuXHQvLyBcdHJ1blNlcSA9IGZhbHNlO1xuXHQvLyBcdC8vYWxlcnQoJ2hlcmUnKTtcblx0Ly8gfSk7XG59O1xuXG4vLyBjb25zdCByZWdpc3RlclBhcmFtZXRlckJ1dHRvbiA9ICgpID0+IHtcbi8vIFx0JCgnI3BhcmFtZXRlcmJ0bicpLm9uKCdjbGljaycsIChlKSA9PiB7XG4vLyBcdFx0bGV0IGVsID0gZDMuc2VsZWN0QWxsKCdyZWN0JylbMF1bNF07XG4vLyBcdFx0bGV0IHRpbWUgPSAwLjk7XG4vLyBcdFx0aGlnaGxpZ2h0RWwoZWwsMCx0aW1lKTtcbi8vIFx0fSk7XG4vLyB9O1xuXG5cbi8vIFBhcmFtZXRlciB3ZXJ0ZSBlaW5sZXNlblxuLy8gJCgnI3BhcmFPc3pidG4nKS5vbignY2xpY2snLCAoZSkgPT4ge1xuLy8gXHRsZXQgczIgPSAkKCdpbnB1dFtuYW1lPXNwZWVkXTpjaGVja2VkJywgJyNwYXJhbWV0ZXJNb2RhbCcpLnZhbCgpO1xuLy8gXHRsZXQgcyA9ICQoJ2lucHV0W25hbWU9b3N6Zm9ybV06Y2hlY2tlZCcsICcjcGFyYW1ldGVyTW9kYWwnKS52YWwoKTtcbi8vIFx0Ly9pZiAoISB0eXBlb2YgcyA9PT0gXCJ1bmRlZmluZWRcIiAmJiAhIHR5cGVvZiBzMiAgPT09IFwidW5kZWZpbmVkXCIpe1xuLy8gXHRpZiAoISBmYWxzZSl7XG4vLyBcdFx0b3NjaWxsYXRvclR5cGUgPSBzO1xuLy8gXHRcdHNvdW5kU3BlZWQgPSBwYXJzZUZsb2F0KHMyKTtcbi8vIFx0XHQkKCcjcGFyYW1ldGVyTW9kYWwnKS5tb2RhbCgnaGlkZScpO1xuLy8gXHR9XG4vLyB9KTtcblxuXG5cbi8vIFNvdW5kIERlZmluaXRpb25cblxuXG5jb25zdCBwbGF5U291bmQgPSAoc3RhcnRUaW1lLCBwaXRjaE5yLCBkdXJhdGlvbiwgZ2Fpbk9sZCkgPT4ge1xuXHQvL2xldCBzdGFydFRpbWUgPSBhdWRpb0NvbnRleHQuY3VycmVudFRpbWUgKyBkZWxheTtcbiAgXHRsZXQgZW5kVGltZSA9IHN0YXJ0VGltZSArIGR1cmF0aW9uO1xuICBcdGxldCBwaXRjaCA9IHNvdW5kc1twaXRjaE5yXVswXTtcbiAgXHRsZXQgZ2FpbiA9IHRvbmVzW3BpdGNoTnJdLmdhaW47XG5cbiAgXHRsZXQgb3V0Z2FpbiA9IGF1ZGlvQ29udGV4dC5jcmVhdGVHYWluKCk7XG4gIFx0b3V0Z2Fpbi5nYWluLnZhbHVlID0gZ2FpbjtcbiAgXHRvdXRnYWluLmNvbm5lY3QoYXVkaW9Db250ZXh0LmRlc3RpbmF0aW9uKTsgXHRcblxuICBcdGxldCBlbnZlbG9wZSA9IGF1ZGlvQ29udGV4dC5jcmVhdGVHYWluKCk7XG4gIFx0ZW52ZWxvcGUuY29ubmVjdChvdXRnYWluKTtcbiAgXHRlbnZlbG9wZS5nYWluLnZhbHVlID0gMDtcbiAgXHRcbiAgXHRlbnZlbG9wZS5nYWluLnNldFRhcmdldEF0VGltZSgxLCBzdGFydFRpbWUsIGVudmVsb3BlU3RhcnRFbmRUaW1lWzBdKTtcbiAgXHRlbnZlbG9wZS5nYWluLnNldFRhcmdldEF0VGltZSgwLCBlbmRUaW1lLCBlbnZlbG9wZVN0YXJ0RW5kVGltZVsxXSk7XG5cbiAgXHRsZXQgb3NjaWxsYXRvciA9IGF1ZGlvQ29udGV4dC5jcmVhdGVPc2NpbGxhdG9yKCk7XG4gIFx0b3NjaWxsYXRvci5jb25uZWN0KGVudmVsb3BlKTtcblxuICBcdG9zY2lsbGF0b3IudHlwZSA9IG9zY2lsbGF0b3JUeXBlO1xuICBcdG9zY2lsbGF0b3IuZGV0dW5lLnZhbHVlID0gcGl0Y2ggKiAxMDA7XG4gIFx0b3NjaWxsYXRvci5mcmVxdWVuY3kudmFsdWUgPSAyNDA7XG5cblx0bGV0IHZpYnJhdG8gPSBhdWRpb0NvbnRleHQuY3JlYXRlR2FpbigpO1xuXHR2aWJyYXRvLmdhaW4udmFsdWUgPSB2aWJyYXRvZ2Fpbjtcblx0dmlicmF0by5jb25uZWN0KG9zY2lsbGF0b3IuZGV0dW5lKTtcblxuXHRsZXQgbGZvID0gYXVkaW9Db250ZXh0LmNyZWF0ZU9zY2lsbGF0b3IoKTtcblx0bGZvLmNvbm5lY3QodmlicmF0byk7XG5cdGxmby5mcmVxdWVuY3kudmFsdWUgPWxmb2ZyZXE7IFxuXG5cdG9zY2lsbGF0b3Iuc3RhcnQoc3RhcnRUaW1lKTtcbiAgXHRsZm8uc3RhcnQoc3RhcnRUaW1lKTtcbiAgXHRvc2NpbGxhdG9yLnN0b3AoZW5kVGltZSArMiApO1xuICBcdGxmby5zdG9wKGVuZFRpbWUgKzIpO1xuXG59O1xuXG4vLy8gUGxheSBMb29wXG5jb25zdCBydW5TZXF1ZW5jZXJzID0gKCkgPT4ge1xuXHRpZiAoIXJ1blNlcSB8fCBzb3VuZFF1ZXVlLmxlbmd0aCA9PT0gMCl7Y29uc29sZS5sb2coXCJzdG9wXCIpO3JldHVybjt9XG5cdGxldCBjdCA9IGF1ZGlvQ29udGV4dC5jdXJyZW50VGltZTtcblx0d2hpbGUgKHNvdW5kUXVldWUubGVuZ3RoPjAgJiYgc291bmRRdWV1ZVswXVswXTwgY3QrMC4xNSl7XG5cdFx0Ly9jb25zb2xlLmxvZygnY3Q6JytjdCsncGxhbmVkIHRpbWU6Jytzb3VuZFF1ZXVlWzBdWzBdKTtcblx0XHRsZXQgaXRlbSA9IHNvdW5kUXVldWUuc3BsaWNlKDAsMSk7XG5cdFx0Ly8gcGxheXNvdW5kIChzdGFydHRpbWUsIHBpdGNoLCBkdXJhdGlvbiwgICAgICAgICAgICAgZ2FpaW4pXG5cdFx0Ly9wbGF5U291bmQoaXRlbVswXVswXSxzb3VuZHNbaXRlbVswXVsxXV1bMF0saXRlbVswXVsyXSx0b25lc1tpdGVtWzBdWzFdXS5nYWluKTtcdFx0XG5cdFxuXHRcdHBsYXlTb3VuZChpdGVtWzBdWzBdLGl0ZW1bMF1bMV0saXRlbVswXVsyXSx0b25lc1tpdGVtWzBdWzFdXS5nYWluKTtcdFx0XG5cdFx0Ly8gZWxlbWVudCAgICAgICAgICAgICAgY29sb3IgICAgICAgZHVyYXRpb25cblx0XHRoaWdobGlnaHRFbChpdGVtWzBdWzNdLGl0ZW1bMF1bMV0saXRlbVswXVsyXSk7XG5cdH1cblx0c2V0VGltZW91dChydW5TZXF1ZW5jZXJzLDkwKTtcbn1cblxuLy8vIHNvdW5kcyBzdGFydCBoZXJlXG4vLy8gU291bmQgdmFyXG5sZXQgcnVuU2VxID0gdHJ1ZTtcbmxldCBzb3VuZFF1ZXVlID0gW107XG5cbnZhciBhdWRpb0NvbnRleHQgPSBudWxsO1xuXG50cnkge1xuICAgd2luZG93LkF1ZGlvQ29udGV4dCA9IHdpbmRvdy5BdWRpb0NvbnRleHR8fHdpbmRvdy53ZWJraXRBdWRpb0NvbnRleHQ7XG4gICB2YXIgYXVkaW9Db250ZXh0ID0gbmV3IEF1ZGlvQ29udGV4dCgpO1xufSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUubG9nKFwiTm8gV2ViIEF1ZGlvIEFQSSBzdXBwb3J0XCIpO1xufVxuXG5cbi8vSU9TIFN0YXJ0IElPU0hBQ0tcbiQoJ2JvZHknKS5vbigndG91Y2hlbmQnLCAoZSkgPT4ge1xuXHQvL2FsZXJ0KCdzdGFydCBzb3VuZFxuXHQvLyBjcmVhdGUgZW1wdHkgYnVmZmVyXG5cdHZhciBidWZmZXIgPSBhdWRpb0NvbnRleHQuY3JlYXRlQnVmZmVyKDEsIDEsIDIyMDUwKTtcblx0dmFyIHNvdXJjZSA9IGF1ZGlvQ29udGV4dC5jcmVhdGVCdWZmZXJTb3VyY2UoKTtcblx0c291cmNlLmJ1ZmZlciA9IGJ1ZmZlcjtcblxuXHQvLyBjb25uZWN0IHRvIG91dHB1dCAoeW91ciBzcGVha2Vycylcblx0c291cmNlLmNvbm5lY3QoYXVkaW9Db250ZXh0LmRlc3RpbmF0aW9uKTtcblxuXHQvLyBwbGF5IHRoZSBmaWxlXG5cdGlmICh0eXBlb2Ygc291cmNlLm5vdGVPbiAhPT0gJ3VuZGVmaW5lZCcpe1xuXHRcdHNvdXJjZS5ub3RlT24oMCk7XG5cdH1cblx0XG5cdC8vIHZhciBzcmMgPSBudWxsO1xuXHQvLyBzcmMgPSBhdWRpb0NvbnRleHQuY3JlYXRlT3NjaWxsYXRvcigpO1xuXHQvLyBzcmMudHlwZSA9ICdzcXVhcmUnO1xuXHQvLyBzcmMuZnJlcXVlbmN5LnZhbHVlID0gNDQwO1xuXHQvLyBzcmMuY29ubmVjdChhdWRpb0NvbnRleHQuZGVzdGluYXRpb24pO1xuXHQvLyBsZXQgY3QgPSBhdWRpb0NvbnRleHQuY3VycmVudFRpbWU7XG5cdC8vIHNyYy5zdGFydChjdCswLjUpO1xuXHQvLyBzcmMuc3RvcChjdCsxLjIpO1xufSk7XG4vL0lPUyBFTkRcblxuXG4vLyBTb3VuZCBjb25zdGFuc3RzIHByZXNldHNcbmxldCB0b25lcyA9IFt7XG5cdCducic6MCxcblx0J2dhaW4nOjAuMSxcblx0J3ZvbCc6JzEwJScsXG5cdC8vICdjb2xvcic6JyM0NTQ1NDUnLFxuXHQvLyAnaG92ZXInOicjMDAwMDAwJyxcblx0J2luc3RydW1lbnQnOidEMycsXG5cdCdpZCc6J2lnLXJvdzEtMCcsXG5cdCd2aXNpYmxlJzp0cnVlXG59LFxue1xuXHQnbnInOjEsXG5cdCdnYWluJzowLjgsXG5cdCd2b2wnOic4MCUnLFxuXHQvLyAnY29sb3InOicjMjk2RUFBJyxcblx0Ly8gJ2hvdmVyJzonIzA5NEU4QScsXG5cdCdpbnN0cnVtZW50JzonRTMnLFxuXHQnaWQnOidpZy1yb3cxLTEnLFxuXHQndmlzaWJsZSc6dHJ1ZVxufSxcbntcblx0J25yJzoyLFxuXHQnZ2Fpbic6MC4wLFxuXHQndm9sJzonMCUnLFxuXHQvLyAnY29sb3InOicjNTQ5MUI1Jyxcblx0Ly8gJ2hvdmVyJzonIzA5NEU4QScsXG5cdCdpbnN0cnVtZW50JzonRjMnLFxuXHQnaWQnOidpZy1yb3cxLTInLFxuXHQndmlzaWJsZSc6ZmFsc2Vcbn0sXG57XG5cdCducic6Myxcblx0J2dhaW4nOjAuMCxcblx0J3ZvbCc6JzAlJyxcblx0Ly8gJ2NvbG9yJzonIzU0OTFCNScsXG5cdC8vICdob3Zlcic6JyMwOTRFOEEnLFxuXHQnaW5zdHJ1bWVudCc6J0czJyxcblx0J2lkJzonaWctcm93MS0zJyxcblx0J3Zpc2libGUnOmZhbHNlXG59LFxue1xuXHQnbnInOjQsXG5cdCdnYWluJzowLjUsXG5cdCd2b2wnOic1MCUnLFxuXHQvLyAnY29sb3InOicjNTQ5MUI1Jyxcblx0Ly8gJ2hvdmVyJzonIzA5NEU4QScsXG5cdCdpbnN0cnVtZW50JzonQTQnLFxuXHQnaWQnOidpZy1yb3cyLTEnLFxuXHQndmlzaWJsZSc6ZmFsc2Vcbn0sXG57XG5cdCducic6NSxcblx0J2dhaW4nOjAuMCxcblx0J3ZvbCc6JzAlJyxcblx0Ly8gJ2NvbG9yJzonIzU0OTFCNScsXG5cdC8vICdob3Zlcic6JyMwOTRFOEEnLFxuXHQnaW5zdHJ1bWVudCc6J0I0Jyxcblx0J2lkJzonaWctcm93Mi0yJyxcblx0J3Zpc2libGUnOmZhbHNlXG59LFxue1xuXHQnbnInOjYsXG5cdCdnYWluJzowLjAsXG5cdCd2b2wnOicwJScsXG5cdC8vICdjb2xvcic6JyM1NDkxQjUnLFxuXHQvLyAnaG92ZXInOicjMDk0RThBJyxcblx0J2luc3RydW1lbnQnOidDNCcsXG5cdCdpZCc6J2lnLXJvdzItMycsXG5cdCd2aXNpYmxlJzpmYWxzZVxufSxcbntcblx0J25yJzo3LFxuXHQnZ2Fpbic6MC4zLFxuXHQndm9sJzonMzAlJyxcblx0Ly8gJ2NvbG9yJzonIzU0OTFCNScsXG5cdC8vICdob3Zlcic6JyMwOTRFOEEnLFxuXHQnaW5zdHJ1bWVudCc6J0Q0Jyxcblx0J2lkJzonaWctcm93My0xJyxcblx0J3Zpc2libGUnOmZhbHNlXG59LFxue1xuXHQnbnInOjgsXG5cdCdnYWluJzowLjAsXG5cdCd2b2wnOicwJScsXG5cdC8vICdjb2xvcic6JyM1NDkxQjUnLFxuXHQvLyAnaG92ZXInOicjMDk0RThBJyxcblx0J2luc3RydW1lbnQnOidFNCcsXG5cdCdpZCc6J2lnLXJvdzMtMicsXG5cdCd2aXNpYmxlJzpmYWxzZVxufSxcbntcblx0J25yJzo5LFxuXHQnZ2Fpbic6MC4wLFxuXHQndm9sJzonMCUnLFxuXHQvLyAnY29sb3InOicjNTQ5MUI1Jyxcblx0Ly8gJ2hvdmVyJzonIzA5NEU4QScsXG5cdCdpbnN0cnVtZW50JzonRjQnLFxuXHQnaWQnOidpZy1yb3czLTMnLFxuXHQndmlzaWJsZSc6ZmFsc2Vcbn1dO1xuXG4vLyBzb3VuZHNcbmxldCBub3RlcyA9IHtcblx0J0QzJzoge1xuXHRcdCdmcmVxJzogNDQwLFxuXHRcdCdkZXR1bmUnOiAtNzAwXG5cdH0sXG5cdCdFMyc6IHtcblx0XHQnZnJlcSc6IDQ0MCxcblx0XHQnZGV0dW5lJzogLTUwMFxuXHR9LCBcblx0J0YzJzoge1xuXHRcdCdmcmVxJzogNDQwLFxuXHRcdCdkZXR1bmUnOiAtNDAwXG5cdH0sXG5cdCdHMyc6IHtcblx0XHQnZnJlcSc6IDQ0MCxcblx0XHQnZGV0dW5lJzogLTIwMFxuXHR9LFxuXHQnQTQnOiB7XG5cdFx0J2ZyZXEnOiA0NDAsXG5cdFx0J2RldHVuZSc6IDBcblx0fSxcblx0J0I0Jzoge1xuXHRcdCdmcmVxJzogNDQwLFxuXHRcdCdkZXR1bmUnOiAyMDBcblx0fSxcblx0J0M0Jzoge1xuXHRcdCdmcmVxJzogNDQwLFxuXHRcdCdkZXR1bmUnOiAzMDBcblx0fSxcblx0J0Q0Jzoge1xuXHRcdCdmcmVxJzogNDQwLFxuXHRcdCdkZXR1bmUnOiA1MDBcblx0fSxcblx0J0U0Jzoge1xuXHRcdCdmcmVxJzogNDQwLFxuXHRcdCdkZXR1bmUnOiA3MDBcblx0fSxcblx0J0Y0Jzoge1xuXHRcdCdmcmVxJzogNDQwLFxuXHRcdCdkZXR1bmUnOiA4MDBcblx0fSxcblx0J0c0Jzoge1xuXHRcdCdmcmVxJzogNDQwLFxuXHRcdCdkZXR1bmUnOiAxMDAwXG5cdH1cbn07XG5cblxuXG5sZXQgc291bmRTcGVlZCA9IDAuNTtcbmxldCB0b25lZHVyYXRpb24gPSAwLjM7XG5sZXQgdmlicmF0b2dhaW4gPSAwLjM7XG5sZXQgZW52ZWxvcGVTdGFydEVuZFRpbWUgPSBbMC4wMSwwLjFdO1xubGV0IGxmb2ZyZXEgPSA2OyAgLy81XG4vLyBQYXJhbWV0cml6YXRpb24gb2YgdGhlIDUgdG9uZXMgIFBpdGNoIGR1cmF0aW9uIHZvbHVtZSBnYWluXG4vLyBEZWJyaWNhdGVkIHRvIGJlIHJlbW92ZWRcbi8vIGZpcnN0IGlzdCBibGFjayBzb3VuZFxuY29uc3Qgc291bmRzID0gW1stMTAsIDAuNSwwLjFdLFszLCAwLjUsMC45XSxbMTAsIDAuNSwwLjldLFsxNSwgMC41LDAuOV0sWzAsIDAuNSwwLjldXTtcbmxldCBvc2NpbGxhdG9yVHlwZSA9ICdzYXd0b290aCc7IC8vJ3NpbmUnOyAvLyAnc2F3dG9vdGgnXG5cblxuLy8vIFNvdW5kIE1ldGhvZHNcbmNvbnN0IHBsYXlNdXNpYyA9ICgpID0+IHtcblx0Ly8gZmlsbCBzb3VuZFF1ZXVlXHRcblx0bGV0IHJlY3RhcnIgPSBkMy5zZWxlY3RBbGwoJ3JlY3QnKS5kYXRhKCk7XG5cdGxldCBlbGFyciA9IGQzLnNlbGVjdEFsbCgncmVjdCcpWzBdO1xuICAgIGxldCBzdGFydFRpbWUgPSBhdWRpb0NvbnRleHQuY3VycmVudFRpbWU7XG4gICAgLy9jb25zb2xlLmxvZygnU3RhcnQnK3N0YXJ0VGltZSk7XG4gICAgc291bmRRdWV1ZSA9W107XG5cdGZvciAobGV0IGk9MDsgaSA8IHJlY3RhcnIubGVuZ3RoOyBpKyspIHtcblx0XHRsZXQgdiA9IHJlY3RhcnJbaV1bMV07XG5cdFx0Ly9wbGF5U291bmQoaSxzb3VuZHNbdl1bMF0sc291bmRzW3ZdWzFdLHNvdW5kc1t2XVsyXSk7XG5cdFx0Ly9hbGVydChpKTtcblx0XHRsZXQgdG1wID0gW107XG5cdFx0dG1wLnB1c2goaSpzb3VuZFNwZWVkK3N0YXJ0VGltZSk7XG5cdFx0dG1wLnB1c2godik7XG5cdFx0dG1wLnB1c2godG9uZWR1cmF0aW9uKTtcblx0XHR0bXAucHVzaChlbGFycltpXSk7XG5cdFx0c291bmRRdWV1ZS5wdXNoKHRtcCk7XG5cdH1cblx0Ly9jb25zb2xlLmxvZygnc3RhcnRzZXF1ZW5jZXInK2F1ZGlvQ29udGV4dC5jdXJyZW50VGltZSk7XG4gICAgcnVuU2VxdWVuY2VycygpO1xufTtcblxuLy8gSW5pdCBTY3JlZW5cbmNvbnN0IGluaXRkM2pzID0gKGVsSWQpID0+IHtcblx0Y29uc3Qgd2lkdGggPSAxMjgwLFxuICAgIGhlaWdodCA9IDQ1O1xuICAgIGxldCBzcl92aWV3cG9ydCA9ICcwIDAgJysod2lkdGgrNzApKycgJytoZWlnaHQ7XG4gICAgY29uc3QgZGl2ID0gZDMuc2VsZWN0KGVsSWQpLFxuXHRzdmcgPSBkaXYuYXBwZW5kKCdzdmcnKVxuICAgICAgICAuYXR0cignd2lkdGgnLCB3aWR0aClcbiAgICAgICAgLmF0dHIoJ2hlaWdodCcsIGhlaWdodClcbiAgICAgICAgLmF0dHIoJ3ZpZXdCb3gnLCBzcl92aWV3cG9ydClcbiAgICAgICAgLmF0dHIoJ3ByZXNlcnZlQXNwZWN0UmF0aW8nLCAneE1pZFlNaWQgbWVldCcpO1xuXG4gICAgcmV0dXJuIHN2Zztcbn07XG5cblxuICAgIC8vIENvbnN0YW50c1xuXG4gICAgY29uc3QgcncgPSAyMCxcbiAgICByaCA9IDIwLFxuICAgIHJvd04gPTEsXG4gICAgY29sTiA9NDgsXG4gICAgLy9jb2xvcmRlZmluaXRpb25cbiAgICBsb29rdXBibHVlID0gWycjNDU0NTQ1JywnIzI5NkVBQScsJyM1NDkxQjUnLCcjNzlCRUZBJ10sXG4gICAgbG9va3VwZ3JlZW4gPSBbJyM0NTQ1NDUnLCcjNEJBODRCJywnIzU0NzI0OScsJyMxRjYyNDEnXSxcbiAgICBsb29rdXByZWQgPSBbJyM0NTQ1NDUnLCcjREIzODMzJywnI0IzMEIwQicsJyNBMTEyM0YnXSxcbiAgICBobG9va3VwID0gWycjMDAwMDAwJywnIzA5NEU4QScsJyMwOTRFOEEnLCcjMDk0RThBJ107XG4gICAgLy8gbG9va3VwID0gWycjNDU0NTQ1JywnIzI5NkVBQScsJyNENDNGM0EnLCcjNUNCODVDJywnIzQ2QjBDRiddLFxuICAgIC8vIGhsb29rdXAgPSBbJyMwMDAwMDAnLCcjMDk0RThBJywnI0E0MUYxQScsJyMzQzk4M0MnLCcjMjY5MEFGJ10sXG4gICAgLy9ycmFuZ2UgPSBsb29rdXAubGVuZ3RoO1xuXG4gICAgLy8gYmluZCBkYXRhIGFuZCByZW5kZXIgZDNqc1xuICAgIGNvbnN0IHN2ZyA9IGluaXRkM2pzKCcjY2hhcnQnKTtcbiAgICBsZXQgbXlkYXRhID0gcmVkcmF3KHJlYWRJbnB1dCgxKSk7XG5cdHJlbmRlckdyYXBoKG15ZGF0YSxzdmcsbG9va3VwYmx1ZSk7XG5cbiAgICBjb25zdCBzdmdncmVlbiA9IGluaXRkM2pzKCcjY2hhcnQtMicpO1xuICAgIGxldCBteWRhdGFHcmVlbiA9IHJlZHJhdyhyZWFkSW5wdXQoMikpO1xuXHRyZW5kZXJHcmFwaChteWRhdGFHcmVlbixzdmdncmVlbixsb29rdXBncmVlbik7XG5cbiAgICBjb25zdCBzdmdyZWQgPSBpbml0ZDNqcygnI2NoYXJ0LTMnKTtcbiAgICBsZXQgbXlkYXRhUmVkID0gcmVkcmF3KHJlYWRJbnB1dCgzKSk7XG5cdHJlbmRlckdyYXBoKG15ZGF0YVJlZCxzdmdyZWQsbG9va3VwcmVkKTtcdFxuXG5cdC8vIHJlc3BvbnNpdmUgY2hhbmdlXG4gICAgZDMuc2VsZWN0KHdpbmRvdylcbiAgICBcdC5vbigncmVzaXplJywgKCkgPT4ge1xuXHRcdCAgICAvL2xldCB0YXJnZXRXaWR0aCA9IHN2Zy5ub2RlKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGg7XG5cdFx0ICAgIGxldCB3aW5XaWR0aCA9ICQod2luZG93KS53aWR0aCgpO1xuXHRcdCAgICBzdmcuYXR0cihcIndpZHRoXCIsIHdpbldpZHRoKTtcblx0XHQgICAgc3ZnZ3JlZW4uYXR0cihcIndpZHRoXCIsIHdpbldpZHRoKTtcblx0XHQgICAgc3ZncmVkLmF0dHIoXCJ3aWR0aFwiLCB3aW5XaWR0aCk7XG4gIFx0XHR9KTtcbiAgICAvL1RyaWdlciByZXNpemUgRXZlbnRcbiAgXHRsZXQgdG1wdyA9ICQod2luZG93KS53aWR0aCgpO1xuXHRzdmcuYXR0cignd2lkdGgnLCB0bXB3KTtcblx0c3ZnZ3JlZW4uYXR0cignd2lkdGgnLCB0bXB3KTtcblx0c3ZncmVkLmF0dHIoJ3dpZHRoJywgdG1wdyk7XG5cblx0Ly8gUmVnaXN0ZXIgQnV0dG9uc1xuXHQvLyBibGFja2J1dHRvbiBvbmx5IG9uZSByZWdpc3RyYXRpb25cblx0cmVnaXN0ZXJCbGFja1ZvbHVtZUJ1dHRvbigpO1xuXHRyZWdpc3RlckJsYWNrVG9uQnV0dG9uKCk7XG5cblx0Ly8gUmVnaXN0ZXIgMyByb3dzIFYgQnV0dG9uXG5cdFsxLDIsM10ubWFwKHJlZ2lzdGVyQnV0dG9uKTtcblx0WzEsMiwzXS5tYXAocmVnaXN0ZXJUb25CdXR0b24pO1xuXHRbMSwyLDNdLm1hcChyZWdpc3RlclZvbHVtZUJ1dHRvbik7XG5cblxuXHRyZWdpc3RlcklucHV0T25DaGFuZ2UoMSxzdmcsbG9va3VwYmx1ZSk7XG5cdHJlZ2lzdGVySW5wdXRPbkNoYW5nZSgyLHN2Z2dyZWVuLGxvb2t1cGdyZWVuKTtcblx0cmVnaXN0ZXJJbnB1dE9uQ2hhbmdlKDMsc3ZncmVkLGxvb2t1cHJlZCk7XG5cblxuXHRyZWdpc3RlclBsYXlCdXR0b24oKTtcblx0cmVnaXN0ZXJTdG9wQnV0dG9uKCk7XG5cdC8vcmVnaXN0ZXJQYXJhbWV0ZXJCdXR0b24oKTtcblxuXHRcblxuXG5cdFxuXG4vL2lvcyBoYWNrXG4vLyBcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIGZ1bmN0aW9uKCkge1xuXG4vLyBcdC8vIGNyZWF0ZSBlbXB0eSBidWZmZXJcbi8vIFx0dmFyIGJ1ZmZlciA9IGF1ZGlvQ29udGV4dC5jcmVhdGVCdWZmZXIoMSwgMSwgMjIwNTApO1xuLy8gXHR2YXIgc291cmNlID0gYXVkaW9Db250ZXh0LmNyZWF0ZUJ1ZmZlclNvdXJjZSgpO1xuLy8gXHRzb3VyY2UuYnVmZmVyID0gYnVmZmVyO1xuXG4vLyBcdC8vIGNvbm5lY3QgdG8gb3V0cHV0ICh5b3VyIHNwZWFrZXJzKVxuLy8gXHRzb3VyY2UuY29ubmVjdChhdWRpb0NvbnRleHQuZGVzdGluYXRpb24pO1xuXG4vLyBcdC8vIHBsYXkgdGhlIGZpbGVcbi8vIFx0c291cmNlLm5vdGVPbigwKTtcblxuLy8gfSwgZmFsc2UpO1xuXG5cblxuLy8gd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaHN0YXJ0XCIsIGZ1bmN0aW9uICgpe1x0XG4vLyBcdFx0aWYgKGhhZF90b3VjaClcdFx0cmV0dXJuO1x0XHRcbi8vIFx0XHQvLyBwbGF5IGVtcHR5IGJ1ZmZlciB0byB1bm11dGUgYXVkaW9cdFxuLy8gXHRcdHZhciBidWZmZXIgPSBhdWRpb0NvbnRleHQuY3JlYXRlQnVmZmVyKDEsIDEsIDIyMDUwKTtcdFxuLy8gXHRcdHZhciBzb3VyY2UgPSBhdWRpb0NvbnRleHQuY3JlYXRlQnVmZmVyU291cmNlKCk7XHRcbi8vIFx0XHRzb3VyY2UuYnVmZmVyID0gYnVmZmVyO1x0XG4vLyBcdFx0c291cmNlLmNvbm5lY3QoYXVkaW9Db250ZXh0LmRlc3RpbmF0aW9uKTtcdFxuLy8gXHRcdHNvdXJjZS5zdGFydCgwKTtcdFxuLy8gXHRcdGhhZF90b3VjaCA9IHRydWU7XG4vLyBcdFx0YWxlcnQoXCJtaXN0XCIpO1xuLy8gXHR9KTtcblxuXG5cblxuXG59KTtcblxuXG5cbiJdfQ==
