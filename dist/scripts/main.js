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
	var updateGraph = function updateGraph(data, svg, lookup, checksum) {

		if (checksum) {
			var grp = svg.selectAll('svg g').data(data);

			var innergrp = grp.selectAll('g').data(function (d) {
				return d;
			});

			innergrp.exit().remove();

			innergrp.enter().append('g').attr('transform', function (d, i) {
				console.log(d, i);
				return 'translate(' + 28 * i + ',0)';
			});

			var rects = innergrp.selectAll('rect').data(function (d) {
				return d;
			});

			rects.exit().remove();

			rects.attr('fill', function (d, i) {
				return lookup[d];
			}).attr('x', function (d, i, k) {
				return rw / data[0][k].length * i;
			}).attr('width', function (d, i, k) {
				return rw / data[0][k].length;
			}).attr('height', rh).enter().append('rect').attr('fill', function (d, i) {
				return lookup[d];
			}).attr('x', function (d, i, k) {
				return rw / data[0][k].length * i;
			}).attr('width', function (d, i, k) {
				return rw / data[0][k].length;
			}).attr('height', rh);

			// rects.exit()
			// .remove();
		} else {
				svg.selectAll('svg g rect').data(data[0]).attr('fill', function (d, i) {
					return lookup[d];
				}).enter().append('rect').attr('x', function (d, i) {
					return 28 * i;
				}).attr('width', rw).attr('height', rh);
				//.remove();
			}
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
	var highlightEl = function highlightEl(el, col, time, hover) {
		$(el).attr("fill", hover);
		setTimeout(function () {
			$(el).attr("fill", col);
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
				updateGraph(newdata, svg, lookup, false);
				var mydata = redraw(readInput(1));
				var mydataGreen = redraw(readInput(2));
				var mydataRed = redraw(readInput(3));
				var newdata2 = reduce3data(mydata[0], mydataGreen[0], mydataRed[0]);
				updateGraph(newdata2, d3.select('#chart-sum'), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(function (i) {
					return tones[i].color;
				}), true);
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
		//let pitch = tones[pitchNr].instrument;

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
		oscillator.detune.value = notes[tones[pitchNr].instrument].detune;
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
			// element              color       duration                 hovercolor
			highlightEl(item[0][3], tones[item[0][1]].color, item[0][2], tones[item[0][1]].hover);
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
		'visible': true
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
		'visible': true
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

	/// Navigation

	var dispNavElements = function dispNavElements(obj) {
		obj.map(function (o) {
			if (o.visible) {
				$('#' + o.id).show();
			} else {
				var el = $('#' + o.id);
				el.hide();
				el.children('input')[0].value = '0';
				//console.log(el.children('input')[0].value);
			}
		});
	};

	/// Sound Methods
	var playMusic = function playMusic() {
		// fill soundQueue	
		var j = undefined;
		var rectarr = d3.select('#chart-sum').select('g').selectAll('g').data();
		var elarr = d3.select('#chart-sum').selectAll('rect')[0];
		var startTime = audioContext.currentTime;
		//console.log('Start'+startTime);
		soundQueue = [];
		for (var i = 0; i < rectarr.length; i++) {
			var v = rectarr[i];
			for (j = 0; j < v.length; j++) {
				//playSound(i,sounds[v][0],sounds[v][1],sounds[v][2]);
				//alert(i);
				var tmp = [];
				tmp.push(i * soundSpeed + startTime + j * 0.0001);
				tmp.push(v[j]);
				tmp.push(toneduration);
				tmp.push(elarr[i]);
				soundQueue.push(tmp);
			}
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

	// configure display
	dispNavElements(tones);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvc2NyaXB0cy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxFQUFFLFFBQUYsRUFBWSxLQUFaLENBQWtCLFlBQVU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEyQjVCLEtBQU0sY0FBYyxTQUFkLFdBQWMsQ0FBQyxJQUFELEVBQU0sR0FBTixFQUFVLE1BQVYsRUFBaUIsUUFBakIsRUFBOEI7O0FBRWpELE1BQUksUUFBSixFQUFhO0FBQ1osT0FBSSxNQUFNLElBQUksU0FBSixDQUFjLE9BQWQsRUFDTixJQURNLENBQ0QsSUFEQyxDQUFOLENBRFE7O0FBSVQsT0FBSSxXQUFXLElBQUksU0FBSixDQUFjLEdBQWQsRUFDZCxJQURjLENBQ1QsVUFBQyxDQUFEO1dBQU87SUFBUCxDQURGLENBSks7O0FBUVQsWUFDQyxJQURELEdBRUMsTUFGRCxHQVJTOztBQVlULFlBQ0MsS0FERCxHQUVGLE1BRkUsQ0FFSyxHQUZMLEVBR0YsSUFIRSxDQUdHLFdBSEgsRUFHZ0IsVUFBQyxDQUFELEVBQUksQ0FBSixFQUFVO0FBQzVCLFlBQVEsR0FBUixDQUFZLENBQVosRUFBYyxDQUFkLEVBRDRCO0FBRTVCLFdBQU8sZUFBZSxLQUFLLENBQUwsR0FBUyxLQUF4QixDQUZxQjtJQUFWLENBSGhCLENBWlM7O0FBcUJaLE9BQUksUUFBTSxTQUFTLFNBQVQsQ0FBbUIsTUFBbkIsRUFDVCxJQURTLENBQ0osVUFBQyxDQUFEO1dBQU87SUFBUCxDQURGLENBckJROztBQXdCWixTQUNDLElBREQsR0FFQyxNQUZELEdBeEJZOztBQTRCWixTQUNDLElBREQsQ0FDTSxNQUROLEVBQ2MsVUFBQyxDQUFELEVBQUcsQ0FBSDtXQUFTLE9BQU8sQ0FBUDtJQUFULENBRGQsQ0FFQyxJQUZELENBRU0sR0FGTixFQUVXLFVBQUMsQ0FBRCxFQUFJLENBQUosRUFBTSxDQUFOO1dBQWEsS0FBRyxL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O0FBcTVCM0IsRUFBQyxDQUFELEVBQUcsQ0FBSCxFQUFLLENBQUwsRUFBUSxHQUFSLENBQVksb0JBQVosRUFyNUIyQjs7QUF1NUIzQix1QkFBc0IsQ0FBdEIsRUFBd0IsR0FBeEIsRUFBNEIsVUFBNUIsRUF2NUIyQjtBQXc1QjNCLHVCQUFzQixDQUF0QixFQUF3QixRQUF4QixFQUFpQyxXQUFqQyxFQXg1QjJCO0FBeTVCM0IsdUJBQXNCLENBQXRCLEVBQXdCLE1BQXhCLEVBQStCLFNBQS9CLEVBejVCMkI7O0FBNDVCM0Isc0JBNTVCMkI7QUE2NUIzQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0NBNzVCaUIsQ0FBbEI7QUFBNEIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcbi8vIGNyZWF0ZSBIVE1MIHN0dWZmXG4vLyBjb25zdCBjcmVhdGVIdG1sVG9uQ29udHJvbCA9IChucikgPT4ge1xuLy8gXHRjb25zdCBwb3NuciA9ICcxJztcblx0XG5cbi8vIFx0bGV0IGVsQ29udGFpbmVyID0gJ3Rvbi1jb250cm9sLScrbnI7XG4vLyBcdGxldCBlbE91dERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJESVZcIik7XG4vLyBcdGVsT3V0RGl2LnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwiY29sLXhzLTNcIik7XG5cdFxuLy8gXHRsZXQgZWxpbnB1dEdyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIkRJVlwiKTtcbi8vIFx0ZWxpbnB1dEdyb3VwLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwiaW5wdXQtZ3JvdXAtYnRuXCIpOyBcbi8vIFx0ZWxPdXREaXYuYXBwZW5kQ2hpbGQoZWxpbnB1dEdyb3VwKTtcbi8vIFx0Ly8gQlVUVE9OXG4vLyBcdGxldCB0ZXh0bm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFwiIFphaGxcIik7IFxuLy8gXHRsZXQgYnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIkJVVFRPTlwiKTtcbi8vIFx0bGV0IHNpZD0nYnRuLXJvdycrbnIrJy0nK3Bvc25yO1xuLy8gXHRidG4uc2V0QXR0cmlidXRlKFwiaWRcIiwgc2lkKTtcbi8vIFx0YnRuLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwiYnRuIGJ0bi1pbmZvIGRyb3Bkb3duLXRvZ2dsZVwiKTtcbi8vIFx0YnRuLmFwcGVuZENoaWxkKHRleHRub2RlKTtcbi8vIFx0ZWxpbnB1dEdyb3VwLmFwcGVuZENoaWxkKGJ0bik7XG4vLyBcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVsQ29udGFpbmVyKS5hcHBlbmRDaGlsZChlbE91dERpdik7XG5cblxuLy8gfTtcblxuLy8gRDNKU1xuY29uc3QgdXBkYXRlR3JhcGggPSAoZGF0YSxzdmcsbG9va3VwLGNoZWNrc3VtKSA9PiB7XG5cdFxuXHRpZiAoY2hlY2tzdW0pe1xuXHRcdGxldCBncnAgPSBzdmcuc2VsZWN0QWxsKCdzdmcgZycpXG5cdCAgICAuZGF0YShkYXRhKTtcblxuXHQgICAgbGV0IGlubmVyZ3JwID0gZ3JwLnNlbGVjdEFsbCgnZycpXG5cdCAgICAuZGF0YSgoZCkgPT4gZCk7XG5cblxuXHQgICAgaW5uZXJncnBcblx0ICAgIC5leGl0KClcblx0ICAgIC5yZW1vdmUoKTtcblx0ICAgIFxuXHQgICAgaW5uZXJncnBcblx0ICAgIC5lbnRlcigpXG5cdFx0LmFwcGVuZCgnZycpXG5cdFx0LmF0dHIoJ3RyYW5zZm9ybScsIChkLCBpKSA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZyhkLGkpO1xuXHRcdFx0cmV0dXJuICd0cmFuc2xhdGUoJyArIDI4ICogaSArICcsMCknXG5cdFx0fSk7XG5cdCAgICBcblxuXHRcdGxldCByZWN0cz1pbm5lcmdycC5zZWxlY3RBbGwoJ3JlY3QnKVxuXHRcdC5kYXRhKChkKSA9PiBkKTtcblx0XHRcblx0XHRyZWN0c1xuXHRcdC5leGl0KClcblx0XHQucmVtb3ZlKCk7XG5cblx0XHRyZWN0c1xuXHRcdC5hdHRyKCdmaWxsJywgKGQsaSkgPT4gbG9va3VwW2RdKVxuXHRcdC5hdHRyKCd4JywgKGQsIGksaykgPT4gIHJ3L2RhdGFbMF1ba10ubGVuZ3RoICogaSlcblx0XHQuYXR0cignd2lkdGgnLCAoZCxpLGspID0+ICBydy9kYXRhWzBdW2tdLmxlbmd0aClcblx0XHQuYXR0cignaGVpZ2h0JywgcmgpXG5cdFx0LmVudGVyKClcblx0XHQuYXBwZW5kKCdyZWN0Jylcblx0XHQuYXR0cignZmlsbCcsIChkLGkpID0+IGxvb2t1cFtkXSlcblx0XHQuYXR0cigneCcsIChkLCBpLGspID0+ICBydy9kYXRhWzBdW2tdLmxlbmd0aCAqIGkpXG5cdFx0LmF0dHIoJ3dpZHRoJywgKGQsaSxrKSA9PiAgcncvZGF0YVswXVtrXS5sZW5ndGgpXG5cdFx0LmF0dHIoJ2hlaWdodCcsIHJoKTtcblxuXHRcdC8vIHJlY3RzLmV4aXQoKVxuXHRcdC8vIC5yZW1vdmUoKTtcblxuXHR9IGVsc2Uge1xuXHRcdHN2Zy5zZWxlY3RBbGwoJ3N2ZyBnIHJlY3QnKVxuXHRcdC5kYXRhKGRhdGFbMF0pXG5cdFx0LmF0dHIoJ2ZpbGwnLCAoZCxpKSA9PiBsb29rdXBbZF0pXG5cdFx0LmVudGVyKClcblx0XHQuYXBwZW5kKCdyZWN0Jylcblx0ICAgIC5hdHRyKCd4JywgKGQsIGkpID0+ICAyOCAqIGkpXG5cdCAgICAuYXR0cignd2lkdGgnLCBydylcblx0ICAgIC5hdHRyKCdoZWlnaHQnLCByaCk7XG5cdCAgICAvLy5yZW1vdmUoKTtcblx0fVxufTtcblxuY29uc3QgcmVuZGVyR3JhcGggPSAoZGF0YSxzdmcsbG9va3VwLGNoZWNrc3VtKSA9PiB7XG5cdC8vIENyZWF0ZSBhIGdyb3VwIGZvciBlYWNoIHJvdyBpbiB0aGUgZGF0YSBtYXRyaXggYW5kXG5cdC8vIHRyYW5zbGF0ZSB0aGUgZ3JvdXAgdmVydGljYWxseVxuXHRsZXQgZ3JwID0gc3ZnLnNlbGVjdEFsbCgnc3ZnIGcnKVxuXHQgICAgLmRhdGEoZGF0YSlcblx0ICAgIC5lbnRlcigpXG5cdCAgICAuYXBwZW5kKCdnJylcblx0ICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAoZCwgaSkgPT4gJ3RyYW5zbGF0ZSgwLCAnICsgNTQgKiBpICsgJyknKTsgIFxuXG5cdGlmIChjaGVja3N1bSl7XG5cdFx0Ly9pbm5lciBzdHJ1Y3R1cmVcblx0XHRsZXQgaW5ncnAgPSBncnAuc2VsZWN0QWxsKCdnJylcblx0XHRcdC8vIC5maWx0ZXIoIChkLGkpID0+IHR5cGVvZiBkW2ldID09PSAnb2JqZWN0Jylcblx0XHQgICAgLmRhdGEoKGQpID0+IGQpXG5cdFx0ICAgIC5lbnRlcigpXG5cdFx0ICAgIC5hcHBlbmQoJ2cnKVxuXHRcdCAgICAuYXR0cigndHJhbnNmb3JtJywgKGQsIGkpID0+ICd0cmFuc2xhdGUoJyArIDI4ICogaSArICcsMCknKTtcblxuXG5cdFx0aW5ncnAuc2VsZWN0QWxsKCdyZWN0Jylcblx0XHQgICAgLmRhdGEoKGQpID0+IGQpXG5cdFx0ICAgIC5lbnRlcigpXG5cdFx0ICAgIC5hcHBlbmQoJ3JlY3QnKVxuXHRcdCAgICBcdC5hdHRyKCd4JywgKGQsIGksaykgPT4gIHJ3L2RhdGFbMF1ba10ubGVuZ3RoICogaSlcblx0XHQgICAgICAgIC5hdHRyKCdmaWxsJywgKGQsaSkgPT4gbG9va3VwW2RdKVxuXHRcdCAgICAgICAgLmF0dHIoJ3dpZHRoJywgKGQsaSxrKSA9PiAgcncvZGF0YVswXVtrXS5sZW5ndGgpXG5cdFx0ICAgICAgICAuYXR0cignaGVpZ2h0JywgcmgpOyAgXG5cdH0gZWxzZSB7XG5cdFx0Ly8gRm9yIGVhY2ggZ3JvdXAsIGNyZWF0ZSBhIHNldCBvZiByZWN0YW5nbGVzIGFuZCBiaW5kIFxuXHRcdC8vIHRoZW0gdG8gdGhlIGlubmVyIGFycmF5ICh0aGUgaW5uZXIgYXJyYXkgaXMgYWxyZWFkeVxuXHRcdC8vIGJpbmRlZCB0byB0aGUgZ3JvdXApXG5cdFx0Z3JwLnNlbGVjdEFsbCgncmVjdCcpXG5cdFx0XHQvLyAuZmlsdGVyKCAoZCxpKSA9PiB0eXBlb2YgZFtpXSA9PT0gJ251bWJlcicpXG5cdFx0ICAgIC5kYXRhKChkKSA9PiBkKVxuXHRcdCAgICAuZW50ZXIoKVxuXHRcdCAgICAuYXBwZW5kKCdyZWN0Jylcblx0XHQgICAgICAgIC5hdHRyKCd4JywgKGQsIGkpID0+ICAyOCAqIGkpXG5cdFx0ICAgICAgICAuYXR0cignZmlsbCcsIChkLGkpID0+IGxvb2t1cFtkXSlcblx0XHQgICAgICAgIC5hdHRyKCd3aWR0aCcsIHJ3KVxuXHRcdCAgICAgICAgLmF0dHIoJ2hlaWdodCcsIHJoKTsgICAgIFxuXHR9XG5cblx0Ly9Nb2R1bG8gMTAgdGlja3MgICAgICAgIFxuXHRncnAuc2VsZWN0QWxsKCdsaW5lJylcblx0ICAgIC5kYXRhKChkKSA9PiB7XG5cdCAgICBcdGxldCB0bXAgPSBNYXRoLnRydW5jKGQubGVuZ3RoIC8gMTApO1xuXHQgICAgXHRsZXQgb3V0ID0gbmV3IEFycmF5KHRtcCsxKS5maWxsKDApO1xuXHQgICAgXHRyZXR1cm4gb3V0O1xuXHQgICAgfSlcblx0ICAgIC5lbnRlcigpLmFwcGVuZCgnbGluZScpXG5cdCAgICBcdC8vLmZpbHRlcigoZCxpKSA9PiBpJTEwPT09MClcbiAgXHRcdFx0LmF0dHIoJ3gxJywgIChkLCBpKSA9PiAyODAgKiBpKzEpXG4gIFx0XHRcdC5hdHRyKCd5MScsIDIwKVxuICBcdFx0XHQuYXR0cigneDInLCAoZCwgaSkgPT4gMjgwICogaSsxKVxuICBcdFx0XHQuYXR0cigneTInLDQwKVxuICBcdFx0XHQuc3R5bGUoJ3N0cm9rZScsICdibGFjaycpXG4gIFx0XHRcdC5zdHlsZSgnc3Ryb2tlLXdpZHRoJywnMnB4Jyk7XG4gIFxuXG4gIFx0Ly8gVGV4dCBcbiAgXHRncnAuc2VsZWN0QWxsKCd0ZXh0Jylcblx0ICAgIC5kYXRhKChkKSA9PiB7XG5cdCAgICBcdGxldCB0bXAgPSBNYXRoLnRydW5jKGQubGVuZ3RoIC8gMTApO1xuXHQgICAgXHRsZXQgb3V0ID0gbmV3IEFycmF5KHRtcCsxKS5maWxsKDApO1xuXHQgICAgXHRyZXR1cm4gb3V0O1xuXHQgICAgfSlcblx0ICAgIC5lbnRlcigpLmFwcGVuZCgndGV4dCcpXG5cdCAgICAvLy5maWx0ZXIoKGQsaSkgPT4gaSUxMD09PTApXG5cdCAgICBcdC5hdHRyKCd4JywgKGQsIGkpID0+IHsgcmV0dXJuIDI4MCAqIGkrNTsgfSlcblx0ICAgIFx0LmF0dHIoJ3knLCAnMzgnKSAgXG5cdCAgICBcdC5hdHRyKCdmb250LWZhbWlseScsICdzYW5zLXNlcmlmJykgXG5cdCAgICBcdC50ZXh0KCAoZCwgaSxrKSA9PiBrKjQwK2kqMTArMSk7XG5cdCAgICBcdFxufTtcblxuLy8gZ2V0IHZhbHVlc1xuLy9jb25zdCBnZXRCdXR0b25JZHMgPSAoKSA9PiBbJyNidG4tcm93MS0xJywnI2J0bi1yb3cxLTInLCcjYnRuLXJvdzEtMycsJyNidG4tcm93MS00J107XG5cbi8vIHJlYWRzIFBhcmFtZXRlciBUb24gWmFobCBmb3Igcm93IG9uZVxuY29uc3QgcmVhZElucHV0ID0gKHJvdykgPT4ge1xuXHRsZXQgaWRzID0gW107XG5cdC8vIFRPRE8gdXNlIGFzIHBhcmFtZXRlciBsYXRlclxuXHRpZiAodHlwZW9mIHJvdyA9PT0gJ3VuZGVmaW5lZCcpe1xuXHRcdGFsZXJ0ICgncm93IGlzIHVuZGVmaW5lZCcpO1xuXHR9XG5cdC8vIGxldCByb3cgPSAxO1xuXHRsZXQgcz0nJztcblx0Zm9yIChsZXQgaSA9IDE7IGkgPCA0OyBpKyspe1xuXHRcdHMgPSAnI2J0bi1yb3cnK3JvdysnLScraTtcblx0XHRpZHMucHVzaChzKTtcblx0fSBcblxuXHRsZXQgb3V0ID0gW107XG5cdGZvciAobGV0IGkgaW4gaWRzKSB7XG5cdFx0bGV0IGVsdmFsID0gJChpZHNbaV0pXG5cdFx0XHRcdFx0XHQucGFyZW50KClcblx0XHRcdFx0XHRcdC5wYXJlbnQoKVxuXHRcdFx0XHRcdFx0LmNoaWxkcmVuKCdpbnB1dCcpWzBdO1xuXHRcdGxldCB2YWwgPSAwO1xuXHRcdGlmICh0eXBlb2YgZWx2YWwgIT09ICd1bmRlZmluZWQnKXtcblx0XHRcdHZhbCA9IGVsdmFsLnZhbHVlO1xuXHRcdH1cblx0XHRvdXQucHVzaCh2YWwpO1xuXHR9XG5cdHJldHVybiBvdXQ7XG59O1xuXG4vLyBSZWR1Y2UgZGF0YSBmcm9tIDMgYXJyYXlzIHRvIG9uZSBBcnJheVxuXG5jb25zdCByZWR1Y2UzZGF0YSA9IChhcnJCLGFyckcsYXJyUikgPT4ge1xuXHRsZXQgb3V0ID0gW107XG5cdGxldCBvdXRlciA9IFtdO1xuXHRvdXRlci5wdXNoKG91dCk7XG5cdGxldCB0bXAscztcblx0Zm9yKGxldCBpPTA7IGk8YXJyQi5sZW5ndGg7IGkrKyl7XG5cdFx0dG1wID0gW107XG5cdFx0dG1wLnB1c2goYXJyQltpXSk7XG5cdFx0dG1wLnB1c2goYXJyR1tpXT09PTAgPyAwIDogYXJyR1tpXSArIDMpO1xuXHRcdHRtcC5wdXNoKGFyclJbaV09PT0wID8gMCA6IGFyclJbaV0gKyA2KTtcblx0XHRzID0gbmV3IFNldCh0bXApO1xuXHRcdGlmIChzLnNpemUgPiAxICYmIHMuaGFzKDApKXtcblx0XHRcdHMuZGVsZXRlKDApO1xuXHRcdH1cblx0XHRvdXQucHVzaChBcnJheS5mcm9tKHMpKTtcblx0fVxuXHRyZXR1cm4gb3V0ZXI7XG59O1xuXG5cblxuLy8gUmVkcmF3IEdhbWVcbmNvbnN0IHJlZHJhdyA9IChpbnBzdHJhcnIpID0+IHtcblx0bGV0IGlucCA9IFtdO1xuXHQvLyBwYXJzZSBpbnB1dFxuXHRmb3IgKGxldCBpID0gMDsgaSA8IGlucHN0cmFyci5sZW5ndGg7IGkrKyl7XG5cdFx0aW5wLnB1c2gocGFyc2VJbnQoaW5wc3RyYXJyW2ldKSk7XG5cdH07XG5cbiAgICAvLyBpbml0IHZhbHVlc1xuXHRsZXQgdCA9IDEsIC8vIGNvdXQgdmFsdWVcblx0XHRkYXRhID0gW10sXG5cdFx0Y29sLFxuXHRcdG5leHRFdmVudCxcblx0XHR0bXAgPSAwO1xuXG5cdGZvciAobGV0IGkgPSAwOyBpIDwgaW5wLmxlbmd0aDsgaSsrKXtcblx0XHRjb2wgPSBpO1xuXHRcdG5leHRFdmVudCA9IGlucFtjb2xdO1xuXHRcdGlmIChuZXh0RXZlbnQgPiAwKXtcblx0XHRcdGJyZWFrO1xuXHRcdH1cblx0fVxuXG5cdGZvciAobGV0IGsgPSAwOyBrIDwgcm93TjsgayArPSAxKSB7XG5cdFx0bGV0IHJvdyA9IFtdO1xuXHRcdGRhdGEucHVzaChyb3cpO1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgY29sTjsgaSArPTEpe1xuXHRcdFx0aWYgKHQgPT09ICBuZXh0RXZlbnQpe1xuXHRcdFx0XHQvLyBqdW1wIG92ZXIgMCBjb2xvciBlbnRyaWVzXG5cdFx0XHRcdHRtcCA9IGNvbCsxOyAvLyBibGFjayBoYXMgaW5kZXggMFxuXHRcdFx0XHQvLyBpZiBzb21ldGhpbmcgaXMgemVybyBnbyBmdXJ0aGVyXG5cdFx0XHRcdHdoaWxlIChpbnBbKGNvbCsxKSVpbnAubGVuZ3RoXSA8IDEpe1xuXHRcdFx0XHRcdGNvbCA9IChjb2wrMSklaW5wLmxlbmd0aDtcblx0XHRcdFx0fVxuXHRcdFx0XHRuZXh0RXZlbnQgKz0gaW5wWyhjb2wrMSklaW5wLmxlbmd0aF07XG5cdFx0XHRcdGNvbCA9IChjb2wrMSklaW5wLmxlbmd0aDsgLy8gbmV4dCBjb2xvclxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dG1wID0gMDtcblx0XHRcdH1cblx0XHRcdC8vIGp1c3QgYXJyYXlcblx0XHRcdHJvdy5wdXNoKHRtcCk7XG5cdFx0XHQvL3Jvdy5wdXNoKFt0LCB0bXBdKTtcblx0XHRcdHQgPSB0ICsgMTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIGRhdGE7XG59O1xuXG4vL1RPRE8gRklYIFRBQkxFU1xuY29uc3QgaGlnaGxpZ2h0RWwgID0gKGVsLGNvbCx0aW1lLGhvdmVyKSA9PntcbiAgICQoZWwpLmF0dHIoIFwiZmlsbFwiLCBob3Zlcik7XG4gICBzZXRUaW1lb3V0KCgpID0+IHskKGVsKS5hdHRyKCBcImZpbGxcIiwgY29sKTt9LHRpbWUqMTAwMCk7XG5cbn07XG5cbi8vQ0hBTkdFIG9uIFRPTiBJbnB1dCBpcyBhcHBsaWVkXG5jb25zdCByZWdpc3RlcklucHV0T25DaGFuZ2UgPSAocm93LHN2Zyxsb29rdXApID0+IHtcblx0bGV0IGlkcyA9IFtdO1xuXHQvLyBUT0RPIHVzZSBhcyBwYXJhbWV0ZXIgbGF0ZXJcblx0Ly8gbGV0IHJvdyA9IDE7XG5cdGxldCBzPScnO1xuXHRmb3IgKGxldCBpID0gMTsgaSA8IDQ7IGkrKyl7XG5cdFx0cyA9ICcjYnRuLXJvdycrcm93KyctJytpO1xuXHRcdGlkcy5wdXNoKHMpO1xuXHR9IFxuXG5cdGZvciAobGV0IGkgaW4gaWRzKSB7XG5cdFx0JChpZHNbaV0pXG5cdFx0XHQucGFyZW50KClcblx0XHRcdC5wYXJlbnQoKVxuXHRcdFx0LmNoaWxkcmVuKCdpbnB1dC5mb3JtLWNvbnRyb2wnKVxuXHRcdFx0LmNoYW5nZSgoKSA9PiB7XG5cdFx0XHRcdGxldCBuZXdkYXRhID0gcmVkcmF3KHJlYWRJbnB1dChyb3cpKTtcblx0XHRcdFx0dXBkYXRlR3JhcGgobmV3ZGF0YSxzdmcsbG9va3VwLGZhbHNlKTtcblx0XHRcdFx0bGV0IG15ZGF0YSA9IHJlZHJhdyhyZWFkSW5wdXQoMSkpO1xuXHRcdFx0XHRsZXQgbXlkYXRhR3JlZW4gPSByZWRyYXcocmVhZElucHV0KDIpKTtcblx0XHRcdFx0bGV0IG15ZGF0YVJlZCA9IHJlZHJhdyhyZWFkSW5wdXQoMykpO1xuXHRcdFx0XHRsZXQgbmV3ZGF0YTIgPSByZWR1Y2UzZGF0YShteWRhdGFbMF0sbXlkYXRhR3JlZW5bMF0sbXlkYXRhUmVkWzBdKTtcblx0XHRcdFx0dXBkYXRlR3JhcGgobmV3ZGF0YTIsZDMuc2VsZWN0KCcjY2hhcnQtc3VtJyksXG5cdFx0XHRcdFx0WzAsMSwyLDMsNCw1LDYsNyw4LDldLm1hcCgoaSkgPT4gdG9uZXNbaV0uY29sb3IpLHRydWUpO1xuXHRcdFx0XHRcblx0XHRcdH0pO1xuXHR9XG59O1xuXG4vLyBSZWdpc3RlciBjb3VudCBCdXR0b25cbmNvbnN0IHJlZ2lzdGVyQnV0dG9uID0gKHJvdykgPT4ge1xuXHRsZXQgaWRzID0gW107XG5cdC8vIFRPRE8gdXNlIGFzIHBhcmFtZXRlciBsYXRlclxuXHQvL2xldCByb3cgPSAxO1xuXHRsZXQgcz0nJztcblx0Zm9yIChsZXQgaSA9IDE7IGkgPCA0OyBpKyspe1xuXHRcdHMgPSAnI2J0bi1yb3cnK3JvdysnLScraTtcblx0XHRpZHMucHVzaChzKTtcblx0fSBcblx0bGV0IGVjID0galF1ZXJ5LkV2ZW50KCAnY2hhbmdlJyApO1xuICAgIGZvciAobGV0IGkgaW4gaWRzKSB7XG4gICAgXHQkKGlkc1tpXSlcblx0XHRcdC5wYXJlbnQoKVxuXHRcdFx0LmNoaWxkcmVuKCd1bC5kcm9wZG93bi1tZW51Jylcblx0XHRcdC5vbignY2xpY2snLCAoZSkgPT4ge1xuXHRcdFx0XHQkKGlkc1tpXSlcblx0XHRcdFx0LnBhcmVudCgpXG5cdFx0XHRcdC5wYXJlbnQoKVxuXHRcdFx0XHQuY2hpbGRyZW4oJ2lucHV0LmZvcm0tY29udHJvbDpmaXJzdCcpXG5cdFx0XHRcdC5hdHRyKCd2YWx1ZScsZS50YXJnZXQudGV4dClcblx0XHRcdFx0Ly9zZW5kIGNoYW5nZSBldmVudFxuXHRcdFx0XHQudHJpZ2dlcihlYyk7XG5cdFx0fSk7XHRcbiAgICB9XG59O1xuXG5cbi8vIFJlZ2lzdGVyIFRvbiBidXR0b25cbmNvbnN0IHJlZ2lzdGVyVG9uQnV0dG9uID0gKHJvdykgPT4ge1xuXHRsZXQgaWRzID0gW107XG5cdC8vIFRPRE8gdXNlIGFzIHBhcmFtZXRlciBsYXRlclxuXHQvL2xldCByb3cgPSAxO1xuXHRsZXQgcz0nJztcblxuXHRmb3IgKGxldCBpID0gMTsgaSA8IDQ7IGkrKyl7XG5cdFx0cyA9ICcjYnRuLXJvdycrcm93KyctJytpKyctdG9uJztcblx0XHRpZHMucHVzaChzKTtcblx0fSBcblx0Ly8gbGV0IGVjID0galF1ZXJ5LkV2ZW50KCAnY2hhbmdlJyApO1xuICAgIGZvciAobGV0IGkgaW4gaWRzKSB7XG4gICAgXHQkKGlkc1tpXSlcblx0XHRcdC5wYXJlbnQoKVxuXHRcdFx0LmNoaWxkcmVuKCd1bC5kcm9wZG93bi1tZW51Jylcblx0XHRcdC5vbignY2xpY2snLCAoZSkgPT4ge1xuXHRcdFx0XHQkKGlkc1tpXSlcblx0XHRcdFx0LnBhcmVudCgpXG5cdFx0XHRcdC5wYXJlbnQoKVxuXHRcdFx0XHQuY2hpbGRyZW4oJ2lucHV0LmZvcm0tY29udHJvbDplcSggMSApJylcblx0XHRcdFx0LmF0dHIoJ3ZhbHVlJyxlLnRhcmdldC50ZXh0KTtcblx0XHRcdFx0XG5cdFx0XHRcdC8vIGRvIHBhcmFtZXRlciBjaGFuZ2Vcblx0XHRcdFx0Ly8gaW5kZXggaGF2ZSB0byBzdXJ2aXZlIDopXG5cdFx0XHQgICAgbGV0IHRtcCA9IHBhcnNlSW50KGUudGFyZ2V0LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5nZXRBdHRyaWJ1dGUoJ25yJykpO1xuXHRcdFx0XHR0b25lc1t0bXBdLmluc3RydW1lbnQgPSBlLnRhcmdldC50ZXh0O1xuXHRcdFx0XHQvL3NlbmQgY2hhbmdlIGV2ZW50XG5cdFx0XHRcdC8vLnRyaWdnZXIoZWMpO1xuXHRcdH0pO1x0XG4gICAgfVxufTtcblxuY29uc3QgcmVnaXN0ZXJCbGFja1RvbkJ1dHRvbiA9ICgpID0+IHtcblx0bGV0IGlkcyA9IFtdO1xuXHQvLyBUT0RPIHVzZSBhcyBwYXJhbWV0ZXIgbGF0ZXJcblx0bGV0IHJvdyA9IDE7XG5cdGxldCBzID0gJyNidG4tcm93MS0wLXRvbic7XG5cdGlkcy5wdXNoKHMpO1xuXHRcblx0Ly8gbGV0IGVjID0galF1ZXJ5LkV2ZW50KCAnY2hhbmdlJyApO1xuICAgIGZvciAobGV0IGkgaW4gaWRzKSB7XG4gICAgXHQkKGlkc1tpXSlcblx0XHRcdC5wYXJlbnQoKVxuXHRcdFx0LmNoaWxkcmVuKCd1bC5kcm9wZG93bi1tZW51Jylcblx0XHRcdC5vbignY2xpY2snLCAoZSkgPT4ge1xuXHRcdFx0XHQkKGlkc1tpXSlcblx0XHRcdFx0LnBhcmVudCgpXG5cdFx0XHRcdC5wYXJlbnQoKVxuXHRcdFx0XHQuY2hpbGRyZW4oJ2lucHV0LmZvcm0tY29udHJvbDpmaXJzdCcpXG5cdFx0XHRcdC5hdHRyKCd2YWx1ZScsZS50YXJnZXQudGV4dCk7XG5cblx0XHRcdFx0dG9uZXNbMF0uaW5zdHJ1bWVudCA9IGUudGFyZ2V0LnRleHQ7XG5cdFx0XHRcdFxuXHRcdFx0XHQvLyBkbyBwYXJhbWV0ZXIgY2hhbmdlXG5cblx0XHRcdFx0Ly9zZW5kIGNoYW5nZSBldmVudFxuXHRcdFx0XHQvLy50cmlnZ2VyKGVjKTtcblx0XHR9KTtcdFxuXG4gICAgfVxufTtcblxuXG4vLyBSZWdpc3RlciBWb2x1bWVuIGJ1dHRvblxuY29uc3QgcmVnaXN0ZXJWb2x1bWVCdXR0b24gPSAocm93KSA9PiB7XG5cdGxldCBpZHMgPSBbXTtcblx0Ly8gVE9ETyB1c2UgYXMgcGFyYW1ldGVyIGxhdGVyXG5cdC8vbGV0IHJvdyA9IDE7XG5cdGxldCBzPScnO1xuXG5cdGZvciAobGV0IGkgPSAxOyBpIDwgNDsgaSsrKXtcblx0XHRzID0gJyNidG4tcm93Jytyb3crJy0nK2krJy12b2x1bWUnO1xuXHRcdGlkcy5wdXNoKHMpO1xuXHR9IFxuXHQvLyBsZXQgZWMgPSBqUXVlcnkuRXZlbnQoICdjaGFuZ2UnICk7XG4gICAgZm9yIChsZXQgaSBpbiBpZHMpIHtcbiAgICBcdCQoaWRzW2ldKVxuXHRcdFx0LnBhcmVudCgpXG5cdFx0XHQuY2hpbGRyZW4oJ3VsLmRyb3Bkb3duLW1lbnUnKVxuXHRcdFx0Lm9uKCdjbGljaycsIChlKSA9PiB7XG5cdFx0XHRcdCQoaWRzW2ldKVxuXHRcdFx0XHQucGFyZW50KClcblx0XHRcdFx0LnBhcmVudCgpXG5cdFx0XHRcdC5jaGlsZHJlbignaW5wdXQuZm9ybS1jb250cm9sOmVxKCAyICknKVxuXHRcdFx0XHQuYXR0cigndmFsdWUnLGUudGFyZ2V0LnRleHQpO1xuXHRcdFx0XHRcblx0XHRcdFx0Ly8gZG8gcGFyYW1ldGVyIGNoYW5nZVxuXHRcdFx0XHQvLyBpbmRleCBoYXZlIHRvIHN1cnZpdmUgOilcblx0XHRcdCAgICBsZXQgdG1wID0gcGFyc2VJbnQoZS50YXJnZXQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LmdldEF0dHJpYnV0ZSgnbnInKSk7XG5cblx0XHRcdFx0dG9uZXNbdG1wXS52b2wgPSBlLnRhcmdldC50ZXh0O1xuXHRcdFx0XHR0b25lc1t0bXBdLmdhaW4gPSBwYXJzZUludChlLnRhcmdldC50ZXh0KSoxLjAvMTAwO1xuXHRcdFx0XHQvL3NlbmQgY2hhbmdlIGV2ZW50XG5cdFx0XHRcdC8vLnRyaWdnZXIoZWMpO1xuXHRcdH0pO1x0XG4gICAgfVxufTtcblxuY29uc3QgcmVnaXN0ZXJCbGFja1ZvbHVtZUJ1dHRvbiA9ICgpID0+IHtcblx0bGV0IGlkcyA9IFtdO1xuXHQvLyBUT0RPIHVzZSBhcyBwYXJhbWV0ZXIgbGF0ZXJcblx0bGV0IHJvdyA9IDE7XG5cdGxldCBzID0gJyNidG4tcm93MS0wLXZvbHVtZSc7XG5cdGlkcy5wdXNoKHMpO1xuXHRcblx0Ly8gbGV0IGVjID0galF1ZXJ5LkV2ZW50KCAnY2hhbmdlJyApO1xuICAgIGZvciAobGV0IGkgaW4gaWRzKSB7XG4gICAgXHQkKGlkc1tpXSlcblx0XHRcdC5wYXJlbnQoKVxuXHRcdFx0LmNoaWxkcmVuKCd1bC5kcm9wZG93bi1tZW51Jylcblx0XHRcdC5vbignY2xpY2snLCAoZSkgPT4ge1xuXHRcdFx0XHQkKGlkc1tpXSlcblx0XHRcdFx0LnBhcmVudCgpXG5cdFx0XHRcdC5wYXJlbnQoKVxuXHRcdFx0XHQuY2hpbGRyZW4oJ2lucHV0LmZvcm0tY29udHJvbDplcSggMSApJylcblx0XHRcdFx0LmF0dHIoJ3ZhbHVlJyxlLnRhcmdldC50ZXh0KTtcblxuXHRcdFx0XHR0b25lc1swXS52b2wgPSBlLnRhcmdldC50ZXh0O1xuXHRcdFx0XHR0b25lc1swXS5nYWluID0gcGFyc2VJbnQoZS50YXJnZXQudGV4dCkqMS4wLzEwMDtcblx0XHRcdFx0XG5cdFx0XHRcdC8vIGRvIHBhcmFtZXRlciBjaGFuZ2VcblxuXHRcdFx0XHQvL3NlbmQgY2hhbmdlIGV2ZW50XG5cdFx0XHRcdC8vLnRyaWdnZXIoZWMpO1xuXHRcdH0pO1x0XG5cbiAgICB9XG59O1xuXG5jb25zdCByZWdpc3RlclBsYXlCdXR0b24gPSAoKSA9PiB7XG5cdCQoJyNwbGF5bXVzaWNidG4nKS5vbignY2xpY2snLCAoZSkgPT4ge1xuXHRcdC8vIGlwaG9uZSBoYWNrXG5cdFx0Ly8gaWYgKGF1ZGlvQ29udGV4dCA9PT0gbnVsbCl7XG5cdFx0Ly8gXHR0cnkge1xuICAvLyAgIFx0XHRcdHdpbmRvdy5BdWRpb0NvbnRleHQgPSB3aW5kb3cuQXVkaW9Db250ZXh0IHx8IHdpbmRvdy53ZWJraXRBdWRpb0NvbnRleHQ7XG4gIC8vICAgXHRcdFx0YXVkaW9Db250ZXh0ID0gbmV3IHdpbmRvdy5BdWRpb0NvbnRleHQoKTtcblx0XHQvLyBcdH0gY2F0Y2ggKGUpIHtcbiAgLy8gICBcdFx0XHRjb25zb2xlLmxvZyhcIk5vIFdlYiBBdWRpbyBBUEkgc3VwcG9ydFwiKTtcblx0XHQvLyBcdH1cblx0XHQvLyBcdGxldCBvc2NpbGxhdG9yID0gYXVkaW9Db250ZXh0LmNyZWF0ZU9zY2lsbGF0b3IoKTtcbiBcdC8vIFx0XHRcdG9zY2lsbGF0b3IuZnJlcXVlbmN5LnZhbHVlID0gNDAwO1xuIFx0Ly8gXHRcdFx0b3NjaWxsYXRvci5jb25uZWN0KGF1ZGlvQ29udGV4dC5kZXN0aW5hdGlvbik7XG4gXHQvLyBcdFx0XHRvc2NpbGxhdG9yLnN0YXJ0KDApO1xuIFx0Ly8gXHRcdFx0b3NjaWxsYXRvci5zdG9wKC41KVxuXHRcdC8vIH1cblx0XHRydW5TZXEgPSB0cnVlO1xuXHRcdHBsYXlNdXNpYygpO1xuXHRcdC8vYWxlcnQoJ2hlcmUnKTtcblx0fSk7XG5cdC8vICQoJyNwbGF5bXVzaWNidG4nKS5vbigndG91Y2hlbmQnLCAoZSkgPT4ge1xuXG5cdC8vIFx0cnVuU2VxID0gdHJ1ZTtcblx0Ly8gXHRwbGF5TXVzaWMoKTtcblx0Ly8gXHQvL2FsZXJ0KCdoZXJlJyk7XG5cdC8vIH0pO1xufTtcblxuY29uc3QgcmVnaXN0ZXJTdG9wQnV0dG9uID0gKCkgPT4ge1xuXHQkKCcjc3RvcG11c2ljYnRuJykub24oJ2NsaWNrJywgKGUpID0+IHtcblx0XHRydW5TZXEgPSBmYWxzZTtcblx0XHQvL2FsZXJ0KCdoZXJlJyk7XG5cdH0pO1xuXHQvLyAkKCcjc3RvcG11c2ljYnRuJykub24oJ3RvdWNoZW5kJywgKGUpID0+IHtcblx0Ly8gXHRydW5TZXEgPSBmYWxzZTtcblx0Ly8gXHQvL2FsZXJ0KCdoZXJlJyk7XG5cdC8vIH0pO1xufTtcblxuLy8gY29uc3QgcmVnaXN0ZXJQYXJhbWV0ZXJCdXR0b24gPSAoKSA9PiB7XG4vLyBcdCQoJyNwYXJhbWV0ZXJidG4nKS5vbignY2xpY2snLCAoZSkgPT4ge1xuLy8gXHRcdGxldCBlbCA9IGQzLnNlbGVjdEFsbCgncmVjdCcpWzBdWzRdO1xuLy8gXHRcdGxldCB0aW1lID0gMC45O1xuLy8gXHRcdGhpZ2hsaWdodEVsKGVsLDAsdGltZSk7XG4vLyBcdH0pO1xuLy8gfTtcblxuXG4vLyBQYXJhbWV0ZXIgd2VydGUgZWlubGVzZW5cbi8vICQoJyNwYXJhT3N6YnRuJykub24oJ2NsaWNrJywgKGUpID0+IHtcbi8vIFx0bGV0IHMyID0gJCgnaW5wdXRbbmFtZT1zcGVlZF06Y2hlY2tlZCcsICcjcGFyYW1ldGVyTW9kYWwnKS52YWwoKTtcbi8vIFx0bGV0IHMgPSAkKCdpbnB1dFtuYW1lPW9zemZvcm1dOmNoZWNrZWQnLCAnI3BhcmFtZXRlck1vZGFsJykudmFsKCk7XG4vLyBcdC8vaWYgKCEgdHlwZW9mIHMgPT09IFwidW5kZWZpbmVkXCIgJiYgISB0eXBlb2YgczIgID09PSBcInVuZGVmaW5lZFwiKXtcbi8vIFx0aWYgKCEgZmFsc2Upe1xuLy8gXHRcdG9zY2lsbGF0b3JUeXBlID0gcztcbi8vIFx0XHRzb3VuZFNwZWVkID0gcGFyc2VGbG9hdChzMik7XG4vLyBcdFx0JCgnI3BhcmFtZXRlck1vZGFsJykubW9kYWwoJ2hpZGUnKTtcbi8vIFx0fVxuLy8gfSk7XG5cblxuXG4vLyBTb3VuZCBEZWZpbml0aW9uXG5cblxuY29uc3QgcGxheVNvdW5kID0gKHN0YXJ0VGltZSwgcGl0Y2hOciwgZHVyYXRpb24sIGdhaW5PbGQpID0+IHtcblx0Ly9sZXQgc3RhcnRUaW1lID0gYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lICsgZGVsYXk7XG4gIFx0bGV0IGVuZFRpbWUgPSBzdGFydFRpbWUgKyBkdXJhdGlvbjtcbiAgXHQvL2xldCBwaXRjaCA9IHRvbmVzW3BpdGNoTnJdLmluc3RydW1lbnQ7IFxuXG5cblxuXG5cbiAgXHRsZXQgZ2FpbiA9IHRvbmVzW3BpdGNoTnJdLmdhaW47XG5cbiAgXHRsZXQgb3V0Z2FpbiA9IGF1ZGlvQ29udGV4dC5jcmVhdGVHYWluKCk7XG4gIFx0b3V0Z2Fpbi5nYWluLnZhbHVlID0gZ2FpbjtcbiAgXHRvdXRnYWluLmNvbm5lY3QoYXVkaW9Db250ZXh0LmRlc3RpbmF0aW9uKTsgXHRcblxuICBcdGxldCBlbnZlbG9wZSA9IGF1ZGlvQ29udGV4dC5jcmVhdGVHYWluKCk7XG4gIFx0ZW52ZWxvcGUuY29ubmVjdChvdXRnYWluKTtcbiAgXHRlbnZlbG9wZS5nYWluLnZhbHVlID0gMDtcbiAgXHRcbiAgXHRlbnZlbG9wZS5nYWluLnNldFRhcmdldEF0VGltZSgxLCBzdGFydFRpbWUsIGVudmVsb3BlU3RhcnRFbmRUaW1lWzBdKTtcbiAgXHRlbnZlbG9wZS5nYWluLnNldFRhcmdldEF0VGltZSgwLCBlbmRUaW1lLCBlbnZlbG9wZVN0YXJ0RW5kVGltZVsxXSk7XG5cbiAgXHRsZXQgb3NjaWxsYXRvciA9IGF1ZGlvQ29udGV4dC5jcmVhdGVPc2NpbGxhdG9yKCk7XG4gIFx0b3NjaWxsYXRvci5jb25uZWN0KGVudmVsb3BlKTtcblxuICBcdG9zY2lsbGF0b3IudHlwZSA9IG9zY2lsbGF0b3JUeXBlO1xuICBcdG9zY2lsbGF0b3IuZGV0dW5lLnZhbHVlID0gbm90ZXNbdG9uZXNbcGl0Y2hOcl0uaW5zdHJ1bWVudF0uZGV0dW5lO1xuICBcdG9zY2lsbGF0b3IuZnJlcXVlbmN5LnZhbHVlID0gMjQwO1xuXG5cdGxldCB2aWJyYXRvID0gYXVkaW9Db250ZXh0LmNyZWF0ZUdhaW4oKTtcblx0dmlicmF0by5nYWluLnZhbHVlID0gdmlicmF0b2dhaW47XG5cdHZpYnJhdG8uY29ubmVjdChvc2NpbGxhdG9yLmRldHVuZSk7XG5cblx0bGV0IGxmbyA9IGF1ZGlvQ29udGV4dC5jcmVhdGVPc2NpbGxhdG9yKCk7XG5cdGxmby5jb25uZWN0KHZpYnJhdG8pO1xuXHRsZm8uZnJlcXVlbmN5LnZhbHVlID1sZm9mcmVxOyBcblxuXHRvc2NpbGxhdG9yLnN0YXJ0KHN0YXJ0VGltZSk7XG4gIFx0bGZvLnN0YXJ0KHN0YXJ0VGltZSk7XG4gIFx0b3NjaWxsYXRvci5zdG9wKGVuZFRpbWUgKzIgKTtcbiAgXHRsZm8uc3RvcChlbmRUaW1lICsyKTtcblxufTtcblxuLy8vIFBsYXkgTG9vcFxuY29uc3QgcnVuU2VxdWVuY2VycyA9ICgpID0+IHtcblx0aWYgKCFydW5TZXEgfHwgc291bmRRdWV1ZS5sZW5ndGggPT09IDApe2NvbnNvbGUubG9nKFwic3RvcFwiKTtyZXR1cm47fVxuXHRsZXQgY3QgPSBhdWRpb0NvbnRleHQuY3VycmVudFRpbWU7XG5cdHdoaWxlIChzb3VuZFF1ZXVlLmxlbmd0aD4wICYmIHNvdW5kUXVldWVbMF1bMF08IGN0KzAuMTUpe1xuXHRcdC8vY29uc29sZS5sb2coJ2N0OicrY3QrJ3BsYW5lZCB0aW1lOicrc291bmRRdWV1ZVswXVswXSk7XG5cdFx0bGV0IGl0ZW0gPSBzb3VuZFF1ZXVlLnNwbGljZSgwLDEpO1xuXHRcdC8vIHBsYXlzb3VuZCAoc3RhcnR0aW1lLCBwaXRjaCwgZHVyYXRpb24sICAgICAgICAgICAgIGdhaWluKVxuXHRcdC8vcGxheVNvdW5kKGl0ZW1bMF1bMF0sc291bmRzW2l0ZW1bMF1bMV1dWzBdLGl0ZW1bMF1bMl0sdG9uZXNbaXRlbVswXVsxXV0uZ2Fpbik7XHRcdFxuXHRcblx0XHRwbGF5U291bmQoaXRlbVswXVswXSxpdGVtWzBdWzFdLGl0ZW1bMF1bMl0sdG9uZXNbaXRlbVswXVsxXV0uZ2Fpbik7XHRcdFxuXHRcdC8vIGVsZW1lbnQgICAgICAgICAgICAgIGNvbG9yICAgICAgIGR1cmF0aW9uICAgICAgICAgICAgICAgICBob3ZlcmNvbG9yXG5cdFx0aGlnaGxpZ2h0RWwoaXRlbVswXVszXSx0b25lc1tpdGVtWzBdWzFdXS5jb2xvcixpdGVtWzBdWzJdLHRvbmVzW2l0ZW1bMF1bMV1dLmhvdmVyKTtcblx0fVxuXHRzZXRUaW1lb3V0KHJ1blNlcXVlbmNlcnMsOTApO1xufVxuXG4vLy8gc291bmRzIHN0YXJ0IGhlcmVcbi8vLyBTb3VuZCB2YXJcbmxldCBydW5TZXEgPSB0cnVlO1xubGV0IHNvdW5kUXVldWUgPSBbXTtcblxudmFyIGF1ZGlvQ29udGV4dCA9IG51bGw7XG5cbnRyeSB7XG4gICB3aW5kb3cuQXVkaW9Db250ZXh0ID0gd2luZG93LkF1ZGlvQ29udGV4dHx8d2luZG93LndlYmtpdEF1ZGlvQ29udGV4dDtcbiAgIHZhciBhdWRpb0NvbnRleHQgPSBuZXcgQXVkaW9Db250ZXh0KCk7XG59IGNhdGNoIChlKSB7XG4gICAgY29uc29sZS5sb2coXCJObyBXZWIgQXVkaW8gQVBJIHN1cHBvcnRcIik7XG59XG5cblxuLy9JT1MgU3RhcnQgSU9TSEFDS1xuJCgnYm9keScpLm9uKCd0b3VjaGVuZCcsIChlKSA9PiB7XG5cdC8vYWxlcnQoJ3N0YXJ0IHNvdW5kXG5cdC8vIGNyZWF0ZSBlbXB0eSBidWZmZXJcblx0dmFyIGJ1ZmZlciA9IGF1ZGlvQ29udGV4dC5jcmVhdGVCdWZmZXIoMSwgMSwgMjIwNTApO1xuXHR2YXIgc291cmNlID0gYXVkaW9Db250ZXh0LmNyZWF0ZUJ1ZmZlclNvdXJjZSgpO1xuXHRzb3VyY2UuYnVmZmVyID0gYnVmZmVyO1xuXG5cdC8vIGNvbm5lY3QgdG8gb3V0cHV0ICh5b3VyIHNwZWFrZXJzKVxuXHRzb3VyY2UuY29ubmVjdChhdWRpb0NvbnRleHQuZGVzdGluYXRpb24pO1xuXG5cdC8vIHBsYXkgdGhlIGZpbGVcblx0aWYgKHR5cGVvZiBzb3VyY2Uubm90ZU9uICE9PSAndW5kZWZpbmVkJyl7XG5cdFx0c291cmNlLm5vdGVPbigwKTtcblx0fVxuXHRcblx0Ly8gdmFyIHNyYyA9IG51bGw7XG5cdC8vIHNyYyA9IGF1ZGlvQ29udGV4dC5jcmVhdGVPc2NpbGxhdG9yKCk7XG5cdC8vIHNyYy50eXBlID0gJ3NxdWFyZSc7XG5cdC8vIHNyYy5mcmVxdWVuY3kudmFsdWUgPSA0NDA7XG5cdC8vIHNyYy5jb25uZWN0KGF1ZGlvQ29udGV4dC5kZXN0aW5hdGlvbik7XG5cdC8vIGxldCBjdCA9IGF1ZGlvQ29udGV4dC5jdXJyZW50VGltZTtcblx0Ly8gc3JjLnN0YXJ0KGN0KzAuNSk7XG5cdC8vIHNyYy5zdG9wKGN0KzEuMik7XG59KTtcbi8vSU9TIEVORFxuXG5cbi8vIFNvdW5kIGNvbnN0YW5zdHMgcHJlc2V0c1xubGV0IHRvbmVzID0gW3tcblx0J25yJzowLFxuXHQnZ2Fpbic6MC4xLFxuXHQndm9sJzonMTAlJyxcbiAgICAnY29sb3InOicjNzU3NTc1Jyxcblx0J2hvdmVyJzonIzAwMDAwMCcsXG5cdCdpbnN0cnVtZW50JzonRDMnLFxuXHQnaWQnOidpZy1yb3cxLTAnLFxuXHQndmlzaWJsZSc6dHJ1ZVxufSxcblxue1xuXHQnbnInOjEsXG5cdCdnYWluJzowLjgsXG5cdCd2b2wnOic4MCUnLFxuXHQnY29sb3InOicjMjk2RUFBJyxcblx0J2hvdmVyJzonIzA5NEU4QScsXG5cdCdpbnN0cnVtZW50JzonRTMnLFxuXHQnaWQnOidpZy1yb3cxLTEnLFxuXHQndmlzaWJsZSc6dHJ1ZVxufSxcbntcblx0J25yJzoyLFxuXHQnZ2Fpbic6MC4wLFxuXHQndm9sJzonMCUnLFxuXHQnY29sb3InOicjNTQ5MUI1Jyxcblx0J2hvdmVyJzonIzM0NjE3NScsXG5cdCdpbnN0cnVtZW50JzonRjMnLFxuXHQnaWQnOidpZy1yb3cxLTInLFxuXHQndmlzaWJsZSc6ZmFsc2Vcbn0sXG57XG5cdCducic6Myxcblx0J2dhaW4nOjAuMCxcblx0J3ZvbCc6JzAlJyxcblx0J2NvbG9yJzonIzc5QkVGQScsXG5cdCdob3Zlcic6JyM1OTlFQkEnLFxuXHQnaW5zdHJ1bWVudCc6J0czJyxcblx0J2lkJzonaWctcm93MS0zJyxcblx0J3Zpc2libGUnOmZhbHNlXG59LFxuXG57XG5cdCducic6NCxcblx0J2dhaW4nOjAuNSxcblx0J3ZvbCc6JzUwJScsXG5cdCdjb2xvcic6JyM0QkE4NEInLFxuXHQnaG92ZXInOicjMkI4ODJCJyxcblx0J2luc3RydW1lbnQnOidBNCcsXG5cdCdpZCc6J2lnLXJvdzItMScsXG5cdCd2aXNpYmxlJzp0cnVlXG59LFxue1xuXHQnbnInOjUsXG5cdCdnYWluJzowLjAsXG5cdCd2b2wnOicwJScsXG5cdCdjb2xvcic6JyM1NDcyNDknLFxuXHQnaG92ZXInOicjMjQ1MjE5Jyxcblx0J2luc3RydW1lbnQnOidCNCcsXG5cdCdpZCc6J2lnLXJvdzItMicsXG5cdCd2aXNpYmxlJzpmYWxzZVxufSxcbntcblx0J25yJzo2LFxuXHQnZ2Fpbic6MC4wLFxuXHQndm9sJzonMCUnLFxuXHQnY29sb3InOicjMUY2MjQxJyxcblx0J2hvdmVyJzonIzFGNjI0MScsXG5cdCdpbnN0cnVtZW50JzonQzQnLFxuXHQnaWQnOidpZy1yb3cyLTMnLFxuXHQndmlzaWJsZSc6ZmFsc2Vcbn0sXG57XG5cdCducic6Nyxcblx0J2dhaW4nOjAuMyxcblx0J3ZvbCc6JzMwJScsXG5cdCdjb2xvcic6JyNEQjM4MzMnLFxuXHQnaG92ZXInOicjQUIxODEzJyxcblx0J2luc3RydW1lbnQnOidENCcsXG5cdCdpZCc6J2lnLXJvdzMtMScsXG5cdCd2aXNpYmxlJzp0cnVlXG59LFxue1xuXHQnbnInOjgsXG5cdCdnYWluJzowLjAsXG5cdCd2b2wnOicwJScsXG5cdCdjb2xvcic6JyNCMzBCMEInLFxuXHQnaG92ZXInOicjNTMwQjBCJyxcblx0J2luc3RydW1lbnQnOidFNCcsXG5cdCdpZCc6J2lnLXJvdzMtMicsXG5cdCd2aXNpYmxlJzpmYWxzZVxufSxcbntcblx0J25yJzo5LFxuXHQnZ2Fpbic6MC4wLFxuXHQndm9sJzonMCUnLFxuXHQnY29sb3InOicjQTExMjNGJyxcblx0J2hvdmVyJzonIzUxMDIxRicsXG5cdCdpbnN0cnVtZW50JzonRjQnLFxuXHQnaWQnOidpZy1yb3czLTMnLFxuXHQndmlzaWJsZSc6ZmFsc2Vcbn1dO1xuXG4vLyBzb3VuZHNcbmxldCBub3RlcyA9IHtcblx0J0QzJzoge1xuXHRcdCdmcmVxJzogNDQwLFxuXHRcdCdkZXR1bmUnOiAtNzAwXG5cdH0sXG5cdCdFMyc6IHtcblx0XHQnZnJlcSc6IDQ0MCxcblx0XHQnZGV0dW5lJzogLTUwMFxuXHR9LCBcblx0J0YzJzoge1xuXHRcdCdmcmVxJzogNDQwLFxuXHRcdCdkZXR1bmUnOiAtNDAwXG5cdH0sXG5cdCdHMyc6IHtcblx0XHQnZnJlcSc6IDQ0MCxcblx0XHQnZGV0dW5lJzogLTIwMFxuXHR9LFxuXHQnQTQnOiB7XG5cdFx0J2ZyZXEnOiA0NDAsXG5cdFx0J2RldHVuZSc6IDBcblx0fSxcblx0J0I0Jzoge1xuXHRcdCdmcmVxJzogNDQwLFxuXHRcdCdkZXR1bmUnOiAyMDBcblx0fSxcblx0J0M0Jzoge1xuXHRcdCdmcmVxJzogNDQwLFxuXHRcdCdkZXR1bmUnOiAzMDBcblx0fSxcblx0J0Q0Jzoge1xuXHRcdCdmcmVxJzogNDQwLFxuXHRcdCdkZXR1bmUnOiA1MDBcblx0fSxcblx0J0U0Jzoge1xuXHRcdCdmcmVxJzogNDQwLFxuXHRcdCdkZXR1bmUnOiA3MDBcblx0fSxcblx0J0Y0Jzoge1xuXHRcdCdmcmVxJzogNDQwLFxuXHRcdCdkZXR1bmUnOiA4MDBcblx0fSxcblx0J0c0Jzoge1xuXHRcdCdmcmVxJzogNDQwLFxuXHRcdCdkZXR1bmUnOiAxMDAwXG5cdH1cbn07XG5cblxuXG5sZXQgc291bmRTcGVlZCA9IDAuNTtcbmxldCB0b25lZHVyYXRpb24gPSAwLjM7XG5sZXQgdmlicmF0b2dhaW4gPSAwLjM7XG5sZXQgZW52ZWxvcGVTdGFydEVuZFRpbWUgPSBbMC4wMSwwLjFdO1xubGV0IGxmb2ZyZXEgPSA2OyAgLy81XG4vLyBQYXJhbWV0cml6YXRpb24gb2YgdGhlIDUgdG9uZXMgIFBpdGNoIGR1cmF0aW9uIHZvbHVtZSBnYWluXG4vLyBEZWJyaWNhdGVkIHRvIGJlIHJlbW92ZWRcbi8vIGZpcnN0IGlzdCBibGFjayBzb3VuZFxuY29uc3Qgc291bmRzID0gW1stMTAsIDAuNSwwLjFdLFszLCAwLjUsMC45XSxbMTAsIDAuNSwwLjldLFsxNSwgMC41LDAuOV0sWzAsIDAuNSwwLjldXTtcbmxldCBvc2NpbGxhdG9yVHlwZSA9ICdzYXd0b290aCc7IC8vJ3NpbmUnOyAvLyAnc2F3dG9vdGgnXG5cbi8vLyBOYXZpZ2F0aW9uXG5cbmNvbnN0IGRpc3BOYXZFbGVtZW50cyA9IChvYmopID0+IHtcblx0b2JqLm1hcCgobykgPT4ge1xuXHRcdGlmIChvLnZpc2libGUpe1xuXHRcdFx0JCgnIycrby5pZCkuc2hvdygpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRsZXQgZWw9JCgnIycrby5pZCk7XG5cdFx0XHRlbC5oaWRlKCk7XG5cdFx0XHRlbC5jaGlsZHJlbignaW5wdXQnKVswXS52YWx1ZT0nMCc7XG5cdFx0XHQvL2NvbnNvbGUubG9nKGVsLmNoaWxkcmVuKCdpbnB1dCcpWzBdLnZhbHVlKTtcblx0XHR9XG5cdH0pO1xufTtcblxuLy8vIFNvdW5kIE1ldGhvZHNcbmNvbnN0IHBsYXlNdXNpYyA9ICgpID0+IHtcblx0Ly8gZmlsbCBzb3VuZFF1ZXVlXHRcblx0bGV0IGo7XG5cdGxldCByZWN0YXJyID0gZDMuc2VsZWN0KCcjY2hhcnQtc3VtJykuc2VsZWN0KCdnJykuc2VsZWN0QWxsKCdnJykuZGF0YSgpO1xuXHRsZXQgZWxhcnIgPSBkMy5zZWxlY3QoJyNjaGFydC1zdW0nKS5zZWxlY3RBbGwoJ3JlY3QnKVswXTtcbiAgICBsZXQgc3RhcnRUaW1lID0gYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lO1xuICAgIC8vY29uc29sZS5sb2coJ1N0YXJ0JytzdGFydFRpbWUpO1xuICAgIHNvdW5kUXVldWUgPVtdO1xuXHRmb3IgKGxldCBpPTA7IGkgPCByZWN0YXJyLmxlbmd0aDsgaSsrKSB7XG5cdFx0bGV0IHYgPSByZWN0YXJyW2ldO1xuXHRcdFx0Zm9yIChqPTA7ajx2Lmxlbmd0aDtqKyspe1xuXHRcdFx0XHQvL3BsYXlTb3VuZChpLHNvdW5kc1t2XVswXSxzb3VuZHNbdl1bMV0sc291bmRzW3ZdWzJdKTtcblx0XHRcdFx0Ly9hbGVydChpKTtcblx0XHRcdFx0bGV0IHRtcCA9IFtdO1xuXHRcdFx0XHR0bXAucHVzaChpKnNvdW5kU3BlZWQrc3RhcnRUaW1lK2oqMC4wMDAxKTtcblx0XHRcdFx0dG1wLnB1c2godltqXSk7XG5cdFx0XHRcdHRtcC5wdXNoKHRvbmVkdXJhdGlvbik7XG5cdFx0XHRcdHRtcC5wdXNoKGVsYXJyW2ldKTtcblx0XHRcdFx0c291bmRRdWV1ZS5wdXNoKHRtcCk7XG5cblx0XHRcdH1cblx0XHRcblx0fVxuXHQvL2NvbnNvbGUubG9nKCdzdGFydHNlcXVlbmNlcicrYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lKTtcbiAgICBydW5TZXF1ZW5jZXJzKCk7XG59O1xuXG4vLyBJbml0IFNjcmVlblxuY29uc3QgaW5pdGQzanMgPSAoZWxJZCkgPT4ge1xuXHRjb25zdCB3aWR0aCA9IDEyODAsXG4gICAgaGVpZ2h0ID0gNDU7XG4gICAgbGV0IHNyX3ZpZXdwb3J0ID0gJzAgMCAnKyh3aWR0aCs3MCkrJyAnK2hlaWdodDtcbiAgICBjb25zdCBkaXYgPSBkMy5zZWxlY3QoZWxJZCksXG5cdHN2ZyA9IGRpdi5hcHBlbmQoJ3N2ZycpXG4gICAgICAgIC5hdHRyKCd3aWR0aCcsIHdpZHRoKVxuICAgICAgICAuYXR0cignaGVpZ2h0JywgaGVpZ2h0KVxuICAgICAgICAuYXR0cigndmlld0JveCcsIHNyX3ZpZXdwb3J0KVxuICAgICAgICAuYXR0cigncHJlc2VydmVBc3BlY3RSYXRpbycsICd4TWlkWU1pZCBtZWV0Jyk7XG5cbiAgICByZXR1cm4gc3ZnO1xufTtcblxuXG4gICAgLy8gQ29uc3RhbnRzXG5cbiAgICBjb25zdCBydyA9IDIwLFxuICAgIHJoID0gMjAsXG4gICAgcm93TiA9MSxcbiAgICBjb2xOID00ODtcbiAgICAvLyBobG9va3VwID0gWycjMDAwMDAwJywnIzA5NEU4QScsJyMwOTRFOEEnLCcjMDk0RThBJ107XG4gICAgXG5cbiAgICAvLyBjb25maWd1cmUgZGlzcGxheVxuICAgIGRpc3BOYXZFbGVtZW50cyh0b25lcyk7XG5cbiAgICAvLyBiaW5kIGRhdGEgYW5kIHJlbmRlciBkM2pzXG4gICAgY29uc3Qgc3ZnID0gaW5pdGQzanMoJyNjaGFydCcpO1xuICAgIGxldCBsb29rdXBibHVlID0gWzAsMSwyLDNdLm1hcCgoaSkgPT4gdG9uZXNbaV0uY29sb3IpOyAgIFxuICAgIGxldCBteWRhdGEgPSByZWRyYXcocmVhZElucHV0KDEpKTtcblx0cmVuZGVyR3JhcGgobXlkYXRhLHN2Zyxsb29rdXBibHVlLGZhbHNlKTtcblxuICAgIGNvbnN0IHN2Z2dyZWVuID0gaW5pdGQzanMoJyNjaGFydC0yJyk7XG4gICAgbGV0IGxvb2t1cGdyZWVuID0gWzAsNCw1LDZdLm1hcCgoaSkgPT4gdG9uZXNbaV0uY29sb3IpOyBcbiAgICBsZXQgbXlkYXRhR3JlZW4gPSByZWRyYXcocmVhZElucHV0KDIpKTtcblx0cmVuZGVyR3JhcGgobXlkYXRhR3JlZW4sc3ZnZ3JlZW4sbG9va3VwZ3JlZW4sZmFsc2UpO1xuXG4gICAgY29uc3Qgc3ZncmVkID0gaW5pdGQzanMoJyNjaGFydC0zJyk7XG4gICAgbGV0IGxvb2t1cHJlZCA9IFswLDcsOCw5XS5tYXAoKGkpID0+IHRvbmVzW2ldLmNvbG9yKTsgXG4gICAgbGV0IG15ZGF0YVJlZCA9IHJlZHJhdyhyZWFkSW5wdXQoMykpO1xuXHRyZW5kZXJHcmFwaChteWRhdGFSZWQsc3ZncmVkLGxvb2t1cHJlZCxmYWxzZSk7XHRcblxuXHQvLyBzdW0gIHRoZSBkYXRhICBcblx0Y29uc3Qgc3Znc3VtID0gaW5pdGQzanMoJyNjaGFydC1zdW0nKTtcblx0bGV0IGxvb2t1cGFsbCA9IFswLDEsMiwzLDQsNSw2LDcsOCw5XS5tYXAoKGkpID0+IHRvbmVzW2ldLmNvbG9yKTsgXG5cdGxldCBteWRhdGFzdW0gPSByZWR1Y2UzZGF0YShteWRhdGFbMF0sbXlkYXRhR3JlZW5bMF0sbXlkYXRhUmVkWzBdKTtcblx0cmVuZGVyR3JhcGgobXlkYXRhc3VtLHN2Z3N1bSxsb29rdXBhbGwsdHJ1ZSk7XG5cblx0Ly8gcmVzcG9uc2l2ZSBjaGFuZ2VcbiAgICBkMy5zZWxlY3Qod2luZG93KVxuICAgIFx0Lm9uKCdyZXNpemUnLCAoKSA9PiB7XG5cdFx0ICAgIC8vbGV0IHRhcmdldFdpZHRoID0gc3ZnLm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aDtcblx0XHQgICAgbGV0IHdpbldpZHRoID0gJCh3aW5kb3cpLndpZHRoKCk7XG5cdFx0ICAgIHN2Zy5hdHRyKFwid2lkdGhcIiwgd2luV2lkdGgpO1xuXHRcdCAgICBzdmdncmVlbi5hdHRyKFwid2lkdGhcIiwgd2luV2lkdGgpO1xuXHRcdCAgICBzdmdyZWQuYXR0cihcIndpZHRoXCIsIHdpbldpZHRoKTtcblx0XHQgICAgc3Znc3VtLmF0dHIoXCJ3aWR0aFwiLCB3aW5XaWR0aCk7XG4gIFx0XHR9KTtcbiAgICAvL1RyaWdlciByZXNpemUgRXZlbnRcbiAgXHRsZXQgdG1wdyA9ICQod2luZG93KS53aWR0aCgpO1xuXHRzdmcuYXR0cignd2lkdGgnLCB0bXB3KTtcblx0c3ZnZ3JlZW4uYXR0cignd2lkdGgnLCB0bXB3KTtcblx0c3ZncmVkLmF0dHIoJ3dpZHRoJywgdG1wdyk7XG5cdHN2Z3N1bS5hdHRyKFwid2lkdGhcIiwgdG1wdyk7XG5cblx0XG5cblx0Ly8gbGV0IHN2Z3Rlc3QgPSBpbml0ZDNqcygnI2NoYXJ0LXRlc3QnKTtcblx0Ly8gbGV0IG15ZGF0YXRlc3QgPSBbW1sxLDIsM10sWzAsNCw1XSxbMSw0XSxbNCw5XSxbMSw0LDddLFswXSxbMF0sWzBdLFswXSxbMF0sWzBdLFswXSxbMF0sWzBdLFswXV1dO1xuXHQvLyByZW5kZXJHcmFwaChteWRhdGF0ZXN0LHN2Z3Rlc3QsbG9va3VwYWxsKTtcblxuXHQvLyBSZWdpc3RlciBCdXR0b25zXG5cdC8vIGJsYWNrYnV0dG9uIG9ubHkgb25lIHJlZ2lzdHJhdGlvblxuXHRyZWdpc3RlckJsYWNrVm9sdW1lQnV0dG9uKCk7XG5cdHJlZ2lzdGVyQmxhY2tUb25CdXR0b24oKTtcblxuXHQvLyBSZWdpc3RlciAzIHJvd3MgViBCdXR0b25cblx0Ly8gVE9ETyBDaGVjayBSRWdpc3RlciBCdXR0b25cblx0WzEsMiwzXS5tYXAocmVnaXN0ZXJCdXR0b24pO1xuXHRbMSwyLDNdLm1hcChyZWdpc3RlclRvbkJ1dHRvbik7XG5cdFsxLDIsM10ubWFwKHJlZ2lzdGVyVm9sdW1lQnV0dG9uKTtcblxuXHRyZWdpc3RlcklucHV0T25DaGFuZ2UoMSxzdmcsbG9va3VwYmx1ZSk7XG5cdHJlZ2lzdGVySW5wdXRPbkNoYW5nZSgyLHN2Z2dyZWVuLGxvb2t1cGdyZWVuKTtcblx0cmVnaXN0ZXJJbnB1dE9uQ2hhbmdlKDMsc3ZncmVkLGxvb2t1cHJlZCk7XG5cblxuXHRyZWdpc3RlclBsYXlCdXR0b24oKTtcblx0cmVnaXN0ZXJTdG9wQnV0dG9uKCk7XG5cdC8vcmVnaXN0ZXJQYXJhbWV0ZXJCdXR0b24oKTtcblxuLy9pb3MgaGFja1xuLy8gXHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCBmdW5jdGlvbigpIHtcblxuLy8gXHQvLyBjcmVhdGUgZW1wdHkgYnVmZmVyXG4vLyBcdHZhciBidWZmZXIgPSBhdWRpb0NvbnRleHQuY3JlYXRlQnVmZmVyKDEsIDEsIDIyMDUwKTtcbi8vIFx0dmFyIHNvdXJjZSA9IGF1ZGlvQ29udGV4dC5jcmVhdGVCdWZmZXJTb3VyY2UoKTtcbi8vIFx0c291cmNlLmJ1ZmZlciA9IGJ1ZmZlcjtcblxuLy8gXHQvLyBjb25uZWN0IHRvIG91dHB1dCAoeW91ciBzcGVha2Vycylcbi8vIFx0c291cmNlLmNvbm5lY3QoYXVkaW9Db250ZXh0LmRlc3RpbmF0aW9uKTtcblxuLy8gXHQvLyBwbGF5IHRoZSBmaWxlXG4vLyBcdHNvdXJjZS5ub3RlT24oMCk7XG5cbi8vIH0sIGZhbHNlKTtcblxuXG5cbi8vIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hzdGFydFwiLCBmdW5jdGlvbiAoKXtcdFxuLy8gXHRcdGlmIChoYWRfdG91Y2gpXHRcdHJldHVybjtcdFx0XG4vLyBcdFx0Ly8gcGxheSBlbXB0eSBidWZmZXIgdG8gdW5tdXRlIGF1ZGlvXHRcbi8vIFx0XHR2YXIgYnVmZmVyID0gYXVkaW9Db250ZXh0LmNyZWF0ZUJ1ZmZlcigxLCAxLCAyMjA1MCk7XHRcbi8vIFx0XHR2YXIgc291cmNlID0gYXVkaW9Db250ZXh0LmNyZWF0ZUJ1ZmZlclNvdXJjZSgpO1x0XG4vLyBcdFx0c291cmNlLmJ1ZmZlciA9IGJ1ZmZlcjtcdFxuLy8gXHRcdHNvdXJjZS5jb25uZWN0KGF1ZGlvQ29udGV4dC5kZXN0aW5hdGlvbik7XHRcbi8vIFx0XHRzb3VyY2Uuc3RhcnQoMCk7XHRcbi8vIFx0XHRoYWRfdG91Y2ggPSB0cnVlO1xuLy8gXHRcdGFsZXJ0KFwibWlzdFwiKTtcbi8vIFx0fSk7XG5cblxuXG5cblxufSk7XG5cblxuXG4iXX0=
