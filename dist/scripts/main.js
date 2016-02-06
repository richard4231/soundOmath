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

		var selection = svg.selectAll('svg g rect').data(data[0]).attr('fill', function (d, i) {
			return lookup[d];
		}).enter().append('rect').attr('x', function (d, i) {
			return 28 * i;
		}).attr('width', rw).attr('height', rh).remove();
	};

	var renderGraph = function renderGraph(data, svg, lookup, checksum) {
		// Create a group for each row in the data matrix and
		// translate the group vertically
		var grp = svg.selectAll('svg g').data(data).enter().append('g').attr('transform', function (d, i) {
			return 'translate(0, ' + 54 * i + ')';
		});

		if (checksum) {
			//inner structure
			var ingrp = grp.selectAll('g')
			// .filter( (d,i) => typeof d[i] === 'object')
			.data(function (d) {
				return d;
			}).enter().append('g').attr('transform', function (d, i) {
				return 'translate(' + 28 * i + ',0)';
			});

			ingrp.selectAll('rect').data(function (d) {
				return d;
			}).enter().append('rect').attr('x', function (d, i, k) {
				return rw / data[0][k].length * i;
			}).attr('fill', function (d, i) {
				return lookup[d];
			}).attr('width', function (d, i, k) {
				return rw / data[0][k].length;
			}).attr('height', rh);
		} else {
			// For each group, create a set of rectangles and bind
			// them to the inner array (the inner array is already
			// binded to the group)
			grp.selectAll('rect')
			// .filter( (d,i) => typeof d[i] === 'number')
			.data(function (d) {
				return d;
			}).enter().append('rect').attr('x', function (d, i) {
				return 28 * i;
			}).attr('fill', function (d, i) {
				return lookup[d];
			}).attr('width', rw).attr('height', rh);
		}

		//Modulo 10 ticks       
		grp.selectAll('line').data(function (d) {
			var tmp = Math.trunc(d.length / 10);
			var out = new Array(tmp + 1).fill(0);
			return out;
		}).enter().append('line')
		//.filter((d,i) => i%10===0)
		.attr('x1', function (d, i) {
			return 280 * i + 1;
		}).attr('y1', 20).attr('x2', function (d, i) {
			return 280 * i + 1;
		}).attr('y2', 40).style('stroke', 'black').style('stroke-width', '2px');

		// Text
		grp.selectAll('text').data(function (d) {
			var tmp = Math.trunc(d.length / 10);
			var out = new Array(tmp + 1).fill(0);
			return out;
		}).enter().append('text')
		//.filter((d,i) => i%10===0)
		.attr('x', function (d, i) {
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
		var tmp = undefined,
		    s = undefined;
		for (var i = 0; i < arrB.length; i++) {
			tmp = [];
			tmp.push(arrB[i]);
			tmp.push(arrG[i] === 0 ? 0 : arrG[i] + 3);
			tmp.push(arrR[i] === 0 ? 0 : arrR[i] + 6);
			s = new Set(tmp);
			if (s.size > 1 && s.has(0)) {
				s.delete(0);
			}
			out.push(Array.from(s));
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

				var mydata = redraw(readInput(1));
				var mydataGreen = redraw(readInput(2));
				var mydataRed = redraw(readInput(3));
				var newdata2 = reduce3data(mydata[0], mydataGreen[0], mydataRed[0]);
				updateGraph(newdata2, d3.select('#chart-sum'), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(function (i) {
					return tones[i].color;
				}));
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
	    colN = 48;
	// hlookup = ['#000000','#094E8A','#094E8A','#094E8A'];

	// bind data and render d3js
	var svg = initd3js('#chart');
	var lookupblue = [0, 1, 2, 3].map(function (i) {
		return tones[i].color;
	});
	var mydata = redraw(readInput(1));
	renderGraph(mydata, svg, lookupblue, false);

	var svggreen = initd3js('#chart-2');
	var lookupgreen = [0, 4, 5, 6].map(function (i) {
		return tones[i].color;
	});
	var mydataGreen = redraw(readInput(2));
	renderGraph(mydataGreen, svggreen, lookupgreen, false);

	var svgred = initd3js('#chart-3');
	var lookupred = [0, 7, 8, 9].map(function (i) {
		return tones[i].color;
	});
	var mydataRed = redraw(readInput(3));
	renderGraph(mydataRed, svgred, lookupred, false);

	// sum  the data 
	var svgsum = initd3js('#chart-sum');
	var lookupall = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(function (i) {
		return tones[i].color;
	});
	var mydatasum = reduce3data(mydata[0], mydataGreen[0], mydataRed[0]);
	renderGraph(mydatasum, svgsum, lookupall, true);

	// responsive change
	d3.select(window).on('resize', function () {
		//let targetWidth = svg.node().getBoundingClientRect().width;
		var winWidth = $(window).width();
		svg.attr("width", winWidth);
		svggreen.attr("width", winWidth);
		svgred.attr("width", winWidth);
		svgsum.attr("width", winWidth);
	});
	//Triger resize Event
	var tmpw = $(window).width();
	svg.attr('width', tmpw);
	svggreen.attr('width', tmpw);
	svgred.attr('width', tmpw);
	svgsum.attr("width", tmpw);

	// let svgtest = initd3js('#chart-test');
	// let mydatatest = [[[1,2,3],[0,4,5],[1,4],[4,9],[1,4,7],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0]]];
	// renderGraph(mydatatest,svgtest,lookupall);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvc2NyaXB0cy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxFQUFFLFFBQUYsRUFBWSxLQUFaLENBQWtCLFlBQVU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEyQjVCLEtBQU0sY0FBYyxTQUFkLFdBQWMsQ0FBQyxJQUFELEVBQU0sR0FBTixFQUFVLE1BQVYsRUFBcUI7O0FBRXhDLE1BQUksWUFBYSxJQUFJLFNBQUosQ0FBYyxZQUFkLEVBQ2YsSUFEZSxDQUNWLEtBQUssQ0FBTCxDQURVLEVBRWYsSUFGZSxDQUVWLE1BRlUsRUFFRixVQUFDLENBQUQsRUFBRyxDQUFIO1VBQVMsT0FBTyxDQUFQO0dBQVQsQ0FGRSxDQUdmLEtBSGUsR0FJZixNQUplLENBSVIsTUFKUSxFQUtaLElBTFksQ0FLUCxHQUxPLEVBS0YsVUFBQyxDQUFELEVBQUksQ0FBSjtVQUFXLEtBQUssQ0FBTDtHQUFYLENBTEUsQ0FNWixJQU5ZLENBTVAsT0FOTyxFQU1FLEVBTkYsRUFPWixJQVBZLENBT1AsUUFQTyxFQU9HLEVBUEgsRUFRWixNQVJZLEVBQWIsQ0FGb0M7RUFBckIsQ0EzQlE7O0FBeUM1QixLQUFNLGNBQWMsU0FBZCxXQUFjLENBQUMsSUFBRCxFQUFNLEdBQU4sRUFBVSxNQUFWLEVBQWlCLFFBQWpCLEVBQThCOzs7QUFHakQsTUFBSSxNQUFNLElBQUksU0FBSixDQUFjLE9BQWQsRUFDTCxJQURLLENBQ0EsSUFEQSxFQUVMLEtBRkssR0FHTCxNQUhLLENBR0UsR0FIRixFQUlMLElBSkssQ0FJQSxXQUpBLEVBSWEsVUFBQyxDQUFELEVBQUksQ0FBSjtVQUFVLGtCQUFrQixLQUFLLENBQUwsR0FBUyxHQUEzQjtHQUFWLENBSm5CLENBSDZDOztBQVNqRCxNQUFJLFFBQUosRUFBYTs7QUFFWixPQUFJLFFBQVEsSUFBSSxTQUFKLENBQWMsR0FBZDs7SUFFUCxJQUZPLENBRUYsVUFBQyxDQUFEO1dBQU87SUFBUCxDQUZFLENBR1AsS0FITyxHQUlQLE1BSk8sQ0FJQSxHQUpBLEVBS1AsSUFMTyxDQUtGLFdBTEUsRUFLVyxVQUFDLENBQUQsRUFBSSxDQUFKO1dBQVUsZUFBZSxLQUFLLENBQUwsR0FBUyxLQUF4QjtJQUFWLENBTG5CLENBRlE7O0FBVVosU0FBTSxTQUFOLENBQWdCLE1BQWhCLEVBQ0ssSUFETCxDQUNVLFVBQUMsQ0FBRDtXQUFPO0lBQVAsQ0FEVixDQUVLLEtBRkwsR0FHSyxNQUhMLENBR1ksTUFIWixFQUlNLElBSk4sQ0FJVyxHQUpYLEVBSWdCLFVBQUMsQ0FBRCxFQUFJLENBQUosRUFBTSxDQUFOO1dBQWEsS0FBRyxLQUFLLENBQUwsRUFBUSxDQUFSLEVBQVcsTUFBWCxHQUFvQixDQUF2QjtJQUFiLENBSmhCLENBS1MsSUFMVCxDQUtjLE1BTGQsRUFLc0IsVUFBQyxDQUFELEVBQUcsQ0FBSDtXQUFTLE9BQU8sQ0FBUDtJQUFULENBTHRCLENBTVMsSUFOVCxDQU1jLE9BTmQsRUFNdUIsVUFBQyxDQUFELEVBQUcsQ0FBSCxFQUFLLENBQUw7V0FBWSxLQUFHLEtBQUssQ0FBTCxFQUFRLENBQVIsRUFBVyxNQUFYO0lBQWYsQ0FOdkIsQ0FPUyxJQVBULENBT2MsUUFQZCxFQU93QixFQVB4QixFQVZZO0dBQWIsTUFrQk87Ozs7QUFJTixPQUFJLFNBQUosQ0FBYyxNQUFkOztJQUVLLElBRkwsQ0FFVSxVQUFDLENBQUQ7V0FBTztJQUFQLENBRlYsQ0FHSyxLQUhMLEdBSUssTUFKTCxDQUlZLE1BSlosRUFLUyxJQUxULENBS2MsR0FMZCxFQUttQixVQUFDLENBQUQsRUFBSSxDQUFKO1dBQVcsS0FBSyxDQUFMO0lBQVgsQ0FMbkIsQ0FNUyxJQU5ULENBTWMsTUFOZCxFQU1zQixVQUFDLENBQUQsRUFBRyxDQUFIO1dBQVMsT0FBTyxDQUFQO0lBQVQsQ0FOdEIsQ0FPUyxJQVBULENBT2MsT0FQZCxFQU91QixFQVB2QixFQVFTLElBUlQsQ0FRYyxRQVJkLEVBUXdCLEVBUnhCLEVBSk07R0FsQlA7OztBQVRpRCxLQTJDakQsQ0FBSSxTQUFKLENBQWMsTUFBZCxFQUNLLElBREwsQ0FDVSxVQUFDLENBQUQsRUFBTztBQUNaLE9BQUksTUFBTSxLQUFLLEtBQUwsQ0FBVyxFQUFFLE1BQUYsR0FBVyxFQUFYLENBQWpCLENBRFE7QUFFWixPQUFJLE1BQU0sSUFBSSxLQUFKLENBQVUsTUFBSSxDQUFKLENBQVYsQ0FBaUIsSUFBakIsQ0FBc0IsQ0FBdEIsQ0FBTixDQUZRO0FBR1osVUFBTyxHQUFQLENBSFk7R0FBUCxDQURWLENBTUssS0FOTCxHQU1hLE1BTmIsQ0FNb0IsTUFOcEI7O0dBUUssSUFSTCxDQVFVLElBUlYsRUFRaUIsVUFBQyxDQUFELEVBQUksQ0FBSjtVQUFVLE1BQU0sQ0FBTixHQUFRLENBQVI7R0FBVixDQVJqQixDQVNLLElBVEwsQ0FTVSxJQVRWLEVBU2dCLEVBVGhCLEVBVUssSUFWTCxDQVVVLElBVlYsRUFVZ0IsVUFBQyxDQUFELEVBQUksQ0FBSjtVQUFVLE1BQU0sQ0FBTixHQUFRLENBQVI7R0FBVixDQVZoQixDQVdLLElBWEwsQ0FXVSxJQVhWLEVBV2UsRUFYZixFQVlLLEtBWkwsQ0FZVyxRQVpYLEVBWXFCLE9BWnJCLEVBYUssS0FiTCxDQWFXLGNBYlgsRUFhMEIsS0FiMUI7OztBQTNDaUQsS0E0RC9DLENBQUksU0FBSixDQUFjLE1BQWQsRUFDRyxJQURILENBQ1EsVUFBQyxDQUFELEVBQU87QUFDWixPQUFJLE1BQU0sS0FBSyxLQUFMLENBQVcsRUFBRSxNQUFGLEdBQVcsRUFBWCxDQUFqQixDQURRO0FBRVosT0FBSSxNQUFNLElBQUksS0FBSixDQUFVLE1BQUksQ0FBSixDQUFWLENBQWlCLElBQWpCLENBQXNCLENBQXRCLENBQU4sQ0FGUTtBQUdaLFVBQU8sR0FBUCxDQUhZO0dBQVAsQ0FEUixDQU1HLEtBTkgsR0FNVyxNQU5YLENBTWtCLE1BTmxCOztHQVFJLElBUkosQ0FRUyxHQVJULEVBUWMsVUFBQyxDQUFELEVBQUksQ0FBSixFQUFVO0FBQUUsVUFBTyxNQUFNLENBQU4sR0FBUSxDQUFSLENBQVQ7R0FBVixDQVJkLENBU0ksSUFUSixDQVNTLEdBVFQsRUFTYyxJQVRkLEVBVUksSUFWSixDQVVTLGFBVlQsRUFVd0IsWUFWeEIsRUFXSSxJQVhKLENBV1UsVUFBQyxDQUFELEVBQUksQ0FBSixFQUFNLENBQU47VUFBWSxJQUFFLEVBQUYsR0FBSyxJQUFFLEVBQUYsR0FBSyxDQUFWO0dBQVosQ0FYVixDQTVEK0M7RUFBOUI7Ozs7OztBQXpDUSxLQXdIdEIsWUFBWSxTQUFaLFNBQVksQ0FBQyxHQUFELEVBQVM7QUFDMUIsTUFBSSxNQUFNLEVBQU47O0FBRHNCLE1BR3RCLE9BQU8sR0FBUCxLQUFlLFdBQWYsRUFBMkI7QUFDOUIsU0FBTyxrQkFBUCxFQUQ4QjtHQUEvQjs7QUFIMEIsTUFPdEIsSUFBRSxFQUFGLENBUHNCO0FBUTFCLE9BQUssSUFBSSxJQUFJLENBQUosRUFBTyxJQUFJLENBQUosRUFBTyxHQUF2QixFQUEyQjtBQUMxQixPQUFJLGFBQVcsR0FBWCxHQUFlLEdBQWYsR0FBbUIsQ0FBbkIsQ0FEc0I7QUFFMUIsT0FBSSxJQUFKLENBQVMsQ0FBVCxFQUYwQjtHQUEzQjs7QUFLQSxNQUFJLE1BQU0sRUFBTixDQWJzQjtBQWMxQixPQUFLLElBQUksQ0FBSixJQUFTLEdBQWQsRUFBbUI7QUFDbEIsT0FBSSxRQUFRLEVBQUUsSUFBSSxDQUFKLENBQUYsRUFDUCxNQURPLEdBRVAsTUFGTyxHQUdQLFFBSE8sQ0FHRSxPQUhGLEVBR1csQ0FIWCxDQUFSLENBRGM7QUFLbEIsT0FBSSxNQUFNLENBQU4sQ0FMYztBQU1sQixPQUFJLE9BQU8sS0FBUCxLQUFpQixXQUFqQixFQUE2QjtBQUNoQyxVQUFNLE1BQU0sS0FBTixDQUQwQjtJQUFqQztBQUdBLE9BQUksSUFBSixDQUFTLEdBQVQsRUFUa0I7R0FBbkI7QUFXQSxTQUFPLEdBQVAsQ0F6QjBCO0VBQVQ7Ozs7QUF4SFUsS0FzSnRCLGNBQWMsU0FBZCxXQUFjLENBQUMsSUFBRCxFQUFNLElBQU4sRUFBVyxJQUFYLEVBQW9CO0FBQ3ZDLE1BQUksTUFBTSxFQUFOLENBRG1DO0FBRXZDLE1BQUksUUFBUSxFQUFSLENBRm1DO0FBR3ZDLFFBQU0sSUFBTixDQUFXLEdBQVgsRUFIdUM7QUFJdkMsTUFBSSxlQUFKO01BQVEsYUFBUixDQUp1QztBQUt2QyxPQUFJLElBQUksSUFBRSxDQUFGLEVBQUssSUFBRSxLQUFLLE1BQUwsRUFBYSxHQUE1QixFQUFnQztBQUMvQixTQUFNLEVBQU4sQ0FEK0I7QUFFL0IsT0FBSSxJQUFKLENBQVMsS0FBSyxDQUFMLENBQVQsRUFGK0I7QUFHL0IsT0FBSSxJQUFKLENBQVMsS0FBSyxDQUFMLE1BQVUsQ0FBVixHQUFjLENBQWQsR0FBa0IsS0FBSyxDQUFMLElBQVUsQ0FBVixDQUEzQixDQUgrQjtBQUkvQixPQUFJLElBQUosQ0FBUyxLQUFLLENBQUwsTUFBVSxDQUFWLEdBQWMsQ0FBZCxHQUFrQixLQUFLLENBQUwsSUFBVSxDQUFWLENBQTNCLENBSitCO0FBSy9CLE9BQUksSUFBSSxHQUFKLENBQVEsR0FBUixDQUFKLENBTCtCO0FBTS9CLE9BQUksRUFBRSxJQUFGLEdBQVMsQ0FBVCxJQUFjLEVBQUUsR0FBRixDQUFNLENBQU4sQ0FBZCxFQUF1QjtBQUMxQixNQUFFLE1BQUYsQ0FBUyxDQUFULEVBRDBCO0lBQTNCO0FBR0EsT0FBSSxJQUFKLENBQVMsTUFBTSxJQUFOLENBQVcsQ0FBWCxDQUFULEVBVCtCO0dBQWhDO0FBV0EsU0FBTyxLQUFQLENBaEJ1QztFQUFwQjs7O0FBdEpRLEtBNEt0QixTQUFTLFNBQVQsTUFBUyxDQUFDLFNBQUQsRUFBZTtBQUM3QixNQUFJLE1BQU0sRUFBTjs7QUFEeUIsT0FHeEIsSUFBSSxJQUFJLENBQUosRUFBTyxJQUFJLFVBQVUsTUFBVixFQUFrQixHQUF0QyxFQUEwQztBQUN6QyxPQUFJLElBQUosQ0FBUyxTQUFTLFVBQVUsQ0FBVixDQUFULENBQVQsRUFEeUM7R0FBMUM7OztBQUg2QixNQVF6QixJQUFJLENBQUo7O0FBQ0gsU0FBTyxFQUFQO01BQ0EsZUFGRDtNQUdDLHFCQUhEO01BSUMsTUFBTSxDQUFOLENBWjRCOztBQWM3QixPQUFLLElBQUksSUFBSSxDQUFKLEVBQU8sSUFBSSxJQUFJLE1BQUosRUFBWSxHQUFoQyxFQUFvQztBQUNuQyxTQUFNLENBQU4sQ0FEbUM7QUFFbkMsZUFBWSxJQUFJLEdBQUosQ0FBWixDQUZtQztBQUduQyxPQUFJLFlBQVksQ0FBWixFQUFjO0FBQ2pCLFVBRGlCO0lBQWxCO0dBSEQ7O0FBUUEsT0FBSyxJQUFJLElBQUksQ0FBSixFQUFPLElBQUksSUFBSixFQUFVLEtBQUssQ0FBTCxFQUFRO0FBQ2pDLE9BQUksTUFBTSxFQUFOLENBRDZCO0FBRWpDLFFBQUssSUFBTCxDQUFVLEdBQVYsRUFGaUM7QUFHakMsUUFBSyxJQUFJLElBQUksQ0FBSixFQUFPLElBQUksSUFBSixFQUFVLEtBQUksQ0FBSixFQUFNO0FBQy9CLFFBQUksTUFBTyxTQUFQLEVBQWlCOztBQUVwQixXQUFNLE1BQUksQ0FBSjs7QUFGYyxZQUliLElBQUksQ0FBQyxNQUFJLENBQUosQ0FBRCxHQUFRLElBQUksTUFBSixDQUFaLEdBQTBCLENBQTFCLEVBQTRCO0FBQ2xDLFlBQU0sQ0FBQyxNQUFJLENBQUosQ0FBRCxHQUFRLElBQUksTUFBSixDQURvQjtNQUFuQztBQUdBLGtCQUFhLElBQUksQ0FBQyxNQUFJLENBQUosQ0FBRCxHQUFRLElBQUksTUFBSixDQUF6QixDQVBvQjtBQVFwQixXQUFNLENBQUMsTUFBSSxDQUFKLENBQUQsR0FBUSxJQUFJLE1BQUo7QUFSTSxLQUFyQixNQVNPO0FBQ04sWUFBTSxDQUFOLENBRE07TUFUUDs7QUFEK0IsT0FjL0IsQ0FBSSxJQUFKLENBQVMsR0FBVDs7QUFkK0IsS0FnQi9CLEdBQUksSUFBSSxDQUFKLENBaEIyQjtJQUFoQztHQUhEO0FBc0JBLFNBQU8sSUFBUCxDQTVDNkI7RUFBZjs7O0FBNUthLEtBNE50QixjQUFlLFNBQWYsV0FBZSxDQUFDLEVBQUQsRUFBSSxHQUFKLEVBQVEsSUFBUixFQUFnQjtBQUNsQyxJQUFFLEVBQUYsRUFBTSxJQUFOLENBQVksTUFBWixFQUFvQixRQUFRLEdBQVIsQ0FBcEIsRUFEa0M7QUFFbEMsYUFBVyxZQUFNO0FBQUMsS0FBRSxFQUFGLEVBQU0sSUFBTixDQUFZLE1BQVosRUFBb0IsT0FBTyxHQUFQLENBQXBCLEVBQUQ7R0FBTixFQUEwQyxPQUFLLElBQUwsQ0FBckQsQ0FGa0M7RUFBaEI7OztBQTVOTyxLQW1PdEIsd0JBQXdCLFNBQXhCLHFCQUF3QixDQUFDLEdBQUQsRUFBSyxHQUFMLEVBQVMsTUFBVCxFQUFvQjtBQUNqRCxNQUFJLE1BQU0sRUFBTjs7O0FBRDZDLE1BSTdDLElBQUUsRUFBRixDQUo2QztBQUtqRCxPQUFLLElBQUksSUFBSSxDQUFKLEVBQU8sSUFBSSxDQUFKLEVBQU8sR0FBdkIsRUFBMkI7QUFDMUIsT0FBSSxhQUFXLEdBQVgsR0FBZSxHQUFmLEdBQW1CLENBQW5CLENBRHNCO0FBRTFCLE9BQUksSUFBSixDQUFTLENBQVQsRUFGMEI7R0FBM0I7O0FBS0EsT0FBSyxJQUFJLENBQUosSUFBUyxHQUFkLEVBQW1CO0FBQ2xCLEtBQUUsSUFBSSxDQUFKLENBQUYsRUFDRSxNQURGLEdBRUUsTUFGRixHQUdFLFFBSEYsQ0FHVyxvQkFIWCxFQUlFLE1BSkYsQ0FJUyxZQUFNO0FBQ2IsUUFBSSxVQUFVLE9BQU8sVUFBVSxHQUFWLENBQVAsQ0FBVixDQURTO0FBRWIsZ0JBQVksT0FBWixFQUFvQixHQUFwQixFQUF3QixNQUF4QixFQUZhOztBQUliLFFBQUksU0FBUyxPQUFPLFVBQVUsQ0FBVixDQUFQLENBQVQsQ0FKUztBQUtiLFFBQUksY0FBYyxPQUFPLFVBQVUsQ0FBVixDQUFQLENBQWQsQ0FMUztBQU1iLFFBQUksWUFBWSxPQUFPLFVBQVUsQ0FBVixDQUFQLENBQVosQ0FOUztBQU9iLFFBQUksV0FBVyxZQUFZLE9BQU8sQ0FBUCxDQUFaLEVBQXNCLFlBQVksQ0FBWixDQUF0QixFQUFxQyxVQUFVLENBQVYsQ0FBckMsQ0FBWCxDQVBTO0FBUWIsZ0JBQVksUUFBWixFQUFxQixHQUFHLE1BQUgsQ0FBVSxZQUFWLENBQXJCLEVBQ0MsQ0FBQyxDQUFELEVBQUcsQ0FBSCxFQUFLLENBQUwsRUFBTyxDQUFQLEVBQVMsQ0FBVCxFQUFXLENBQVgsRUFBYSxDQUFiLEVBQWUsQ0FBZixFQUFpQixDQUFqQixFQUFtQixDQUFuQixFQUFzQixHQUF0QixDQUEwQixVQUFDLENBQUQ7WUFBTyxNQUFNLENBQU4sRUFBUyxLQUFUO0tBQVAsQ0FEM0IsRUFSYTtJQUFOLENBSlQsQ0FEa0I7R0FBbkI7RUFWNkI7OztBQW5PRixLQW9RdEIsaUJBQWlCLFNBQWpCLGNBQWlCLENBQUMsR0FBRCxFQUFTO0FBQy9CLE1BQUksTUFBTSxFQUFOOzs7QUFEMkIsTUFJM0IsSUFBRSxFQUFGLENBSjJCO0FBSy9CLE9BQUssSUFBSSxJQUFJLENBQUosRUFBTyxJQUFJLENBQUosRUFBTyxHQUF2QixFQUEyQjtBQUMxQixPQUFJLGFBQVcsR0FBWCxHQUFlLEdBQWYsR0FBbUIsQ0FBbkIsQ0FEc0I7QUFFMUIsT0FBSSxJQUFKLENBQVMsQ0FBVCxFQUYwQjtHQUEzQjtBQUlBLE1BQUksS0FBSyxPQUFPLEtBQVAsQ0FBYyxRQUFkLENBQUwsQ0FUMkI7OzZCQVVuQjtBQUNSLEtBQUUsSUFBSSxDQUFKLENBQUYsRUFDRCxNQURDLEdBRUQsUUFGQyxDQUVRLGtCQUZSLEVBR0QsRUFIQyxDQUdFLE9BSEYsRUFHVyxVQUFDLENBQUQsRUFBTztBQUNuQixNQUFFLElBQUksQ0FBSixDQUFGLEVBQ0MsTUFERCxHQUVDLE1BRkQsR0FHQyxRQUhELENBR1UsMEJBSFYsRUFJQyxJQUpELENBSU0sT0FKTixFQUljLEVBQUUsTUFBRixDQUFTLElBQVQ7O0FBSmQsS0FNQyxPQU5ELENBTVMsRUFOVCxFQURtQjtJQUFQLENBSFg7SUFYMkI7O0FBVTVCLE9BQUssSUFBSSxDQUFKLElBQVMsR0FBZCxFQUFtQjtTQUFWLEdBQVU7R0FBbkI7RUFWbUI7OztBQXBRSyxLQWdTdEIsb0JBQW9CLFNBQXBCLGlCQUFvQixDQUFDLEdBQUQsRUFBUztBQUNsQyxNQUFJLE1BQU0sRUFBTjs7O0FBRDhCLE1BSTlCLElBQUUsRUFBRixDQUo4Qjs7QUFNbEMsT0FBSyxJQUFJLElBQUksQ0FBSixFQUFPLElBQUksQ0FBSixFQUFPLEdBQXZCLEVBQTJCO0FBQzFCLE9BQUksYUFBVyxHQUFYLEdBQWUsR0FBZixHQUFtQixDQUFuQixHQUFxQixNQUFyQixDQURzQjtBQUUxQixPQUFJLElBQUosQ0FBUyxDQUFULEVBRjBCO0dBQTNCOztBQU5rQzsrQkFXdEI7QUFDUixLQUFFLElBQUksQ0FBSixDQUFGLEVBQ0QsTUFEQyxHQUVELFFBRkMsQ0FFUSxrQkFGUixFQUdELEVBSEMsQ0FHRSxPQUhGLEVBR1csVUFBQyxDQUFELEVBQU87QUFDbkIsTUFBRSxJQUFJLENBQUosQ0FBRixFQUNDLE1BREQsR0FFQyxNQUZELEdBR0MsUUFIRCxDQUdVLDRCQUhWLEVBSUMsSUFKRCxDQUlNLE9BSk4sRUFJYyxFQUFFLE1BQUYsQ0FBUyxJQUFULENBSmQ7Ozs7QUFEbUIsUUFTWixNQUFNLFNBQVMsRUFBRSxNQUFGLENBQVMsYUFBVCxDQUF1QixhQUF2QixDQUFxQyxZQUFyQyxDQUFrRCxJQUFsRCxDQUFULENBQU4sQ0FUWTtBQVVuQixVQUFNLEdBQU4sRUFBVyxVQUFYLEdBQXdCLEVBQUUsTUFBRixDQUFTLElBQVQ7OztBQVZMLElBQVAsQ0FIWDtJQVo4Qjs7QUFXL0IsT0FBSyxJQUFJLENBQUosSUFBUyxHQUFkLEVBQW1CO1VBQVYsR0FBVTtHQUFuQjtFQVhzQixDQWhTRTs7QUFnVTVCLEtBQU0seUJBQXlCLFNBQXpCLHNCQUF5QixHQUFNO0FBQ3BDLE1BQUksTUFBTSxFQUFOOztBQURnQyxNQUdoQyxNQUFNLENBQU4sQ0FIZ0M7QUFJcEMsTUFBSSxJQUFJLGlCQUFKLENBSmdDO0FBS3BDLE1BQUksSUFBSixDQUFTLENBQVQ7OztBQUxvQzsrQkFReEI7QUFDUixLQUFFLElBQUksQ0FBSixDQUFGLEVBQ0QsTUFEQyxHQUVELFFBRkMsQ0FFUSxrQkFGUixFQUdELEVBSEMsQ0FHRSxPQUhGLEVBR1csVUFBQyxDQUFELEVBQU87QUFDbkIsTUFBRSxJQUFJLENBQUosQ0FBRixFQUNDLE1BREQsR0FFQyxNQUZELEdBR0MsUUFIRCxDQUdVLDBCQUhWLEVBSUMsSUFKRCxDQUlNLE9BSk4sRUFJYyxFQUFFLE1BQUYsQ0FBUyxJQUFULENBSmQsQ0FEbUI7O0FBT25CLFVBQU0sQ0FBTixFQUFTLFVBQVQsR0FBc0IsRUFBRSxNQUFGLENBQVMsSUFBVDs7Ozs7O0FBUEgsSUFBUCxDQUhYO0lBVGdDOztBQVFqQyxPQUFLLElBQUksQ0FBSixJQUFTLEdBQWQsRUFBbUI7VUFBVixHQUFVO0dBQW5CO0VBUjJCOzs7QUFoVUgsS0FnV3RCLHVCQUF1QixTQUF2QixvQkFBdUIsQ0FBQyxHQUFELEVBQVM7QUFDckMsTUFBSSxNQUFNLEVBQU47OztBQURpQyxNQUlqQyxJQUFFLEVBQUYsQ0FKaUM7O0FBTXJDLE9BQUssSUFBSSxJQUFJLENBQUosRUFBTyxJQUFJLENBQUosRUFBTyxHQUF2QixFQUEyQjtBQUMxQixPQUFJLGFBQVcsR0FBWCxHQUFlLEdBQWYsR0FBbUIsQ0FBbkIsR0FBcUIsU0FBckIsQ0FEc0I7QUFFMUIsT0FBSSxJQUFKLENBQVMsQ0FBVCxFQUYwQjtHQUEzQjs7QUFOcUM7K0JBV3pCO0FBQ1IsS0FBRSxJQUFJLENBQUosQ0FBRixFQUNELE1BREMsR0FFRCxRQUZDLENBRVEsa0JBRlIsRUFHRCxFQUhDLENBR0UsT0FIRixFQUdXLFVBQUMsQ0FBRCxFQUFPO0FBQ25CLE1BQUUsSUFBSSxDQUFKLENBQUYsRUFDQyxNQURELEdBRUMsTUFGRCxHQUdDLFFBSEQsQ0FHVSw0QkFIVixFQUlDLElBSkQsQ0FJTSxPQUpOLEVBSWMsRUFBRSxNQUFGLENBQVMsSUFBVCxDQUpkOzs7O0FBRG1CLFFBU1osTUFBTSxTQUFTLEVBQUUsTUFBRixDQUFTLGFBQVQsQ0FBdUIsYUFBdkIsQ0FBcUMsWUFBckMsQ0FBa0QsSUFBbEQsQ0FBVCxDQUFOLENBVFk7O0FBV25CLFVBQU0sR0FBTixFQUFXLEdBQVgsR0FBaUIsRUFBRSxNQUFGLENBQVMsSUFBVCxDQVhFO0FBWW5CLFVBQU0sR0FBTixFQUFXLElBQVgsR0FBa0IsU0FBUyxFQUFFLE1BQUYsQ0FBUyxJQUFULENBQVQsR0FBd0IsR0FBeEIsR0FBNEIsR0FBNUI7OztBQVpDLElBQVAsQ0FIWDtJQVppQzs7QUFXbEMsT0FBSyxJQUFJLENBQUosSUFBUyxHQUFkLEVBQW1CO1VBQVYsR0FBVTtHQUFuQjtFQVh5QixDQWhXRDs7QUFrWTVCLEtBQU0sNEJBQTRCLFNBQTVCLHlCQUE0QixHQUFNO0FBQ3ZDLE1BQUksTUFBTSxFQUFOOztBQURtQyxNQUduQyxNQUFNLENBQU4sQ0FIbUM7QUFJdkMsTUFBSSxJQUFJLG9CQUFKLENBSm1DO0FBS3ZDLE1BQUksSUFBSixDQUFTLENBQVQ7OztBQUx1QzsrQkFRM0I7QUFDUixLQUFFLElBQUksQ0FBSixDQUFGLEVBQ0QsTUFEQyxHQUVELFFBRkMsQ0FFUSxrQkFGUixFQUdELEVBSEMsQ0FHRSxPQUhGLEVBR1csVUFBQyxDQUFELEVBQU87QUFDbkIsTUFBRSxJQUFJLENBQUosQ0FBRixFQUNDLE1BREQsR0FFQyxNQUZELEdBR0MsUUFIRCxDQUdVLDRCQUhWLEVBSUMsSUFKRCxDQUlNLE9BSk4sRUFJYyxFQUFFLE1BQUYsQ0FBUyxJQUFULENBSmQsQ0FEbUI7O0FBT25CLFVBQU0sQ0FBTixFQUFTLEdBQVQsR0FBZSxFQUFFLE1BQUYsQ0FBUyxJQUFULENBUEk7QUFRbkIsVUFBTSxDQUFOLEVBQVMsSUFBVCxHQUFnQixTQUFTLEVBQUUsTUFBRixDQUFTLElBQVQsQ0FBVCxHQUF3QixHQUF4QixHQUE0QixHQUE1Qjs7Ozs7O0FBUkcsSUFBUCxDQUhYO0lBVG1DOztBQVFwQyxPQUFLLElBQUksQ0FBSixJQUFTLEdBQWQsRUFBbUI7VUFBVixHQUFVO0dBQW5CO0VBUjhCLENBbFlOOztBQWlhNUIsS0FBTSxxQkFBcUIsU0FBckIsa0JBQXFCLEdBQU07QUFDaEMsSUFBRSxlQUFGLEVBQW1CLEVBQW5CLENBQXNCLE9BQXRCLEVBQStCLFVBQUMsQ0FBRCxFQUFPOzs7Ozs7Ozs7Ozs7Ozs7QUFlckMsWUFBUyxJQUFULENBZnFDO0FBZ0JyQzs7QUFoQnFDLEdBQVAsQ0FBL0I7Ozs7Ozs7QUFEZ0MsRUFBTixDQWphQzs7QUE2YjVCLEtBQU0scUJBQXFCLFNBQXJCLGtCQUFxQixHQUFNO0FBQ2hDLElBQUUsZUFBRixFQUFtQixFQUFuQixDQUFzQixPQUF0QixFQUErQixVQUFDLENBQUQsRUFBTztBQUNyQyxZQUFTLEtBQVQ7O0FBRHFDLEdBQVAsQ0FBL0I7Ozs7O0FBRGdDLEVBQU47Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTdiQyxLQWtldEIsWUFBWSxTQUFaLFNBQVksQ0FBQyxTQUFELEVBQVksT0FBWixFQUFxQixRQUFyQixFQUErQixPQUEvQixFQUEyQzs7QUFFMUQsTUFBSSxVQUFVLFlBQVksUUFBWixDQUY0QztBQUcxRCxNQUFJLFFBQVEsT0FBTyxPQUFQLEVBQWdCLENBQWhCLENBQVIsQ0FIc0Q7QUFJMUQsTUFBSSxPQUFPLE1BQU0sT0FBTixFQUFlLElBQWYsQ0FKK0M7O0FBTTFELE1BQUksVUFBVSxhQUFhLFVBQWIsRUFBVixDQU5zRDtBQU8xRCxVQUFRLElBQVIsQ0FBYSxLQUFiLEdBQXFCLElBQXJCLENBUDBEO0FBUTFELFVBQVEsT0FBUixDQUFnQixhQUFhLFdBQWIsQ0FBaEIsQ0FSMEQ7O0FBVTFELE1BQUksV0FBVyxhQUFhLFVBQWIsRUFBWCxDQVZzRDtBQVcxRCxXQUFTLE9BQVQsQ0FBaUIsT0FBakIsRUFYMEQ7QUFZMUQsV0FBUyxJQUFULENBQWMsS0FBZCxHQUFzQixDQUF0QixDQVowRDs7QUFjMUQsV0FBUyxJQUFULENBQWMsZUFBZCxDQUE4QixDQUE5QixFQUFpQyxTQUFqQyxFQUE0QyxxQkFBcUIsQ0FBckIsQ0FBNUMsRUFkMEQ7QUFlMUQsV0FBUyxJQUFULENBQWMsZUFBZCxDQUE4QixDQUE5QixFQUFpQyxPQUFqQyxFQUEwQyxxQkFBcUIsQ0FBckIsQ0FBMUMsRUFmMEQ7O0FBaUIxRCxNQUFJLGFBQWEsYUFBYSxnQkFBYixFQUFiLENBakJzRDtBQWtCMUQsYUFBVyxPQUFYLENBQW1CLFFBQW5CLEVBbEIwRDs7QUFvQjFELGFBQVcsSUFBWCxHQUFrQixjQUFsQixDQXBCMEQ7QUFxQjFELGFBQVcsTUFBWCxDQUFrQixLQUFsQixHQUEwQixRQUFRLEdBQVIsQ0FyQmdDO0FBc0IxRCxhQUFXLFNBQVgsQ0FBcUIsS0FBckIsR0FBNkIsR0FBN0IsQ0F0QjBEOztBQXdCNUQsTUFBSSxVQUFVLGFBQWEsVUFBYixFQUFWLENBeEJ3RDtBQXlCNUQsVUFBUSxJQUFSLENBQWEsS0FBYixHQUFxQixXQUFyQixDQXpCNEQ7QUEwQjVELFVBQVEsT0FBUixDQUFnQixXQUFXLE1BQVgsQ0FBaEIsQ0ExQjREOztBQTRCNUQsTUFBSSxNQUFNLGFBQWEsZ0JBQWIsRUFBTixDQTVCd0Q7QUE2QjVELE1BQUksT0FBSixDQUFZLE9BQVosRUE3QjREO0FBOEI1RCxNQUFJLFNBQUosQ0FBYyxLQUFkLEdBQXFCLE9BQXJCLENBOUI0RDs7QUFnQzVELGFBQVcsS0FBWCxDQUFpQixTQUFqQixFQWhDNEQ7QUFpQzFELE1BQUksS0FBSixDQUFVLFNBQVYsRUFqQzBEO0FBa0MxRCxhQUFXLElBQVgsQ0FBZ0IsVUFBUyxDQUFULENBQWhCLENBbEMwRDtBQW1DMUQsTUFBSSxJQUFKLENBQVMsVUFBUyxDQUFULENBQVQsQ0FuQzBEO0VBQTNDOzs7QUFsZVUsS0EwZ0J0QixnQkFBZ0IsU0FBaEIsYUFBZ0IsR0FBTTtBQUMzQixNQUFJLENBQUMsTUFBRCxJQUFXLFdBQVcsTUFBWCxLQUFzQixDQUF0QixFQUF3QjtBQUFDLFdBQVEsR0FBUixDQUFZLE1BQVosRUFBRDtHQUF2QztBQUNBLE1BQUksS0FBSyxhQUFhLFdBQWIsQ0FGa0I7QUFHM0IsU0FBTyxXQUFXLE1BQVgsR0FBa0IsQ0FBbEIsSUFBdUIsV0FBVyxDQUFYLEVBQWMsQ0FBZCxJQUFrQixLQUFHLElBQUgsRUFBUTs7QUFFdkQsT0FBSSxPQUFPLFdBQVcsTUFBWCxDQUFrQixDQUFsQixFQUFvQixDQUFwQixDQUFQOzs7O0FBRm1ELFlBTXZELENBQVUsS0FBSyxDQUFMLEVBQVEsQ0FBUixDQUFWLEVBQXFCLEtBQUssQ0FBTCxFQUFRLENBQVIsQ0FBckIsRUFBZ0MsS0FBSyxDQUFMLEVBQVEsQ0FBUixDQUFoQyxFQUEyQyxNQUFNLEtBQUssQ0FBTCxFQUFRLENBQVIsQ0FBTixFQUFrQixJQUFsQixDQUEzQzs7QUFOdUQsY0FRdkQsQ0FBWSxLQUFLLENBQUwsRUFBUSxDQUFSLENBQVosRUFBdUIsS0FBSyxDQUFMLEVBQVEsQ0FBUixDQUF2QixFQUFrQyxLQUFLLENBQUwsRUFBUSxDQUFSLENBQWxDLEVBUnVEO0dBQXhEO0FBVUEsYUFBVyxhQUFYLEVBQXlCLEVBQXpCLEVBYjJCO0VBQU47Ozs7QUExZ0JNLEtBNGhCeEIsU0FBUyxJQUFULENBNWhCd0I7QUE2aEI1QixLQUFJLGFBQWEsRUFBYixDQTdoQndCOztBQStoQjVCLEtBQUksZUFBZSxJQUFmLENBL2hCd0I7O0FBaWlCNUIsS0FBSTtBQUNELFNBQU8sWUFBUCxHQUFzQixPQUFPLFlBQVAsSUFBcUIsT0FBTyxrQkFBUCxDQUQxQztBQUVELE1BQUksZUFBZSxJQUFJLFlBQUosRUFBZixDQUZIO0VBQUosQ0FHRSxPQUFPLENBQVAsRUFBVTtBQUNSLFVBQVEsR0FBUixDQUFZLDBCQUFaLEVBRFE7RUFBVjs7O0FBcGlCMEIsRUEwaUI1QixDQUFFLE1BQUYsRUFBVSxFQUFWLENBQWEsVUFBYixFQUF5QixVQUFDLENBQUQsRUFBTzs7O0FBRy9CLE1BQUksU0FBUyxhQUFhLFlBQWIsQ0FBMEIsQ0FBMUIsRUFBNkIsQ0FBN0IsRUFBZ0MsS0FBaEMsQ0FBVCxDQUgyQjtBQUkvQixNQUFJLFNBQVMsYUFBYSxrQkFBYixFQUFULENBSjJCO0FBSy9CLFNBQU8sTUFBUCxHQUFnQixNQUFoQjs7O0FBTCtCLFFBUS9CLENBQU8sT0FBUCxDQUFlLGFBQWEsV0FBYixDQUFmOzs7QUFSK0IsTUFXM0IsT0FBTyxPQUFPLE1BQVAsS0FBa0IsV0FBekIsRUFBcUM7QUFDeEMsVUFBTyxNQUFQLENBQWMsQ0FBZCxFQUR3QztHQUF6Qzs7Ozs7Ozs7OztBQVgrQixFQUFQLENBQXpCOzs7O0FBMWlCNEIsS0Fza0J4QixRQUFRLENBQUM7QUFDWixRQUFLLENBQUw7QUFDQSxVQUFPLEdBQVA7QUFDQSxTQUFNLEtBQU47QUFDRyxXQUFRLFNBQVI7QUFDSCxXQUFRLFNBQVI7QUFDQSxnQkFBYSxJQUFiO0FBQ0EsUUFBSyxXQUFMO0FBQ0EsYUFBVSxJQUFWO0VBUlcsRUFXWjtBQUNDLFFBQUssQ0FBTDtBQUNBLFVBQU8sR0FBUDtBQUNBLFNBQU0sS0FBTjtBQUNBLFdBQVEsU0FBUjtBQUNBLFdBQVEsU0FBUjtBQUNBLGdCQUFhLElBQWI7QUFDQSxRQUFLLFdBQUw7QUFDQSxhQUFVLElBQVY7RUFuQlcsRUFxQlo7QUFDQyxRQUFLLENBQUw7QUFDQSxVQUFPLEdBQVA7QUFDQSxTQUFNLElBQU47QUFDQSxXQUFRLFNBQVI7QUFDQSxXQUFRLFNBQVI7QUFDQSxnQkFBYSxJQUFiO0FBQ0EsUUFBSyxXQUFMO0FBQ0EsYUFBVSxLQUFWO0VBN0JXLEVBK0JaO0FBQ0MsUUFBSyxDQUFMO0FBQ0EsVUFBTyxHQUFQO0FBQ0EsU0FBTSxJQUFOO0FBQ0EsV0FBUSxTQUFSO0FBQ0EsV0FBUSxTQUFSO0FBQ0EsZ0JBQWEsSUFBYjtBQUNBLFFBQUssV0FBTDtBQUNBLGFBQVUsS0FBVjtFQXZDVyxFQTBDWjtBQUNDLFFBQUssQ0FBTDtBQUNBLFVBQU8sR0FBUDtBQUNBLFNBQU0sS0FBTjtBQUNBLFdBQVEsU0FBUjtBQUNBLFdBQVEsU0FBUjtBQUNBLGdCQUFhLElBQWI7QUFDQSxRQUFLLFdBQUw7QUFDQSxhQUFVLEtBQVY7RUFsRFcsRUFvRFo7QUFDQyxRQUFLLENBQUw7QUFDQSxVQUFPLEdBQVA7QUFDQSxTQUFNLElBQU47QUFDQSxXQUFRLFNBQVI7QUFDQSxXQUFRLFNBQVI7QUFDQSxnQkFBYSxJQUFiO0FBQ0EsUUFBSyxXQUFMO0FBQ0EsYUFBVSxLQUFWO0VBNURXLEVBOERaO0FBQ0MsUUFBSyxDQUFMO0FBQ0EsVUFBTyxHQUFQO0FBQ0EsU0FBTSxJQUFOO0FBQ0EsV0FBUSxTQUFSO0FBQ0EsV0FBUSxTQUFSO0FBQ0EsZ0JBQWEsSUFBYjtBQUNBLFFBQUssV0FBTDtBQUNBLGFBQVUsS0FBVjtFQXRFVyxFQXdFWjtBQUNDLFFBQUssQ0FBTDtBQUNBLFVBQU8sR0FBUDtBQUNBLFNBQU0sS0FBTjtBQUNBLFdBQVEsU0FBUjtBQUNBLFdBQVEsU0FBUjtBQUNBLGdCQUFhLElBQWI7QUFDQSxRQUFLLFdBQUw7QUFDQSxhQUFVLEtBQVY7RUFoRlcsRUFrRlo7QUFDQyxRQUFLLENBQUw7QUFDQSxVQUFPLEdBQVA7QUFDQSxTQUFNLElBQU47QUFDQSxXQUFRLFNBQVI7QUFDQSxXQUFRLFNBQVI7QUFDQSxnQkFBYSxJQUFiO0FBQ0EsUUFBSyxXQUFMO0FBQ0EsYUFBVSxLQUFWO0VBMUZXLEVBNEZaO0FBQ0MsUUFBSyxDQUFMO0FBQ0EsVUFBTyxHQUFQO0FBQ0EsU0FBTSxJQUFOO0FBQ0EsV0FBUSxTQUFSO0FBQ0EsV0FBUSxTQUFSO0FBQ0EsZ0JBQWEsSUFBYjtBQUNBLFFBQUssV0FBTDtBQUNBLGFBQVUsS0FBVjtFQXBHVyxDQUFSOzs7QUF0a0J3QixLQThxQnhCLFFBQVE7QUFDWCxRQUFNO0FBQ0wsV0FBUSxHQUFSO0FBQ0EsYUFBVSxDQUFDLEdBQUQ7R0FGWDtBQUlBLFFBQU07QUFDTCxXQUFRLEdBQVI7QUFDQSxhQUFVLENBQUMsR0FBRDtHQUZYO0FBSUEsUUFBTTtBQUNMLFdBQVEsR0FBUjtBQUNBLGFBQVUsQ0FBQyxHQUFEO0dBRlg7QUFJQSxRQUFNO0FBQ0wsV0FBUSxHQUFSO0FBQ0EsYUFBVSxDQUFDLEdBQUQ7R0FGWDtBQUlBLFFBQU07QUFDTCxXQUFRLEdBQVI7QUFDQSxhQUFVLENBQVY7R0FGRDtBQUlBLFFBQU07QUFDTCxXQUFRLEdBQVI7QUFDQSxhQUFVLEdBQVY7R0FGRDtBQUlBLFFBQU07QUFDTCxXQUFRLEdBQVI7QUFDQSxhQUFVLEdBQVY7R0FGRDtBQUlBLFFBQU07QUFDTCxXQUFRLEdBQVI7QUFDQSxhQUFVLEdBQVY7R0FGRDtBQUlBLFFBQU07QUFDTCxXQUFRLEdBQVI7QUFDQSxhQUFVLEdBQVY7R0FGRDtBQUlBLFFBQU07QUFDTCxXQUFRLEdBQVI7QUFDQSxhQUFVLEdBQVY7R0FGRDtBQUlBLFFBQU07QUFDTCxXQUFRLEdBQVI7QUFDQSxhQUFVLElBQVY7R0FGRDtFQXpDRyxDQTlxQndCOztBQSt0QjVCLEtBQUksYUFBYSxHQUFiLENBL3RCd0I7QUFndUI1QixLQUFJLGVBQWUsR0FBZixDQWh1QndCO0FBaXVCNUIsS0FBSSxjQUFjLEdBQWQsQ0FqdUJ3QjtBQWt1QjVCLEtBQUksdUJBQXVCLENBQUMsSUFBRCxFQUFNLEdBQU4sQ0FBdkIsQ0FsdUJ3QjtBQW11QjVCLEtBQUksVUFBVSxDQUFWOzs7O0FBbnVCd0IsS0F1dUJ0QixTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUQsRUFBSyxHQUFOLEVBQVUsR0FBVixDQUFELEVBQWdCLENBQUMsQ0FBRCxFQUFJLEdBQUosRUFBUSxHQUFSLENBQWhCLEVBQTZCLENBQUMsRUFBRCxFQUFLLEdBQUwsRUFBUyxHQUFULENBQTdCLEVBQTJDLENBQUMsRUFBRCxFQUFLLEdBQUwsRUFBUyxHQUFULENBQTNDLEVBQXlELENBQUMsQ0FBRCxFQUFJLEdBQUosRUFBUSxHQUFSLENBQXpELENBQVQsQ0F2dUJzQjtBQXd1QjVCLEtBQUksaUJBQWlCLFVBQWpCOzs7QUF4dUJ3QixLQTR1QnRCLFlBQVksU0FBWixTQUFZLEdBQU07O0FBRXZCLE1BQUksVUFBVSxHQUFHLFNBQUgsQ0FBYSxNQUFiLEVBQXFCLElBQXJCLEVBQVYsQ0FGbUI7QUFHdkIsTUFBSSxRQUFRLEdBQUcsU0FBSCxDQUFhLE1BQWIsRUFBcUIsQ0FBckIsQ0FBUixDQUhtQjtBQUlwQixNQUFJLFlBQVksYUFBYSxXQUFiOztBQUpJLFlBTXBCLEdBQVksRUFBWixDQU5vQjtBQU92QixPQUFLLElBQUksSUFBRSxDQUFGLEVBQUssSUFBSSxRQUFRLE1BQVIsRUFBZ0IsR0FBbEMsRUFBdUM7QUFDdEMsT0FBSSxJQUFJLFFBQVEsQ0FBUixFQUFXLENBQVgsQ0FBSjs7O0FBRGtDLE9BSWxDLE1BQU0sRUFBTixDQUprQztBQUt0QyxPQUFJLElBQUosQ0FBUyxJQUFFLFVBQUYsR0FBYSxTQUFiLENBQVQsQ0FMc0M7QUFNdEMsT0FBSSxJQUFKLENBQVMsQ0FBVCxFQU5zQztBQU90QyxPQUFJLElBQUosQ0FBUyxZQUFULEVBUHNDO0FBUXRDLE9BQUksSUFBSixDQUFTLE1BQU0sQ0FBTixDQUFULEVBUnNDO0FBU3RDLGNBQVcsSUFBWCxDQUFnQixHQUFoQixFQVRzQztHQUF2Qzs7QUFQdUIsZUFtQnBCLEdBbkJvQjtFQUFOOzs7QUE1dUJVLEtBbXdCdEIsV0FBVyxTQUFYLFFBQVcsQ0FBQyxJQUFELEVBQVU7QUFDMUIsTUFBTSxRQUFRLElBQVI7TUFDSCxTQUFTLEVBQVQsQ0FGdUI7QUFHdkIsTUFBSSxjQUFjLFVBQVEsUUFBTSxFQUFOLENBQVIsR0FBa0IsR0FBbEIsR0FBc0IsTUFBdEIsQ0FISztBQUl2QixNQUFNLE1BQU0sR0FBRyxNQUFILENBQVUsSUFBVixDQUFOO01BQ1QsTUFBTSxJQUFJLE1BQUosQ0FBVyxLQUFYLEVBQ0UsSUFERixDQUNPLE9BRFAsRUFDZ0IsS0FEaEIsRUFFRSxJQUZGLENBRU8sUUFGUCxFQUVpQixNQUZqQixFQUdFLElBSEYsQ0FHTyxTQUhQLEVBR2tCLFdBSGxCLEVBSUUsSUFKRixDQUlPLHFCQUpQLEVBSThCLGVBSjlCLENBQU4sQ0FMMEI7O0FBV3ZCLFNBQU8sR0FBUCxDQVh1QjtFQUFWOzs7O0FBbndCVyxLQW94QmxCLEtBQUssRUFBTDtLQUNOLEtBQUssRUFBTDtLQUNBLE9BQU0sQ0FBTjtLQUNBLE9BQU0sRUFBTjs7OztBQXZ4QndCLEtBMnhCbEIsTUFBTSxTQUFTLFFBQVQsQ0FBTixDQTN4QmtCO0FBNHhCeEIsS0FBSSxhQUFhLENBQUMsQ0FBRCxFQUFHLENBQUgsRUFBSyxDQUFMLEVBQU8sQ0FBUCxFQUFVLEdBQVYsQ0FBYyxVQUFDLENBQUQ7U0FBTyxNQUFNLENBQU4sRUFBUyxLQUFUO0VBQVAsQ0FBM0IsQ0E1eEJvQjtBQTZ4QnhCLEtBQUksU0FBUyxPQUFPLFVBQVUsQ0FBVixDQUFQLENBQVQsQ0E3eEJvQjtBQTh4QjNCLGFBQVksTUFBWixFQUFtQixHQUFuQixFQUF1QixVQUF2QixFQUFrQyxLQUFsQyxFQTl4QjJCOztBQWd5QnhCLEtBQU0sV0FBVyxTQUFTLFVBQVQsQ0FBWCxDQWh5QmtCO0FBaXlCeEIsS0FBSSxjQUFjLENBQUMsQ0FBRCxFQUFHLENBQUgsRUFBSyxDQUFMLEVBQU8sQ0FBUCxFQUFVLEdBQVYsQ0FBYyxVQUFDLENBQUQ7U0FBTyxNQUFNLENBQU4sRUFBUyxLQUFUO0VBQVAsQ0FBNUIsQ0FqeUJvQjtBQWt5QnhCLEtBQUksY0FBYyxPQUFPLFVBQVUsQ0FBVixDQUFQLENBQWQsQ0FseUJvQjtBQW15QjNCLGFBQVksV0FBWixFQUF3QixRQUF4QixFQUFpQyxXQUFqQyxFQUE2QyxLQUE3QyxFQW55QjJCOztBQXF5QnhCLEtBQU0sU0FBUyxTQUFTLFVBQVQsQ0FBVCxDQXJ5QmtCO0FBc3lCeEIsS0FBSSxZQUFZLENBQUMsQ0FBRCxFQUFHLENBQUgsRUFBSyxDQUFMLEVBQU8sQ0FBUCxFQUFVLEdBQVYsQ0FBYyxVQUFDLENBQUQ7U0FBTyxNQUFNLENBQU4sRUFBUyxLQUFUO0VBQVAsQ0FBMUIsQ0F0eUJvQjtBQXV5QnhCLEtBQUksWUFBWSxPQUFPLFVBQVUsQ0FBVixDQUFQLENBQVosQ0F2eUJvQjtBQXd5QjNCLGFBQVksU0FBWixFQUFzQixNQUF0QixFQUE2QixTQUE3QixFQUF1QyxLQUF2Qzs7O0FBeHlCMkIsS0EyeUJyQixTQUFTLFNBQVMsWUFBVCxDQUFULENBM3lCcUI7QUE0eUIzQixLQUFJLFlBQVksQ0FBQyxDQUFELEVBQUcsQ0FBSCxFQUFLLENBQUwsRUFBTyxDQUFQLEVBQVMsQ0FBVCxFQUFXLENBQVgsRUFBYSxDQUFiLEVBQWUsQ0FBZixFQUFpQixDQUFqQixFQUFtQixDQUFuQixFQUFzQixHQUF0QixDQUEwQixVQUFDLENBQUQ7U0FBTyxNQUFNLENBQU4sRUFBUyxLQUFUO0VBQVAsQ0FBdEMsQ0E1eUJ1QjtBQTZ5QjNCLEtBQUksWUFBWSxZQUFZLE9BQU8sQ0FBUCxDQUFaLEVBQXNCLFlBQVksQ0FBWixDQUF0QixFQUFxQyxVQUFVLENBQVYsQ0FBckMsQ0FBWixDQTd5QnVCO0FBOHlCM0IsYUFBWSxTQUFaLEVBQXNCLE1BQXRCLEVBQTZCLFNBQTdCLEVBQXVDLElBQXZDOzs7QUE5eUIyQixHQWl6QnhCLENBQUcsTUFBSCxDQUFVLE1BQVYsRUFDRSxFQURGLENBQ0ssUUFETCxFQUNlLFlBQU07O0FBRW5CLE1BQUksV0FBVyxFQUFFLE1BQUYsRUFBVSxLQUFWLEVBQVgsQ0FGZTtBQUduQixNQUFJLElBQUosQ0FBUyxPQUFULEVBQWtCLFFBQWxCLEVBSG1CO0FBSW5CLFdBQVMsSUFBVCxDQUFjLE9BQWQsRUFBdUIsUUFBdkIsRUFKbUI7QUFLbkIsU0FBTyxJQUFQLENBQVksT0FBWixFQUFxQixRQUFyQixFQUxtQjtBQU1uQixTQUFPLElBQVAsQ0FBWSxPQUFaLEVBQXFCLFFBQXJCLEVBTm1CO0VBQU4sQ0FEZjs7QUFqekJ3QixLQTJ6QnJCLE9BQU8sRUFBRSxNQUFGLEVBQVUsS0FBVixFQUFQLENBM3pCcUI7QUE0ekIzQixLQUFJLElBQUosQ0FBUyxPQUFULEVBQWtCLElBQWxCLEVBNXpCMkI7QUE2ekIzQixVQUFTLElBQVQsQ0FBYyxPQUFkLEVBQXVCLElBQXZCLEVBN3pCMkI7QUE4ekIzQixRQUFPLElBQVAsQ0FBWSxPQUFaLEVBQXFCLElBQXJCLEVBOXpCMkI7QUErekIzQixRQUFPLElBQVAsQ0FBWSxPQUFaLEVBQXFCLElBQXJCOzs7Ozs7OztBQS96QjJCLDBCQXkwQjNCLEdBejBCMkI7QUEwMEIzQjs7OztBQTEwQjJCLEVBODBCMUIsQ0FBRCxFQUFHLENBQUgsRUFBSyxDQUFMLEVBQVEsR0FBUixDQUFZLGNBQVosRUE5MEIyQjtBQSswQjNCLEVBQUMsQ0FBRCxFQUFHLENBQUgsRUFBSyxDQUFMLEVBQVEsR0FBUixDQUFZLGlCQUFaLEVBLzBCMkI7QUFnMUIzQixFQUFDLENBQUQsRUFBRyxDQUFILEVBQUssQ0FBTCxFQUFRLEdBQVIsQ0FBWSxvQkFBWixFQWgxQjJCOztBQWsxQjNCLHVCQUFzQixDQUF0QixFQUF3QixHQUF4QixFQUE0QixVQUE1QixFQWwxQjJCO0FBbTFCM0IsdUJBQXNCLENBQXRCLEVBQXdCLFFBQXhCLEVBQWlDLFdBQWpDLEVBbjFCMkI7QUFvMUIzQix1QkFBc0IsQ0FBdEIsRUFBd0IsTUFBeEIsRUFBK0IsU0FBL0IsRUFwMUIyQjs7QUF1MUIzQixzQkF2MUIyQjtBQXcxQjNCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Q0F4MUJpQixDQUFsQjtBQUE0QiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuLy8gY3JlYXRlIEhUTUwgc3R1ZmZcbi8vIGNvbnN0IGNyZWF0ZUh0bWxUb25Db250cm9sID0gKG5yKSA9PiB7XG4vLyBcdGNvbnN0IHBvc25yID0gJzEnO1xuXHRcblxuLy8gXHRsZXQgZWxDb250YWluZXIgPSAndG9uLWNvbnRyb2wtJytucjtcbi8vIFx0bGV0IGVsT3V0RGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIkRJVlwiKTtcbi8vIFx0ZWxPdXREaXYuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJjb2wteHMtM1wiKTtcblx0XG4vLyBcdGxldCBlbGlucHV0R3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiRElWXCIpO1xuLy8gXHRlbGlucHV0R3JvdXAuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJpbnB1dC1ncm91cC1idG5cIik7IFxuLy8gXHRlbE91dERpdi5hcHBlbmRDaGlsZChlbGlucHV0R3JvdXApO1xuLy8gXHQvLyBCVVRUT05cbi8vIFx0bGV0IHRleHRub2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoXCIgWmFobFwiKTsgXG4vLyBcdGxldCBidG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiQlVUVE9OXCIpO1xuLy8gXHRsZXQgc2lkPSdidG4tcm93JytucisnLScrcG9zbnI7XG4vLyBcdGJ0bi5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBzaWQpO1xuLy8gXHRidG4uc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJidG4gYnRuLWluZm8gZHJvcGRvd24tdG9nZ2xlXCIpO1xuLy8gXHRidG4uYXBwZW5kQ2hpbGQodGV4dG5vZGUpO1xuLy8gXHRlbGlucHV0R3JvdXAuYXBwZW5kQ2hpbGQoYnRuKTtcbi8vIFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWxDb250YWluZXIpLmFwcGVuZENoaWxkKGVsT3V0RGl2KTtcblxuXG4vLyB9O1xuXG4vLyBEM0pTXG5jb25zdCB1cGRhdGVHcmFwaCA9IChkYXRhLHN2Zyxsb29rdXApID0+IHtcblx0XG5cdGxldCBzZWxlY3Rpb24gPSAgc3ZnLnNlbGVjdEFsbCgnc3ZnIGcgcmVjdCcpXG5cdFx0LmRhdGEoZGF0YVswXSlcblx0XHQuYXR0cignZmlsbCcsIChkLGkpID0+IGxvb2t1cFtkXSlcblx0XHQuZW50ZXIoKVxuXHRcdC5hcHBlbmQoJ3JlY3QnKVxuXHQgICAgLmF0dHIoJ3gnLCAoZCwgaSkgPT4gIDI4ICogaSlcblx0ICAgIC5hdHRyKCd3aWR0aCcsIHJ3KVxuXHQgICAgLmF0dHIoJ2hlaWdodCcsIHJoKVxuXHQgICAgLnJlbW92ZSgpO1xuICBcbn07XG5cbmNvbnN0IHJlbmRlckdyYXBoID0gKGRhdGEsc3ZnLGxvb2t1cCxjaGVja3N1bSkgPT4ge1xuXHQvLyBDcmVhdGUgYSBncm91cCBmb3IgZWFjaCByb3cgaW4gdGhlIGRhdGEgbWF0cml4IGFuZFxuXHQvLyB0cmFuc2xhdGUgdGhlIGdyb3VwIHZlcnRpY2FsbHlcblx0bGV0IGdycCA9IHN2Zy5zZWxlY3RBbGwoJ3N2ZyBnJylcblx0ICAgIC5kYXRhKGRhdGEpXG5cdCAgICAuZW50ZXIoKVxuXHQgICAgLmFwcGVuZCgnZycpXG5cdCAgICAuYXR0cigndHJhbnNmb3JtJywgKGQsIGkpID0+ICd0cmFuc2xhdGUoMCwgJyArIDU0ICogaSArICcpJyk7ICBcblxuXHRpZiAoY2hlY2tzdW0pe1xuXHRcdC8vaW5uZXIgc3RydWN0dXJlXG5cdFx0bGV0IGluZ3JwID0gZ3JwLnNlbGVjdEFsbCgnZycpXG5cdFx0XHQvLyAuZmlsdGVyKCAoZCxpKSA9PiB0eXBlb2YgZFtpXSA9PT0gJ29iamVjdCcpXG5cdFx0ICAgIC5kYXRhKChkKSA9PiBkKVxuXHRcdCAgICAuZW50ZXIoKVxuXHRcdCAgICAuYXBwZW5kKCdnJylcblx0XHQgICAgLmF0dHIoJ3RyYW5zZm9ybScsIChkLCBpKSA9PiAndHJhbnNsYXRlKCcgKyAyOCAqIGkgKyAnLDApJyk7XG5cblxuXHRcdGluZ3JwLnNlbGVjdEFsbCgncmVjdCcpXG5cdFx0ICAgIC5kYXRhKChkKSA9PiBkKVxuXHRcdCAgICAuZW50ZXIoKVxuXHRcdCAgICAuYXBwZW5kKCdyZWN0Jylcblx0XHQgICAgXHQuYXR0cigneCcsIChkLCBpLGspID0+ICBydy9kYXRhWzBdW2tdLmxlbmd0aCAqIGkpXG5cdFx0ICAgICAgICAuYXR0cignZmlsbCcsIChkLGkpID0+IGxvb2t1cFtkXSlcblx0XHQgICAgICAgIC5hdHRyKCd3aWR0aCcsIChkLGksaykgPT4gIHJ3L2RhdGFbMF1ba10ubGVuZ3RoKVxuXHRcdCAgICAgICAgLmF0dHIoJ2hlaWdodCcsIHJoKTsgIFxuXHR9IGVsc2Uge1xuXHRcdC8vIEZvciBlYWNoIGdyb3VwLCBjcmVhdGUgYSBzZXQgb2YgcmVjdGFuZ2xlcyBhbmQgYmluZCBcblx0XHQvLyB0aGVtIHRvIHRoZSBpbm5lciBhcnJheSAodGhlIGlubmVyIGFycmF5IGlzIGFscmVhZHlcblx0XHQvLyBiaW5kZWQgdG8gdGhlIGdyb3VwKVxuXHRcdGdycC5zZWxlY3RBbGwoJ3JlY3QnKVxuXHRcdFx0Ly8gLmZpbHRlciggKGQsaSkgPT4gdHlwZW9mIGRbaV0gPT09ICdudW1iZXInKVxuXHRcdCAgICAuZGF0YSgoZCkgPT4gZClcblx0XHQgICAgLmVudGVyKClcblx0XHQgICAgLmFwcGVuZCgncmVjdCcpXG5cdFx0ICAgICAgICAuYXR0cigneCcsIChkLCBpKSA9PiAgMjggKiBpKVxuXHRcdCAgICAgICAgLmF0dHIoJ2ZpbGwnLCAoZCxpKSA9PiBsb29rdXBbZF0pXG5cdFx0ICAgICAgICAuYXR0cignd2lkdGgnLCBydylcblx0XHQgICAgICAgIC5hdHRyKCdoZWlnaHQnLCByaCk7ICAgICBcblx0fVxuXG5cdC8vTW9kdWxvIDEwIHRpY2tzICAgICAgICBcblx0Z3JwLnNlbGVjdEFsbCgnbGluZScpXG5cdCAgICAuZGF0YSgoZCkgPT4ge1xuXHQgICAgXHRsZXQgdG1wID0gTWF0aC50cnVuYyhkLmxlbmd0aCAvIDEwKTtcblx0ICAgIFx0bGV0IG91dCA9IG5ldyBBcnJheSh0bXArMSkuZmlsbCgwKTtcblx0ICAgIFx0cmV0dXJuIG91dDtcblx0ICAgIH0pXG5cdCAgICAuZW50ZXIoKS5hcHBlbmQoJ2xpbmUnKVxuXHQgICAgXHQvLy5maWx0ZXIoKGQsaSkgPT4gaSUxMD09PTApXG4gIFx0XHRcdC5hdHRyKCd4MScsICAoZCwgaSkgPT4gMjgwICogaSsxKVxuICBcdFx0XHQuYXR0cigneTEnLCAyMClcbiAgXHRcdFx0LmF0dHIoJ3gyJywgKGQsIGkpID0+IDI4MCAqIGkrMSlcbiAgXHRcdFx0LmF0dHIoJ3kyJyw0MClcbiAgXHRcdFx0LnN0eWxlKCdzdHJva2UnLCAnYmxhY2snKVxuICBcdFx0XHQuc3R5bGUoJ3N0cm9rZS13aWR0aCcsJzJweCcpO1xuICBcblxuICBcdC8vIFRleHQgXG4gIFx0Z3JwLnNlbGVjdEFsbCgndGV4dCcpXG5cdCAgICAuZGF0YSgoZCkgPT4ge1xuXHQgICAgXHRsZXQgdG1wID0gTWF0aC50cnVuYyhkLmxlbmd0aCAvIDEwKTtcblx0ICAgIFx0bGV0IG91dCA9IG5ldyBBcnJheSh0bXArMSkuZmlsbCgwKTtcblx0ICAgIFx0cmV0dXJuIG91dDtcblx0ICAgIH0pXG5cdCAgICAuZW50ZXIoKS5hcHBlbmQoJ3RleHQnKVxuXHQgICAgLy8uZmlsdGVyKChkLGkpID0+IGklMTA9PT0wKVxuXHQgICAgXHQuYXR0cigneCcsIChkLCBpKSA9PiB7IHJldHVybiAyODAgKiBpKzU7IH0pXG5cdCAgICBcdC5hdHRyKCd5JywgJzM4JykgIFxuXHQgICAgXHQuYXR0cignZm9udC1mYW1pbHknLCAnc2Fucy1zZXJpZicpIFxuXHQgICAgXHQudGV4dCggKGQsIGksaykgPT4gayo0MCtpKjEwKzEpO1xuXHQgICAgXHRcbn07XG5cbi8vIGdldCB2YWx1ZXNcbi8vY29uc3QgZ2V0QnV0dG9uSWRzID0gKCkgPT4gWycjYnRuLXJvdzEtMScsJyNidG4tcm93MS0yJywnI2J0bi1yb3cxLTMnLCcjYnRuLXJvdzEtNCddO1xuXG4vLyByZWFkcyBQYXJhbWV0ZXIgVG9uIFphaGwgZm9yIHJvdyBvbmVcbmNvbnN0IHJlYWRJbnB1dCA9IChyb3cpID0+IHtcblx0bGV0IGlkcyA9IFtdO1xuXHQvLyBUT0RPIHVzZSBhcyBwYXJhbWV0ZXIgbGF0ZXJcblx0aWYgKHR5cGVvZiByb3cgPT09ICd1bmRlZmluZWQnKXtcblx0XHRhbGVydCAoJ3JvdyBpcyB1bmRlZmluZWQnKTtcblx0fVxuXHQvLyBsZXQgcm93ID0gMTtcblx0bGV0IHM9Jyc7XG5cdGZvciAobGV0IGkgPSAxOyBpIDwgNDsgaSsrKXtcblx0XHRzID0gJyNidG4tcm93Jytyb3crJy0nK2k7XG5cdFx0aWRzLnB1c2gocyk7XG5cdH0gXG5cblx0bGV0IG91dCA9IFtdO1xuXHRmb3IgKGxldCBpIGluIGlkcykge1xuXHRcdGxldCBlbHZhbCA9ICQoaWRzW2ldKVxuXHRcdFx0XHRcdFx0LnBhcmVudCgpXG5cdFx0XHRcdFx0XHQucGFyZW50KClcblx0XHRcdFx0XHRcdC5jaGlsZHJlbignaW5wdXQnKVswXTtcblx0XHRsZXQgdmFsID0gMDtcblx0XHRpZiAodHlwZW9mIGVsdmFsICE9PSAndW5kZWZpbmVkJyl7XG5cdFx0XHR2YWwgPSBlbHZhbC52YWx1ZTtcblx0XHR9XG5cdFx0b3V0LnB1c2godmFsKTtcblx0fVxuXHRyZXR1cm4gb3V0O1xufTtcblxuLy8gUmVkdWNlIGRhdGEgZnJvbSAzIGFycmF5cyB0byBvbmUgQXJyYXlcblxuY29uc3QgcmVkdWNlM2RhdGEgPSAoYXJyQixhcnJHLGFyclIpID0+IHtcblx0bGV0IG91dCA9IFtdO1xuXHRsZXQgb3V0ZXIgPSBbXTtcblx0b3V0ZXIucHVzaChvdXQpO1xuXHRsZXQgdG1wLHM7XG5cdGZvcihsZXQgaT0wOyBpPGFyckIubGVuZ3RoOyBpKyspe1xuXHRcdHRtcCA9IFtdO1xuXHRcdHRtcC5wdXNoKGFyckJbaV0pO1xuXHRcdHRtcC5wdXNoKGFyckdbaV09PT0wID8gMCA6IGFyckdbaV0gKyAzKTtcblx0XHR0bXAucHVzaChhcnJSW2ldPT09MCA/IDAgOiBhcnJSW2ldICsgNik7XG5cdFx0cyA9IG5ldyBTZXQodG1wKTtcblx0XHRpZiAocy5zaXplID4gMSAmJiBzLmhhcygwKSl7XG5cdFx0XHRzLmRlbGV0ZSgwKTtcblx0XHR9XG5cdFx0b3V0LnB1c2goQXJyYXkuZnJvbShzKSk7XG5cdH1cblx0cmV0dXJuIG91dGVyO1xufTtcblxuXG5cbi8vIFJlZHJhdyBHYW1lXG5jb25zdCByZWRyYXcgPSAoaW5wc3RyYXJyKSA9PiB7XG5cdGxldCBpbnAgPSBbXTtcblx0Ly8gcGFyc2UgaW5wdXRcblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBpbnBzdHJhcnIubGVuZ3RoOyBpKyspe1xuXHRcdGlucC5wdXNoKHBhcnNlSW50KGlucHN0cmFycltpXSkpO1xuXHR9O1xuXG4gICAgLy8gaW5pdCB2YWx1ZXNcblx0bGV0IHQgPSAxLCAvLyBjb3V0IHZhbHVlXG5cdFx0ZGF0YSA9IFtdLFxuXHRcdGNvbCxcblx0XHRuZXh0RXZlbnQsXG5cdFx0dG1wID0gMDtcblxuXHRmb3IgKGxldCBpID0gMDsgaSA8IGlucC5sZW5ndGg7IGkrKyl7XG5cdFx0Y29sID0gaTtcblx0XHRuZXh0RXZlbnQgPSBpbnBbY29sXTtcblx0XHRpZiAobmV4dEV2ZW50ID4gMCl7XG5cdFx0XHRicmVhaztcblx0XHR9XG5cdH1cblxuXHRmb3IgKGxldCBrID0gMDsgayA8IHJvd047IGsgKz0gMSkge1xuXHRcdGxldCByb3cgPSBbXTtcblx0XHRkYXRhLnB1c2gocm93KTtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGNvbE47IGkgKz0xKXtcblx0XHRcdGlmICh0ID09PSAgbmV4dEV2ZW50KXtcblx0XHRcdFx0Ly8ganVtcCBvdmVyIDAgY29sb3IgZW50cmllc1xuXHRcdFx0XHR0bXAgPSBjb2wrMTsgLy8gYmxhY2sgaGFzIGluZGV4IDBcblx0XHRcdFx0Ly8gaWYgc29tZXRoaW5nIGlzIHplcm8gZ28gZnVydGhlclxuXHRcdFx0XHR3aGlsZSAoaW5wWyhjb2wrMSklaW5wLmxlbmd0aF0gPCAxKXtcblx0XHRcdFx0XHRjb2wgPSAoY29sKzEpJWlucC5sZW5ndGg7XG5cdFx0XHRcdH1cblx0XHRcdFx0bmV4dEV2ZW50ICs9IGlucFsoY29sKzEpJWlucC5sZW5ndGhdO1xuXHRcdFx0XHRjb2wgPSAoY29sKzEpJWlucC5sZW5ndGg7IC8vIG5leHQgY29sb3Jcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRtcCA9IDA7XG5cdFx0XHR9XG5cdFx0XHQvLyBqdXN0IGFycmF5XG5cdFx0XHRyb3cucHVzaCh0bXApO1xuXHRcdFx0Ly9yb3cucHVzaChbdCwgdG1wXSk7XG5cdFx0XHR0ID0gdCArIDE7XG5cdFx0fVxuXHR9XG5cdHJldHVybiBkYXRhO1xufTtcblxuLy9UT0RPIEZJWCBUQUJMRVNcbmNvbnN0IGhpZ2hsaWdodEVsICA9IChlbCxjb2wsdGltZSkgPT57XG4gICAkKGVsKS5hdHRyKCBcImZpbGxcIiwgaGxvb2t1cFtjb2xdKTtcbiAgIHNldFRpbWVvdXQoKCkgPT4geyQoZWwpLmF0dHIoIFwiZmlsbFwiLCBsb29rdXBbY29sXSk7fSx0aW1lKjEwMDApO1xuXG59O1xuXG4vL0NIQU5HRSBvbiBUT04gSW5wdXQgaXMgYXBwbGllZFxuY29uc3QgcmVnaXN0ZXJJbnB1dE9uQ2hhbmdlID0gKHJvdyxzdmcsbG9va3VwKSA9PiB7XG5cdGxldCBpZHMgPSBbXTtcblx0Ly8gVE9ETyB1c2UgYXMgcGFyYW1ldGVyIGxhdGVyXG5cdC8vIGxldCByb3cgPSAxO1xuXHRsZXQgcz0nJztcblx0Zm9yIChsZXQgaSA9IDE7IGkgPCA0OyBpKyspe1xuXHRcdHMgPSAnI2J0bi1yb3cnK3JvdysnLScraTtcblx0XHRpZHMucHVzaChzKTtcblx0fSBcblxuXHRmb3IgKGxldCBpIGluIGlkcykge1xuXHRcdCQoaWRzW2ldKVxuXHRcdFx0LnBhcmVudCgpXG5cdFx0XHQucGFyZW50KClcblx0XHRcdC5jaGlsZHJlbignaW5wdXQuZm9ybS1jb250cm9sJylcblx0XHRcdC5jaGFuZ2UoKCkgPT4ge1xuXHRcdFx0XHRsZXQgbmV3ZGF0YSA9IHJlZHJhdyhyZWFkSW5wdXQocm93KSk7XG5cdFx0XHRcdHVwZGF0ZUdyYXBoKG5ld2RhdGEsc3ZnLGxvb2t1cCk7XG5cblx0XHRcdFx0bGV0IG15ZGF0YSA9IHJlZHJhdyhyZWFkSW5wdXQoMSkpO1xuXHRcdFx0XHRsZXQgbXlkYXRhR3JlZW4gPSByZWRyYXcocmVhZElucHV0KDIpKTtcblx0XHRcdFx0bGV0IG15ZGF0YVJlZCA9IHJlZHJhdyhyZWFkSW5wdXQoMykpO1xuXHRcdFx0XHRsZXQgbmV3ZGF0YTIgPSByZWR1Y2UzZGF0YShteWRhdGFbMF0sbXlkYXRhR3JlZW5bMF0sbXlkYXRhUmVkWzBdKTtcblx0XHRcdFx0dXBkYXRlR3JhcGgobmV3ZGF0YTIsZDMuc2VsZWN0KCcjY2hhcnQtc3VtJyksXG5cdFx0XHRcdFx0WzAsMSwyLDMsNCw1LDYsNyw4LDldLm1hcCgoaSkgPT4gdG9uZXNbaV0uY29sb3IpKTtcblx0XHRcdFx0XG5cblxuXHRcdFx0fSk7XG5cdH1cbn07XG5cbi8vIFJlZ2lzdGVyIGNvdW50IEJ1dHRvblxuY29uc3QgcmVnaXN0ZXJCdXR0b24gPSAocm93KSA9PiB7XG5cdGxldCBpZHMgPSBbXTtcblx0Ly8gVE9ETyB1c2UgYXMgcGFyYW1ldGVyIGxhdGVyXG5cdC8vbGV0IHJvdyA9IDE7XG5cdGxldCBzPScnO1xuXHRmb3IgKGxldCBpID0gMTsgaSA8IDQ7IGkrKyl7XG5cdFx0cyA9ICcjYnRuLXJvdycrcm93KyctJytpO1xuXHRcdGlkcy5wdXNoKHMpO1xuXHR9IFxuXHRsZXQgZWMgPSBqUXVlcnkuRXZlbnQoICdjaGFuZ2UnICk7XG4gICAgZm9yIChsZXQgaSBpbiBpZHMpIHtcbiAgICBcdCQoaWRzW2ldKVxuXHRcdFx0LnBhcmVudCgpXG5cdFx0XHQuY2hpbGRyZW4oJ3VsLmRyb3Bkb3duLW1lbnUnKVxuXHRcdFx0Lm9uKCdjbGljaycsIChlKSA9PiB7XG5cdFx0XHRcdCQoaWRzW2ldKVxuXHRcdFx0XHQucGFyZW50KClcblx0XHRcdFx0LnBhcmVudCgpXG5cdFx0XHRcdC5jaGlsZHJlbignaW5wdXQuZm9ybS1jb250cm9sOmZpcnN0Jylcblx0XHRcdFx0LmF0dHIoJ3ZhbHVlJyxlLnRhcmdldC50ZXh0KVxuXHRcdFx0XHQvL3NlbmQgY2hhbmdlIGV2ZW50XG5cdFx0XHRcdC50cmlnZ2VyKGVjKTtcblx0XHR9KTtcdFxuICAgIH1cbn07XG5cblxuLy8gUmVnaXN0ZXIgVG9uIGJ1dHRvblxuY29uc3QgcmVnaXN0ZXJUb25CdXR0b24gPSAocm93KSA9PiB7XG5cdGxldCBpZHMgPSBbXTtcblx0Ly8gVE9ETyB1c2UgYXMgcGFyYW1ldGVyIGxhdGVyXG5cdC8vbGV0IHJvdyA9IDE7XG5cdGxldCBzPScnO1xuXG5cdGZvciAobGV0IGkgPSAxOyBpIDwgNDsgaSsrKXtcblx0XHRzID0gJyNidG4tcm93Jytyb3crJy0nK2krJy10b24nO1xuXHRcdGlkcy5wdXNoKHMpO1xuXHR9IFxuXHQvLyBsZXQgZWMgPSBqUXVlcnkuRXZlbnQoICdjaGFuZ2UnICk7XG4gICAgZm9yIChsZXQgaSBpbiBpZHMpIHtcbiAgICBcdCQoaWRzW2ldKVxuXHRcdFx0LnBhcmVudCgpXG5cdFx0XHQuY2hpbGRyZW4oJ3VsLmRyb3Bkb3duLW1lbnUnKVxuXHRcdFx0Lm9uKCdjbGljaycsIChlKSA9PiB7XG5cdFx0XHRcdCQoaWRzW2ldKVxuXHRcdFx0XHQucGFyZW50KClcblx0XHRcdFx0LnBhcmVudCgpXG5cdFx0XHRcdC5jaGlsZHJlbignaW5wdXQuZm9ybS1jb250cm9sOmVxKCAxICknKVxuXHRcdFx0XHQuYXR0cigndmFsdWUnLGUudGFyZ2V0LnRleHQpO1xuXHRcdFx0XHRcblx0XHRcdFx0Ly8gZG8gcGFyYW1ldGVyIGNoYW5nZVxuXHRcdFx0XHQvLyBpbmRleCBoYXZlIHRvIHN1cnZpdmUgOilcblx0XHRcdCAgICBsZXQgdG1wID0gcGFyc2VJbnQoZS50YXJnZXQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LmdldEF0dHJpYnV0ZSgnbnInKSk7XG5cdFx0XHRcdHRvbmVzW3RtcF0uaW5zdHJ1bWVudCA9IGUudGFyZ2V0LnRleHQ7XG5cdFx0XHRcdC8vc2VuZCBjaGFuZ2UgZXZlbnRcblx0XHRcdFx0Ly8udHJpZ2dlcihlYyk7XG5cdFx0fSk7XHRcbiAgICB9XG59O1xuXG5jb25zdCByZWdpc3RlckJsYWNrVG9uQnV0dG9uID0gKCkgPT4ge1xuXHRsZXQgaWRzID0gW107XG5cdC8vIFRPRE8gdXNlIGFzIHBhcmFtZXRlciBsYXRlclxuXHRsZXQgcm93ID0gMTtcblx0bGV0IHMgPSAnI2J0bi1yb3cxLTAtdG9uJztcblx0aWRzLnB1c2gocyk7XG5cdFxuXHQvLyBsZXQgZWMgPSBqUXVlcnkuRXZlbnQoICdjaGFuZ2UnICk7XG4gICAgZm9yIChsZXQgaSBpbiBpZHMpIHtcbiAgICBcdCQoaWRzW2ldKVxuXHRcdFx0LnBhcmVudCgpXG5cdFx0XHQuY2hpbGRyZW4oJ3VsLmRyb3Bkb3duLW1lbnUnKVxuXHRcdFx0Lm9uKCdjbGljaycsIChlKSA9PiB7XG5cdFx0XHRcdCQoaWRzW2ldKVxuXHRcdFx0XHQucGFyZW50KClcblx0XHRcdFx0LnBhcmVudCgpXG5cdFx0XHRcdC5jaGlsZHJlbignaW5wdXQuZm9ybS1jb250cm9sOmZpcnN0Jylcblx0XHRcdFx0LmF0dHIoJ3ZhbHVlJyxlLnRhcmdldC50ZXh0KTtcblxuXHRcdFx0XHR0b25lc1swXS5pbnN0cnVtZW50ID0gZS50YXJnZXQudGV4dDtcblx0XHRcdFx0XG5cdFx0XHRcdC8vIGRvIHBhcmFtZXRlciBjaGFuZ2VcblxuXHRcdFx0XHQvL3NlbmQgY2hhbmdlIGV2ZW50XG5cdFx0XHRcdC8vLnRyaWdnZXIoZWMpO1xuXHRcdH0pO1x0XG5cbiAgICB9XG59O1xuXG5cbi8vIFJlZ2lzdGVyIFZvbHVtZW4gYnV0dG9uXG5jb25zdCByZWdpc3RlclZvbHVtZUJ1dHRvbiA9IChyb3cpID0+IHtcblx0bGV0IGlkcyA9IFtdO1xuXHQvLyBUT0RPIHVzZSBhcyBwYXJhbWV0ZXIgbGF0ZXJcblx0Ly9sZXQgcm93ID0gMTtcblx0bGV0IHM9Jyc7XG5cblx0Zm9yIChsZXQgaSA9IDE7IGkgPCA0OyBpKyspe1xuXHRcdHMgPSAnI2J0bi1yb3cnK3JvdysnLScraSsnLXZvbHVtZSc7XG5cdFx0aWRzLnB1c2gocyk7XG5cdH0gXG5cdC8vIGxldCBlYyA9IGpRdWVyeS5FdmVudCggJ2NoYW5nZScgKTtcbiAgICBmb3IgKGxldCBpIGluIGlkcykge1xuICAgIFx0JChpZHNbaV0pXG5cdFx0XHQucGFyZW50KClcblx0XHRcdC5jaGlsZHJlbigndWwuZHJvcGRvd24tbWVudScpXG5cdFx0XHQub24oJ2NsaWNrJywgKGUpID0+IHtcblx0XHRcdFx0JChpZHNbaV0pXG5cdFx0XHRcdC5wYXJlbnQoKVxuXHRcdFx0XHQucGFyZW50KClcblx0XHRcdFx0LmNoaWxkcmVuKCdpbnB1dC5mb3JtLWNvbnRyb2w6ZXEoIDIgKScpXG5cdFx0XHRcdC5hdHRyKCd2YWx1ZScsZS50YXJnZXQudGV4dCk7XG5cdFx0XHRcdFxuXHRcdFx0XHQvLyBkbyBwYXJhbWV0ZXIgY2hhbmdlXG5cdFx0XHRcdC8vIGluZGV4IGhhdmUgdG8gc3Vydml2ZSA6KVxuXHRcdFx0ICAgIGxldCB0bXAgPSBwYXJzZUludChlLnRhcmdldC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQuZ2V0QXR0cmlidXRlKCducicpKTtcblxuXHRcdFx0XHR0b25lc1t0bXBdLnZvbCA9IGUudGFyZ2V0LnRleHQ7XG5cdFx0XHRcdHRvbmVzW3RtcF0uZ2FpbiA9IHBhcnNlSW50KGUudGFyZ2V0LnRleHQpKjEuMC8xMDA7XG5cdFx0XHRcdC8vc2VuZCBjaGFuZ2UgZXZlbnRcblx0XHRcdFx0Ly8udHJpZ2dlcihlYyk7XG5cdFx0fSk7XHRcbiAgICB9XG59O1xuXG5jb25zdCByZWdpc3RlckJsYWNrVm9sdW1lQnV0dG9uID0gKCkgPT4ge1xuXHRsZXQgaWRzID0gW107XG5cdC8vIFRPRE8gdXNlIGFzIHBhcmFtZXRlciBsYXRlclxuXHRsZXQgcm93ID0gMTtcblx0bGV0IHMgPSAnI2J0bi1yb3cxLTAtdm9sdW1lJztcblx0aWRzLnB1c2gocyk7XG5cdFxuXHQvLyBsZXQgZWMgPSBqUXVlcnkuRXZlbnQoICdjaGFuZ2UnICk7XG4gICAgZm9yIChsZXQgaSBpbiBpZHMpIHtcbiAgICBcdCQoaWRzW2ldKVxuXHRcdFx0LnBhcmVudCgpXG5cdFx0XHQuY2hpbGRyZW4oJ3VsLmRyb3Bkb3duLW1lbnUnKVxuXHRcdFx0Lm9uKCdjbGljaycsIChlKSA9PiB7XG5cdFx0XHRcdCQoaWRzW2ldKVxuXHRcdFx0XHQucGFyZW50KClcblx0XHRcdFx0LnBhcmVudCgpXG5cdFx0XHRcdC5jaGlsZHJlbignaW5wdXQuZm9ybS1jb250cm9sOmVxKCAxICknKVxuXHRcdFx0XHQuYXR0cigndmFsdWUnLGUudGFyZ2V0LnRleHQpO1xuXG5cdFx0XHRcdHRvbmVzWzBdLnZvbCA9IGUudGFyZ2V0LnRleHQ7XG5cdFx0XHRcdHRvbmVzWzBdLmdhaW4gPSBwYXJzZUludChlLnRhcmdldC50ZXh0KSoxLjAvMTAwO1xuXHRcdFx0XHRcblx0XHRcdFx0Ly8gZG8gcGFyYW1ldGVyIGNoYW5nZVxuXG5cdFx0XHRcdC8vc2VuZCBjaGFuZ2UgZXZlbnRcblx0XHRcdFx0Ly8udHJpZ2dlcihlYyk7XG5cdFx0fSk7XHRcblxuICAgIH1cbn07XG5cbmNvbnN0IHJlZ2lzdGVyUGxheUJ1dHRvbiA9ICgpID0+IHtcblx0JCgnI3BsYXltdXNpY2J0bicpLm9uKCdjbGljaycsIChlKSA9PiB7XG5cdFx0Ly8gaXBob25lIGhhY2tcblx0XHQvLyBpZiAoYXVkaW9Db250ZXh0ID09PSBudWxsKXtcblx0XHQvLyBcdHRyeSB7XG4gIC8vICAgXHRcdFx0d2luZG93LkF1ZGlvQ29udGV4dCA9IHdpbmRvdy5BdWRpb0NvbnRleHQgfHwgd2luZG93LndlYmtpdEF1ZGlvQ29udGV4dDtcbiAgLy8gICBcdFx0XHRhdWRpb0NvbnRleHQgPSBuZXcgd2luZG93LkF1ZGlvQ29udGV4dCgpO1xuXHRcdC8vIFx0fSBjYXRjaCAoZSkge1xuICAvLyAgIFx0XHRcdGNvbnNvbGUubG9nKFwiTm8gV2ViIEF1ZGlvIEFQSSBzdXBwb3J0XCIpO1xuXHRcdC8vIFx0fVxuXHRcdC8vIFx0bGV0IG9zY2lsbGF0b3IgPSBhdWRpb0NvbnRleHQuY3JlYXRlT3NjaWxsYXRvcigpO1xuIFx0Ly8gXHRcdFx0b3NjaWxsYXRvci5mcmVxdWVuY3kudmFsdWUgPSA0MDA7XG4gXHQvLyBcdFx0XHRvc2NpbGxhdG9yLmNvbm5lY3QoYXVkaW9Db250ZXh0LmRlc3RpbmF0aW9uKTtcbiBcdC8vIFx0XHRcdG9zY2lsbGF0b3Iuc3RhcnQoMCk7XG4gXHQvLyBcdFx0XHRvc2NpbGxhdG9yLnN0b3AoLjUpXG5cdFx0Ly8gfVxuXHRcdHJ1blNlcSA9IHRydWU7XG5cdFx0cGxheU11c2ljKCk7XG5cdFx0Ly9hbGVydCgnaGVyZScpO1xuXHR9KTtcblx0Ly8gJCgnI3BsYXltdXNpY2J0bicpLm9uKCd0b3VjaGVuZCcsIChlKSA9PiB7XG5cblx0Ly8gXHRydW5TZXEgPSB0cnVlO1xuXHQvLyBcdHBsYXlNdXNpYygpO1xuXHQvLyBcdC8vYWxlcnQoJ2hlcmUnKTtcblx0Ly8gfSk7XG59O1xuXG5jb25zdCByZWdpc3RlclN0b3BCdXR0b24gPSAoKSA9PiB7XG5cdCQoJyNzdG9wbXVzaWNidG4nKS5vbignY2xpY2snLCAoZSkgPT4ge1xuXHRcdHJ1blNlcSA9IGZhbHNlO1xuXHRcdC8vYWxlcnQoJ2hlcmUnKTtcblx0fSk7XG5cdC8vICQoJyNzdG9wbXVzaWNidG4nKS5vbigndG91Y2hlbmQnLCAoZSkgPT4ge1xuXHQvLyBcdHJ1blNlcSA9IGZhbHNlO1xuXHQvLyBcdC8vYWxlcnQoJ2hlcmUnKTtcblx0Ly8gfSk7XG59O1xuXG4vLyBjb25zdCByZWdpc3RlclBhcmFtZXRlckJ1dHRvbiA9ICgpID0+IHtcbi8vIFx0JCgnI3BhcmFtZXRlcmJ0bicpLm9uKCdjbGljaycsIChlKSA9PiB7XG4vLyBcdFx0bGV0IGVsID0gZDMuc2VsZWN0QWxsKCdyZWN0JylbMF1bNF07XG4vLyBcdFx0bGV0IHRpbWUgPSAwLjk7XG4vLyBcdFx0aGlnaGxpZ2h0RWwoZWwsMCx0aW1lKTtcbi8vIFx0fSk7XG4vLyB9O1xuXG5cbi8vIFBhcmFtZXRlciB3ZXJ0ZSBlaW5sZXNlblxuLy8gJCgnI3BhcmFPc3pidG4nKS5vbignY2xpY2snLCAoZSkgPT4ge1xuLy8gXHRsZXQgczIgPSAkKCdpbnB1dFtuYW1lPXNwZWVkXTpjaGVja2VkJywgJyNwYXJhbWV0ZXJNb2RhbCcpLnZhbCgpO1xuLy8gXHRsZXQgcyA9ICQoJ2lucHV0W25hbWU9b3N6Zm9ybV06Y2hlY2tlZCcsICcjcGFyYW1ldGVyTW9kYWwnKS52YWwoKTtcbi8vIFx0Ly9pZiAoISB0eXBlb2YgcyA9PT0gXCJ1bmRlZmluZWRcIiAmJiAhIHR5cGVvZiBzMiAgPT09IFwidW5kZWZpbmVkXCIpe1xuLy8gXHRpZiAoISBmYWxzZSl7XG4vLyBcdFx0b3NjaWxsYXRvclR5cGUgPSBzO1xuLy8gXHRcdHNvdW5kU3BlZWQgPSBwYXJzZUZsb2F0KHMyKTtcbi8vIFx0XHQkKCcjcGFyYW1ldGVyTW9kYWwnKS5tb2RhbCgnaGlkZScpO1xuLy8gXHR9XG4vLyB9KTtcblxuXG5cbi8vIFNvdW5kIERlZmluaXRpb25cblxuXG5jb25zdCBwbGF5U291bmQgPSAoc3RhcnRUaW1lLCBwaXRjaE5yLCBkdXJhdGlvbiwgZ2Fpbk9sZCkgPT4ge1xuXHQvL2xldCBzdGFydFRpbWUgPSBhdWRpb0NvbnRleHQuY3VycmVudFRpbWUgKyBkZWxheTtcbiAgXHRsZXQgZW5kVGltZSA9IHN0YXJ0VGltZSArIGR1cmF0aW9uO1xuICBcdGxldCBwaXRjaCA9IHNvdW5kc1twaXRjaE5yXVswXTtcbiAgXHRsZXQgZ2FpbiA9IHRvbmVzW3BpdGNoTnJdLmdhaW47XG5cbiAgXHRsZXQgb3V0Z2FpbiA9IGF1ZGlvQ29udGV4dC5jcmVhdGVHYWluKCk7XG4gIFx0b3V0Z2Fpbi5nYWluLnZhbHVlID0gZ2FpbjtcbiAgXHRvdXRnYWluLmNvbm5lY3QoYXVkaW9Db250ZXh0LmRlc3RpbmF0aW9uKTsgXHRcblxuICBcdGxldCBlbnZlbG9wZSA9IGF1ZGlvQ29udGV4dC5jcmVhdGVHYWluKCk7XG4gIFx0ZW52ZWxvcGUuY29ubmVjdChvdXRnYWluKTtcbiAgXHRlbnZlbG9wZS5nYWluLnZhbHVlID0gMDtcbiAgXHRcbiAgXHRlbnZlbG9wZS5nYWluLnNldFRhcmdldEF0VGltZSgxLCBzdGFydFRpbWUsIGVudmVsb3BlU3RhcnRFbmRUaW1lWzBdKTtcbiAgXHRlbnZlbG9wZS5nYWluLnNldFRhcmdldEF0VGltZSgwLCBlbmRUaW1lLCBlbnZlbG9wZVN0YXJ0RW5kVGltZVsxXSk7XG5cbiAgXHRsZXQgb3NjaWxsYXRvciA9IGF1ZGlvQ29udGV4dC5jcmVhdGVPc2NpbGxhdG9yKCk7XG4gIFx0b3NjaWxsYXRvci5jb25uZWN0KGVudmVsb3BlKTtcblxuICBcdG9zY2lsbGF0b3IudHlwZSA9IG9zY2lsbGF0b3JUeXBlO1xuICBcdG9zY2lsbGF0b3IuZGV0dW5lLnZhbHVlID0gcGl0Y2ggKiAxMDA7XG4gIFx0b3NjaWxsYXRvci5mcmVxdWVuY3kudmFsdWUgPSAyNDA7XG5cblx0bGV0IHZpYnJhdG8gPSBhdWRpb0NvbnRleHQuY3JlYXRlR2FpbigpO1xuXHR2aWJyYXRvLmdhaW4udmFsdWUgPSB2aWJyYXRvZ2Fpbjtcblx0dmlicmF0by5jb25uZWN0KG9zY2lsbGF0b3IuZGV0dW5lKTtcblxuXHRsZXQgbGZvID0gYXVkaW9Db250ZXh0LmNyZWF0ZU9zY2lsbGF0b3IoKTtcblx0bGZvLmNvbm5lY3QodmlicmF0byk7XG5cdGxmby5mcmVxdWVuY3kudmFsdWUgPWxmb2ZyZXE7IFxuXG5cdG9zY2lsbGF0b3Iuc3RhcnQoc3RhcnRUaW1lKTtcbiAgXHRsZm8uc3RhcnQoc3RhcnRUaW1lKTtcbiAgXHRvc2NpbGxhdG9yLnN0b3AoZW5kVGltZSArMiApO1xuICBcdGxmby5zdG9wKGVuZFRpbWUgKzIpO1xuXG59O1xuXG4vLy8gUGxheSBMb29wXG5jb25zdCBydW5TZXF1ZW5jZXJzID0gKCkgPT4ge1xuXHRpZiAoIXJ1blNlcSB8fCBzb3VuZFF1ZXVlLmxlbmd0aCA9PT0gMCl7Y29uc29sZS5sb2coXCJzdG9wXCIpO3JldHVybjt9XG5cdGxldCBjdCA9IGF1ZGlvQ29udGV4dC5jdXJyZW50VGltZTtcblx0d2hpbGUgKHNvdW5kUXVldWUubGVuZ3RoPjAgJiYgc291bmRRdWV1ZVswXVswXTwgY3QrMC4xNSl7XG5cdFx0Ly9jb25zb2xlLmxvZygnY3Q6JytjdCsncGxhbmVkIHRpbWU6Jytzb3VuZFF1ZXVlWzBdWzBdKTtcblx0XHRsZXQgaXRlbSA9IHNvdW5kUXVldWUuc3BsaWNlKDAsMSk7XG5cdFx0Ly8gcGxheXNvdW5kIChzdGFydHRpbWUsIHBpdGNoLCBkdXJhdGlvbiwgICAgICAgICAgICAgZ2FpaW4pXG5cdFx0Ly9wbGF5U291bmQoaXRlbVswXVswXSxzb3VuZHNbaXRlbVswXVsxXV1bMF0saXRlbVswXVsyXSx0b25lc1tpdGVtWzBdWzFdXS5nYWluKTtcdFx0XG5cdFxuXHRcdHBsYXlTb3VuZChpdGVtWzBdWzBdLGl0ZW1bMF1bMV0saXRlbVswXVsyXSx0b25lc1tpdGVtWzBdWzFdXS5nYWluKTtcdFx0XG5cdFx0Ly8gZWxlbWVudCAgICAgICAgICAgICAgY29sb3IgICAgICAgZHVyYXRpb25cblx0XHRoaWdobGlnaHRFbChpdGVtWzBdWzNdLGl0ZW1bMF1bMV0saXRlbVswXVsyXSk7XG5cdH1cblx0c2V0VGltZW91dChydW5TZXF1ZW5jZXJzLDkwKTtcbn1cblxuLy8vIHNvdW5kcyBzdGFydCBoZXJlXG4vLy8gU291bmQgdmFyXG5sZXQgcnVuU2VxID0gdHJ1ZTtcbmxldCBzb3VuZFF1ZXVlID0gW107XG5cbnZhciBhdWRpb0NvbnRleHQgPSBudWxsO1xuXG50cnkge1xuICAgd2luZG93LkF1ZGlvQ29udGV4dCA9IHdpbmRvdy5BdWRpb0NvbnRleHR8fHdpbmRvdy53ZWJraXRBdWRpb0NvbnRleHQ7XG4gICB2YXIgYXVkaW9Db250ZXh0ID0gbmV3IEF1ZGlvQ29udGV4dCgpO1xufSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUubG9nKFwiTm8gV2ViIEF1ZGlvIEFQSSBzdXBwb3J0XCIpO1xufVxuXG5cbi8vSU9TIFN0YXJ0IElPU0hBQ0tcbiQoJ2JvZHknKS5vbigndG91Y2hlbmQnLCAoZSkgPT4ge1xuXHQvL2FsZXJ0KCdzdGFydCBzb3VuZFxuXHQvLyBjcmVhdGUgZW1wdHkgYnVmZmVyXG5cdHZhciBidWZmZXIgPSBhdWRpb0NvbnRleHQuY3JlYXRlQnVmZmVyKDEsIDEsIDIyMDUwKTtcblx0dmFyIHNvdXJjZSA9IGF1ZGlvQ29udGV4dC5jcmVhdGVCdWZmZXJTb3VyY2UoKTtcblx0c291cmNlLmJ1ZmZlciA9IGJ1ZmZlcjtcblxuXHQvLyBjb25uZWN0IHRvIG91dHB1dCAoeW91ciBzcGVha2Vycylcblx0c291cmNlLmNvbm5lY3QoYXVkaW9Db250ZXh0LmRlc3RpbmF0aW9uKTtcblxuXHQvLyBwbGF5IHRoZSBmaWxlXG5cdGlmICh0eXBlb2Ygc291cmNlLm5vdGVPbiAhPT0gJ3VuZGVmaW5lZCcpe1xuXHRcdHNvdXJjZS5ub3RlT24oMCk7XG5cdH1cblx0XG5cdC8vIHZhciBzcmMgPSBudWxsO1xuXHQvLyBzcmMgPSBhdWRpb0NvbnRleHQuY3JlYXRlT3NjaWxsYXRvcigpO1xuXHQvLyBzcmMudHlwZSA9ICdzcXVhcmUnO1xuXHQvLyBzcmMuZnJlcXVlbmN5LnZhbHVlID0gNDQwO1xuXHQvLyBzcmMuY29ubmVjdChhdWRpb0NvbnRleHQuZGVzdGluYXRpb24pO1xuXHQvLyBsZXQgY3QgPSBhdWRpb0NvbnRleHQuY3VycmVudFRpbWU7XG5cdC8vIHNyYy5zdGFydChjdCswLjUpO1xuXHQvLyBzcmMuc3RvcChjdCsxLjIpO1xufSk7XG4vL0lPUyBFTkRcblxuXG4vLyBTb3VuZCBjb25zdGFuc3RzIHByZXNldHNcbmxldCB0b25lcyA9IFt7XG5cdCducic6MCxcblx0J2dhaW4nOjAuMSxcblx0J3ZvbCc6JzEwJScsXG4gICAgJ2NvbG9yJzonIzc1NzU3NScsXG5cdCdob3Zlcic6JyMwMDAwMDAnLFxuXHQnaW5zdHJ1bWVudCc6J0QzJyxcblx0J2lkJzonaWctcm93MS0wJyxcblx0J3Zpc2libGUnOnRydWVcbn0sXG5cbntcblx0J25yJzoxLFxuXHQnZ2Fpbic6MC44LFxuXHQndm9sJzonODAlJyxcblx0J2NvbG9yJzonIzI5NkVBQScsXG5cdCdob3Zlcic6JyMwOTRFOEEnLFxuXHQnaW5zdHJ1bWVudCc6J0UzJyxcblx0J2lkJzonaWctcm93MS0xJyxcblx0J3Zpc2libGUnOnRydWVcbn0sXG57XG5cdCducic6Mixcblx0J2dhaW4nOjAuMCxcblx0J3ZvbCc6JzAlJyxcblx0J2NvbG9yJzonIzU0OTFCNScsXG5cdCdob3Zlcic6JyMzNDYxNzUnLFxuXHQnaW5zdHJ1bWVudCc6J0YzJyxcblx0J2lkJzonaWctcm93MS0yJyxcblx0J3Zpc2libGUnOmZhbHNlXG59LFxue1xuXHQnbnInOjMsXG5cdCdnYWluJzowLjAsXG5cdCd2b2wnOicwJScsXG5cdCdjb2xvcic6JyM3OUJFRkEnLFxuXHQnaG92ZXInOicjNTk5RUJBJyxcblx0J2luc3RydW1lbnQnOidHMycsXG5cdCdpZCc6J2lnLXJvdzEtMycsXG5cdCd2aXNpYmxlJzpmYWxzZVxufSxcblxue1xuXHQnbnInOjQsXG5cdCdnYWluJzowLjUsXG5cdCd2b2wnOic1MCUnLFxuXHQnY29sb3InOicjNEJBODRCJyxcblx0J2hvdmVyJzonIzJCODgyQicsXG5cdCdpbnN0cnVtZW50JzonQTQnLFxuXHQnaWQnOidpZy1yb3cyLTEnLFxuXHQndmlzaWJsZSc6ZmFsc2Vcbn0sXG57XG5cdCducic6NSxcblx0J2dhaW4nOjAuMCxcblx0J3ZvbCc6JzAlJyxcblx0J2NvbG9yJzonIzU0NzI0OScsXG5cdCdob3Zlcic6JyMyNDUyMTknLFxuXHQnaW5zdHJ1bWVudCc6J0I0Jyxcblx0J2lkJzonaWctcm93Mi0yJyxcblx0J3Zpc2libGUnOmZhbHNlXG59LFxue1xuXHQnbnInOjYsXG5cdCdnYWluJzowLjAsXG5cdCd2b2wnOicwJScsXG5cdCdjb2xvcic6JyMxRjYyNDEnLFxuXHQnaG92ZXInOicjMUY2MjQxJyxcblx0J2luc3RydW1lbnQnOidDNCcsXG5cdCdpZCc6J2lnLXJvdzItMycsXG5cdCd2aXNpYmxlJzpmYWxzZVxufSxcbntcblx0J25yJzo3LFxuXHQnZ2Fpbic6MC4zLFxuXHQndm9sJzonMzAlJyxcblx0J2NvbG9yJzonI0RCMzgzMycsXG5cdCdob3Zlcic6JyNBQjE4MTMnLFxuXHQnaW5zdHJ1bWVudCc6J0Q0Jyxcblx0J2lkJzonaWctcm93My0xJyxcblx0J3Zpc2libGUnOmZhbHNlXG59LFxue1xuXHQnbnInOjgsXG5cdCdnYWluJzowLjAsXG5cdCd2b2wnOicwJScsXG5cdCdjb2xvcic6JyNCMzBCMEInLFxuXHQnaG92ZXInOicjNTMwQjBCJyxcblx0J2luc3RydW1lbnQnOidFNCcsXG5cdCdpZCc6J2lnLXJvdzMtMicsXG5cdCd2aXNpYmxlJzpmYWxzZVxufSxcbntcblx0J25yJzo5LFxuXHQnZ2Fpbic6MC4wLFxuXHQndm9sJzonMCUnLFxuXHQnY29sb3InOicjQTExMjNGJyxcblx0J2hvdmVyJzonIzUxMDIxRicsXG5cdCdpbnN0cnVtZW50JzonRjQnLFxuXHQnaWQnOidpZy1yb3czLTMnLFxuXHQndmlzaWJsZSc6ZmFsc2Vcbn1dO1xuXG4vLyBzb3VuZHNcbmxldCBub3RlcyA9IHtcblx0J0QzJzoge1xuXHRcdCdmcmVxJzogNDQwLFxuXHRcdCdkZXR1bmUnOiAtNzAwXG5cdH0sXG5cdCdFMyc6IHtcblx0XHQnZnJlcSc6IDQ0MCxcblx0XHQnZGV0dW5lJzogLTUwMFxuXHR9LCBcblx0J0YzJzoge1xuXHRcdCdmcmVxJzogNDQwLFxuXHRcdCdkZXR1bmUnOiAtNDAwXG5cdH0sXG5cdCdHMyc6IHtcblx0XHQnZnJlcSc6IDQ0MCxcblx0XHQnZGV0dW5lJzogLTIwMFxuXHR9LFxuXHQnQTQnOiB7XG5cdFx0J2ZyZXEnOiA0NDAsXG5cdFx0J2RldHVuZSc6IDBcblx0fSxcblx0J0I0Jzoge1xuXHRcdCdmcmVxJzogNDQwLFxuXHRcdCdkZXR1bmUnOiAyMDBcblx0fSxcblx0J0M0Jzoge1xuXHRcdCdmcmVxJzogNDQwLFxuXHRcdCdkZXR1bmUnOiAzMDBcblx0fSxcblx0J0Q0Jzoge1xuXHRcdCdmcmVxJzogNDQwLFxuXHRcdCdkZXR1bmUnOiA1MDBcblx0fSxcblx0J0U0Jzoge1xuXHRcdCdmcmVxJzogNDQwLFxuXHRcdCdkZXR1bmUnOiA3MDBcblx0fSxcblx0J0Y0Jzoge1xuXHRcdCdmcmVxJzogNDQwLFxuXHRcdCdkZXR1bmUnOiA4MDBcblx0fSxcblx0J0c0Jzoge1xuXHRcdCdmcmVxJzogNDQwLFxuXHRcdCdkZXR1bmUnOiAxMDAwXG5cdH1cbn07XG5cblxuXG5sZXQgc291bmRTcGVlZCA9IDAuNTtcbmxldCB0b25lZHVyYXRpb24gPSAwLjM7XG5sZXQgdmlicmF0b2dhaW4gPSAwLjM7XG5sZXQgZW52ZWxvcGVTdGFydEVuZFRpbWUgPSBbMC4wMSwwLjFdO1xubGV0IGxmb2ZyZXEgPSA2OyAgLy81XG4vLyBQYXJhbWV0cml6YXRpb24gb2YgdGhlIDUgdG9uZXMgIFBpdGNoIGR1cmF0aW9uIHZvbHVtZSBnYWluXG4vLyBEZWJyaWNhdGVkIHRvIGJlIHJlbW92ZWRcbi8vIGZpcnN0IGlzdCBibGFjayBzb3VuZFxuY29uc3Qgc291bmRzID0gW1stMTAsIDAuNSwwLjFdLFszLCAwLjUsMC45XSxbMTAsIDAuNSwwLjldLFsxNSwgMC41LDAuOV0sWzAsIDAuNSwwLjldXTtcbmxldCBvc2NpbGxhdG9yVHlwZSA9ICdzYXd0b290aCc7IC8vJ3NpbmUnOyAvLyAnc2F3dG9vdGgnXG5cblxuLy8vIFNvdW5kIE1ldGhvZHNcbmNvbnN0IHBsYXlNdXNpYyA9ICgpID0+IHtcblx0Ly8gZmlsbCBzb3VuZFF1ZXVlXHRcblx0bGV0IHJlY3RhcnIgPSBkMy5zZWxlY3RBbGwoJ3JlY3QnKS5kYXRhKCk7XG5cdGxldCBlbGFyciA9IGQzLnNlbGVjdEFsbCgncmVjdCcpWzBdO1xuICAgIGxldCBzdGFydFRpbWUgPSBhdWRpb0NvbnRleHQuY3VycmVudFRpbWU7XG4gICAgLy9jb25zb2xlLmxvZygnU3RhcnQnK3N0YXJ0VGltZSk7XG4gICAgc291bmRRdWV1ZSA9W107XG5cdGZvciAobGV0IGk9MDsgaSA8IHJlY3RhcnIubGVuZ3RoOyBpKyspIHtcblx0XHRsZXQgdiA9IHJlY3RhcnJbaV1bMV07XG5cdFx0Ly9wbGF5U291bmQoaSxzb3VuZHNbdl1bMF0sc291bmRzW3ZdWzFdLHNvdW5kc1t2XVsyXSk7XG5cdFx0Ly9hbGVydChpKTtcblx0XHRsZXQgdG1wID0gW107XG5cdFx0dG1wLnB1c2goaSpzb3VuZFNwZWVkK3N0YXJ0VGltZSk7XG5cdFx0dG1wLnB1c2godik7XG5cdFx0dG1wLnB1c2godG9uZWR1cmF0aW9uKTtcblx0XHR0bXAucHVzaChlbGFycltpXSk7XG5cdFx0c291bmRRdWV1ZS5wdXNoKHRtcCk7XG5cdH1cblx0Ly9jb25zb2xlLmxvZygnc3RhcnRzZXF1ZW5jZXInK2F1ZGlvQ29udGV4dC5jdXJyZW50VGltZSk7XG4gICAgcnVuU2VxdWVuY2VycygpO1xufTtcblxuLy8gSW5pdCBTY3JlZW5cbmNvbnN0IGluaXRkM2pzID0gKGVsSWQpID0+IHtcblx0Y29uc3Qgd2lkdGggPSAxMjgwLFxuICAgIGhlaWdodCA9IDQ1O1xuICAgIGxldCBzcl92aWV3cG9ydCA9ICcwIDAgJysod2lkdGgrNzApKycgJytoZWlnaHQ7XG4gICAgY29uc3QgZGl2ID0gZDMuc2VsZWN0KGVsSWQpLFxuXHRzdmcgPSBkaXYuYXBwZW5kKCdzdmcnKVxuICAgICAgICAuYXR0cignd2lkdGgnLCB3aWR0aClcbiAgICAgICAgLmF0dHIoJ2hlaWdodCcsIGhlaWdodClcbiAgICAgICAgLmF0dHIoJ3ZpZXdCb3gnLCBzcl92aWV3cG9ydClcbiAgICAgICAgLmF0dHIoJ3ByZXNlcnZlQXNwZWN0UmF0aW8nLCAneE1pZFlNaWQgbWVldCcpO1xuXG4gICAgcmV0dXJuIHN2Zztcbn07XG5cblxuICAgIC8vIENvbnN0YW50c1xuXG4gICAgY29uc3QgcncgPSAyMCxcbiAgICByaCA9IDIwLFxuICAgIHJvd04gPTEsXG4gICAgY29sTiA9NDg7XG4gICAgLy8gaGxvb2t1cCA9IFsnIzAwMDAwMCcsJyMwOTRFOEEnLCcjMDk0RThBJywnIzA5NEU4QSddO1xuICAgIFxuICAgIC8vIGJpbmQgZGF0YSBhbmQgcmVuZGVyIGQzanNcbiAgICBjb25zdCBzdmcgPSBpbml0ZDNqcygnI2NoYXJ0Jyk7XG4gICAgbGV0IGxvb2t1cGJsdWUgPSBbMCwxLDIsM10ubWFwKChpKSA9PiB0b25lc1tpXS5jb2xvcik7ICAgXG4gICAgbGV0IG15ZGF0YSA9IHJlZHJhdyhyZWFkSW5wdXQoMSkpO1xuXHRyZW5kZXJHcmFwaChteWRhdGEsc3ZnLGxvb2t1cGJsdWUsZmFsc2UpO1xuXG4gICAgY29uc3Qgc3ZnZ3JlZW4gPSBpbml0ZDNqcygnI2NoYXJ0LTInKTtcbiAgICBsZXQgbG9va3VwZ3JlZW4gPSBbMCw0LDUsNl0ubWFwKChpKSA9PiB0b25lc1tpXS5jb2xvcik7IFxuICAgIGxldCBteWRhdGFHcmVlbiA9IHJlZHJhdyhyZWFkSW5wdXQoMikpO1xuXHRyZW5kZXJHcmFwaChteWRhdGFHcmVlbixzdmdncmVlbixsb29rdXBncmVlbixmYWxzZSk7XG5cbiAgICBjb25zdCBzdmdyZWQgPSBpbml0ZDNqcygnI2NoYXJ0LTMnKTtcbiAgICBsZXQgbG9va3VwcmVkID0gWzAsNyw4LDldLm1hcCgoaSkgPT4gdG9uZXNbaV0uY29sb3IpOyBcbiAgICBsZXQgbXlkYXRhUmVkID0gcmVkcmF3KHJlYWRJbnB1dCgzKSk7XG5cdHJlbmRlckdyYXBoKG15ZGF0YVJlZCxzdmdyZWQsbG9va3VwcmVkLGZhbHNlKTtcdFxuXG5cdC8vIHN1bSAgdGhlIGRhdGEgIFxuXHRjb25zdCBzdmdzdW0gPSBpbml0ZDNqcygnI2NoYXJ0LXN1bScpO1xuXHRsZXQgbG9va3VwYWxsID0gWzAsMSwyLDMsNCw1LDYsNyw4LDldLm1hcCgoaSkgPT4gdG9uZXNbaV0uY29sb3IpOyBcblx0bGV0IG15ZGF0YXN1bSA9IHJlZHVjZTNkYXRhKG15ZGF0YVswXSxteWRhdGFHcmVlblswXSxteWRhdGFSZWRbMF0pO1xuXHRyZW5kZXJHcmFwaChteWRhdGFzdW0sc3Znc3VtLGxvb2t1cGFsbCx0cnVlKTtcblxuXHQvLyByZXNwb25zaXZlIGNoYW5nZVxuICAgIGQzLnNlbGVjdCh3aW5kb3cpXG4gICAgXHQub24oJ3Jlc2l6ZScsICgpID0+IHtcblx0XHQgICAgLy9sZXQgdGFyZ2V0V2lkdGggPSBzdmcubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoO1xuXHRcdCAgICBsZXQgd2luV2lkdGggPSAkKHdpbmRvdykud2lkdGgoKTtcblx0XHQgICAgc3ZnLmF0dHIoXCJ3aWR0aFwiLCB3aW5XaWR0aCk7XG5cdFx0ICAgIHN2Z2dyZWVuLmF0dHIoXCJ3aWR0aFwiLCB3aW5XaWR0aCk7XG5cdFx0ICAgIHN2Z3JlZC5hdHRyKFwid2lkdGhcIiwgd2luV2lkdGgpO1xuXHRcdCAgICBzdmdzdW0uYXR0cihcIndpZHRoXCIsIHdpbldpZHRoKTtcbiAgXHRcdH0pO1xuICAgIC8vVHJpZ2VyIHJlc2l6ZSBFdmVudFxuICBcdGxldCB0bXB3ID0gJCh3aW5kb3cpLndpZHRoKCk7XG5cdHN2Zy5hdHRyKCd3aWR0aCcsIHRtcHcpO1xuXHRzdmdncmVlbi5hdHRyKCd3aWR0aCcsIHRtcHcpO1xuXHRzdmdyZWQuYXR0cignd2lkdGgnLCB0bXB3KTtcblx0c3Znc3VtLmF0dHIoXCJ3aWR0aFwiLCB0bXB3KTtcblxuXHRcblxuXHQvLyBsZXQgc3ZndGVzdCA9IGluaXRkM2pzKCcjY2hhcnQtdGVzdCcpO1xuXHQvLyBsZXQgbXlkYXRhdGVzdCA9IFtbWzEsMiwzXSxbMCw0LDVdLFsxLDRdLFs0LDldLFsxLDQsN10sWzBdLFswXSxbMF0sWzBdLFswXSxbMF0sWzBdLFswXSxbMF0sWzBdXV07XG5cdC8vIHJlbmRlckdyYXBoKG15ZGF0YXRlc3Qsc3ZndGVzdCxsb29rdXBhbGwpO1xuXG5cdC8vIFJlZ2lzdGVyIEJ1dHRvbnNcblx0Ly8gYmxhY2tidXR0b24gb25seSBvbmUgcmVnaXN0cmF0aW9uXG5cdHJlZ2lzdGVyQmxhY2tWb2x1bWVCdXR0b24oKTtcblx0cmVnaXN0ZXJCbGFja1RvbkJ1dHRvbigpO1xuXG5cdC8vIFJlZ2lzdGVyIDMgcm93cyBWIEJ1dHRvblxuXHQvLyBUT0RPIENoZWNrIFJFZ2lzdGVyIEJ1dHRvblxuXHRbMSwyLDNdLm1hcChyZWdpc3RlckJ1dHRvbik7XG5cdFsxLDIsM10ubWFwKHJlZ2lzdGVyVG9uQnV0dG9uKTtcblx0WzEsMiwzXS5tYXAocmVnaXN0ZXJWb2x1bWVCdXR0b24pO1xuXG5cdHJlZ2lzdGVySW5wdXRPbkNoYW5nZSgxLHN2Zyxsb29rdXBibHVlKTtcblx0cmVnaXN0ZXJJbnB1dE9uQ2hhbmdlKDIsc3ZnZ3JlZW4sbG9va3VwZ3JlZW4pO1xuXHRyZWdpc3RlcklucHV0T25DaGFuZ2UoMyxzdmdyZWQsbG9va3VwcmVkKTtcblxuXG5cdHJlZ2lzdGVyUGxheUJ1dHRvbigpO1xuXHRyZWdpc3RlclN0b3BCdXR0b24oKTtcblx0Ly9yZWdpc3RlclBhcmFtZXRlckJ1dHRvbigpO1xuXG4vL2lvcyBoYWNrXG4vLyBcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIGZ1bmN0aW9uKCkge1xuXG4vLyBcdC8vIGNyZWF0ZSBlbXB0eSBidWZmZXJcbi8vIFx0dmFyIGJ1ZmZlciA9IGF1ZGlvQ29udGV4dC5jcmVhdGVCdWZmZXIoMSwgMSwgMjIwNTApO1xuLy8gXHR2YXIgc291cmNlID0gYXVkaW9Db250ZXh0LmNyZWF0ZUJ1ZmZlclNvdXJjZSgpO1xuLy8gXHRzb3VyY2UuYnVmZmVyID0gYnVmZmVyO1xuXG4vLyBcdC8vIGNvbm5lY3QgdG8gb3V0cHV0ICh5b3VyIHNwZWFrZXJzKVxuLy8gXHRzb3VyY2UuY29ubmVjdChhdWRpb0NvbnRleHQuZGVzdGluYXRpb24pO1xuXG4vLyBcdC8vIHBsYXkgdGhlIGZpbGVcbi8vIFx0c291cmNlLm5vdGVPbigwKTtcblxuLy8gfSwgZmFsc2UpO1xuXG5cblxuLy8gd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaHN0YXJ0XCIsIGZ1bmN0aW9uICgpe1x0XG4vLyBcdFx0aWYgKGhhZF90b3VjaClcdFx0cmV0dXJuO1x0XHRcbi8vIFx0XHQvLyBwbGF5IGVtcHR5IGJ1ZmZlciB0byB1bm11dGUgYXVkaW9cdFxuLy8gXHRcdHZhciBidWZmZXIgPSBhdWRpb0NvbnRleHQuY3JlYXRlQnVmZmVyKDEsIDEsIDIyMDUwKTtcdFxuLy8gXHRcdHZhciBzb3VyY2UgPSBhdWRpb0NvbnRleHQuY3JlYXRlQnVmZmVyU291cmNlKCk7XHRcbi8vIFx0XHRzb3VyY2UuYnVmZmVyID0gYnVmZmVyO1x0XG4vLyBcdFx0c291cmNlLmNvbm5lY3QoYXVkaW9Db250ZXh0LmRlc3RpbmF0aW9uKTtcdFxuLy8gXHRcdHNvdXJjZS5zdGFydCgwKTtcdFxuLy8gXHRcdGhhZF90b3VjaCA9IHRydWU7XG4vLyBcdFx0YWxlcnQoXCJtaXN0XCIpO1xuLy8gXHR9KTtcblxuXG5cblxuXG59KTtcblxuXG5cbiJdfQ==
