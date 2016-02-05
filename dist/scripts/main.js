(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

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
			return lookup[d];
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

		//inner structure
		var ingrp = grp.selectAll('g').data(function (d) {
			return d;
		}).enter().append('g').filter(function (d, i) {
			return (typeof d === 'undefined' ? 'undefined' : _typeof(d)) === 'object';
		}).attr('transform', function (d, i) {
			return 'translate(' + 28 * i + ',0)';
		});

		ingrp.selectAll('rect').data(function (d) {
			return d;
		}).enter().append('rect').attr('x', function (d, i) {
			return 7 * i;
		}).attr('fill', function (d, i) {
			return lookup[d];
		}).attr('width', 7).attr('height', rh);

		// For each group, create a set of rectangles and bind
		// them to the inner array (the inner array is already
		// binded to the group)
		grp.selectAll('rect').data(function (d) {
			return d;
		}).enter().append('rect').filter(function (d, i) {
			return typeof d === 'number';
		}).attr('x', function (d, i) {
			return 28 * i;
		}).attr('fill', function (d, i) {
			return lookup[d];
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

	// Reduce data from 3 arrays to one Array

	var reduce3data = function reduce3data(arrB, arrG, arrR) {
		var out = [];
		var outer = [];
		outer.push(out);
		for (var i = 0; i < arrB.length; i++) {
			var tmp = [];
			tmp.push(arrB[i]);
			tmp.push(arrG[i] + 3);
			tmp.push(arrR[i] + 6);
			out.push(tmp);
		}
		return outer;
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
				// just array
				row.push(tmp);
				//row.push([t, tmp]);
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
		'color': '#757575',
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
		'hover': '#346175',
		'instrument': 'F3',
		'id': 'ig-row1-2',
		'visible': false
	}, {
		'nr': 3,
		'gain': 0.0,
		'vol': '0%',
		'color': '#79BEFA',
		'hover': '#599EBA',
		'instrument': 'G3',
		'id': 'ig-row1-3',
		'visible': false
	}, {
		'nr': 4,
		'gain': 0.5,
		'vol': '50%',
		'color': '#4BA84B',
		'hover': '#2B882B',
		'instrument': 'A4',
		'id': 'ig-row2-1',
		'visible': false
	}, {
		'nr': 5,
		'gain': 0.0,
		'vol': '0%',
		'color': '#547249',
		'hover': '#245219',
		'instrument': 'B4',
		'id': 'ig-row2-2',
		'visible': false
	}, {
		'nr': 6,
		'gain': 0.0,
		'vol': '0%',
		'color': '#1F6241',
		'hover': '#1F6241',
		'instrument': 'C4',
		'id': 'ig-row2-3',
		'visible': false
	}, {
		'nr': 7,
		'gain': 0.3,
		'vol': '30%',
		'color': '#DB3833',
		'hover': '#AB1813',
		'instrument': 'D4',
		'id': 'ig-row3-1',
		'visible': false
	}, {
		'nr': 8,
		'gain': 0.0,
		'vol': '0%',
		'color': '#B30B0B',
		'hover': '#530B0B',
		'instrument': 'E4',
		'id': 'ig-row3-2',
		'visible': false
	}, {
		'nr': 9,
		'gain': 0.0,
		'vol': '0%',
		'color': '#A1123F',
		'hover': '#51021F',
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
	//lookupblue = ['#454545','#296EAA','#5491B5','#79BEFA'],
	//lookupgreen = ['#454545','#4BA84B','#547249','#1F6241'],
	// lookupred = ['#454545','#DB3833','#B30B0B','#A1123F'],
	hlookup = ['#000000', '#094E8A', '#094E8A', '#094E8A'];
	// lookup = ['#454545','#296EAA','#D43F3A','#5CB85C','#46B0CF'],
	// hlookup = ['#000000','#094E8A','#A41F1A','#3C983C','#2690AF'],
	//rrange = lookup.length;

	// bind data and render d3js
	var svg = initd3js('#chart');
	var lookupblue = [0, 1, 2, 3].map(function (i) {
		return tones[i].color;
	});
	var mydata = redraw(readInput(1));
	renderGraph(mydata, svg, lookupblue);

	var svggreen = initd3js('#chart-2');
	var lookupgreen = [0, 4, 5, 6].map(function (i) {
		return tones[i].color;
	});
	var mydataGreen = redraw(readInput(2));
	renderGraph(mydataGreen, svggreen, lookupgreen);

	var svgred = initd3js('#chart-3');
	var lookupred = [0, 7, 8, 9].map(function (i) {
		return tones[i].color;
	});
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

	// sum  the data
	var svgsum = initd3js('#chart-sum');
	var lookupall = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(function (i) {
		return tones[i].color;
	});
	//let mydatasum = [[[1,2,3],[0,4,5],[1,4],[4,9],[1,4,7],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0]]];

	var mydatasum = reduce3data(mydata[0], mydataGreen[0], mydataRed[0]);

	renderGraph(mydatasum, svgsum, lookupall);

	// Register Buttons
	// blackbutton only one registration
	registerBlackVolumeButton();
	registerBlackTonButton();

	// Register 3 rows V Button
	// TODO Check REgister Button
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvc2NyaXB0cy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztBQ0FBLEVBQUUsUUFBRixFQUFZLEtBQVosQ0FBa0IsWUFBVTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTJCNUIsS0FBTSxjQUFjLFNBQWQsV0FBYyxDQUFDLElBQUQsRUFBTSxHQUFOLEVBQVUsTUFBVixFQUFxQjtBQUN4QyxNQUFJLE1BQU0sSUFBSSxTQUFKLENBQWMsR0FBZCxFQUNMLElBREssQ0FDQSxJQURBLENBQU4sQ0FEb0M7O0FBSXhDLE1BQUksWUFBWSxJQUFJLFNBQUosQ0FBYyxNQUFkLEVBQXNCLElBQXRCLENBQTJCLFVBQUMsQ0FBRDtVQUFPO0dBQVAsQ0FBM0IsQ0FDZCxJQURjLENBQ1QsTUFEUyxFQUNELFVBQUMsQ0FBRCxFQUFHLENBQUg7VUFBUyxPQUFPLENBQVA7R0FBVCxDQURYLENBSm9DOztBQU94QyxZQUFVLEtBQVYsR0FDRSxNQURGLENBQ1MsTUFEVCxFQUVLLElBRkwsQ0FFVSxHQUZWLEVBRWUsVUFBQyxDQUFELEVBQUksQ0FBSjtVQUFXLEtBQUssQ0FBTDtHQUFYLENBRmYsQ0FHSyxJQUhMLENBR1UsT0FIVixFQUdtQixFQUhuQixFQUlLLElBSkwsQ0FJVSxRQUpWLEVBSW9CLEVBSnBCLEVBUHdDOztBQWF4QyxZQUFVLElBQVYsR0FBaUIsTUFBakIsR0Fid0M7RUFBckIsQ0EzQlE7O0FBMkM1QixLQUFNLGNBQWMsU0FBZCxXQUFjLENBQUMsSUFBRCxFQUFNLEdBQU4sRUFBVSxNQUFWLEVBQXFCOzs7QUFHeEMsTUFBSSxNQUFNLElBQUksU0FBSixDQUFjLEdBQWQsRUFDTCxJQURLLENBQ0EsSUFEQSxFQUVMLEtBRkssR0FHTCxNQUhLLENBR0UsR0FIRixFQUlMLElBSkssQ0FJQSxXQUpBLEVBSWEsVUFBQyxDQUFELEVBQUksQ0FBSjtVQUFVLGtCQUFrQixL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QyxDQUFELEVBQUcsQ0FBSCxFQUFLLENBQUwsRUFBUSxHQUFSLENBQVksb0JBQVosRUExekIyQjs7QUE0ekIzQix1QkFBc0IsQ0FBdEIsRUFBd0IsR0FBeEIsRUFBNEIsVUFBNUIsRUE1ekIyQjtBQTZ6QjNCLHVCQUFzQixDQUF0QixFQUF3QixRQUF4QixFQUFpQyxXQUFqQyxFQTd6QjJCO0FBOHpCM0IsdUJBQXNCLENBQXRCLEVBQXdCLE1BQXhCLEVBQStCLFNBQS9CLEVBOXpCMkI7O0FBaTBCM0Isc0JBajBCMkI7QUFrMEIzQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0NBbDBCaUIsQ0FBbEI7QUFBNEIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcbi8vIGNyZWF0ZSBIVE1MIHN0dWZmXG4vLyBjb25zdCBjcmVhdGVIdG1sVG9uQ29udHJvbCA9IChucikgPT4ge1xuLy8gXHRjb25zdCBwb3NuciA9ICcxJztcblx0XG5cbi8vIFx0bGV0IGVsQ29udGFpbmVyID0gJ3Rvbi1jb250cm9sLScrbnI7XG4vLyBcdGxldCBlbE91dERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJESVZcIik7XG4vLyBcdGVsT3V0RGl2LnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwiY29sLXhzLTNcIik7XG5cdFxuLy8gXHRsZXQgZWxpbnB1dEdyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIkRJVlwiKTtcbi8vIFx0ZWxpbnB1dEdyb3VwLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwiaW5wdXQtZ3JvdXAtYnRuXCIpOyBcbi8vIFx0ZWxPdXREaXYuYXBwZW5kQ2hpbGQoZWxpbnB1dEdyb3VwKTtcbi8vIFx0Ly8gQlVUVE9OXG4vLyBcdGxldCB0ZXh0bm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFwiIFphaGxcIik7IFxuLy8gXHRsZXQgYnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIkJVVFRPTlwiKTtcbi8vIFx0bGV0IHNpZD0nYnRuLXJvdycrbnIrJy0nK3Bvc25yO1xuLy8gXHRidG4uc2V0QXR0cmlidXRlKFwiaWRcIiwgc2lkKTtcbi8vIFx0YnRuLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwiYnRuIGJ0bi1pbmZvIGRyb3Bkb3duLXRvZ2dsZVwiKTtcbi8vIFx0YnRuLmFwcGVuZENoaWxkKHRleHRub2RlKTtcbi8vIFx0ZWxpbnB1dEdyb3VwLmFwcGVuZENoaWxkKGJ0bik7XG4vLyBcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVsQ29udGFpbmVyKS5hcHBlbmRDaGlsZChlbE91dERpdik7XG5cblxuLy8gfTtcblxuLy8gRDNKU1xuY29uc3QgdXBkYXRlR3JhcGggPSAoZGF0YSxzdmcsbG9va3VwKSA9PiB7XG5cdGxldCBncnAgPSBzdmcuc2VsZWN0QWxsKCdnJylcblx0ICAgIC5kYXRhKGRhdGEpO1xuXG5cdGxldCBzZWxlY3Rpb24gPSBncnAuc2VsZWN0QWxsKCdyZWN0JykuZGF0YSgoZCkgPT4gZClcblx0XHQuYXR0cignZmlsbCcsIChkLGkpID0+IGxvb2t1cFtkXSk7XG5cblx0c2VsZWN0aW9uLmVudGVyKClcblx0XHQuYXBwZW5kKCdyZWN0Jylcblx0ICAgIC5hdHRyKCd4JywgKGQsIGkpID0+ICAyOCAqIGkpXG5cdCAgICAuYXR0cignd2lkdGgnLCBydylcblx0ICAgIC5hdHRyKCdoZWlnaHQnLCByaCk7XG5cblx0c2VsZWN0aW9uLmV4aXQoKS5yZW1vdmUoKTsgICAgXG59O1xuXG5jb25zdCByZW5kZXJHcmFwaCA9IChkYXRhLHN2Zyxsb29rdXApID0+IHtcblx0Ly8gQ3JlYXRlIGEgZ3JvdXAgZm9yIGVhY2ggcm93IGluIHRoZSBkYXRhIG1hdHJpeCBhbmRcblx0Ly8gdHJhbnNsYXRlIHRoZSBncm91cCB2ZXJ0aWNhbGx5XG5cdGxldCBncnAgPSBzdmcuc2VsZWN0QWxsKCdnJylcblx0ICAgIC5kYXRhKGRhdGEpXG5cdCAgICAuZW50ZXIoKVxuXHQgICAgLmFwcGVuZCgnZycpXG5cdCAgICAuYXR0cigndHJhbnNmb3JtJywgKGQsIGkpID0+ICd0cmFuc2xhdGUoMCwgJyArIDU0ICogaSArICcpJyk7ICBcblxuXHQvL2lubmVyIHN0cnVjdHVyZVxuXHRsZXQgaW5ncnAgPSBncnAuc2VsZWN0QWxsKCdnJylcblx0ICAgIC5kYXRhKChkKSA9PiBkKVxuXHQgICAgLmVudGVyKClcblx0ICAgIC5hcHBlbmQoJ2cnKVxuXHQgICAgLmZpbHRlciggKGQsaSkgPT4gdHlwZW9mIGQgPT09ICdvYmplY3QnKVxuXHQgICAgLmF0dHIoJ3RyYW5zZm9ybScsIChkLCBpKSA9PiAndHJhbnNsYXRlKCcgKyAyOCAqIGkgKyAnLDApJyk7XG5cblxuXHRpbmdycC5zZWxlY3RBbGwoJ3JlY3QnKVxuXHQgICAgLmRhdGEoKGQpID0+IGQpXG5cdCAgICAuZW50ZXIoKVxuXHQgICAgLmFwcGVuZCgncmVjdCcpXG5cdCAgICBcdC5hdHRyKCd4JywgKGQsIGkpID0+ICA3ICogaSlcblx0ICAgICAgICAuYXR0cignZmlsbCcsIChkLGkpID0+IGxvb2t1cFtkXSlcblx0ICAgICAgICAuYXR0cignd2lkdGgnLCA3KVxuXHQgICAgICAgIC5hdHRyKCdoZWlnaHQnLCByaCk7ICBcblxuXHQvLyBGb3IgZWFjaCBncm91cCwgY3JlYXRlIGEgc2V0IG9mIHJlY3RhbmdsZXMgYW5kIGJpbmQgXG5cdC8vIHRoZW0gdG8gdGhlIGlubmVyIGFycmF5ICh0aGUgaW5uZXIgYXJyYXkgaXMgYWxyZWFkeVxuXHQvLyBiaW5kZWQgdG8gdGhlIGdyb3VwKVxuXHRncnAuc2VsZWN0QWxsKCdyZWN0Jylcblx0ICAgIC5kYXRhKChkKSA9PiBkKVxuXHQgICAgLmVudGVyKClcblx0ICAgIC5hcHBlbmQoJ3JlY3QnKVxuXHQgICAgXHQuZmlsdGVyKCAoZCxpKSA9PiB0eXBlb2YgZCA9PT0gJ251bWJlcicpXG5cdCAgICAgICAgLmF0dHIoJ3gnLCAoZCwgaSkgPT4gIDI4ICogaSlcblx0ICAgICAgICAuYXR0cignZmlsbCcsIChkLGkpID0+IGxvb2t1cFtkXSlcblx0ICAgICAgICAuYXR0cignd2lkdGgnLCBydylcblx0ICAgICAgICAuYXR0cignaGVpZ2h0JywgcmgpOyAgICAgXG5cblx0Ly9Nb2R1bG8gMTAgdGlja3MgICAgICAgIFxuXHRncnAuc2VsZWN0QWxsKCdsaW5lJylcblx0ICAgIC5kYXRhKChkKSA9PiBkKVxuXHQgICAgLmVudGVyKCkuYXBwZW5kKCdsaW5lJylcblx0ICAgIC5maWx0ZXIoKGQsaSkgPT4gaSUxMD09PTApXG4gIFx0XHRcdC5hdHRyKCd4MScsICAoZCwgaSkgPT4gMjgwICogaSsxKVxuICBcdFx0XHQuYXR0cigneTEnLCAyMClcbiAgXHRcdFx0LmF0dHIoJ3gyJywgKGQsIGkpID0+IDI4MCAqIGkrMSlcbiAgXHRcdFx0LmF0dHIoJ3kyJyw0MClcbiAgXHRcdFx0LnN0eWxlKCdzdHJva2UnLCAnYmxhY2snKVxuICBcdFx0XHQuc3R5bGUoJ3N0cm9rZS13aWR0aCcsJzJweCcpOyAgICAgIFxuXG4gIFx0Ly8gVGV4dCBcbiAgXHRncnAuc2VsZWN0QWxsKCd0ZXh0Jylcblx0ICAgIC5kYXRhKChkKSA9PiBkKVxuXHQgICAgLmVudGVyKCkuYXBwZW5kKCd0ZXh0Jylcblx0ICAgIC5maWx0ZXIoKGQsaSkgPT4gaSUxMD09PTApXG5cdCAgICBcdC5hdHRyKCd4JywgKGQsIGkpID0+IHsgcmV0dXJuIDI4MCAqIGkrNTsgfSlcblx0ICAgIFx0LmF0dHIoJ3knLCAnMzgnKSAgXG5cdCAgICBcdC5hdHRyKCdmb250LWZhbWlseScsICdzYW5zLXNlcmlmJykgXG5cdCAgICBcdC50ZXh0KCAoZCwgaSxrKSA9PiBrKjQwK2kqMTArMSk7IFxufTtcblxuLy8gZ2V0IHZhbHVlc1xuLy9jb25zdCBnZXRCdXR0b25JZHMgPSAoKSA9PiBbJyNidG4tcm93MS0xJywnI2J0bi1yb3cxLTInLCcjYnRuLXJvdzEtMycsJyNidG4tcm93MS00J107XG5cbi8vIHJlYWRzIFBhcmFtZXRlciBUb24gWmFobCBmb3Igcm93IG9uZVxuY29uc3QgcmVhZElucHV0ID0gKHJvdykgPT4ge1xuXHRsZXQgaWRzID0gW107XG5cdC8vIFRPRE8gdXNlIGFzIHBhcmFtZXRlciBsYXRlclxuXHRpZiAodHlwZW9mIHJvdyA9PT0gJ3VuZGVmaW5lZCcpe1xuXHRcdGFsZXJ0ICgncm93IGlzIHVuZGVmaW5lZCcpO1xuXHR9XG5cdC8vIGxldCByb3cgPSAxO1xuXHRsZXQgcz0nJztcblx0Zm9yIChsZXQgaSA9IDE7IGkgPCA0OyBpKyspe1xuXHRcdHMgPSAnI2J0bi1yb3cnK3JvdysnLScraTtcblx0XHRpZHMucHVzaChzKTtcblx0fSBcblxuXHRsZXQgb3V0ID0gW107XG5cdGZvciAobGV0IGkgaW4gaWRzKSB7XG5cdFx0bGV0IGVsdmFsID0gJChpZHNbaV0pXG5cdFx0XHRcdFx0XHQucGFyZW50KClcblx0XHRcdFx0XHRcdC5wYXJlbnQoKVxuXHRcdFx0XHRcdFx0LmNoaWxkcmVuKCdpbnB1dCcpWzBdO1xuXHRcdGxldCB2YWwgPSAwO1xuXHRcdGlmICh0eXBlb2YgZWx2YWwgIT09ICd1bmRlZmluZWQnKXtcblx0XHRcdHZhbCA9IGVsdmFsLnZhbHVlO1xuXHRcdH1cblx0XHRvdXQucHVzaCh2YWwpO1xuXHR9XG5cdHJldHVybiBvdXQ7XG59O1xuXG4vLyBSZWR1Y2UgZGF0YSBmcm9tIDMgYXJyYXlzIHRvIG9uZSBBcnJheVxuXG5jb25zdCByZWR1Y2UzZGF0YSA9IChhcnJCLGFyckcsYXJyUikgPT4ge1xuXHRsZXQgb3V0ID0gW107XG5cdGxldCBvdXRlciA9IFtdO1xuXHRvdXRlci5wdXNoKG91dCk7XG5cdGZvcihsZXQgaT0wOyBpPGFyckIubGVuZ3RoOyBpKyspe1xuXHRcdGxldCB0bXAgPSBbXTtcblx0XHR0bXAucHVzaChhcnJCW2ldKTtcblx0XHR0bXAucHVzaChhcnJHW2ldKzMpO1xuXHRcdHRtcC5wdXNoKGFyclJbaV0rNik7XG5cdFx0b3V0LnB1c2godG1wKTtcblx0fVxuXHRyZXR1cm4gb3V0ZXI7XG59O1xuXG5cblxuLy8gUmVkcmF3IEdhbWVcbmNvbnN0IHJlZHJhdyA9IChpbnBzdHJhcnIpID0+IHtcblx0bGV0IGlucCA9IFtdO1xuXHQvLyBwYXJzZSBpbnB1dFxuXHRmb3IgKGxldCBpID0gMDsgaSA8IGlucHN0cmFyci5sZW5ndGg7IGkrKyl7XG5cdFx0aW5wLnB1c2gocGFyc2VJbnQoaW5wc3RyYXJyW2ldKSk7XG5cdH07XG5cbiAgICAvLyBpbml0IHZhbHVlc1xuXHRsZXQgdCA9IDEsIC8vIGNvdXQgdmFsdWVcblx0XHRkYXRhID0gW10sXG5cdFx0Y29sLFxuXHRcdG5leHRFdmVudCxcblx0XHR0bXAgPSAwO1xuXG5cdGZvciAobGV0IGkgPSAwOyBpIDwgaW5wLmxlbmd0aDsgaSsrKXtcblx0XHRjb2wgPSBpO1xuXHRcdG5leHRFdmVudCA9IGlucFtjb2xdO1xuXHRcdGlmIChuZXh0RXZlbnQgPiAwKXtcblx0XHRcdGJyZWFrO1xuXHRcdH1cblx0fVxuXG5cdGZvciAobGV0IGsgPSAwOyBrIDwgcm93TjsgayArPSAxKSB7XG5cdFx0bGV0IHJvdyA9IFtdO1xuXHRcdGRhdGEucHVzaChyb3cpO1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgY29sTjsgaSArPTEpe1xuXHRcdFx0aWYgKHQgPT09ICBuZXh0RXZlbnQpe1xuXHRcdFx0XHQvLyBqdW1wIG92ZXIgMCBjb2xvciBlbnRyaWVzXG5cdFx0XHRcdHRtcCA9IGNvbCsxOyAvLyBibGFjayBoYXMgaW5kZXggMFxuXHRcdFx0XHQvLyBpZiBzb21ldGhpbmcgaXMgemVybyBnbyBmdXJ0aGVyXG5cdFx0XHRcdHdoaWxlIChpbnBbKGNvbCsxKSVpbnAubGVuZ3RoXSA8IDEpe1xuXHRcdFx0XHRcdGNvbCA9IChjb2wrMSklaW5wLmxlbmd0aDtcblx0XHRcdFx0fVxuXHRcdFx0XHRuZXh0RXZlbnQgKz0gaW5wWyhjb2wrMSklaW5wLmxlbmd0aF07XG5cdFx0XHRcdGNvbCA9IChjb2wrMSklaW5wLmxlbmd0aDsgLy8gbmV4dCBjb2xvclxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dG1wID0gMDtcblx0XHRcdH1cblx0XHRcdC8vIGp1c3QgYXJyYXlcblx0XHRcdHJvdy5wdXNoKHRtcCk7XG5cdFx0XHQvL3Jvdy5wdXNoKFt0LCB0bXBdKTtcblx0XHRcdHQgPSB0ICsgMTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIGRhdGE7XG59O1xuXG4vL1RPRE8gRklYIFRBQkxFU1xuY29uc3QgaGlnaGxpZ2h0RWwgID0gKGVsLGNvbCx0aW1lKSA9PntcbiAgICQoZWwpLmF0dHIoIFwiZmlsbFwiLCBobG9va3VwW2NvbF0pO1xuICAgc2V0VGltZW91dCgoKSA9PiB7JChlbCkuYXR0ciggXCJmaWxsXCIsIGxvb2t1cFtjb2xdKTt9LHRpbWUqMTAwMCk7XG5cbn07XG5cbi8vQ0hBTkdFIG9uIFRPTiBJbnB1dCBpcyBhcHBsaWVkXG5jb25zdCByZWdpc3RlcklucHV0T25DaGFuZ2UgPSAocm93LHN2Zyxsb29rdXApID0+IHtcblx0bGV0IGlkcyA9IFtdO1xuXHQvLyBUT0RPIHVzZSBhcyBwYXJhbWV0ZXIgbGF0ZXJcblx0Ly8gbGV0IHJvdyA9IDE7XG5cdGxldCBzPScnO1xuXHRmb3IgKGxldCBpID0gMTsgaSA8IDQ7IGkrKyl7XG5cdFx0cyA9ICcjYnRuLXJvdycrcm93KyctJytpO1xuXHRcdGlkcy5wdXNoKHMpO1xuXHR9IFxuXG5cdGZvciAobGV0IGkgaW4gaWRzKSB7XG5cdFx0JChpZHNbaV0pXG5cdFx0XHQucGFyZW50KClcblx0XHRcdC5wYXJlbnQoKVxuXHRcdFx0LmNoaWxkcmVuKCdpbnB1dC5mb3JtLWNvbnRyb2wnKVxuXHRcdFx0LmNoYW5nZSgoKSA9PiB7XG5cdFx0XHRcdGxldCBuZXdkYXRhID0gcmVkcmF3KHJlYWRJbnB1dChyb3cpKTtcblx0XHRcdFx0dXBkYXRlR3JhcGgobmV3ZGF0YSxzdmcsbG9va3VwKTtcblx0XHRcdH0pO1xuXHR9XG59O1xuXG4vLyBSZWdpc3RlciBjb3VudCBCdXR0b25cbmNvbnN0IHJlZ2lzdGVyQnV0dG9uID0gKHJvdykgPT4ge1xuXHRsZXQgaWRzID0gW107XG5cdC8vIFRPRE8gdXNlIGFzIHBhcmFtZXRlciBsYXRlclxuXHQvL2xldCByb3cgPSAxO1xuXHRsZXQgcz0nJztcblx0Zm9yIChsZXQgaSA9IDE7IGkgPCA0OyBpKyspe1xuXHRcdHMgPSAnI2J0bi1yb3cnK3JvdysnLScraTtcblx0XHRpZHMucHVzaChzKTtcblx0fSBcblx0bGV0IGVjID0galF1ZXJ5LkV2ZW50KCAnY2hhbmdlJyApO1xuICAgIGZvciAobGV0IGkgaW4gaWRzKSB7XG4gICAgXHQkKGlkc1tpXSlcblx0XHRcdC5wYXJlbnQoKVxuXHRcdFx0LmNoaWxkcmVuKCd1bC5kcm9wZG93bi1tZW51Jylcblx0XHRcdC5vbignY2xpY2snLCAoZSkgPT4ge1xuXHRcdFx0XHQkKGlkc1tpXSlcblx0XHRcdFx0LnBhcmVudCgpXG5cdFx0XHRcdC5wYXJlbnQoKVxuXHRcdFx0XHQuY2hpbGRyZW4oJ2lucHV0LmZvcm0tY29udHJvbDpmaXJzdCcpXG5cdFx0XHRcdC5hdHRyKCd2YWx1ZScsZS50YXJnZXQudGV4dClcblx0XHRcdFx0Ly9zZW5kIGNoYW5nZSBldmVudFxuXHRcdFx0XHQudHJpZ2dlcihlYyk7XG5cdFx0fSk7XHRcbiAgICB9XG59O1xuXG5cbi8vIFJlZ2lzdGVyIFRvbiBidXR0b25cbmNvbnN0IHJlZ2lzdGVyVG9uQnV0dG9uID0gKHJvdykgPT4ge1xuXHRsZXQgaWRzID0gW107XG5cdC8vIFRPRE8gdXNlIGFzIHBhcmFtZXRlciBsYXRlclxuXHQvL2xldCByb3cgPSAxO1xuXHRsZXQgcz0nJztcblxuXHRmb3IgKGxldCBpID0gMTsgaSA8IDQ7IGkrKyl7XG5cdFx0cyA9ICcjYnRuLXJvdycrcm93KyctJytpKyctdG9uJztcblx0XHRpZHMucHVzaChzKTtcblx0fSBcblx0Ly8gbGV0IGVjID0galF1ZXJ5LkV2ZW50KCAnY2hhbmdlJyApO1xuICAgIGZvciAobGV0IGkgaW4gaWRzKSB7XG4gICAgXHQkKGlkc1tpXSlcblx0XHRcdC5wYXJlbnQoKVxuXHRcdFx0LmNoaWxkcmVuKCd1bC5kcm9wZG93bi1tZW51Jylcblx0XHRcdC5vbignY2xpY2snLCAoZSkgPT4ge1xuXHRcdFx0XHQkKGlkc1tpXSlcblx0XHRcdFx0LnBhcmVudCgpXG5cdFx0XHRcdC5wYXJlbnQoKVxuXHRcdFx0XHQuY2hpbGRyZW4oJ2lucHV0LmZvcm0tY29udHJvbDplcSggMSApJylcblx0XHRcdFx0LmF0dHIoJ3ZhbHVlJyxlLnRhcmdldC50ZXh0KTtcblx0XHRcdFx0XG5cdFx0XHRcdC8vIGRvIHBhcmFtZXRlciBjaGFuZ2Vcblx0XHRcdFx0Ly8gaW5kZXggaGF2ZSB0byBzdXJ2aXZlIDopXG5cdFx0XHQgICAgbGV0IHRtcCA9IHBhcnNlSW50KGUudGFyZ2V0LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5nZXRBdHRyaWJ1dGUoJ25yJykpO1xuXHRcdFx0XHR0b25lc1t0bXBdLmluc3RydW1lbnQgPSBlLnRhcmdldC50ZXh0O1xuXHRcdFx0XHQvL3NlbmQgY2hhbmdlIGV2ZW50XG5cdFx0XHRcdC8vLnRyaWdnZXIoZWMpO1xuXHRcdH0pO1x0XG4gICAgfVxufTtcblxuY29uc3QgcmVnaXN0ZXJCbGFja1RvbkJ1dHRvbiA9ICgpID0+IHtcblx0bGV0IGlkcyA9IFtdO1xuXHQvLyBUT0RPIHVzZSBhcyBwYXJhbWV0ZXIgbGF0ZXJcblx0bGV0IHJvdyA9IDE7XG5cdGxldCBzID0gJyNidG4tcm93MS0wLXRvbic7XG5cdGlkcy5wdXNoKHMpO1xuXHRcblx0Ly8gbGV0IGVjID0galF1ZXJ5LkV2ZW50KCAnY2hhbmdlJyApO1xuICAgIGZvciAobGV0IGkgaW4gaWRzKSB7XG4gICAgXHQkKGlkc1tpXSlcblx0XHRcdC5wYXJlbnQoKVxuXHRcdFx0LmNoaWxkcmVuKCd1bC5kcm9wZG93bi1tZW51Jylcblx0XHRcdC5vbignY2xpY2snLCAoZSkgPT4ge1xuXHRcdFx0XHQkKGlkc1tpXSlcblx0XHRcdFx0LnBhcmVudCgpXG5cdFx0XHRcdC5wYXJlbnQoKVxuXHRcdFx0XHQuY2hpbGRyZW4oJ2lucHV0LmZvcm0tY29udHJvbDpmaXJzdCcpXG5cdFx0XHRcdC5hdHRyKCd2YWx1ZScsZS50YXJnZXQudGV4dCk7XG5cblx0XHRcdFx0dG9uZXNbMF0uaW5zdHJ1bWVudCA9IGUudGFyZ2V0LnRleHQ7XG5cdFx0XHRcdFxuXHRcdFx0XHQvLyBkbyBwYXJhbWV0ZXIgY2hhbmdlXG5cblx0XHRcdFx0Ly9zZW5kIGNoYW5nZSBldmVudFxuXHRcdFx0XHQvLy50cmlnZ2VyKGVjKTtcblx0XHR9KTtcdFxuXG4gICAgfVxufTtcblxuXG4vLyBSZWdpc3RlciBWb2x1bWVuIGJ1dHRvblxuY29uc3QgcmVnaXN0ZXJWb2x1bWVCdXR0b24gPSAocm93KSA9PiB7XG5cdGxldCBpZHMgPSBbXTtcblx0Ly8gVE9ETyB1c2UgYXMgcGFyYW1ldGVyIGxhdGVyXG5cdC8vbGV0IHJvdyA9IDE7XG5cdGxldCBzPScnO1xuXG5cdGZvciAobGV0IGkgPSAxOyBpIDwgNDsgaSsrKXtcblx0XHRzID0gJyNidG4tcm93Jytyb3crJy0nK2krJy12b2x1bWUnO1xuXHRcdGlkcy5wdXNoKHMpO1xuXHR9IFxuXHQvLyBsZXQgZWMgPSBqUXVlcnkuRXZlbnQoICdjaGFuZ2UnICk7XG4gICAgZm9yIChsZXQgaSBpbiBpZHMpIHtcbiAgICBcdCQoaWRzW2ldKVxuXHRcdFx0LnBhcmVudCgpXG5cdFx0XHQuY2hpbGRyZW4oJ3VsLmRyb3Bkb3duLW1lbnUnKVxuXHRcdFx0Lm9uKCdjbGljaycsIChlKSA9PiB7XG5cdFx0XHRcdCQoaWRzW2ldKVxuXHRcdFx0XHQucGFyZW50KClcblx0XHRcdFx0LnBhcmVudCgpXG5cdFx0XHRcdC5jaGlsZHJlbignaW5wdXQuZm9ybS1jb250cm9sOmVxKCAyICknKVxuXHRcdFx0XHQuYXR0cigndmFsdWUnLGUudGFyZ2V0LnRleHQpO1xuXHRcdFx0XHRcblx0XHRcdFx0Ly8gZG8gcGFyYW1ldGVyIGNoYW5nZVxuXHRcdFx0XHQvLyBpbmRleCBoYXZlIHRvIHN1cnZpdmUgOilcblx0XHRcdCAgICBsZXQgdG1wID0gcGFyc2VJbnQoZS50YXJnZXQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LmdldEF0dHJpYnV0ZSgnbnInKSk7XG5cblx0XHRcdFx0dG9uZXNbdG1wXS52b2wgPSBlLnRhcmdldC50ZXh0O1xuXHRcdFx0XHR0b25lc1t0bXBdLmdhaW4gPSBwYXJzZUludChlLnRhcmdldC50ZXh0KSoxLjAvMTAwO1xuXHRcdFx0XHQvL3NlbmQgY2hhbmdlIGV2ZW50XG5cdFx0XHRcdC8vLnRyaWdnZXIoZWMpO1xuXHRcdH0pO1x0XG4gICAgfVxufTtcblxuY29uc3QgcmVnaXN0ZXJCbGFja1ZvbHVtZUJ1dHRvbiA9ICgpID0+IHtcblx0bGV0IGlkcyA9IFtdO1xuXHQvLyBUT0RPIHVzZSBhcyBwYXJhbWV0ZXIgbGF0ZXJcblx0bGV0IHJvdyA9IDE7XG5cdGxldCBzID0gJyNidG4tcm93MS0wLXZvbHVtZSc7XG5cdGlkcy5wdXNoKHMpO1xuXHRcblx0Ly8gbGV0IGVjID0galF1ZXJ5LkV2ZW50KCAnY2hhbmdlJyApO1xuICAgIGZvciAobGV0IGkgaW4gaWRzKSB7XG4gICAgXHQkKGlkc1tpXSlcblx0XHRcdC5wYXJlbnQoKVxuXHRcdFx0LmNoaWxkcmVuKCd1bC5kcm9wZG93bi1tZW51Jylcblx0XHRcdC5vbignY2xpY2snLCAoZSkgPT4ge1xuXHRcdFx0XHQkKGlkc1tpXSlcblx0XHRcdFx0LnBhcmVudCgpXG5cdFx0XHRcdC5wYXJlbnQoKVxuXHRcdFx0XHQuY2hpbGRyZW4oJ2lucHV0LmZvcm0tY29udHJvbDplcSggMSApJylcblx0XHRcdFx0LmF0dHIoJ3ZhbHVlJyxlLnRhcmdldC50ZXh0KTtcblxuXHRcdFx0XHR0b25lc1swXS52b2wgPSBlLnRhcmdldC50ZXh0O1xuXHRcdFx0XHR0b25lc1swXS5nYWluID0gcGFyc2VJbnQoZS50YXJnZXQudGV4dCkqMS4wLzEwMDtcblx0XHRcdFx0XG5cdFx0XHRcdC8vIGRvIHBhcmFtZXRlciBjaGFuZ2VcblxuXHRcdFx0XHQvL3NlbmQgY2hhbmdlIGV2ZW50XG5cdFx0XHRcdC8vLnRyaWdnZXIoZWMpO1xuXHRcdH0pO1x0XG5cbiAgICB9XG59O1xuXG5jb25zdCByZWdpc3RlclBsYXlCdXR0b24gPSAoKSA9PiB7XG5cdCQoJyNwbGF5bXVzaWNidG4nKS5vbignY2xpY2snLCAoZSkgPT4ge1xuXHRcdC8vIGlwaG9uZSBoYWNrXG5cdFx0Ly8gaWYgKGF1ZGlvQ29udGV4dCA9PT0gbnVsbCl7XG5cdFx0Ly8gXHR0cnkge1xuICAvLyAgIFx0XHRcdHdpbmRvdy5BdWRpb0NvbnRleHQgPSB3aW5kb3cuQXVkaW9Db250ZXh0IHx8IHdpbmRvdy53ZWJraXRBdWRpb0NvbnRleHQ7XG4gIC8vICAgXHRcdFx0YXVkaW9Db250ZXh0ID0gbmV3IHdpbmRvdy5BdWRpb0NvbnRleHQoKTtcblx0XHQvLyBcdH0gY2F0Y2ggKGUpIHtcbiAgLy8gICBcdFx0XHRjb25zb2xlLmxvZyhcIk5vIFdlYiBBdWRpbyBBUEkgc3VwcG9ydFwiKTtcblx0XHQvLyBcdH1cblx0XHQvLyBcdGxldCBvc2NpbGxhdG9yID0gYXVkaW9Db250ZXh0LmNyZWF0ZU9zY2lsbGF0b3IoKTtcbiBcdC8vIFx0XHRcdG9zY2lsbGF0b3IuZnJlcXVlbmN5LnZhbHVlID0gNDAwO1xuIFx0Ly8gXHRcdFx0b3NjaWxsYXRvci5jb25uZWN0KGF1ZGlvQ29udGV4dC5kZXN0aW5hdGlvbik7XG4gXHQvLyBcdFx0XHRvc2NpbGxhdG9yLnN0YXJ0KDApO1xuIFx0Ly8gXHRcdFx0b3NjaWxsYXRvci5zdG9wKC41KVxuXHRcdC8vIH1cblx0XHRydW5TZXEgPSB0cnVlO1xuXHRcdHBsYXlNdXNpYygpO1xuXHRcdC8vYWxlcnQoJ2hlcmUnKTtcblx0fSk7XG5cdC8vICQoJyNwbGF5bXVzaWNidG4nKS5vbigndG91Y2hlbmQnLCAoZSkgPT4ge1xuXG5cdC8vIFx0cnVuU2VxID0gdHJ1ZTtcblx0Ly8gXHRwbGF5TXVzaWMoKTtcblx0Ly8gXHQvL2FsZXJ0KCdoZXJlJyk7XG5cdC8vIH0pO1xufTtcblxuY29uc3QgcmVnaXN0ZXJTdG9wQnV0dG9uID0gKCkgPT4ge1xuXHQkKCcjc3RvcG11c2ljYnRuJykub24oJ2NsaWNrJywgKGUpID0+IHtcblx0XHRydW5TZXEgPSBmYWxzZTtcblx0XHQvL2FsZXJ0KCdoZXJlJyk7XG5cdH0pO1xuXHQvLyAkKCcjc3RvcG11c2ljYnRuJykub24oJ3RvdWNoZW5kJywgKGUpID0+IHtcblx0Ly8gXHRydW5TZXEgPSBmYWxzZTtcblx0Ly8gXHQvL2FsZXJ0KCdoZXJlJyk7XG5cdC8vIH0pO1xufTtcblxuLy8gY29uc3QgcmVnaXN0ZXJQYXJhbWV0ZXJCdXR0b24gPSAoKSA9PiB7XG4vLyBcdCQoJyNwYXJhbWV0ZXJidG4nKS5vbignY2xpY2snLCAoZSkgPT4ge1xuLy8gXHRcdGxldCBlbCA9IGQzLnNlbGVjdEFsbCgncmVjdCcpWzBdWzRdO1xuLy8gXHRcdGxldCB0aW1lID0gMC45O1xuLy8gXHRcdGhpZ2hsaWdodEVsKGVsLDAsdGltZSk7XG4vLyBcdH0pO1xuLy8gfTtcblxuXG4vLyBQYXJhbWV0ZXIgd2VydGUgZWlubGVzZW5cbi8vICQoJyNwYXJhT3N6YnRuJykub24oJ2NsaWNrJywgKGUpID0+IHtcbi8vIFx0bGV0IHMyID0gJCgnaW5wdXRbbmFtZT1zcGVlZF06Y2hlY2tlZCcsICcjcGFyYW1ldGVyTW9kYWwnKS52YWwoKTtcbi8vIFx0bGV0IHMgPSAkKCdpbnB1dFtuYW1lPW9zemZvcm1dOmNoZWNrZWQnLCAnI3BhcmFtZXRlck1vZGFsJykudmFsKCk7XG4vLyBcdC8vaWYgKCEgdHlwZW9mIHMgPT09IFwidW5kZWZpbmVkXCIgJiYgISB0eXBlb2YgczIgID09PSBcInVuZGVmaW5lZFwiKXtcbi8vIFx0aWYgKCEgZmFsc2Upe1xuLy8gXHRcdG9zY2lsbGF0b3JUeXBlID0gcztcbi8vIFx0XHRzb3VuZFNwZWVkID0gcGFyc2VGbG9hdChzMik7XG4vLyBcdFx0JCgnI3BhcmFtZXRlck1vZGFsJykubW9kYWwoJ2hpZGUnKTtcbi8vIFx0fVxuLy8gfSk7XG5cblxuXG4vLyBTb3VuZCBEZWZpbml0aW9uXG5cblxuY29uc3QgcGxheVNvdW5kID0gKHN0YXJ0VGltZSwgcGl0Y2hOciwgZHVyYXRpb24sIGdhaW5PbGQpID0+IHtcblx0Ly9sZXQgc3RhcnRUaW1lID0gYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lICsgZGVsYXk7XG4gIFx0bGV0IGVuZFRpbWUgPSBzdGFydFRpbWUgKyBkdXJhdGlvbjtcbiAgXHRsZXQgcGl0Y2ggPSBzb3VuZHNbcGl0Y2hOcl1bMF07XG4gIFx0bGV0IGdhaW4gPSB0b25lc1twaXRjaE5yXS5nYWluO1xuXG4gIFx0bGV0IG91dGdhaW4gPSBhdWRpb0NvbnRleHQuY3JlYXRlR2FpbigpO1xuICBcdG91dGdhaW4uZ2Fpbi52YWx1ZSA9IGdhaW47XG4gIFx0b3V0Z2Fpbi5jb25uZWN0KGF1ZGlvQ29udGV4dC5kZXN0aW5hdGlvbik7IFx0XG5cbiAgXHRsZXQgZW52ZWxvcGUgPSBhdWRpb0NvbnRleHQuY3JlYXRlR2FpbigpO1xuICBcdGVudmVsb3BlLmNvbm5lY3Qob3V0Z2Fpbik7XG4gIFx0ZW52ZWxvcGUuZ2Fpbi52YWx1ZSA9IDA7XG4gIFx0XG4gIFx0ZW52ZWxvcGUuZ2Fpbi5zZXRUYXJnZXRBdFRpbWUoMSwgc3RhcnRUaW1lLCBlbnZlbG9wZVN0YXJ0RW5kVGltZVswXSk7XG4gIFx0ZW52ZWxvcGUuZ2Fpbi5zZXRUYXJnZXRBdFRpbWUoMCwgZW5kVGltZSwgZW52ZWxvcGVTdGFydEVuZFRpbWVbMV0pO1xuXG4gIFx0bGV0IG9zY2lsbGF0b3IgPSBhdWRpb0NvbnRleHQuY3JlYXRlT3NjaWxsYXRvcigpO1xuICBcdG9zY2lsbGF0b3IuY29ubmVjdChlbnZlbG9wZSk7XG5cbiAgXHRvc2NpbGxhdG9yLnR5cGUgPSBvc2NpbGxhdG9yVHlwZTtcbiAgXHRvc2NpbGxhdG9yLmRldHVuZS52YWx1ZSA9IHBpdGNoICogMTAwO1xuICBcdG9zY2lsbGF0b3IuZnJlcXVlbmN5LnZhbHVlID0gMjQwO1xuXG5cdGxldCB2aWJyYXRvID0gYXVkaW9Db250ZXh0LmNyZWF0ZUdhaW4oKTtcblx0dmlicmF0by5nYWluLnZhbHVlID0gdmlicmF0b2dhaW47XG5cdHZpYnJhdG8uY29ubmVjdChvc2NpbGxhdG9yLmRldHVuZSk7XG5cblx0bGV0IGxmbyA9IGF1ZGlvQ29udGV4dC5jcmVhdGVPc2NpbGxhdG9yKCk7XG5cdGxmby5jb25uZWN0KHZpYnJhdG8pO1xuXHRsZm8uZnJlcXVlbmN5LnZhbHVlID1sZm9mcmVxOyBcblxuXHRvc2NpbGxhdG9yLnN0YXJ0KHN0YXJ0VGltZSk7XG4gIFx0bGZvLnN0YXJ0KHN0YXJ0VGltZSk7XG4gIFx0b3NjaWxsYXRvci5zdG9wKGVuZFRpbWUgKzIgKTtcbiAgXHRsZm8uc3RvcChlbmRUaW1lICsyKTtcblxufTtcblxuLy8vIFBsYXkgTG9vcFxuY29uc3QgcnVuU2VxdWVuY2VycyA9ICgpID0+IHtcblx0aWYgKCFydW5TZXEgfHwgc291bmRRdWV1ZS5sZW5ndGggPT09IDApe2NvbnNvbGUubG9nKFwic3RvcFwiKTtyZXR1cm47fVxuXHRsZXQgY3QgPSBhdWRpb0NvbnRleHQuY3VycmVudFRpbWU7XG5cdHdoaWxlIChzb3VuZFF1ZXVlLmxlbmd0aD4wICYmIHNvdW5kUXVldWVbMF1bMF08IGN0KzAuMTUpe1xuXHRcdC8vY29uc29sZS5sb2coJ2N0OicrY3QrJ3BsYW5lZCB0aW1lOicrc291bmRRdWV1ZVswXVswXSk7XG5cdFx0bGV0IGl0ZW0gPSBzb3VuZFF1ZXVlLnNwbGljZSgwLDEpO1xuXHRcdC8vIHBsYXlzb3VuZCAoc3RhcnR0aW1lLCBwaXRjaCwgZHVyYXRpb24sICAgICAgICAgICAgIGdhaWluKVxuXHRcdC8vcGxheVNvdW5kKGl0ZW1bMF1bMF0sc291bmRzW2l0ZW1bMF1bMV1dWzBdLGl0ZW1bMF1bMl0sdG9uZXNbaXRlbVswXVsxXV0uZ2Fpbik7XHRcdFxuXHRcblx0XHRwbGF5U291bmQoaXRlbVswXVswXSxpdGVtWzBdWzFdLGl0ZW1bMF1bMl0sdG9uZXNbaXRlbVswXVsxXV0uZ2Fpbik7XHRcdFxuXHRcdC8vIGVsZW1lbnQgICAgICAgICAgICAgIGNvbG9yICAgICAgIGR1cmF0aW9uXG5cdFx0aGlnaGxpZ2h0RWwoaXRlbVswXVszXSxpdGVtWzBdWzFdLGl0ZW1bMF1bMl0pO1xuXHR9XG5cdHNldFRpbWVvdXQocnVuU2VxdWVuY2Vycyw5MCk7XG59XG5cbi8vLyBzb3VuZHMgc3RhcnQgaGVyZVxuLy8vIFNvdW5kIHZhclxubGV0IHJ1blNlcSA9IHRydWU7XG5sZXQgc291bmRRdWV1ZSA9IFtdO1xuXG52YXIgYXVkaW9Db250ZXh0ID0gbnVsbDtcblxudHJ5IHtcbiAgIHdpbmRvdy5BdWRpb0NvbnRleHQgPSB3aW5kb3cuQXVkaW9Db250ZXh0fHx3aW5kb3cud2Via2l0QXVkaW9Db250ZXh0O1xuICAgdmFyIGF1ZGlvQ29udGV4dCA9IG5ldyBBdWRpb0NvbnRleHQoKTtcbn0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLmxvZyhcIk5vIFdlYiBBdWRpbyBBUEkgc3VwcG9ydFwiKTtcbn1cblxuXG4vL0lPUyBTdGFydCBJT1NIQUNLXG4kKCdib2R5Jykub24oJ3RvdWNoZW5kJywgKGUpID0+IHtcblx0Ly9hbGVydCgnc3RhcnQgc291bmRcblx0Ly8gY3JlYXRlIGVtcHR5IGJ1ZmZlclxuXHR2YXIgYnVmZmVyID0gYXVkaW9Db250ZXh0LmNyZWF0ZUJ1ZmZlcigxLCAxLCAyMjA1MCk7XG5cdHZhciBzb3VyY2UgPSBhdWRpb0NvbnRleHQuY3JlYXRlQnVmZmVyU291cmNlKCk7XG5cdHNvdXJjZS5idWZmZXIgPSBidWZmZXI7XG5cblx0Ly8gY29ubmVjdCB0byBvdXRwdXQgKHlvdXIgc3BlYWtlcnMpXG5cdHNvdXJjZS5jb25uZWN0KGF1ZGlvQ29udGV4dC5kZXN0aW5hdGlvbik7XG5cblx0Ly8gcGxheSB0aGUgZmlsZVxuXHRpZiAodHlwZW9mIHNvdXJjZS5ub3RlT24gIT09ICd1bmRlZmluZWQnKXtcblx0XHRzb3VyY2Uubm90ZU9uKDApO1xuXHR9XG5cdFxuXHQvLyB2YXIgc3JjID0gbnVsbDtcblx0Ly8gc3JjID0gYXVkaW9Db250ZXh0LmNyZWF0ZU9zY2lsbGF0b3IoKTtcblx0Ly8gc3JjLnR5cGUgPSAnc3F1YXJlJztcblx0Ly8gc3JjLmZyZXF1ZW5jeS52YWx1ZSA9IDQ0MDtcblx0Ly8gc3JjLmNvbm5lY3QoYXVkaW9Db250ZXh0LmRlc3RpbmF0aW9uKTtcblx0Ly8gbGV0IGN0ID0gYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lO1xuXHQvLyBzcmMuc3RhcnQoY3QrMC41KTtcblx0Ly8gc3JjLnN0b3AoY3QrMS4yKTtcbn0pO1xuLy9JT1MgRU5EXG5cblxuLy8gU291bmQgY29uc3RhbnN0cyBwcmVzZXRzXG5sZXQgdG9uZXMgPSBbe1xuXHQnbnInOjAsXG5cdCdnYWluJzowLjEsXG5cdCd2b2wnOicxMCUnLFxuICAgICdjb2xvcic6JyM3NTc1NzUnLFxuXHQnaG92ZXInOicjMDAwMDAwJyxcblx0J2luc3RydW1lbnQnOidEMycsXG5cdCdpZCc6J2lnLXJvdzEtMCcsXG5cdCd2aXNpYmxlJzp0cnVlXG59LFxuXG57XG5cdCducic6MSxcblx0J2dhaW4nOjAuOCxcblx0J3ZvbCc6JzgwJScsXG5cdCdjb2xvcic6JyMyOTZFQUEnLFxuXHQnaG92ZXInOicjMDk0RThBJyxcblx0J2luc3RydW1lbnQnOidFMycsXG5cdCdpZCc6J2lnLXJvdzEtMScsXG5cdCd2aXNpYmxlJzp0cnVlXG59LFxue1xuXHQnbnInOjIsXG5cdCdnYWluJzowLjAsXG5cdCd2b2wnOicwJScsXG5cdCdjb2xvcic6JyM1NDkxQjUnLFxuXHQnaG92ZXInOicjMzQ2MTc1Jyxcblx0J2luc3RydW1lbnQnOidGMycsXG5cdCdpZCc6J2lnLXJvdzEtMicsXG5cdCd2aXNpYmxlJzpmYWxzZVxufSxcbntcblx0J25yJzozLFxuXHQnZ2Fpbic6MC4wLFxuXHQndm9sJzonMCUnLFxuXHQnY29sb3InOicjNzlCRUZBJyxcblx0J2hvdmVyJzonIzU5OUVCQScsXG5cdCdpbnN0cnVtZW50JzonRzMnLFxuXHQnaWQnOidpZy1yb3cxLTMnLFxuXHQndmlzaWJsZSc6ZmFsc2Vcbn0sXG5cbntcblx0J25yJzo0LFxuXHQnZ2Fpbic6MC41LFxuXHQndm9sJzonNTAlJyxcblx0J2NvbG9yJzonIzRCQTg0QicsXG5cdCdob3Zlcic6JyMyQjg4MkInLFxuXHQnaW5zdHJ1bWVudCc6J0E0Jyxcblx0J2lkJzonaWctcm93Mi0xJyxcblx0J3Zpc2libGUnOmZhbHNlXG59LFxue1xuXHQnbnInOjUsXG5cdCdnYWluJzowLjAsXG5cdCd2b2wnOicwJScsXG5cdCdjb2xvcic6JyM1NDcyNDknLFxuXHQnaG92ZXInOicjMjQ1MjE5Jyxcblx0J2luc3RydW1lbnQnOidCNCcsXG5cdCdpZCc6J2lnLXJvdzItMicsXG5cdCd2aXNpYmxlJzpmYWxzZVxufSxcbntcblx0J25yJzo2LFxuXHQnZ2Fpbic6MC4wLFxuXHQndm9sJzonMCUnLFxuXHQnY29sb3InOicjMUY2MjQxJyxcblx0J2hvdmVyJzonIzFGNjI0MScsXG5cdCdpbnN0cnVtZW50JzonQzQnLFxuXHQnaWQnOidpZy1yb3cyLTMnLFxuXHQndmlzaWJsZSc6ZmFsc2Vcbn0sXG57XG5cdCducic6Nyxcblx0J2dhaW4nOjAuMyxcblx0J3ZvbCc6JzMwJScsXG5cdCdjb2xvcic6JyNEQjM4MzMnLFxuXHQnaG92ZXInOicjQUIxODEzJyxcblx0J2luc3RydW1lbnQnOidENCcsXG5cdCdpZCc6J2lnLXJvdzMtMScsXG5cdCd2aXNpYmxlJzpmYWxzZVxufSxcbntcblx0J25yJzo4LFxuXHQnZ2Fpbic6MC4wLFxuXHQndm9sJzonMCUnLFxuXHQnY29sb3InOicjQjMwQjBCJyxcblx0J2hvdmVyJzonIzUzMEIwQicsXG5cdCdpbnN0cnVtZW50JzonRTQnLFxuXHQnaWQnOidpZy1yb3czLTInLFxuXHQndmlzaWJsZSc6ZmFsc2Vcbn0sXG57XG5cdCducic6OSxcblx0J2dhaW4nOjAuMCxcblx0J3ZvbCc6JzAlJyxcblx0J2NvbG9yJzonI0ExMTIzRicsXG5cdCdob3Zlcic6JyM1MTAyMUYnLFxuXHQnaW5zdHJ1bWVudCc6J0Y0Jyxcblx0J2lkJzonaWctcm93My0zJyxcblx0J3Zpc2libGUnOmZhbHNlXG59XTtcblxuLy8gc291bmRzXG5sZXQgbm90ZXMgPSB7XG5cdCdEMyc6IHtcblx0XHQnZnJlcSc6IDQ0MCxcblx0XHQnZGV0dW5lJzogLTcwMFxuXHR9LFxuXHQnRTMnOiB7XG5cdFx0J2ZyZXEnOiA0NDAsXG5cdFx0J2RldHVuZSc6IC01MDBcblx0fSwgXG5cdCdGMyc6IHtcblx0XHQnZnJlcSc6IDQ0MCxcblx0XHQnZGV0dW5lJzogLTQwMFxuXHR9LFxuXHQnRzMnOiB7XG5cdFx0J2ZyZXEnOiA0NDAsXG5cdFx0J2RldHVuZSc6IC0yMDBcblx0fSxcblx0J0E0Jzoge1xuXHRcdCdmcmVxJzogNDQwLFxuXHRcdCdkZXR1bmUnOiAwXG5cdH0sXG5cdCdCNCc6IHtcblx0XHQnZnJlcSc6IDQ0MCxcblx0XHQnZGV0dW5lJzogMjAwXG5cdH0sXG5cdCdDNCc6IHtcblx0XHQnZnJlcSc6IDQ0MCxcblx0XHQnZGV0dW5lJzogMzAwXG5cdH0sXG5cdCdENCc6IHtcblx0XHQnZnJlcSc6IDQ0MCxcblx0XHQnZGV0dW5lJzogNTAwXG5cdH0sXG5cdCdFNCc6IHtcblx0XHQnZnJlcSc6IDQ0MCxcblx0XHQnZGV0dW5lJzogNzAwXG5cdH0sXG5cdCdGNCc6IHtcblx0XHQnZnJlcSc6IDQ0MCxcblx0XHQnZGV0dW5lJzogODAwXG5cdH0sXG5cdCdHNCc6IHtcblx0XHQnZnJlcSc6IDQ0MCxcblx0XHQnZGV0dW5lJzogMTAwMFxuXHR9XG59O1xuXG5cblxubGV0IHNvdW5kU3BlZWQgPSAwLjU7XG5sZXQgdG9uZWR1cmF0aW9uID0gMC4zO1xubGV0IHZpYnJhdG9nYWluID0gMC4zO1xubGV0IGVudmVsb3BlU3RhcnRFbmRUaW1lID0gWzAuMDEsMC4xXTtcbmxldCBsZm9mcmVxID0gNjsgIC8vNVxuLy8gUGFyYW1ldHJpemF0aW9uIG9mIHRoZSA1IHRvbmVzICBQaXRjaCBkdXJhdGlvbiB2b2x1bWUgZ2FpblxuLy8gRGVicmljYXRlZCB0byBiZSByZW1vdmVkXG4vLyBmaXJzdCBpc3QgYmxhY2sgc291bmRcbmNvbnN0IHNvdW5kcyA9IFtbLTEwLCAwLjUsMC4xXSxbMywgMC41LDAuOV0sWzEwLCAwLjUsMC45XSxbMTUsIDAuNSwwLjldLFswLCAwLjUsMC45XV07XG5sZXQgb3NjaWxsYXRvclR5cGUgPSAnc2F3dG9vdGgnOyAvLydzaW5lJzsgLy8gJ3Nhd3Rvb3RoJ1xuXG5cbi8vLyBTb3VuZCBNZXRob2RzXG5jb25zdCBwbGF5TXVzaWMgPSAoKSA9PiB7XG5cdC8vIGZpbGwgc291bmRRdWV1ZVx0XG5cdGxldCByZWN0YXJyID0gZDMuc2VsZWN0QWxsKCdyZWN0JykuZGF0YSgpO1xuXHRsZXQgZWxhcnIgPSBkMy5zZWxlY3RBbGwoJ3JlY3QnKVswXTtcbiAgICBsZXQgc3RhcnRUaW1lID0gYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lO1xuICAgIC8vY29uc29sZS5sb2coJ1N0YXJ0JytzdGFydFRpbWUpO1xuICAgIHNvdW5kUXVldWUgPVtdO1xuXHRmb3IgKGxldCBpPTA7IGkgPCByZWN0YXJyLmxlbmd0aDsgaSsrKSB7XG5cdFx0bGV0IHYgPSByZWN0YXJyW2ldWzFdO1xuXHRcdC8vcGxheVNvdW5kKGksc291bmRzW3ZdWzBdLHNvdW5kc1t2XVsxXSxzb3VuZHNbdl1bMl0pO1xuXHRcdC8vYWxlcnQoaSk7XG5cdFx0bGV0IHRtcCA9IFtdO1xuXHRcdHRtcC5wdXNoKGkqc291bmRTcGVlZCtzdGFydFRpbWUpO1xuXHRcdHRtcC5wdXNoKHYpO1xuXHRcdHRtcC5wdXNoKHRvbmVkdXJhdGlvbik7XG5cdFx0dG1wLnB1c2goZWxhcnJbaV0pO1xuXHRcdHNvdW5kUXVldWUucHVzaCh0bXApO1xuXHR9XG5cdC8vY29uc29sZS5sb2coJ3N0YXJ0c2VxdWVuY2VyJythdWRpb0NvbnRleHQuY3VycmVudFRpbWUpO1xuICAgIHJ1blNlcXVlbmNlcnMoKTtcbn07XG5cbi8vIEluaXQgU2NyZWVuXG5jb25zdCBpbml0ZDNqcyA9IChlbElkKSA9PiB7XG5cdGNvbnN0IHdpZHRoID0gMTI4MCxcbiAgICBoZWlnaHQgPSA0NTtcbiAgICBsZXQgc3Jfdmlld3BvcnQgPSAnMCAwICcrKHdpZHRoKzcwKSsnICcraGVpZ2h0O1xuICAgIGNvbnN0IGRpdiA9IGQzLnNlbGVjdChlbElkKSxcblx0c3ZnID0gZGl2LmFwcGVuZCgnc3ZnJylcbiAgICAgICAgLmF0dHIoJ3dpZHRoJywgd2lkdGgpXG4gICAgICAgIC5hdHRyKCdoZWlnaHQnLCBoZWlnaHQpXG4gICAgICAgIC5hdHRyKCd2aWV3Qm94Jywgc3Jfdmlld3BvcnQpXG4gICAgICAgIC5hdHRyKCdwcmVzZXJ2ZUFzcGVjdFJhdGlvJywgJ3hNaWRZTWlkIG1lZXQnKTtcblxuICAgIHJldHVybiBzdmc7XG59O1xuXG5cbiAgICAvLyBDb25zdGFudHNcblxuICAgIGNvbnN0IHJ3ID0gMjAsXG4gICAgcmggPSAyMCxcbiAgICByb3dOID0xLFxuICAgIGNvbE4gPTQ4LFxuICAgIC8vY29sb3JkZWZpbml0aW9uXG4gICAgLy9sb29rdXBibHVlID0gWycjNDU0NTQ1JywnIzI5NkVBQScsJyM1NDkxQjUnLCcjNzlCRUZBJ10sXG4gICAgLy9sb29rdXBncmVlbiA9IFsnIzQ1NDU0NScsJyM0QkE4NEInLCcjNTQ3MjQ5JywnIzFGNjI0MSddLFxuICAgIC8vIGxvb2t1cHJlZCA9IFsnIzQ1NDU0NScsJyNEQjM4MzMnLCcjQjMwQjBCJywnI0ExMTIzRiddLFxuICAgIGhsb29rdXAgPSBbJyMwMDAwMDAnLCcjMDk0RThBJywnIzA5NEU4QScsJyMwOTRFOEEnXTtcbiAgICAvLyBsb29rdXAgPSBbJyM0NTQ1NDUnLCcjMjk2RUFBJywnI0Q0M0YzQScsJyM1Q0I4NUMnLCcjNDZCMENGJ10sXG4gICAgLy8gaGxvb2t1cCA9IFsnIzAwMDAwMCcsJyMwOTRFOEEnLCcjQTQxRjFBJywnIzNDOTgzQycsJyMyNjkwQUYnXSxcbiAgICAvL3JyYW5nZSA9IGxvb2t1cC5sZW5ndGg7XG5cbiAgICAvLyBiaW5kIGRhdGEgYW5kIHJlbmRlciBkM2pzXG4gICAgY29uc3Qgc3ZnID0gaW5pdGQzanMoJyNjaGFydCcpO1xuICAgIGxldCBsb29rdXBibHVlID0gWzAsMSwyLDNdLm1hcCgoaSkgPT4gdG9uZXNbaV0uY29sb3IpOyAgIFxuICAgIGxldCBteWRhdGEgPSByZWRyYXcocmVhZElucHV0KDEpKTtcblx0cmVuZGVyR3JhcGgobXlkYXRhLHN2Zyxsb29rdXBibHVlKTtcblxuICAgIGNvbnN0IHN2Z2dyZWVuID0gaW5pdGQzanMoJyNjaGFydC0yJyk7XG4gICAgbGV0IGxvb2t1cGdyZWVuID0gWzAsNCw1LDZdLm1hcCgoaSkgPT4gdG9uZXNbaV0uY29sb3IpOyBcbiAgICBsZXQgbXlkYXRhR3JlZW4gPSByZWRyYXcocmVhZElucHV0KDIpKTtcblx0cmVuZGVyR3JhcGgobXlkYXRhR3JlZW4sc3ZnZ3JlZW4sbG9va3VwZ3JlZW4pO1xuXG4gICAgY29uc3Qgc3ZncmVkID0gaW5pdGQzanMoJyNjaGFydC0zJyk7XG4gICAgbGV0IGxvb2t1cHJlZCA9IFswLDcsOCw5XS5tYXAoKGkpID0+IHRvbmVzW2ldLmNvbG9yKTsgXG4gICAgbGV0IG15ZGF0YVJlZCA9IHJlZHJhdyhyZWFkSW5wdXQoMykpO1xuXHRyZW5kZXJHcmFwaChteWRhdGFSZWQsc3ZncmVkLGxvb2t1cHJlZCk7XHRcblxuXHQvLyByZXNwb25zaXZlIGNoYW5nZVxuICAgIGQzLnNlbGVjdCh3aW5kb3cpXG4gICAgXHQub24oJ3Jlc2l6ZScsICgpID0+IHtcblx0XHQgICAgLy9sZXQgdGFyZ2V0V2lkdGggPSBzdmcubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoO1xuXHRcdCAgICBsZXQgd2luV2lkdGggPSAkKHdpbmRvdykud2lkdGgoKTtcblx0XHQgICAgc3ZnLmF0dHIoXCJ3aWR0aFwiLCB3aW5XaWR0aCk7XG5cdFx0ICAgIHN2Z2dyZWVuLmF0dHIoXCJ3aWR0aFwiLCB3aW5XaWR0aCk7XG5cdFx0ICAgIHN2Z3JlZC5hdHRyKFwid2lkdGhcIiwgd2luV2lkdGgpO1xuICBcdFx0fSk7XG4gICAgLy9UcmlnZXIgcmVzaXplIEV2ZW50XG4gIFx0bGV0IHRtcHcgPSAkKHdpbmRvdykud2lkdGgoKTtcblx0c3ZnLmF0dHIoJ3dpZHRoJywgdG1wdyk7XG5cdHN2Z2dyZWVuLmF0dHIoJ3dpZHRoJywgdG1wdyk7XG5cdHN2Z3JlZC5hdHRyKCd3aWR0aCcsIHRtcHcpO1xuXG5cdC8vIHN1bSAgdGhlIGRhdGFcblx0bGV0IHN2Z3N1bSA9IGluaXRkM2pzKCcjY2hhcnQtc3VtJyk7XG5cdGxldCBsb29rdXBhbGwgPSBbMCwxLDIsMyw0LDUsNiw3LDgsOV0ubWFwKChpKSA9PiB0b25lc1tpXS5jb2xvcik7IFxuXHQvL2xldCBteWRhdGFzdW0gPSBbW1sxLDIsM10sWzAsNCw1XSxbMSw0XSxbNCw5XSxbMSw0LDddLFswXSxbMF0sWzBdLFswXSxbMF0sWzBdLFswXSxbMF0sWzBdLFswXV1dO1xuXHRcblx0bGV0IG15ZGF0YXN1bSA9IHJlZHVjZTNkYXRhKG15ZGF0YVswXSxteWRhdGFHcmVlblswXSxteWRhdGFSZWRbMF0pO1xuXHRcblxuXHRyZW5kZXJHcmFwaChteWRhdGFzdW0sc3Znc3VtLGxvb2t1cGFsbCk7XG5cblx0Ly8gUmVnaXN0ZXIgQnV0dG9uc1xuXHQvLyBibGFja2J1dHRvbiBvbmx5IG9uZSByZWdpc3RyYXRpb25cblx0cmVnaXN0ZXJCbGFja1ZvbHVtZUJ1dHRvbigpO1xuXHRyZWdpc3RlckJsYWNrVG9uQnV0dG9uKCk7XG5cblx0Ly8gUmVnaXN0ZXIgMyByb3dzIFYgQnV0dG9uXG5cdC8vIFRPRE8gQ2hlY2sgUkVnaXN0ZXIgQnV0dG9uXG5cdFsxLDIsM10ubWFwKHJlZ2lzdGVyQnV0dG9uKTtcblx0WzEsMiwzXS5tYXAocmVnaXN0ZXJUb25CdXR0b24pO1xuXHRbMSwyLDNdLm1hcChyZWdpc3RlclZvbHVtZUJ1dHRvbik7XG5cblx0cmVnaXN0ZXJJbnB1dE9uQ2hhbmdlKDEsc3ZnLGxvb2t1cGJsdWUpO1xuXHRyZWdpc3RlcklucHV0T25DaGFuZ2UoMixzdmdncmVlbixsb29rdXBncmVlbik7XG5cdHJlZ2lzdGVySW5wdXRPbkNoYW5nZSgzLHN2Z3JlZCxsb29rdXByZWQpO1xuXG5cblx0cmVnaXN0ZXJQbGF5QnV0dG9uKCk7XG5cdHJlZ2lzdGVyU3RvcEJ1dHRvbigpO1xuXHQvL3JlZ2lzdGVyUGFyYW1ldGVyQnV0dG9uKCk7XG5cbi8vaW9zIGhhY2tcbi8vIFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgZnVuY3Rpb24oKSB7XG5cbi8vIFx0Ly8gY3JlYXRlIGVtcHR5IGJ1ZmZlclxuLy8gXHR2YXIgYnVmZmVyID0gYXVkaW9Db250ZXh0LmNyZWF0ZUJ1ZmZlcigxLCAxLCAyMjA1MCk7XG4vLyBcdHZhciBzb3VyY2UgPSBhdWRpb0NvbnRleHQuY3JlYXRlQnVmZmVyU291cmNlKCk7XG4vLyBcdHNvdXJjZS5idWZmZXIgPSBidWZmZXI7XG5cbi8vIFx0Ly8gY29ubmVjdCB0byBvdXRwdXQgKHlvdXIgc3BlYWtlcnMpXG4vLyBcdHNvdXJjZS5jb25uZWN0KGF1ZGlvQ29udGV4dC5kZXN0aW5hdGlvbik7XG5cbi8vIFx0Ly8gcGxheSB0aGUgZmlsZVxuLy8gXHRzb3VyY2Uubm90ZU9uKDApO1xuXG4vLyB9LCBmYWxzZSk7XG5cblxuXG4vLyB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoc3RhcnRcIiwgZnVuY3Rpb24gKCl7XHRcbi8vIFx0XHRpZiAoaGFkX3RvdWNoKVx0XHRyZXR1cm47XHRcdFxuLy8gXHRcdC8vIHBsYXkgZW1wdHkgYnVmZmVyIHRvIHVubXV0ZSBhdWRpb1x0XG4vLyBcdFx0dmFyIGJ1ZmZlciA9IGF1ZGlvQ29udGV4dC5jcmVhdGVCdWZmZXIoMSwgMSwgMjIwNTApO1x0XG4vLyBcdFx0dmFyIHNvdXJjZSA9IGF1ZGlvQ29udGV4dC5jcmVhdGVCdWZmZXJTb3VyY2UoKTtcdFxuLy8gXHRcdHNvdXJjZS5idWZmZXIgPSBidWZmZXI7XHRcbi8vIFx0XHRzb3VyY2UuY29ubmVjdChhdWRpb0NvbnRleHQuZGVzdGluYXRpb24pO1x0XG4vLyBcdFx0c291cmNlLnN0YXJ0KDApO1x0XG4vLyBcdFx0aGFkX3RvdWNoID0gdHJ1ZTtcbi8vIFx0XHRhbGVydChcIm1pc3RcIik7XG4vLyBcdH0pO1xuXG5cblxuXG5cbn0pO1xuXG5cblxuIl19
