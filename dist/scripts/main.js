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
		var elarr = d3.select('#chart-sum').select('g').selectAll('g')[0];
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
				tmp.push(d3.select(elarr[i]).selectAll('rect')[j]);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvc2NyaXB0cy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxFQUFFLFFBQUYsRUFBWSxLQUFaLENBQWtCLFlBQVU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEyQjVCLEtBQU0sY0FBYyxTQUFkLFdBQWMsQ0FBQyxJQUFELEVBQU0sR0FBTixFQUFVLE1BQVYsRUFBaUIsUUFBakIsRUFBOEI7O0FBRWpELE1BQUksUUFBSixFQUFhO0FBQ1osT0FBSSxNQUFNLElBQUksU0FBSixDQUFjLE9BQWQsRUFDTixJQURNLENBQ0QsSUFEQyxDQUFOLENBRFE7O0FBSVQsT0FBSSxXQUFXLElBQUksU0FBSixDQUFjLEdBQWQsRUFDZCxJQURjLENBQ1QsVUFBQyxDQUFEO1dBQU87SUFBUCxDQURGLENBSks7O0FBUVQsWUFDQyxJQURELEdBRUMsTUFGRCxHQVJTOztBQVlULFlBQ0MsS0FERCxHQUVGLE1BRkUsQ0FFSyxHQUZMLEVBR0YsSUFIRSxDQUdHLFdBSEgsRUFHZ0IsVUFBQyxDQUFELEVBQUksQ0FBSixFQUFVO0FBQzVCLFlBQVEsR0FBUixDQUFZLENBQVosRUFBYyxDQUFkLEVBRDRCO0FBRTVCLFdBQU8sZUFBZSxLQUFLLENBQUwsR0FBUyxLQUF4QixDQUZxQjtJQUFWLENBSGhCLENBWlM7O0FBcUJaLE9BQUksUUFBTSxTQUFTLFNBQVQsQ0FBbUIsTUFBbkIsRUFDVCxJQURTLENBQ0osVUFBQyxDQUFEO1dBQU87SUFBUCxDQURGLENBckJROztBQXdCWixTQUNDLElBREQsR0FFQyxNQUZELEdBeEJZOztBQTRCWixTQUNDLElBREQsQ0FDTSxNQUROLEVBQ2MsVUFBQyxDQUFELEVBQUcsQ0FBSDtXQUFTLE9BQU8sQ0FBUDtJQUFULENBRGQsQ0FFQyxJQUZELENBRU0sR0FGTixFQUVXLFVBQUMsQ0FBRCxFQUFJLENBQUosRUFBTSxDQUFOO1dBQWEsS0FBRyxL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LGNBQVosRUFuNUIyQjtBQW81QjNCLEVBQUMsQ0FBRCxFQUFHLENBQUgsRUFBSyxDQUFMLEVBQVEsR0FBUixDQUFZLGlCQUFaLEVBcDVCMkI7QUFxNUIzQixFQUFDLENBQUQsRUFBRyxDQUFILEVBQUssQ0FBTCxFQUFRLEdBQVIsQ0FBWSxvQkFBWixFQXI1QjJCOztBQXU1QjNCLHVCQUFzQixDQUF0QixFQUF3QixHQUF4QixFQUE0QixVQUE1QixFQXY1QjJCO0FBdzVCM0IsdUJBQXNCLENBQXRCLEVBQXdCLFFBQXhCLEVBQWlDLFdBQWpDLEVBeDVCMkI7QUF5NUIzQix1QkFBc0IsQ0FBdEIsRUFBd0IsTUFBeEIsRUFBK0IsU0FBL0IsRUF6NUIyQjs7QUE0NUIzQixzQkE1NUIyQjtBQTY1QjNCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Q0E3NUJpQixDQUFsQjtBQUE0QiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuLy8gY3JlYXRlIEhUTUwgc3R1ZmZcbi8vIGNvbnN0IGNyZWF0ZUh0bWxUb25Db250cm9sID0gKG5yKSA9PiB7XG4vLyBcdGNvbnN0IHBvc25yID0gJzEnO1xuXHRcblxuLy8gXHRsZXQgZWxDb250YWluZXIgPSAndG9uLWNvbnRyb2wtJytucjtcbi8vIFx0bGV0IGVsT3V0RGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIkRJVlwiKTtcbi8vIFx0ZWxPdXREaXYuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJjb2wteHMtM1wiKTtcblx0XG4vLyBcdGxldCBlbGlucHV0R3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiRElWXCIpO1xuLy8gXHRlbGlucHV0R3JvdXAuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJpbnB1dC1ncm91cC1idG5cIik7IFxuLy8gXHRlbE91dERpdi5hcHBlbmRDaGlsZChlbGlucHV0R3JvdXApO1xuLy8gXHQvLyBCVVRUT05cbi8vIFx0bGV0IHRleHRub2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoXCIgWmFobFwiKTsgXG4vLyBcdGxldCBidG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiQlVUVE9OXCIpO1xuLy8gXHRsZXQgc2lkPSdidG4tcm93JytucisnLScrcG9zbnI7XG4vLyBcdGJ0bi5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBzaWQpO1xuLy8gXHRidG4uc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJidG4gYnRuLWluZm8gZHJvcGRvd24tdG9nZ2xlXCIpO1xuLy8gXHRidG4uYXBwZW5kQ2hpbGQodGV4dG5vZGUpO1xuLy8gXHRlbGlucHV0R3JvdXAuYXBwZW5kQ2hpbGQoYnRuKTtcbi8vIFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWxDb250YWluZXIpLmFwcGVuZENoaWxkKGVsT3V0RGl2KTtcblxuXG4vLyB9O1xuXG4vLyBEM0pTXG5jb25zdCB1cGRhdGVHcmFwaCA9IChkYXRhLHN2Zyxsb29rdXAsY2hlY2tzdW0pID0+IHtcblx0XG5cdGlmIChjaGVja3N1bSl7XG5cdFx0bGV0IGdycCA9IHN2Zy5zZWxlY3RBbGwoJ3N2ZyBnJylcblx0ICAgIC5kYXRhKGRhdGEpO1xuXG5cdCAgICBsZXQgaW5uZXJncnAgPSBncnAuc2VsZWN0QWxsKCdnJylcblx0ICAgIC5kYXRhKChkKSA9PiBkKTtcblxuXG5cdCAgICBpbm5lcmdycFxuXHQgICAgLmV4aXQoKVxuXHQgICAgLnJlbW92ZSgpO1xuXHQgICAgXG5cdCAgICBpbm5lcmdycFxuXHQgICAgLmVudGVyKClcblx0XHQuYXBwZW5kKCdnJylcblx0XHQuYXR0cigndHJhbnNmb3JtJywgKGQsIGkpID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKGQsaSk7XG5cdFx0XHRyZXR1cm4gJ3RyYW5zbGF0ZSgnICsgMjggKiBpICsgJywwKSdcblx0XHR9KTtcblx0ICAgIFxuXG5cdFx0bGV0IHJlY3RzPWlubmVyZ3JwLnNlbGVjdEFsbCgncmVjdCcpXG5cdFx0LmRhdGEoKGQpID0+IGQpO1xuXHRcdFxuXHRcdHJlY3RzXG5cdFx0LmV4aXQoKVxuXHRcdC5yZW1vdmUoKTtcblxuXHRcdHJlY3RzXG5cdFx0LmF0dHIoJ2ZpbGwnLCAoZCxpKSA9PiBsb29rdXBbZF0pXG5cdFx0LmF0dHIoJ3gnLCAoZCwgaSxrKSA9PiAgcncvZGF0YVswXVtrXS5sZW5ndGggKiBpKVxuXHRcdC5hdHRyKCd3aWR0aCcsIChkLGksaykgPT4gIHJ3L2RhdGFbMF1ba10ubGVuZ3RoKVxuXHRcdC5hdHRyKCdoZWlnaHQnLCByaClcblx0XHQuZW50ZXIoKVxuXHRcdC5hcHBlbmQoJ3JlY3QnKVxuXHRcdC5hdHRyKCdmaWxsJywgKGQsaSkgPT4gbG9va3VwW2RdKVxuXHRcdC5hdHRyKCd4JywgKGQsIGksaykgPT4gIHJ3L2RhdGFbMF1ba10ubGVuZ3RoICogaSlcblx0XHQuYXR0cignd2lkdGgnLCAoZCxpLGspID0+ICBydy9kYXRhWzBdW2tdLmxlbmd0aClcblx0XHQuYXR0cignaGVpZ2h0JywgcmgpO1xuXG5cdFx0Ly8gcmVjdHMuZXhpdCgpXG5cdFx0Ly8gLnJlbW92ZSgpO1xuXG5cdH0gZWxzZSB7XG5cdFx0c3ZnLnNlbGVjdEFsbCgnc3ZnIGcgcmVjdCcpXG5cdFx0LmRhdGEoZGF0YVswXSlcblx0XHQuYXR0cignZmlsbCcsIChkLGkpID0+IGxvb2t1cFtkXSlcblx0XHQuZW50ZXIoKVxuXHRcdC5hcHBlbmQoJ3JlY3QnKVxuXHQgICAgLmF0dHIoJ3gnLCAoZCwgaSkgPT4gIDI4ICogaSlcblx0ICAgIC5hdHRyKCd3aWR0aCcsIHJ3KVxuXHQgICAgLmF0dHIoJ2hlaWdodCcsIHJoKTtcblx0ICAgIC8vLnJlbW92ZSgpO1xuXHR9XG59O1xuXG5jb25zdCByZW5kZXJHcmFwaCA9IChkYXRhLHN2Zyxsb29rdXAsY2hlY2tzdW0pID0+IHtcblx0Ly8gQ3JlYXRlIGEgZ3JvdXAgZm9yIGVhY2ggcm93IGluIHRoZSBkYXRhIG1hdHJpeCBhbmRcblx0Ly8gdHJhbnNsYXRlIHRoZSBncm91cCB2ZXJ0aWNhbGx5XG5cdGxldCBncnAgPSBzdmcuc2VsZWN0QWxsKCdzdmcgZycpXG5cdCAgICAuZGF0YShkYXRhKVxuXHQgICAgLmVudGVyKClcblx0ICAgIC5hcHBlbmQoJ2cnKVxuXHQgICAgLmF0dHIoJ3RyYW5zZm9ybScsIChkLCBpKSA9PiAndHJhbnNsYXRlKDAsICcgKyA1NCAqIGkgKyAnKScpOyAgXG5cblx0aWYgKGNoZWNrc3VtKXtcblx0XHQvL2lubmVyIHN0cnVjdHVyZVxuXHRcdGxldCBpbmdycCA9IGdycC5zZWxlY3RBbGwoJ2cnKVxuXHRcdFx0Ly8gLmZpbHRlciggKGQsaSkgPT4gdHlwZW9mIGRbaV0gPT09ICdvYmplY3QnKVxuXHRcdCAgICAuZGF0YSgoZCkgPT4gZClcblx0XHQgICAgLmVudGVyKClcblx0XHQgICAgLmFwcGVuZCgnZycpXG5cdFx0ICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAoZCwgaSkgPT4gJ3RyYW5zbGF0ZSgnICsgMjggKiBpICsgJywwKScpO1xuXG5cblx0XHRpbmdycC5zZWxlY3RBbGwoJ3JlY3QnKVxuXHRcdCAgICAuZGF0YSgoZCkgPT4gZClcblx0XHQgICAgLmVudGVyKClcblx0XHQgICAgLmFwcGVuZCgncmVjdCcpXG5cdFx0ICAgIFx0LmF0dHIoJ3gnLCAoZCwgaSxrKSA9PiAgcncvZGF0YVswXVtrXS5sZW5ndGggKiBpKVxuXHRcdCAgICAgICAgLmF0dHIoJ2ZpbGwnLCAoZCxpKSA9PiBsb29rdXBbZF0pXG5cdFx0ICAgICAgICAuYXR0cignd2lkdGgnLCAoZCxpLGspID0+ICBydy9kYXRhWzBdW2tdLmxlbmd0aClcblx0XHQgICAgICAgIC5hdHRyKCdoZWlnaHQnLCByaCk7ICBcblx0fSBlbHNlIHtcblx0XHQvLyBGb3IgZWFjaCBncm91cCwgY3JlYXRlIGEgc2V0IG9mIHJlY3RhbmdsZXMgYW5kIGJpbmQgXG5cdFx0Ly8gdGhlbSB0byB0aGUgaW5uZXIgYXJyYXkgKHRoZSBpbm5lciBhcnJheSBpcyBhbHJlYWR5XG5cdFx0Ly8gYmluZGVkIHRvIHRoZSBncm91cClcblx0XHRncnAuc2VsZWN0QWxsKCdyZWN0Jylcblx0XHRcdC8vIC5maWx0ZXIoIChkLGkpID0+IHR5cGVvZiBkW2ldID09PSAnbnVtYmVyJylcblx0XHQgICAgLmRhdGEoKGQpID0+IGQpXG5cdFx0ICAgIC5lbnRlcigpXG5cdFx0ICAgIC5hcHBlbmQoJ3JlY3QnKVxuXHRcdCAgICAgICAgLmF0dHIoJ3gnLCAoZCwgaSkgPT4gIDI4ICogaSlcblx0XHQgICAgICAgIC5hdHRyKCdmaWxsJywgKGQsaSkgPT4gbG9va3VwW2RdKVxuXHRcdCAgICAgICAgLmF0dHIoJ3dpZHRoJywgcncpXG5cdFx0ICAgICAgICAuYXR0cignaGVpZ2h0JywgcmgpOyAgICAgXG5cdH1cblxuXHQvL01vZHVsbyAxMCB0aWNrcyAgICAgICAgXG5cdGdycC5zZWxlY3RBbGwoJ2xpbmUnKVxuXHQgICAgLmRhdGEoKGQpID0+IHtcblx0ICAgIFx0bGV0IHRtcCA9IE1hdGgudHJ1bmMoZC5sZW5ndGggLyAxMCk7XG5cdCAgICBcdGxldCBvdXQgPSBuZXcgQXJyYXkodG1wKzEpLmZpbGwoMCk7XG5cdCAgICBcdHJldHVybiBvdXQ7XG5cdCAgICB9KVxuXHQgICAgLmVudGVyKCkuYXBwZW5kKCdsaW5lJylcblx0ICAgIFx0Ly8uZmlsdGVyKChkLGkpID0+IGklMTA9PT0wKVxuICBcdFx0XHQuYXR0cigneDEnLCAgKGQsIGkpID0+IDI4MCAqIGkrMSlcbiAgXHRcdFx0LmF0dHIoJ3kxJywgMjApXG4gIFx0XHRcdC5hdHRyKCd4MicsIChkLCBpKSA9PiAyODAgKiBpKzEpXG4gIFx0XHRcdC5hdHRyKCd5MicsNDApXG4gIFx0XHRcdC5zdHlsZSgnc3Ryb2tlJywgJ2JsYWNrJylcbiAgXHRcdFx0LnN0eWxlKCdzdHJva2Utd2lkdGgnLCcycHgnKTtcbiAgXG5cbiAgXHQvLyBUZXh0IFxuICBcdGdycC5zZWxlY3RBbGwoJ3RleHQnKVxuXHQgICAgLmRhdGEoKGQpID0+IHtcblx0ICAgIFx0bGV0IHRtcCA9IE1hdGgudHJ1bmMoZC5sZW5ndGggLyAxMCk7XG5cdCAgICBcdGxldCBvdXQgPSBuZXcgQXJyYXkodG1wKzEpLmZpbGwoMCk7XG5cdCAgICBcdHJldHVybiBvdXQ7XG5cdCAgICB9KVxuXHQgICAgLmVudGVyKCkuYXBwZW5kKCd0ZXh0Jylcblx0ICAgIC8vLmZpbHRlcigoZCxpKSA9PiBpJTEwPT09MClcblx0ICAgIFx0LmF0dHIoJ3gnLCAoZCwgaSkgPT4geyByZXR1cm4gMjgwICogaSs1OyB9KVxuXHQgICAgXHQuYXR0cigneScsICczOCcpICBcblx0ICAgIFx0LmF0dHIoJ2ZvbnQtZmFtaWx5JywgJ3NhbnMtc2VyaWYnKSBcblx0ICAgIFx0LnRleHQoIChkLCBpLGspID0+IGsqNDAraSoxMCsxKTtcblx0ICAgIFx0XG59O1xuXG4vLyBnZXQgdmFsdWVzXG4vL2NvbnN0IGdldEJ1dHRvbklkcyA9ICgpID0+IFsnI2J0bi1yb3cxLTEnLCcjYnRuLXJvdzEtMicsJyNidG4tcm93MS0zJywnI2J0bi1yb3cxLTQnXTtcblxuLy8gcmVhZHMgUGFyYW1ldGVyIFRvbiBaYWhsIGZvciByb3cgb25lXG5jb25zdCByZWFkSW5wdXQgPSAocm93KSA9PiB7XG5cdGxldCBpZHMgPSBbXTtcblx0Ly8gVE9ETyB1c2UgYXMgcGFyYW1ldGVyIGxhdGVyXG5cdGlmICh0eXBlb2Ygcm93ID09PSAndW5kZWZpbmVkJyl7XG5cdFx0YWxlcnQgKCdyb3cgaXMgdW5kZWZpbmVkJyk7XG5cdH1cblx0Ly8gbGV0IHJvdyA9IDE7XG5cdGxldCBzPScnO1xuXHRmb3IgKGxldCBpID0gMTsgaSA8IDQ7IGkrKyl7XG5cdFx0cyA9ICcjYnRuLXJvdycrcm93KyctJytpO1xuXHRcdGlkcy5wdXNoKHMpO1xuXHR9IFxuXG5cdGxldCBvdXQgPSBbXTtcblx0Zm9yIChsZXQgaSBpbiBpZHMpIHtcblx0XHRsZXQgZWx2YWwgPSAkKGlkc1tpXSlcblx0XHRcdFx0XHRcdC5wYXJlbnQoKVxuXHRcdFx0XHRcdFx0LnBhcmVudCgpXG5cdFx0XHRcdFx0XHQuY2hpbGRyZW4oJ2lucHV0JylbMF07XG5cdFx0bGV0IHZhbCA9IDA7XG5cdFx0aWYgKHR5cGVvZiBlbHZhbCAhPT0gJ3VuZGVmaW5lZCcpe1xuXHRcdFx0dmFsID0gZWx2YWwudmFsdWU7XG5cdFx0fVxuXHRcdG91dC5wdXNoKHZhbCk7XG5cdH1cblx0cmV0dXJuIG91dDtcbn07XG5cbi8vIFJlZHVjZSBkYXRhIGZyb20gMyBhcnJheXMgdG8gb25lIEFycmF5XG5cbmNvbnN0IHJlZHVjZTNkYXRhID0gKGFyckIsYXJyRyxhcnJSKSA9PiB7XG5cdGxldCBvdXQgPSBbXTtcblx0bGV0IG91dGVyID0gW107XG5cdG91dGVyLnB1c2gob3V0KTtcblx0bGV0IHRtcCxzO1xuXHRmb3IobGV0IGk9MDsgaTxhcnJCLmxlbmd0aDsgaSsrKXtcblx0XHR0bXAgPSBbXTtcblx0XHR0bXAucHVzaChhcnJCW2ldKTtcblx0XHR0bXAucHVzaChhcnJHW2ldPT09MCA/IDAgOiBhcnJHW2ldICsgMyk7XG5cdFx0dG1wLnB1c2goYXJyUltpXT09PTAgPyAwIDogYXJyUltpXSArIDYpO1xuXHRcdHMgPSBuZXcgU2V0KHRtcCk7XG5cdFx0aWYgKHMuc2l6ZSA+IDEgJiYgcy5oYXMoMCkpe1xuXHRcdFx0cy5kZWxldGUoMCk7XG5cdFx0fVxuXHRcdG91dC5wdXNoKEFycmF5LmZyb20ocykpO1xuXHR9XG5cdHJldHVybiBvdXRlcjtcbn07XG5cblxuXG4vLyBSZWRyYXcgR2FtZVxuY29uc3QgcmVkcmF3ID0gKGlucHN0cmFycikgPT4ge1xuXHRsZXQgaW5wID0gW107XG5cdC8vIHBhcnNlIGlucHV0XG5cdGZvciAobGV0IGkgPSAwOyBpIDwgaW5wc3RyYXJyLmxlbmd0aDsgaSsrKXtcblx0XHRpbnAucHVzaChwYXJzZUludChpbnBzdHJhcnJbaV0pKTtcblx0fTtcblxuICAgIC8vIGluaXQgdmFsdWVzXG5cdGxldCB0ID0gMSwgLy8gY291dCB2YWx1ZVxuXHRcdGRhdGEgPSBbXSxcblx0XHRjb2wsXG5cdFx0bmV4dEV2ZW50LFxuXHRcdHRtcCA9IDA7XG5cblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBpbnAubGVuZ3RoOyBpKyspe1xuXHRcdGNvbCA9IGk7XG5cdFx0bmV4dEV2ZW50ID0gaW5wW2NvbF07XG5cdFx0aWYgKG5leHRFdmVudCA+IDApe1xuXHRcdFx0YnJlYWs7XG5cdFx0fVxuXHR9XG5cblx0Zm9yIChsZXQgayA9IDA7IGsgPCByb3dOOyBrICs9IDEpIHtcblx0XHRsZXQgcm93ID0gW107XG5cdFx0ZGF0YS5wdXNoKHJvdyk7XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBjb2xOOyBpICs9MSl7XG5cdFx0XHRpZiAodCA9PT0gIG5leHRFdmVudCl7XG5cdFx0XHRcdC8vIGp1bXAgb3ZlciAwIGNvbG9yIGVudHJpZXNcblx0XHRcdFx0dG1wID0gY29sKzE7IC8vIGJsYWNrIGhhcyBpbmRleCAwXG5cdFx0XHRcdC8vIGlmIHNvbWV0aGluZyBpcyB6ZXJvIGdvIGZ1cnRoZXJcblx0XHRcdFx0d2hpbGUgKGlucFsoY29sKzEpJWlucC5sZW5ndGhdIDwgMSl7XG5cdFx0XHRcdFx0Y29sID0gKGNvbCsxKSVpbnAubGVuZ3RoO1xuXHRcdFx0XHR9XG5cdFx0XHRcdG5leHRFdmVudCArPSBpbnBbKGNvbCsxKSVpbnAubGVuZ3RoXTtcblx0XHRcdFx0Y29sID0gKGNvbCsxKSVpbnAubGVuZ3RoOyAvLyBuZXh0IGNvbG9yXG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0bXAgPSAwO1xuXHRcdFx0fVxuXHRcdFx0Ly8ganVzdCBhcnJheVxuXHRcdFx0cm93LnB1c2godG1wKTtcblx0XHRcdC8vcm93LnB1c2goW3QsIHRtcF0pO1xuXHRcdFx0dCA9IHQgKyAxO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gZGF0YTtcbn07XG5cbi8vVE9ETyBGSVggVEFCTEVTXG5jb25zdCBoaWdobGlnaHRFbCAgPSAoZWwsY29sLHRpbWUsaG92ZXIpID0+e1xuICAgJChlbCkuYXR0ciggXCJmaWxsXCIsIGhvdmVyKTtcbiAgIHNldFRpbWVvdXQoKCkgPT4geyQoZWwpLmF0dHIoIFwiZmlsbFwiLCBjb2wpO30sdGltZSoxMDAwKTtcblxufTtcblxuLy9DSEFOR0Ugb24gVE9OIElucHV0IGlzIGFwcGxpZWRcbmNvbnN0IHJlZ2lzdGVySW5wdXRPbkNoYW5nZSA9IChyb3csc3ZnLGxvb2t1cCkgPT4ge1xuXHRsZXQgaWRzID0gW107XG5cdC8vIFRPRE8gdXNlIGFzIHBhcmFtZXRlciBsYXRlclxuXHQvLyBsZXQgcm93ID0gMTtcblx0bGV0IHM9Jyc7XG5cdGZvciAobGV0IGkgPSAxOyBpIDwgNDsgaSsrKXtcblx0XHRzID0gJyNidG4tcm93Jytyb3crJy0nK2k7XG5cdFx0aWRzLnB1c2gocyk7XG5cdH0gXG5cblx0Zm9yIChsZXQgaSBpbiBpZHMpIHtcblx0XHQkKGlkc1tpXSlcblx0XHRcdC5wYXJlbnQoKVxuXHRcdFx0LnBhcmVudCgpXG5cdFx0XHQuY2hpbGRyZW4oJ2lucHV0LmZvcm0tY29udHJvbCcpXG5cdFx0XHQuY2hhbmdlKCgpID0+IHtcblx0XHRcdFx0bGV0IG5ld2RhdGEgPSByZWRyYXcocmVhZElucHV0KHJvdykpO1xuXHRcdFx0XHR1cGRhdGVHcmFwaChuZXdkYXRhLHN2Zyxsb29rdXAsZmFsc2UpO1xuXHRcdFx0XHRsZXQgbXlkYXRhID0gcmVkcmF3KHJlYWRJbnB1dCgxKSk7XG5cdFx0XHRcdGxldCBteWRhdGFHcmVlbiA9IHJlZHJhdyhyZWFkSW5wdXQoMikpO1xuXHRcdFx0XHRsZXQgbXlkYXRhUmVkID0gcmVkcmF3KHJlYWRJbnB1dCgzKSk7XG5cdFx0XHRcdGxldCBuZXdkYXRhMiA9IHJlZHVjZTNkYXRhKG15ZGF0YVswXSxteWRhdGFHcmVlblswXSxteWRhdGFSZWRbMF0pO1xuXHRcdFx0XHR1cGRhdGVHcmFwaChuZXdkYXRhMixkMy5zZWxlY3QoJyNjaGFydC1zdW0nKSxcblx0XHRcdFx0XHRbMCwxLDIsMyw0LDUsNiw3LDgsOV0ubWFwKChpKSA9PiB0b25lc1tpXS5jb2xvciksdHJ1ZSk7XG5cdFx0XHRcdFxuXHRcdFx0fSk7XG5cdH1cbn07XG5cbi8vIFJlZ2lzdGVyIGNvdW50IEJ1dHRvblxuY29uc3QgcmVnaXN0ZXJCdXR0b24gPSAocm93KSA9PiB7XG5cdGxldCBpZHMgPSBbXTtcblx0Ly8gVE9ETyB1c2UgYXMgcGFyYW1ldGVyIGxhdGVyXG5cdC8vbGV0IHJvdyA9IDE7XG5cdGxldCBzPScnO1xuXHRmb3IgKGxldCBpID0gMTsgaSA8IDQ7IGkrKyl7XG5cdFx0cyA9ICcjYnRuLXJvdycrcm93KyctJytpO1xuXHRcdGlkcy5wdXNoKHMpO1xuXHR9IFxuXHRsZXQgZWMgPSBqUXVlcnkuRXZlbnQoICdjaGFuZ2UnICk7XG4gICAgZm9yIChsZXQgaSBpbiBpZHMpIHtcbiAgICBcdCQoaWRzW2ldKVxuXHRcdFx0LnBhcmVudCgpXG5cdFx0XHQuY2hpbGRyZW4oJ3VsLmRyb3Bkb3duLW1lbnUnKVxuXHRcdFx0Lm9uKCdjbGljaycsIChlKSA9PiB7XG5cdFx0XHRcdCQoaWRzW2ldKVxuXHRcdFx0XHQucGFyZW50KClcblx0XHRcdFx0LnBhcmVudCgpXG5cdFx0XHRcdC5jaGlsZHJlbignaW5wdXQuZm9ybS1jb250cm9sOmZpcnN0Jylcblx0XHRcdFx0LmF0dHIoJ3ZhbHVlJyxlLnRhcmdldC50ZXh0KVxuXHRcdFx0XHQvL3NlbmQgY2hhbmdlIGV2ZW50XG5cdFx0XHRcdC50cmlnZ2VyKGVjKTtcblx0XHR9KTtcdFxuICAgIH1cbn07XG5cblxuLy8gUmVnaXN0ZXIgVG9uIGJ1dHRvblxuY29uc3QgcmVnaXN0ZXJUb25CdXR0b24gPSAocm93KSA9PiB7XG5cdGxldCBpZHMgPSBbXTtcblx0Ly8gVE9ETyB1c2UgYXMgcGFyYW1ldGVyIGxhdGVyXG5cdC8vbGV0IHJvdyA9IDE7XG5cdGxldCBzPScnO1xuXG5cdGZvciAobGV0IGkgPSAxOyBpIDwgNDsgaSsrKXtcblx0XHRzID0gJyNidG4tcm93Jytyb3crJy0nK2krJy10b24nO1xuXHRcdGlkcy5wdXNoKHMpO1xuXHR9IFxuXHQvLyBsZXQgZWMgPSBqUXVlcnkuRXZlbnQoICdjaGFuZ2UnICk7XG4gICAgZm9yIChsZXQgaSBpbiBpZHMpIHtcbiAgICBcdCQoaWRzW2ldKVxuXHRcdFx0LnBhcmVudCgpXG5cdFx0XHQuY2hpbGRyZW4oJ3VsLmRyb3Bkb3duLW1lbnUnKVxuXHRcdFx0Lm9uKCdjbGljaycsIChlKSA9PiB7XG5cdFx0XHRcdCQoaWRzW2ldKVxuXHRcdFx0XHQucGFyZW50KClcblx0XHRcdFx0LnBhcmVudCgpXG5cdFx0XHRcdC5jaGlsZHJlbignaW5wdXQuZm9ybS1jb250cm9sOmVxKCAxICknKVxuXHRcdFx0XHQuYXR0cigndmFsdWUnLGUudGFyZ2V0LnRleHQpO1xuXHRcdFx0XHRcblx0XHRcdFx0Ly8gZG8gcGFyYW1ldGVyIGNoYW5nZVxuXHRcdFx0XHQvLyBpbmRleCBoYXZlIHRvIHN1cnZpdmUgOilcblx0XHRcdCAgICBsZXQgdG1wID0gcGFyc2VJbnQoZS50YXJnZXQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LmdldEF0dHJpYnV0ZSgnbnInKSk7XG5cdFx0XHRcdHRvbmVzW3RtcF0uaW5zdHJ1bWVudCA9IGUudGFyZ2V0LnRleHQ7XG5cdFx0XHRcdC8vc2VuZCBjaGFuZ2UgZXZlbnRcblx0XHRcdFx0Ly8udHJpZ2dlcihlYyk7XG5cdFx0fSk7XHRcbiAgICB9XG59O1xuXG5jb25zdCByZWdpc3RlckJsYWNrVG9uQnV0dG9uID0gKCkgPT4ge1xuXHRsZXQgaWRzID0gW107XG5cdC8vIFRPRE8gdXNlIGFzIHBhcmFtZXRlciBsYXRlclxuXHRsZXQgcm93ID0gMTtcblx0bGV0IHMgPSAnI2J0bi1yb3cxLTAtdG9uJztcblx0aWRzLnB1c2gocyk7XG5cdFxuXHQvLyBsZXQgZWMgPSBqUXVlcnkuRXZlbnQoICdjaGFuZ2UnICk7XG4gICAgZm9yIChsZXQgaSBpbiBpZHMpIHtcbiAgICBcdCQoaWRzW2ldKVxuXHRcdFx0LnBhcmVudCgpXG5cdFx0XHQuY2hpbGRyZW4oJ3VsLmRyb3Bkb3duLW1lbnUnKVxuXHRcdFx0Lm9uKCdjbGljaycsIChlKSA9PiB7XG5cdFx0XHRcdCQoaWRzW2ldKVxuXHRcdFx0XHQucGFyZW50KClcblx0XHRcdFx0LnBhcmVudCgpXG5cdFx0XHRcdC5jaGlsZHJlbignaW5wdXQuZm9ybS1jb250cm9sOmZpcnN0Jylcblx0XHRcdFx0LmF0dHIoJ3ZhbHVlJyxlLnRhcmdldC50ZXh0KTtcblxuXHRcdFx0XHR0b25lc1swXS5pbnN0cnVtZW50ID0gZS50YXJnZXQudGV4dDtcblx0XHRcdFx0XG5cdFx0XHRcdC8vIGRvIHBhcmFtZXRlciBjaGFuZ2VcblxuXHRcdFx0XHQvL3NlbmQgY2hhbmdlIGV2ZW50XG5cdFx0XHRcdC8vLnRyaWdnZXIoZWMpO1xuXHRcdH0pO1x0XG5cbiAgICB9XG59O1xuXG5cbi8vIFJlZ2lzdGVyIFZvbHVtZW4gYnV0dG9uXG5jb25zdCByZWdpc3RlclZvbHVtZUJ1dHRvbiA9IChyb3cpID0+IHtcblx0bGV0IGlkcyA9IFtdO1xuXHQvLyBUT0RPIHVzZSBhcyBwYXJhbWV0ZXIgbGF0ZXJcblx0Ly9sZXQgcm93ID0gMTtcblx0bGV0IHM9Jyc7XG5cblx0Zm9yIChsZXQgaSA9IDE7IGkgPCA0OyBpKyspe1xuXHRcdHMgPSAnI2J0bi1yb3cnK3JvdysnLScraSsnLXZvbHVtZSc7XG5cdFx0aWRzLnB1c2gocyk7XG5cdH0gXG5cdC8vIGxldCBlYyA9IGpRdWVyeS5FdmVudCggJ2NoYW5nZScgKTtcbiAgICBmb3IgKGxldCBpIGluIGlkcykge1xuICAgIFx0JChpZHNbaV0pXG5cdFx0XHQucGFyZW50KClcblx0XHRcdC5jaGlsZHJlbigndWwuZHJvcGRvd24tbWVudScpXG5cdFx0XHQub24oJ2NsaWNrJywgKGUpID0+IHtcblx0XHRcdFx0JChpZHNbaV0pXG5cdFx0XHRcdC5wYXJlbnQoKVxuXHRcdFx0XHQucGFyZW50KClcblx0XHRcdFx0LmNoaWxkcmVuKCdpbnB1dC5mb3JtLWNvbnRyb2w6ZXEoIDIgKScpXG5cdFx0XHRcdC5hdHRyKCd2YWx1ZScsZS50YXJnZXQudGV4dCk7XG5cdFx0XHRcdFxuXHRcdFx0XHQvLyBkbyBwYXJhbWV0ZXIgY2hhbmdlXG5cdFx0XHRcdC8vIGluZGV4IGhhdmUgdG8gc3Vydml2ZSA6KVxuXHRcdFx0ICAgIGxldCB0bXAgPSBwYXJzZUludChlLnRhcmdldC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQuZ2V0QXR0cmlidXRlKCducicpKTtcblxuXHRcdFx0XHR0b25lc1t0bXBdLnZvbCA9IGUudGFyZ2V0LnRleHQ7XG5cdFx0XHRcdHRvbmVzW3RtcF0uZ2FpbiA9IHBhcnNlSW50KGUudGFyZ2V0LnRleHQpKjEuMC8xMDA7XG5cdFx0XHRcdC8vc2VuZCBjaGFuZ2UgZXZlbnRcblx0XHRcdFx0Ly8udHJpZ2dlcihlYyk7XG5cdFx0fSk7XHRcbiAgICB9XG59O1xuXG5jb25zdCByZWdpc3RlckJsYWNrVm9sdW1lQnV0dG9uID0gKCkgPT4ge1xuXHRsZXQgaWRzID0gW107XG5cdC8vIFRPRE8gdXNlIGFzIHBhcmFtZXRlciBsYXRlclxuXHRsZXQgcm93ID0gMTtcblx0bGV0IHMgPSAnI2J0bi1yb3cxLTAtdm9sdW1lJztcblx0aWRzLnB1c2gocyk7XG5cdFxuXHQvLyBsZXQgZWMgPSBqUXVlcnkuRXZlbnQoICdjaGFuZ2UnICk7XG4gICAgZm9yIChsZXQgaSBpbiBpZHMpIHtcbiAgICBcdCQoaWRzW2ldKVxuXHRcdFx0LnBhcmVudCgpXG5cdFx0XHQuY2hpbGRyZW4oJ3VsLmRyb3Bkb3duLW1lbnUnKVxuXHRcdFx0Lm9uKCdjbGljaycsIChlKSA9PiB7XG5cdFx0XHRcdCQoaWRzW2ldKVxuXHRcdFx0XHQucGFyZW50KClcblx0XHRcdFx0LnBhcmVudCgpXG5cdFx0XHRcdC5jaGlsZHJlbignaW5wdXQuZm9ybS1jb250cm9sOmVxKCAxICknKVxuXHRcdFx0XHQuYXR0cigndmFsdWUnLGUudGFyZ2V0LnRleHQpO1xuXG5cdFx0XHRcdHRvbmVzWzBdLnZvbCA9IGUudGFyZ2V0LnRleHQ7XG5cdFx0XHRcdHRvbmVzWzBdLmdhaW4gPSBwYXJzZUludChlLnRhcmdldC50ZXh0KSoxLjAvMTAwO1xuXHRcdFx0XHRcblx0XHRcdFx0Ly8gZG8gcGFyYW1ldGVyIGNoYW5nZVxuXG5cdFx0XHRcdC8vc2VuZCBjaGFuZ2UgZXZlbnRcblx0XHRcdFx0Ly8udHJpZ2dlcihlYyk7XG5cdFx0fSk7XHRcblxuICAgIH1cbn07XG5cbmNvbnN0IHJlZ2lzdGVyUGxheUJ1dHRvbiA9ICgpID0+IHtcblx0JCgnI3BsYXltdXNpY2J0bicpLm9uKCdjbGljaycsIChlKSA9PiB7XG5cdFx0Ly8gaXBob25lIGhhY2tcblx0XHQvLyBpZiAoYXVkaW9Db250ZXh0ID09PSBudWxsKXtcblx0XHQvLyBcdHRyeSB7XG4gIC8vICAgXHRcdFx0d2luZG93LkF1ZGlvQ29udGV4dCA9IHdpbmRvdy5BdWRpb0NvbnRleHQgfHwgd2luZG93LndlYmtpdEF1ZGlvQ29udGV4dDtcbiAgLy8gICBcdFx0XHRhdWRpb0NvbnRleHQgPSBuZXcgd2luZG93LkF1ZGlvQ29udGV4dCgpO1xuXHRcdC8vIFx0fSBjYXRjaCAoZSkge1xuICAvLyAgIFx0XHRcdGNvbnNvbGUubG9nKFwiTm8gV2ViIEF1ZGlvIEFQSSBzdXBwb3J0XCIpO1xuXHRcdC8vIFx0fVxuXHRcdC8vIFx0bGV0IG9zY2lsbGF0b3IgPSBhdWRpb0NvbnRleHQuY3JlYXRlT3NjaWxsYXRvcigpO1xuIFx0Ly8gXHRcdFx0b3NjaWxsYXRvci5mcmVxdWVuY3kudmFsdWUgPSA0MDA7XG4gXHQvLyBcdFx0XHRvc2NpbGxhdG9yLmNvbm5lY3QoYXVkaW9Db250ZXh0LmRlc3RpbmF0aW9uKTtcbiBcdC8vIFx0XHRcdG9zY2lsbGF0b3Iuc3RhcnQoMCk7XG4gXHQvLyBcdFx0XHRvc2NpbGxhdG9yLnN0b3AoLjUpXG5cdFx0Ly8gfVxuXHRcdHJ1blNlcSA9IHRydWU7XG5cdFx0cGxheU11c2ljKCk7XG5cdFx0Ly9hbGVydCgnaGVyZScpO1xuXHR9KTtcblx0Ly8gJCgnI3BsYXltdXNpY2J0bicpLm9uKCd0b3VjaGVuZCcsIChlKSA9PiB7XG5cblx0Ly8gXHRydW5TZXEgPSB0cnVlO1xuXHQvLyBcdHBsYXlNdXNpYygpO1xuXHQvLyBcdC8vYWxlcnQoJ2hlcmUnKTtcblx0Ly8gfSk7XG59O1xuXG5jb25zdCByZWdpc3RlclN0b3BCdXR0b24gPSAoKSA9PiB7XG5cdCQoJyNzdG9wbXVzaWNidG4nKS5vbignY2xpY2snLCAoZSkgPT4ge1xuXHRcdHJ1blNlcSA9IGZhbHNlO1xuXHRcdC8vYWxlcnQoJ2hlcmUnKTtcblx0fSk7XG5cdC8vICQoJyNzdG9wbXVzaWNidG4nKS5vbigndG91Y2hlbmQnLCAoZSkgPT4ge1xuXHQvLyBcdHJ1blNlcSA9IGZhbHNlO1xuXHQvLyBcdC8vYWxlcnQoJ2hlcmUnKTtcblx0Ly8gfSk7XG59O1xuXG4vLyBjb25zdCByZWdpc3RlclBhcmFtZXRlckJ1dHRvbiA9ICgpID0+IHtcbi8vIFx0JCgnI3BhcmFtZXRlcmJ0bicpLm9uKCdjbGljaycsIChlKSA9PiB7XG4vLyBcdFx0bGV0IGVsID0gZDMuc2VsZWN0QWxsKCdyZWN0JylbMF1bNF07XG4vLyBcdFx0bGV0IHRpbWUgPSAwLjk7XG4vLyBcdFx0aGlnaGxpZ2h0RWwoZWwsMCx0aW1lKTtcbi8vIFx0fSk7XG4vLyB9O1xuXG5cbi8vIFBhcmFtZXRlciB3ZXJ0ZSBlaW5sZXNlblxuLy8gJCgnI3BhcmFPc3pidG4nKS5vbignY2xpY2snLCAoZSkgPT4ge1xuLy8gXHRsZXQgczIgPSAkKCdpbnB1dFtuYW1lPXNwZWVkXTpjaGVja2VkJywgJyNwYXJhbWV0ZXJNb2RhbCcpLnZhbCgpO1xuLy8gXHRsZXQgcyA9ICQoJ2lucHV0W25hbWU9b3N6Zm9ybV06Y2hlY2tlZCcsICcjcGFyYW1ldGVyTW9kYWwnKS52YWwoKTtcbi8vIFx0Ly9pZiAoISB0eXBlb2YgcyA9PT0gXCJ1bmRlZmluZWRcIiAmJiAhIHR5cGVvZiBzMiAgPT09IFwidW5kZWZpbmVkXCIpe1xuLy8gXHRpZiAoISBmYWxzZSl7XG4vLyBcdFx0b3NjaWxsYXRvclR5cGUgPSBzO1xuLy8gXHRcdHNvdW5kU3BlZWQgPSBwYXJzZUZsb2F0KHMyKTtcbi8vIFx0XHQkKCcjcGFyYW1ldGVyTW9kYWwnKS5tb2RhbCgnaGlkZScpO1xuLy8gXHR9XG4vLyB9KTtcblxuXG5cbi8vIFNvdW5kIERlZmluaXRpb25cblxuXG5jb25zdCBwbGF5U291bmQgPSAoc3RhcnRUaW1lLCBwaXRjaE5yLCBkdXJhdGlvbiwgZ2Fpbk9sZCkgPT4ge1xuXHQvL2xldCBzdGFydFRpbWUgPSBhdWRpb0NvbnRleHQuY3VycmVudFRpbWUgKyBkZWxheTtcbiAgXHRsZXQgZW5kVGltZSA9IHN0YXJ0VGltZSArIGR1cmF0aW9uO1xuICBcdC8vbGV0IHBpdGNoID0gdG9uZXNbcGl0Y2hOcl0uaW5zdHJ1bWVudDsgXG5cblxuXG5cblxuICBcdGxldCBnYWluID0gdG9uZXNbcGl0Y2hOcl0uZ2FpbjtcblxuICBcdGxldCBvdXRnYWluID0gYXVkaW9Db250ZXh0LmNyZWF0ZUdhaW4oKTtcbiAgXHRvdXRnYWluLmdhaW4udmFsdWUgPSBnYWluO1xuICBcdG91dGdhaW4uY29ubmVjdChhdWRpb0NvbnRleHQuZGVzdGluYXRpb24pOyBcdFxuXG4gIFx0bGV0IGVudmVsb3BlID0gYXVkaW9Db250ZXh0LmNyZWF0ZUdhaW4oKTtcbiAgXHRlbnZlbG9wZS5jb25uZWN0KG91dGdhaW4pO1xuICBcdGVudmVsb3BlLmdhaW4udmFsdWUgPSAwO1xuICBcdFxuICBcdGVudmVsb3BlLmdhaW4uc2V0VGFyZ2V0QXRUaW1lKDEsIHN0YXJ0VGltZSwgZW52ZWxvcGVTdGFydEVuZFRpbWVbMF0pO1xuICBcdGVudmVsb3BlLmdhaW4uc2V0VGFyZ2V0QXRUaW1lKDAsIGVuZFRpbWUsIGVudmVsb3BlU3RhcnRFbmRUaW1lWzFdKTtcblxuICBcdGxldCBvc2NpbGxhdG9yID0gYXVkaW9Db250ZXh0LmNyZWF0ZU9zY2lsbGF0b3IoKTtcbiAgXHRvc2NpbGxhdG9yLmNvbm5lY3QoZW52ZWxvcGUpO1xuXG4gIFx0b3NjaWxsYXRvci50eXBlID0gb3NjaWxsYXRvclR5cGU7XG4gIFx0b3NjaWxsYXRvci5kZXR1bmUudmFsdWUgPSBub3Rlc1t0b25lc1twaXRjaE5yXS5pbnN0cnVtZW50XS5kZXR1bmU7XG4gIFx0b3NjaWxsYXRvci5mcmVxdWVuY3kudmFsdWUgPSAyNDA7XG5cblx0bGV0IHZpYnJhdG8gPSBhdWRpb0NvbnRleHQuY3JlYXRlR2FpbigpO1xuXHR2aWJyYXRvLmdhaW4udmFsdWUgPSB2aWJyYXRvZ2Fpbjtcblx0dmlicmF0by5jb25uZWN0KG9zY2lsbGF0b3IuZGV0dW5lKTtcblxuXHRsZXQgbGZvID0gYXVkaW9Db250ZXh0LmNyZWF0ZU9zY2lsbGF0b3IoKTtcblx0bGZvLmNvbm5lY3QodmlicmF0byk7XG5cdGxmby5mcmVxdWVuY3kudmFsdWUgPWxmb2ZyZXE7IFxuXG5cdG9zY2lsbGF0b3Iuc3RhcnQoc3RhcnRUaW1lKTtcbiAgXHRsZm8uc3RhcnQoc3RhcnRUaW1lKTtcbiAgXHRvc2NpbGxhdG9yLnN0b3AoZW5kVGltZSArMiApO1xuICBcdGxmby5zdG9wKGVuZFRpbWUgKzIpO1xuXG59O1xuXG4vLy8gUGxheSBMb29wXG5jb25zdCBydW5TZXF1ZW5jZXJzID0gKCkgPT4ge1xuXHRpZiAoIXJ1blNlcSB8fCBzb3VuZFF1ZXVlLmxlbmd0aCA9PT0gMCl7Y29uc29sZS5sb2coXCJzdG9wXCIpO3JldHVybjt9XG5cdGxldCBjdCA9IGF1ZGlvQ29udGV4dC5jdXJyZW50VGltZTtcblx0d2hpbGUgKHNvdW5kUXVldWUubGVuZ3RoPjAgJiYgc291bmRRdWV1ZVswXVswXTwgY3QrMC4xNSl7XG5cdFx0Ly9jb25zb2xlLmxvZygnY3Q6JytjdCsncGxhbmVkIHRpbWU6Jytzb3VuZFF1ZXVlWzBdWzBdKTtcblx0XHRsZXQgaXRlbSA9IHNvdW5kUXVldWUuc3BsaWNlKDAsMSk7XG5cdFx0Ly8gcGxheXNvdW5kIChzdGFydHRpbWUsIHBpdGNoLCBkdXJhdGlvbiwgICAgICAgICAgICAgZ2FpaW4pXG5cdFx0Ly9wbGF5U291bmQoaXRlbVswXVswXSxzb3VuZHNbaXRlbVswXVsxXV1bMF0saXRlbVswXVsyXSx0b25lc1tpdGVtWzBdWzFdXS5nYWluKTtcdFx0XG5cdFxuXHRcdHBsYXlTb3VuZChpdGVtWzBdWzBdLGl0ZW1bMF1bMV0saXRlbVswXVsyXSx0b25lc1tpdGVtWzBdWzFdXS5nYWluKTtcdFx0XG5cdFx0Ly8gZWxlbWVudCAgICAgICAgICAgICAgY29sb3IgICAgICAgZHVyYXRpb24gICAgICAgICAgICAgICAgIGhvdmVyY29sb3Jcblx0XHRoaWdobGlnaHRFbChpdGVtWzBdWzNdLHRvbmVzW2l0ZW1bMF1bMV1dLmNvbG9yLGl0ZW1bMF1bMl0sdG9uZXNbaXRlbVswXVsxXV0uaG92ZXIpO1xuXHR9XG5cdHNldFRpbWVvdXQocnVuU2VxdWVuY2Vycyw5MCk7XG59XG5cbi8vLyBzb3VuZHMgc3RhcnQgaGVyZVxuLy8vIFNvdW5kIHZhclxubGV0IHJ1blNlcSA9IHRydWU7XG5sZXQgc291bmRRdWV1ZSA9IFtdO1xuXG52YXIgYXVkaW9Db250ZXh0ID0gbnVsbDtcblxudHJ5IHtcbiAgIHdpbmRvdy5BdWRpb0NvbnRleHQgPSB3aW5kb3cuQXVkaW9Db250ZXh0fHx3aW5kb3cud2Via2l0QXVkaW9Db250ZXh0O1xuICAgdmFyIGF1ZGlvQ29udGV4dCA9IG5ldyBBdWRpb0NvbnRleHQoKTtcbn0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLmxvZyhcIk5vIFdlYiBBdWRpbyBBUEkgc3VwcG9ydFwiKTtcbn1cblxuXG4vL0lPUyBTdGFydCBJT1NIQUNLXG4kKCdib2R5Jykub24oJ3RvdWNoZW5kJywgKGUpID0+IHtcblx0Ly9hbGVydCgnc3RhcnQgc291bmRcblx0Ly8gY3JlYXRlIGVtcHR5IGJ1ZmZlclxuXHR2YXIgYnVmZmVyID0gYXVkaW9Db250ZXh0LmNyZWF0ZUJ1ZmZlcigxLCAxLCAyMjA1MCk7XG5cdHZhciBzb3VyY2UgPSBhdWRpb0NvbnRleHQuY3JlYXRlQnVmZmVyU291cmNlKCk7XG5cdHNvdXJjZS5idWZmZXIgPSBidWZmZXI7XG5cblx0Ly8gY29ubmVjdCB0byBvdXRwdXQgKHlvdXIgc3BlYWtlcnMpXG5cdHNvdXJjZS5jb25uZWN0KGF1ZGlvQ29udGV4dC5kZXN0aW5hdGlvbik7XG5cblx0Ly8gcGxheSB0aGUgZmlsZVxuXHRpZiAodHlwZW9mIHNvdXJjZS5ub3RlT24gIT09ICd1bmRlZmluZWQnKXtcblx0XHRzb3VyY2Uubm90ZU9uKDApO1xuXHR9XG5cdFxuXHQvLyB2YXIgc3JjID0gbnVsbDtcblx0Ly8gc3JjID0gYXVkaW9Db250ZXh0LmNyZWF0ZU9zY2lsbGF0b3IoKTtcblx0Ly8gc3JjLnR5cGUgPSAnc3F1YXJlJztcblx0Ly8gc3JjLmZyZXF1ZW5jeS52YWx1ZSA9IDQ0MDtcblx0Ly8gc3JjLmNvbm5lY3QoYXVkaW9Db250ZXh0LmRlc3RpbmF0aW9uKTtcblx0Ly8gbGV0IGN0ID0gYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lO1xuXHQvLyBzcmMuc3RhcnQoY3QrMC41KTtcblx0Ly8gc3JjLnN0b3AoY3QrMS4yKTtcbn0pO1xuLy9JT1MgRU5EXG5cblxuLy8gU291bmQgY29uc3RhbnN0cyBwcmVzZXRzXG5sZXQgdG9uZXMgPSBbe1xuXHQnbnInOjAsXG5cdCdnYWluJzowLjEsXG5cdCd2b2wnOicxMCUnLFxuICAgICdjb2xvcic6JyM3NTc1NzUnLFxuXHQnaG92ZXInOicjMDAwMDAwJyxcblx0J2luc3RydW1lbnQnOidEMycsXG5cdCdpZCc6J2lnLXJvdzEtMCcsXG5cdCd2aXNpYmxlJzp0cnVlXG59LFxuXG57XG5cdCducic6MSxcblx0J2dhaW4nOjAuOCxcblx0J3ZvbCc6JzgwJScsXG5cdCdjb2xvcic6JyMyOTZFQUEnLFxuXHQnaG92ZXInOicjMDk0RThBJyxcblx0J2luc3RydW1lbnQnOidFMycsXG5cdCdpZCc6J2lnLXJvdzEtMScsXG5cdCd2aXNpYmxlJzp0cnVlXG59LFxue1xuXHQnbnInOjIsXG5cdCdnYWluJzowLjAsXG5cdCd2b2wnOicwJScsXG5cdCdjb2xvcic6JyM1NDkxQjUnLFxuXHQnaG92ZXInOicjMzQ2MTc1Jyxcblx0J2luc3RydW1lbnQnOidGMycsXG5cdCdpZCc6J2lnLXJvdzEtMicsXG5cdCd2aXNpYmxlJzpmYWxzZVxufSxcbntcblx0J25yJzozLFxuXHQnZ2Fpbic6MC4wLFxuXHQndm9sJzonMCUnLFxuXHQnY29sb3InOicjNzlCRUZBJyxcblx0J2hvdmVyJzonIzU5OUVCQScsXG5cdCdpbnN0cnVtZW50JzonRzMnLFxuXHQnaWQnOidpZy1yb3cxLTMnLFxuXHQndmlzaWJsZSc6ZmFsc2Vcbn0sXG5cbntcblx0J25yJzo0LFxuXHQnZ2Fpbic6MC41LFxuXHQndm9sJzonNTAlJyxcblx0J2NvbG9yJzonIzRCQTg0QicsXG5cdCdob3Zlcic6JyMyQjg4MkInLFxuXHQnaW5zdHJ1bWVudCc6J0E0Jyxcblx0J2lkJzonaWctcm93Mi0xJyxcblx0J3Zpc2libGUnOnRydWVcbn0sXG57XG5cdCducic6NSxcblx0J2dhaW4nOjAuMCxcblx0J3ZvbCc6JzAlJyxcblx0J2NvbG9yJzonIzU0NzI0OScsXG5cdCdob3Zlcic6JyMyNDUyMTknLFxuXHQnaW5zdHJ1bWVudCc6J0I0Jyxcblx0J2lkJzonaWctcm93Mi0yJyxcblx0J3Zpc2libGUnOmZhbHNlXG59LFxue1xuXHQnbnInOjYsXG5cdCdnYWluJzowLjAsXG5cdCd2b2wnOicwJScsXG5cdCdjb2xvcic6JyMxRjYyNDEnLFxuXHQnaG92ZXInOicjMUY2MjQxJyxcblx0J2luc3RydW1lbnQnOidDNCcsXG5cdCdpZCc6J2lnLXJvdzItMycsXG5cdCd2aXNpYmxlJzpmYWxzZVxufSxcbntcblx0J25yJzo3LFxuXHQnZ2Fpbic6MC4zLFxuXHQndm9sJzonMzAlJyxcblx0J2NvbG9yJzonI0RCMzgzMycsXG5cdCdob3Zlcic6JyNBQjE4MTMnLFxuXHQnaW5zdHJ1bWVudCc6J0Q0Jyxcblx0J2lkJzonaWctcm93My0xJyxcblx0J3Zpc2libGUnOnRydWVcbn0sXG57XG5cdCducic6OCxcblx0J2dhaW4nOjAuMCxcblx0J3ZvbCc6JzAlJyxcblx0J2NvbG9yJzonI0IzMEIwQicsXG5cdCdob3Zlcic6JyM1MzBCMEInLFxuXHQnaW5zdHJ1bWVudCc6J0U0Jyxcblx0J2lkJzonaWctcm93My0yJyxcblx0J3Zpc2libGUnOmZhbHNlXG59LFxue1xuXHQnbnInOjksXG5cdCdnYWluJzowLjAsXG5cdCd2b2wnOicwJScsXG5cdCdjb2xvcic6JyNBMTEyM0YnLFxuXHQnaG92ZXInOicjNTEwMjFGJyxcblx0J2luc3RydW1lbnQnOidGNCcsXG5cdCdpZCc6J2lnLXJvdzMtMycsXG5cdCd2aXNpYmxlJzpmYWxzZVxufV07XG5cbi8vIHNvdW5kc1xubGV0IG5vdGVzID0ge1xuXHQnRDMnOiB7XG5cdFx0J2ZyZXEnOiA0NDAsXG5cdFx0J2RldHVuZSc6IC03MDBcblx0fSxcblx0J0UzJzoge1xuXHRcdCdmcmVxJzogNDQwLFxuXHRcdCdkZXR1bmUnOiAtNTAwXG5cdH0sIFxuXHQnRjMnOiB7XG5cdFx0J2ZyZXEnOiA0NDAsXG5cdFx0J2RldHVuZSc6IC00MDBcblx0fSxcblx0J0czJzoge1xuXHRcdCdmcmVxJzogNDQwLFxuXHRcdCdkZXR1bmUnOiAtMjAwXG5cdH0sXG5cdCdBNCc6IHtcblx0XHQnZnJlcSc6IDQ0MCxcblx0XHQnZGV0dW5lJzogMFxuXHR9LFxuXHQnQjQnOiB7XG5cdFx0J2ZyZXEnOiA0NDAsXG5cdFx0J2RldHVuZSc6IDIwMFxuXHR9LFxuXHQnQzQnOiB7XG5cdFx0J2ZyZXEnOiA0NDAsXG5cdFx0J2RldHVuZSc6IDMwMFxuXHR9LFxuXHQnRDQnOiB7XG5cdFx0J2ZyZXEnOiA0NDAsXG5cdFx0J2RldHVuZSc6IDUwMFxuXHR9LFxuXHQnRTQnOiB7XG5cdFx0J2ZyZXEnOiA0NDAsXG5cdFx0J2RldHVuZSc6IDcwMFxuXHR9LFxuXHQnRjQnOiB7XG5cdFx0J2ZyZXEnOiA0NDAsXG5cdFx0J2RldHVuZSc6IDgwMFxuXHR9LFxuXHQnRzQnOiB7XG5cdFx0J2ZyZXEnOiA0NDAsXG5cdFx0J2RldHVuZSc6IDEwMDBcblx0fVxufTtcblxuXG5cbmxldCBzb3VuZFNwZWVkID0gMC41O1xubGV0IHRvbmVkdXJhdGlvbiA9IDAuMztcbmxldCB2aWJyYXRvZ2FpbiA9IDAuMztcbmxldCBlbnZlbG9wZVN0YXJ0RW5kVGltZSA9IFswLjAxLDAuMV07XG5sZXQgbGZvZnJlcSA9IDY7ICAvLzVcbi8vIFBhcmFtZXRyaXphdGlvbiBvZiB0aGUgNSB0b25lcyAgUGl0Y2ggZHVyYXRpb24gdm9sdW1lIGdhaW5cbi8vIERlYnJpY2F0ZWQgdG8gYmUgcmVtb3ZlZFxuLy8gZmlyc3QgaXN0IGJsYWNrIHNvdW5kXG5jb25zdCBzb3VuZHMgPSBbWy0xMCwgMC41LDAuMV0sWzMsIDAuNSwwLjldLFsxMCwgMC41LDAuOV0sWzE1LCAwLjUsMC45XSxbMCwgMC41LDAuOV1dO1xubGV0IG9zY2lsbGF0b3JUeXBlID0gJ3Nhd3Rvb3RoJzsgLy8nc2luZSc7IC8vICdzYXd0b290aCdcblxuLy8vIE5hdmlnYXRpb25cblxuY29uc3QgZGlzcE5hdkVsZW1lbnRzID0gKG9iaikgPT4ge1xuXHRvYmoubWFwKChvKSA9PiB7XG5cdFx0aWYgKG8udmlzaWJsZSl7XG5cdFx0XHQkKCcjJytvLmlkKS5zaG93KCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGxldCBlbD0kKCcjJytvLmlkKTtcblx0XHRcdGVsLmhpZGUoKTtcblx0XHRcdGVsLmNoaWxkcmVuKCdpbnB1dCcpWzBdLnZhbHVlPScwJztcblx0XHRcdC8vY29uc29sZS5sb2coZWwuY2hpbGRyZW4oJ2lucHV0JylbMF0udmFsdWUpO1xuXHRcdH1cblx0fSk7XG59O1xuXG4vLy8gU291bmQgTWV0aG9kc1xuY29uc3QgcGxheU11c2ljID0gKCkgPT4ge1xuXHQvLyBmaWxsIHNvdW5kUXVldWVcdFxuXHRsZXQgajtcblx0bGV0IHJlY3RhcnIgPSBkMy5zZWxlY3QoJyNjaGFydC1zdW0nKS5zZWxlY3QoJ2cnKS5zZWxlY3RBbGwoJ2cnKS5kYXRhKCk7XG5cdGxldCBlbGFyciA9IGQzLnNlbGVjdCgnI2NoYXJ0LXN1bScpLnNlbGVjdCgnZycpLnNlbGVjdEFsbCgnZycpWzBdO1xuICAgIGxldCBzdGFydFRpbWUgPSBhdWRpb0NvbnRleHQuY3VycmVudFRpbWU7XG4gICAgLy9jb25zb2xlLmxvZygnU3RhcnQnK3N0YXJ0VGltZSk7XG4gICAgc291bmRRdWV1ZSA9W107XG5cdGZvciAobGV0IGk9MDsgaSA8IHJlY3RhcnIubGVuZ3RoOyBpKyspIHtcblx0XHRsZXQgdiA9IHJlY3RhcnJbaV07XG5cdFx0XHRmb3IgKGo9MDtqPHYubGVuZ3RoO2orKyl7XG5cdFx0XHRcdC8vcGxheVNvdW5kKGksc291bmRzW3ZdWzBdLHNvdW5kc1t2XVsxXSxzb3VuZHNbdl1bMl0pO1xuXHRcdFx0XHQvL2FsZXJ0KGkpO1xuXHRcdFx0XHRsZXQgdG1wID0gW107XG5cdFx0XHRcdHRtcC5wdXNoKGkqc291bmRTcGVlZCtzdGFydFRpbWUraiowLjAwMDEpO1xuXHRcdFx0XHR0bXAucHVzaCh2W2pdKTtcblx0XHRcdFx0dG1wLnB1c2godG9uZWR1cmF0aW9uKTtcblx0XHRcdFx0dG1wLnB1c2goZDMuc2VsZWN0KGVsYXJyW2ldKS5zZWxlY3RBbGwoJ3JlY3QnKVtqXSk7XG5cdFx0XHRcdHNvdW5kUXVldWUucHVzaCh0bXApO1xuXG5cdFx0XHR9XG5cdFx0XG5cdH1cblx0Ly9jb25zb2xlLmxvZygnc3RhcnRzZXF1ZW5jZXInK2F1ZGlvQ29udGV4dC5jdXJyZW50VGltZSk7XG4gICAgcnVuU2VxdWVuY2VycygpO1xufTtcblxuLy8gSW5pdCBTY3JlZW5cbmNvbnN0IGluaXRkM2pzID0gKGVsSWQpID0+IHtcblx0Y29uc3Qgd2lkdGggPSAxMjgwLFxuICAgIGhlaWdodCA9IDQ1O1xuICAgIGxldCBzcl92aWV3cG9ydCA9ICcwIDAgJysod2lkdGgrNzApKycgJytoZWlnaHQ7XG4gICAgY29uc3QgZGl2ID0gZDMuc2VsZWN0KGVsSWQpLFxuXHRzdmcgPSBkaXYuYXBwZW5kKCdzdmcnKVxuICAgICAgICAuYXR0cignd2lkdGgnLCB3aWR0aClcbiAgICAgICAgLmF0dHIoJ2hlaWdodCcsIGhlaWdodClcbiAgICAgICAgLmF0dHIoJ3ZpZXdCb3gnLCBzcl92aWV3cG9ydClcbiAgICAgICAgLmF0dHIoJ3ByZXNlcnZlQXNwZWN0UmF0aW8nLCAneE1pZFlNaWQgbWVldCcpO1xuXG4gICAgcmV0dXJuIHN2Zztcbn07XG5cblxuICAgIC8vIENvbnN0YW50c1xuXG4gICAgY29uc3QgcncgPSAyMCxcbiAgICByaCA9IDIwLFxuICAgIHJvd04gPTEsXG4gICAgY29sTiA9NDg7XG4gICAgLy8gaGxvb2t1cCA9IFsnIzAwMDAwMCcsJyMwOTRFOEEnLCcjMDk0RThBJywnIzA5NEU4QSddO1xuICAgIFxuXG4gICAgLy8gY29uZmlndXJlIGRpc3BsYXlcbiAgICBkaXNwTmF2RWxlbWVudHModG9uZXMpO1xuXG4gICAgLy8gYmluZCBkYXRhIGFuZCByZW5kZXIgZDNqc1xuICAgIGNvbnN0IHN2ZyA9IGluaXRkM2pzKCcjY2hhcnQnKTtcbiAgICBsZXQgbG9va3VwYmx1ZSA9IFswLDEsMiwzXS5tYXAoKGkpID0+IHRvbmVzW2ldLmNvbG9yKTsgICBcbiAgICBsZXQgbXlkYXRhID0gcmVkcmF3KHJlYWRJbnB1dCgxKSk7XG5cdHJlbmRlckdyYXBoKG15ZGF0YSxzdmcsbG9va3VwYmx1ZSxmYWxzZSk7XG5cbiAgICBjb25zdCBzdmdncmVlbiA9IGluaXRkM2pzKCcjY2hhcnQtMicpO1xuICAgIGxldCBsb29rdXBncmVlbiA9IFswLDQsNSw2XS5tYXAoKGkpID0+IHRvbmVzW2ldLmNvbG9yKTsgXG4gICAgbGV0IG15ZGF0YUdyZWVuID0gcmVkcmF3KHJlYWRJbnB1dCgyKSk7XG5cdHJlbmRlckdyYXBoKG15ZGF0YUdyZWVuLHN2Z2dyZWVuLGxvb2t1cGdyZWVuLGZhbHNlKTtcblxuICAgIGNvbnN0IHN2Z3JlZCA9IGluaXRkM2pzKCcjY2hhcnQtMycpO1xuICAgIGxldCBsb29rdXByZWQgPSBbMCw3LDgsOV0ubWFwKChpKSA9PiB0b25lc1tpXS5jb2xvcik7IFxuICAgIGxldCBteWRhdGFSZWQgPSByZWRyYXcocmVhZElucHV0KDMpKTtcblx0cmVuZGVyR3JhcGgobXlkYXRhUmVkLHN2Z3JlZCxsb29rdXByZWQsZmFsc2UpO1x0XG5cblx0Ly8gc3VtICB0aGUgZGF0YSAgXG5cdGNvbnN0IHN2Z3N1bSA9IGluaXRkM2pzKCcjY2hhcnQtc3VtJyk7XG5cdGxldCBsb29rdXBhbGwgPSBbMCwxLDIsMyw0LDUsNiw3LDgsOV0ubWFwKChpKSA9PiB0b25lc1tpXS5jb2xvcik7IFxuXHRsZXQgbXlkYXRhc3VtID0gcmVkdWNlM2RhdGEobXlkYXRhWzBdLG15ZGF0YUdyZWVuWzBdLG15ZGF0YVJlZFswXSk7XG5cdHJlbmRlckdyYXBoKG15ZGF0YXN1bSxzdmdzdW0sbG9va3VwYWxsLHRydWUpO1xuXG5cdC8vIHJlc3BvbnNpdmUgY2hhbmdlXG4gICAgZDMuc2VsZWN0KHdpbmRvdylcbiAgICBcdC5vbigncmVzaXplJywgKCkgPT4ge1xuXHRcdCAgICAvL2xldCB0YXJnZXRXaWR0aCA9IHN2Zy5ub2RlKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGg7XG5cdFx0ICAgIGxldCB3aW5XaWR0aCA9ICQod2luZG93KS53aWR0aCgpO1xuXHRcdCAgICBzdmcuYXR0cihcIndpZHRoXCIsIHdpbldpZHRoKTtcblx0XHQgICAgc3ZnZ3JlZW4uYXR0cihcIndpZHRoXCIsIHdpbldpZHRoKTtcblx0XHQgICAgc3ZncmVkLmF0dHIoXCJ3aWR0aFwiLCB3aW5XaWR0aCk7XG5cdFx0ICAgIHN2Z3N1bS5hdHRyKFwid2lkdGhcIiwgd2luV2lkdGgpO1xuICBcdFx0fSk7XG4gICAgLy9UcmlnZXIgcmVzaXplIEV2ZW50XG4gIFx0bGV0IHRtcHcgPSAkKHdpbmRvdykud2lkdGgoKTtcblx0c3ZnLmF0dHIoJ3dpZHRoJywgdG1wdyk7XG5cdHN2Z2dyZWVuLmF0dHIoJ3dpZHRoJywgdG1wdyk7XG5cdHN2Z3JlZC5hdHRyKCd3aWR0aCcsIHRtcHcpO1xuXHRzdmdzdW0uYXR0cihcIndpZHRoXCIsIHRtcHcpO1xuXG5cdFxuXG5cdC8vIGxldCBzdmd0ZXN0ID0gaW5pdGQzanMoJyNjaGFydC10ZXN0Jyk7XG5cdC8vIGxldCBteWRhdGF0ZXN0ID0gW1tbMSwyLDNdLFswLDQsNV0sWzEsNF0sWzQsOV0sWzEsNCw3XSxbMF0sWzBdLFswXSxbMF0sWzBdLFswXSxbMF0sWzBdLFswXSxbMF1dXTtcblx0Ly8gcmVuZGVyR3JhcGgobXlkYXRhdGVzdCxzdmd0ZXN0LGxvb2t1cGFsbCk7XG5cblx0Ly8gUmVnaXN0ZXIgQnV0dG9uc1xuXHQvLyBibGFja2J1dHRvbiBvbmx5IG9uZSByZWdpc3RyYXRpb25cblx0cmVnaXN0ZXJCbGFja1ZvbHVtZUJ1dHRvbigpO1xuXHRyZWdpc3RlckJsYWNrVG9uQnV0dG9uKCk7XG5cblx0Ly8gUmVnaXN0ZXIgMyByb3dzIFYgQnV0dG9uXG5cdC8vIFRPRE8gQ2hlY2sgUkVnaXN0ZXIgQnV0dG9uXG5cdFsxLDIsM10ubWFwKHJlZ2lzdGVyQnV0dG9uKTtcblx0WzEsMiwzXS5tYXAocmVnaXN0ZXJUb25CdXR0b24pO1xuXHRbMSwyLDNdLm1hcChyZWdpc3RlclZvbHVtZUJ1dHRvbik7XG5cblx0cmVnaXN0ZXJJbnB1dE9uQ2hhbmdlKDEsc3ZnLGxvb2t1cGJsdWUpO1xuXHRyZWdpc3RlcklucHV0T25DaGFuZ2UoMixzdmdncmVlbixsb29rdXBncmVlbik7XG5cdHJlZ2lzdGVySW5wdXRPbkNoYW5nZSgzLHN2Z3JlZCxsb29rdXByZWQpO1xuXG5cblx0cmVnaXN0ZXJQbGF5QnV0dG9uKCk7XG5cdHJlZ2lzdGVyU3RvcEJ1dHRvbigpO1xuXHQvL3JlZ2lzdGVyUGFyYW1ldGVyQnV0dG9uKCk7XG5cbi8vaW9zIGhhY2tcbi8vIFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgZnVuY3Rpb24oKSB7XG5cbi8vIFx0Ly8gY3JlYXRlIGVtcHR5IGJ1ZmZlclxuLy8gXHR2YXIgYnVmZmVyID0gYXVkaW9Db250ZXh0LmNyZWF0ZUJ1ZmZlcigxLCAxLCAyMjA1MCk7XG4vLyBcdHZhciBzb3VyY2UgPSBhdWRpb0NvbnRleHQuY3JlYXRlQnVmZmVyU291cmNlKCk7XG4vLyBcdHNvdXJjZS5idWZmZXIgPSBidWZmZXI7XG5cbi8vIFx0Ly8gY29ubmVjdCB0byBvdXRwdXQgKHlvdXIgc3BlYWtlcnMpXG4vLyBcdHNvdXJjZS5jb25uZWN0KGF1ZGlvQ29udGV4dC5kZXN0aW5hdGlvbik7XG5cbi8vIFx0Ly8gcGxheSB0aGUgZmlsZVxuLy8gXHRzb3VyY2Uubm90ZU9uKDApO1xuXG4vLyB9LCBmYWxzZSk7XG5cblxuXG4vLyB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoc3RhcnRcIiwgZnVuY3Rpb24gKCl7XHRcbi8vIFx0XHRpZiAoaGFkX3RvdWNoKVx0XHRyZXR1cm47XHRcdFxuLy8gXHRcdC8vIHBsYXkgZW1wdHkgYnVmZmVyIHRvIHVubXV0ZSBhdWRpb1x0XG4vLyBcdFx0dmFyIGJ1ZmZlciA9IGF1ZGlvQ29udGV4dC5jcmVhdGVCdWZmZXIoMSwgMSwgMjIwNTApO1x0XG4vLyBcdFx0dmFyIHNvdXJjZSA9IGF1ZGlvQ29udGV4dC5jcmVhdGVCdWZmZXJTb3VyY2UoKTtcdFxuLy8gXHRcdHNvdXJjZS5idWZmZXIgPSBidWZmZXI7XHRcbi8vIFx0XHRzb3VyY2UuY29ubmVjdChhdWRpb0NvbnRleHQuZGVzdGluYXRpb24pO1x0XG4vLyBcdFx0c291cmNlLnN0YXJ0KDApO1x0XG4vLyBcdFx0aGFkX3RvdWNoID0gdHJ1ZTtcbi8vIFx0XHRhbGVydChcIm1pc3RcIik7XG4vLyBcdH0pO1xuXG5cblxuXG5cbn0pO1xuXG5cblxuIl19
