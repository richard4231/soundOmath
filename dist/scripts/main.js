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
		var s = '';

		for (var i = 1; i < 4; i++) {
			s = '#btn-row' + row + '-' + i + '-ton';
			ids.push(s);
		}
		for (var i in ids) {
			$(ids[i]).parent().children('ul.dropdown-menu').on('click', function (e) {
				// index have to survive :)
				var nr = parseInt(e.target.parentElement.parentElement.getAttribute('nr'));
				tones[nr].instrument = e.target.text;
				updateInput(tones, nr);
			});
		}
	};
	//Register first Black Button
	var registerBlackTonButton = function registerBlackTonButton() {
		var ids = [];
		var row = 1;
		var s = '#btn-row1-0-ton';
		ids.push(s);
		for (var i in ids) {
			$(ids[i]).parent().children('ul.dropdown-menu').on('click', function (e) {
				tones[0].instrument = e.target.text;
				updateInput(tones, 0);
			});
		}
	};
	// Register Volumen button
	var registerVolumeButton = function registerVolumeButton(row) {
		var ids = [];
		var s = '';
		for (var i = 1; i < 4; i++) {
			s = '#btn-row' + row + '-' + i + '-volume';
			ids.push(s);
		}
		var ec = jQuery.Event('change');
		for (var i in ids) {
			$(ids[i]).parent().children('ul.dropdown-menu').on('click', function (e) {
				var nr = parseInt(e.target.parentElement.parentElement.getAttribute('nr'));
				tones[nr].vol = e.target.text;
				tones[nr].gain = parseInt(e.target.text) * 1.0 / 100;
				updateInput(tones, nr);
			});
		}
	};
	// Register First Gray Button
	var registerBlackVolumeButton = function registerBlackVolumeButton() {
		var ids = [];
		var row = 1;
		var s = '#btn-row1-0-volume';
		ids.push(s);
		for (var i in ids) {
			$(ids[i]).parent().children('ul.dropdown-menu').on('click', function (e) {
				tones[0].vol = e.target.text;
				tones[0].gain = parseInt(e.target.text) * 1.0 / 100;
				updateInput(tones, 0);
			});
		}
	};
	var updateInput = function updateInput(obj, nr) {
		var iel = $('#' + obj[nr].id).children('input');
		if (nr > 0) {
			iel[1].value = obj[nr].instrument;
			iel[2].value = obj[nr].vol;
		} else {
			iel[0].value = obj[nr].instrument;
			iel[1].value = obj[nr].vol;
		}
	};
	var syncFormDisplay = function syncFormDisplay(obj) {
		for (var i = 0; i < obj.length; i++) {
			updateInput(obj, i);
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

		var src = null;
		src = audioContext.createOscillator();
		src.type = 'square';
		src.frequency.value = 440;
		src.connect(audioContext.destination);
		var ct = audioContext.currentTime;
		src.start(ct + 0.5);
		src.stop(ct + 0.9);
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
				tmp.push(d3.select(elarr[i]).selectAll('rect')[0][j]);
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
	syncFormDisplay(tones);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvc2NyaXB0cy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxFQUFFLFFBQUYsRUFBWSxLQUFaLENBQWtCLFlBQVU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEyQjVCLEtBQU0sY0FBYyxTQUFkLFdBQWMsQ0FBQyxJQUFELEVBQU0sR0FBTixFQUFVLE1BQVYsRUFBaUIsUUFBakIsRUFBOEI7O0FBRWpELE1BQUksUUFBSixFQUFhO0FBQ1osT0FBSSxNQUFNLElBQUksU0FBSixDQUFjLE9BQWQsRUFDTixJQURNLENBQ0QsSUFEQyxDQUFOLENBRFE7O0FBSVQsT0FBSSxXQUFXLElBQUksU0FBSixDQUFjLEdBQWQsRUFDZCxJQURjLENBQ1QsVUFBQyxDQUFEO1dBQU87SUFBUCxDQURGLENBSks7O0FBUVQsWUFDQyxJQURELEdBRUMsTUFGRCxHQVJTOztBQVlULFlBQ0MsS0FERCxHQUVGLE1BRkUsQ0FFSyxHQUZMLEVBR0YsSUFIRSxDQUdHLFdBSEgsRUFHZ0IsVUFBQyxDQUFELEVBQUksQ0FBSixFQUFVO0FBQzVCLFlBQVEsR0FBUixDQUFZLENBQVosRUFBYyxDQUFkLEVBRDRCO0FBRTVCLFdBQU8sZUFBZSxLQUFLLENBQUwsR0FBUyxLQUF4QixDQUZxQjtJQUFWLENBSGhCLENBWlM7O0FBcUJaLE9BQUksUUFBTSxTQUFTLFNBQVQsQ0FBbUIsTUFBbkIsRUFDVCxJQURTLENBQ0osVUFBQyxDQUFEO1dBQU87SUFBUCxDQURGLENBckJROztBQXdCWixTQUNDLElBREQsR0FFQyxNQUZELEdBeEJZOztBQTRCWixTQUNDLElBREQsQ0FDTSxNQUROLEVBQ2MsVUFBQyxDQUFELEVBQUcsQ0FBSDtXQUFTLE9BQU8sQ0FBUDtJQUFULENBRGQsQ0FFQyxJQUZELENBRU0sR0FGTixFQUVXLFVBQUMsQ0FBRCxFQUFJLENBQUosRUFBTSxDQUFOO1dBQWEsS0FBRyxL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c291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcbi8vIGNyZWF0ZSBIVE1MIHN0dWZmXG4vLyBjb25zdCBjcmVhdGVIdG1sVG9uQ29udHJvbCA9IChucikgPT4ge1xuLy8gXHRjb25zdCBwb3NuciA9ICcxJztcblx0XG5cbi8vIFx0bGV0IGVsQ29udGFpbmVyID0gJ3Rvbi1jb250cm9sLScrbnI7XG4vLyBcdGxldCBlbE91dERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJESVZcIik7XG4vLyBcdGVsT3V0RGl2LnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwiY29sLXhzLTNcIik7XG5cdFxuLy8gXHRsZXQgZWxpbnB1dEdyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIkRJVlwiKTtcbi8vIFx0ZWxpbnB1dEdyb3VwLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwiaW5wdXQtZ3JvdXAtYnRuXCIpOyBcbi8vIFx0ZWxPdXREaXYuYXBwZW5kQ2hpbGQoZWxpbnB1dEdyb3VwKTtcbi8vIFx0Ly8gQlVUVE9OXG4vLyBcdGxldCB0ZXh0bm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFwiIFphaGxcIik7IFxuLy8gXHRsZXQgYnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIkJVVFRPTlwiKTtcbi8vIFx0bGV0IHNpZD0nYnRuLXJvdycrbnIrJy0nK3Bvc25yO1xuLy8gXHRidG4uc2V0QXR0cmlidXRlKFwiaWRcIiwgc2lkKTtcbi8vIFx0YnRuLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwiYnRuIGJ0bi1pbmZvIGRyb3Bkb3duLXRvZ2dsZVwiKTtcbi8vIFx0YnRuLmFwcGVuZENoaWxkKHRleHRub2RlKTtcbi8vIFx0ZWxpbnB1dEdyb3VwLmFwcGVuZENoaWxkKGJ0bik7XG4vLyBcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVsQ29udGFpbmVyKS5hcHBlbmRDaGlsZChlbE91dERpdik7XG5cblxuLy8gfTtcblxuLy8gRDNKU1xuY29uc3QgdXBkYXRlR3JhcGggPSAoZGF0YSxzdmcsbG9va3VwLGNoZWNrc3VtKSA9PiB7XG5cdFxuXHRpZiAoY2hlY2tzdW0pe1xuXHRcdGxldCBncnAgPSBzdmcuc2VsZWN0QWxsKCdzdmcgZycpXG5cdCAgICAuZGF0YShkYXRhKTtcblxuXHQgICAgbGV0IGlubmVyZ3JwID0gZ3JwLnNlbGVjdEFsbCgnZycpXG5cdCAgICAuZGF0YSgoZCkgPT4gZCk7XG5cblxuXHQgICAgaW5uZXJncnBcblx0ICAgIC5leGl0KClcblx0ICAgIC5yZW1vdmUoKTtcblx0ICAgIFxuXHQgICAgaW5uZXJncnBcblx0ICAgIC5lbnRlcigpXG5cdFx0LmFwcGVuZCgnZycpXG5cdFx0LmF0dHIoJ3RyYW5zZm9ybScsIChkLCBpKSA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZyhkLGkpO1xuXHRcdFx0cmV0dXJuICd0cmFuc2xhdGUoJyArIDI4ICogaSArICcsMCknXG5cdFx0fSk7XG5cdCAgICBcblxuXHRcdGxldCByZWN0cz1pbm5lcmdycC5zZWxlY3RBbGwoJ3JlY3QnKVxuXHRcdC5kYXRhKChkKSA9PiBkKTtcblx0XHRcblx0XHRyZWN0c1xuXHRcdC5leGl0KClcblx0XHQucmVtb3ZlKCk7XG5cblx0XHRyZWN0c1xuXHRcdC5hdHRyKCdmaWxsJywgKGQsaSkgPT4gbG9va3VwW2RdKVxuXHRcdC5hdHRyKCd4JywgKGQsIGksaykgPT4gIHJ3L2RhdGFbMF1ba10ubGVuZ3RoICogaSlcblx0XHQuYXR0cignd2lkdGgnLCAoZCxpLGspID0+ICBydy9kYXRhWzBdW2tdLmxlbmd0aClcblx0XHQuYXR0cignaGVpZ2h0JywgcmgpXG5cdFx0LmVudGVyKClcblx0XHQuYXBwZW5kKCdyZWN0Jylcblx0XHQuYXR0cignZmlsbCcsIChkLGkpID0+IGxvb2t1cFtkXSlcblx0XHQuYXR0cigneCcsIChkLCBpLGspID0+ICBydy9kYXRhWzBdW2tdLmxlbmd0aCAqIGkpXG5cdFx0LmF0dHIoJ3dpZHRoJywgKGQsaSxrKSA9PiAgcncvZGF0YVswXVtrXS5sZW5ndGgpXG5cdFx0LmF0dHIoJ2hlaWdodCcsIHJoKTtcblxuXHRcdC8vIHJlY3RzLmV4aXQoKVxuXHRcdC8vIC5yZW1vdmUoKTtcblxuXHR9IGVsc2Uge1xuXHRcdHN2Zy5zZWxlY3RBbGwoJ3N2ZyBnIHJlY3QnKVxuXHRcdC5kYXRhKGRhdGFbMF0pXG5cdFx0LmF0dHIoJ2ZpbGwnLCAoZCxpKSA9PiBsb29rdXBbZF0pXG5cdFx0LmVudGVyKClcblx0XHQuYXBwZW5kKCdyZWN0Jylcblx0ICAgIC5hdHRyKCd4JywgKGQsIGkpID0+ICAyOCAqIGkpXG5cdCAgICAuYXR0cignd2lkdGgnLCBydylcblx0ICAgIC5hdHRyKCdoZWlnaHQnLCByaCk7XG5cdCAgICAvLy5yZW1vdmUoKTtcblx0fVxufTtcblxuY29uc3QgcmVuZGVyR3JhcGggPSAoZGF0YSxzdmcsbG9va3VwLGNoZWNrc3VtKSA9PiB7XG5cdC8vIENyZWF0ZSBhIGdyb3VwIGZvciBlYWNoIHJvdyBpbiB0aGUgZGF0YSBtYXRyaXggYW5kXG5cdC8vIHRyYW5zbGF0ZSB0aGUgZ3JvdXAgdmVydGljYWxseVxuXHRsZXQgZ3JwID0gc3ZnLnNlbGVjdEFsbCgnc3ZnIGcnKVxuXHQgICAgLmRhdGEoZGF0YSlcblx0ICAgIC5lbnRlcigpXG5cdCAgICAuYXBwZW5kKCdnJylcblx0ICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAoZCwgaSkgPT4gJ3RyYW5zbGF0ZSgwLCAnICsgNTQgKiBpICsgJyknKTsgIFxuXG5cdGlmIChjaGVja3N1bSl7XG5cdFx0Ly9pbm5lciBzdHJ1Y3R1cmVcblx0XHRsZXQgaW5ncnAgPSBncnAuc2VsZWN0QWxsKCdnJylcblx0XHRcdC8vIC5maWx0ZXIoIChkLGkpID0+IHR5cGVvZiBkW2ldID09PSAnb2JqZWN0Jylcblx0XHQgICAgLmRhdGEoKGQpID0+IGQpXG5cdFx0ICAgIC5lbnRlcigpXG5cdFx0ICAgIC5hcHBlbmQoJ2cnKVxuXHRcdCAgICAuYXR0cigndHJhbnNmb3JtJywgKGQsIGkpID0+ICd0cmFuc2xhdGUoJyArIDI4ICogaSArICcsMCknKTtcblxuXG5cdFx0aW5ncnAuc2VsZWN0QWxsKCdyZWN0Jylcblx0XHQgICAgLmRhdGEoKGQpID0+IGQpXG5cdFx0ICAgIC5lbnRlcigpXG5cdFx0ICAgIC5hcHBlbmQoJ3JlY3QnKVxuXHRcdCAgICBcdC5hdHRyKCd4JywgKGQsIGksaykgPT4gIHJ3L2RhdGFbMF1ba10ubGVuZ3RoICogaSlcblx0XHQgICAgICAgIC5hdHRyKCdmaWxsJywgKGQsaSkgPT4gbG9va3VwW2RdKVxuXHRcdCAgICAgICAgLmF0dHIoJ3dpZHRoJywgKGQsaSxrKSA9PiAgcncvZGF0YVswXVtrXS5sZW5ndGgpXG5cdFx0ICAgICAgICAuYXR0cignaGVpZ2h0JywgcmgpOyAgXG5cdH0gZWxzZSB7XG5cdFx0Ly8gRm9yIGVhY2ggZ3JvdXAsIGNyZWF0ZSBhIHNldCBvZiByZWN0YW5nbGVzIGFuZCBiaW5kIFxuXHRcdC8vIHRoZW0gdG8gdGhlIGlubmVyIGFycmF5ICh0aGUgaW5uZXIgYXJyYXkgaXMgYWxyZWFkeVxuXHRcdC8vIGJpbmRlZCB0byB0aGUgZ3JvdXApXG5cdFx0Z3JwLnNlbGVjdEFsbCgncmVjdCcpXG5cdFx0XHQvLyAuZmlsdGVyKCAoZCxpKSA9PiB0eXBlb2YgZFtpXSA9PT0gJ251bWJlcicpXG5cdFx0ICAgIC5kYXRhKChkKSA9PiBkKVxuXHRcdCAgICAuZW50ZXIoKVxuXHRcdCAgICAuYXBwZW5kKCdyZWN0Jylcblx0XHQgICAgICAgIC5hdHRyKCd4JywgKGQsIGkpID0+ICAyOCAqIGkpXG5cdFx0ICAgICAgICAuYXR0cignZmlsbCcsIChkLGkpID0+IGxvb2t1cFtkXSlcblx0XHQgICAgICAgIC5hdHRyKCd3aWR0aCcsIHJ3KVxuXHRcdCAgICAgICAgLmF0dHIoJ2hlaWdodCcsIHJoKTsgICAgIFxuXHR9XG5cblx0Ly9Nb2R1bG8gMTAgdGlja3MgICAgICAgIFxuXHRncnAuc2VsZWN0QWxsKCdsaW5lJylcblx0ICAgIC5kYXRhKChkKSA9PiB7XG5cdCAgICBcdGxldCB0bXAgPSBNYXRoLnRydW5jKGQubGVuZ3RoIC8gMTApO1xuXHQgICAgXHRsZXQgb3V0ID0gbmV3IEFycmF5KHRtcCsxKS5maWxsKDApO1xuXHQgICAgXHRyZXR1cm4gb3V0O1xuXHQgICAgfSlcblx0ICAgIC5lbnRlcigpLmFwcGVuZCgnbGluZScpXG5cdCAgICBcdC8vLmZpbHRlcigoZCxpKSA9PiBpJTEwPT09MClcbiAgXHRcdFx0LmF0dHIoJ3gxJywgIChkLCBpKSA9PiAyODAgKiBpKzEpXG4gIFx0XHRcdC5hdHRyKCd5MScsIDIwKVxuICBcdFx0XHQuYXR0cigneDInLCAoZCwgaSkgPT4gMjgwICogaSsxKVxuICBcdFx0XHQuYXR0cigneTInLDQwKVxuICBcdFx0XHQuc3R5bGUoJ3N0cm9rZScsICdibGFjaycpXG4gIFx0XHRcdC5zdHlsZSgnc3Ryb2tlLXdpZHRoJywnMnB4Jyk7XG4gIFxuXG4gIFx0Ly8gVGV4dCBcbiAgXHRncnAuc2VsZWN0QWxsKCd0ZXh0Jylcblx0ICAgIC5kYXRhKChkKSA9PiB7XG5cdCAgICBcdGxldCB0bXAgPSBNYXRoLnRydW5jKGQubGVuZ3RoIC8gMTApO1xuXHQgICAgXHRsZXQgb3V0ID0gbmV3IEFycmF5KHRtcCsxKS5maWxsKDApO1xuXHQgICAgXHRyZXR1cm4gb3V0O1xuXHQgICAgfSlcblx0ICAgIC5lbnRlcigpLmFwcGVuZCgndGV4dCcpXG5cdCAgICAvLy5maWx0ZXIoKGQsaSkgPT4gaSUxMD09PTApXG5cdCAgICBcdC5hdHRyKCd4JywgKGQsIGkpID0+IHsgcmV0dXJuIDI4MCAqIGkrNTsgfSlcblx0ICAgIFx0LmF0dHIoJ3knLCAnMzgnKSAgXG5cdCAgICBcdC5hdHRyKCdmb250LWZhbWlseScsICdzYW5zLXNlcmlmJykgXG5cdCAgICBcdC50ZXh0KCAoZCwgaSxrKSA9PiBrKjQwK2kqMTArMSk7XG5cdCAgICBcdFxufTtcblxuLy8gZ2V0IHZhbHVlc1xuLy9jb25zdCBnZXRCdXR0b25JZHMgPSAoKSA9PiBbJyNidG4tcm93MS0xJywnI2J0bi1yb3cxLTInLCcjYnRuLXJvdzEtMycsJyNidG4tcm93MS00J107XG5cbi8vIHJlYWRzIFBhcmFtZXRlciBUb24gWmFobCBmb3Igcm93IG9uZVxuY29uc3QgcmVhZElucHV0ID0gKHJvdykgPT4ge1xuXHRsZXQgaWRzID0gW107XG5cdC8vIFRPRE8gdXNlIGFzIHBhcmFtZXRlciBsYXRlclxuXHRpZiAodHlwZW9mIHJvdyA9PT0gJ3VuZGVmaW5lZCcpe1xuXHRcdGFsZXJ0ICgncm93IGlzIHVuZGVmaW5lZCcpO1xuXHR9XG5cdC8vIGxldCByb3cgPSAxO1xuXHRsZXQgcz0nJztcblx0Zm9yIChsZXQgaSA9IDE7IGkgPCA0OyBpKyspe1xuXHRcdHMgPSAnI2J0bi1yb3cnK3JvdysnLScraTtcblx0XHRpZHMucHVzaChzKTtcblx0fSBcblxuXHRsZXQgb3V0ID0gW107XG5cdGZvciAobGV0IGkgaW4gaWRzKSB7XG5cdFx0bGV0IGVsdmFsID0gJChpZHNbaV0pXG5cdFx0XHRcdFx0XHQucGFyZW50KClcblx0XHRcdFx0XHRcdC5wYXJlbnQoKVxuXHRcdFx0XHRcdFx0LmNoaWxkcmVuKCdpbnB1dCcpWzBdO1xuXHRcdGxldCB2YWwgPSAwO1xuXHRcdGlmICh0eXBlb2YgZWx2YWwgIT09ICd1bmRlZmluZWQnKXtcblx0XHRcdHZhbCA9IGVsdmFsLnZhbHVlO1xuXHRcdH1cblx0XHRvdXQucHVzaCh2YWwpO1xuXHR9XG5cdHJldHVybiBvdXQ7XG59O1xuXG4vLyBSZWR1Y2UgZGF0YSBmcm9tIDMgYXJyYXlzIHRvIG9uZSBBcnJheVxuXG5jb25zdCByZWR1Y2UzZGF0YSA9IChhcnJCLGFyckcsYXJyUikgPT4ge1xuXHRsZXQgb3V0ID0gW107XG5cdGxldCBvdXRlciA9IFtdO1xuXHRvdXRlci5wdXNoKG91dCk7XG5cdGxldCB0bXAscztcblx0Zm9yKGxldCBpPTA7IGk8YXJyQi5sZW5ndGg7IGkrKyl7XG5cdFx0dG1wID0gW107XG5cdFx0dG1wLnB1c2goYXJyQltpXSk7XG5cdFx0dG1wLnB1c2goYXJyR1tpXT09PTAgPyAwIDogYXJyR1tpXSArIDMpO1xuXHRcdHRtcC5wdXNoKGFyclJbaV09PT0wID8gMCA6IGFyclJbaV0gKyA2KTtcblx0XHRzID0gbmV3IFNldCh0bXApO1xuXHRcdGlmIChzLnNpemUgPiAxICYmIHMuaGFzKDApKXtcblx0XHRcdHMuZGVsZXRlKDApO1xuXHRcdH1cblx0XHRvdXQucHVzaChBcnJheS5mcm9tKHMpKTtcblx0fVxuXHRyZXR1cm4gb3V0ZXI7XG59O1xuXG5cblxuLy8gUmVkcmF3IEdhbWVcbmNvbnN0IHJlZHJhdyA9IChpbnBzdHJhcnIpID0+IHtcblx0bGV0IGlucCA9IFtdO1xuXHQvLyBwYXJzZSBpbnB1dFxuXHRmb3IgKGxldCBpID0gMDsgaSA8IGlucHN0cmFyci5sZW5ndGg7IGkrKyl7XG5cdFx0aW5wLnB1c2gocGFyc2VJbnQoaW5wc3RyYXJyW2ldKSk7XG5cdH07XG5cbiAgICAvLyBpbml0IHZhbHVlc1xuXHRsZXQgdCA9IDEsIC8vIGNvdXQgdmFsdWVcblx0XHRkYXRhID0gW10sXG5cdFx0Y29sLFxuXHRcdG5leHRFdmVudCxcblx0XHR0bXAgPSAwO1xuXG5cdGZvciAobGV0IGkgPSAwOyBpIDwgaW5wLmxlbmd0aDsgaSsrKXtcblx0XHRjb2wgPSBpO1xuXHRcdG5leHRFdmVudCA9IGlucFtjb2xdO1xuXHRcdGlmIChuZXh0RXZlbnQgPiAwKXtcblx0XHRcdGJyZWFrO1xuXHRcdH1cblx0fVxuXG5cdGZvciAobGV0IGsgPSAwOyBrIDwgcm93TjsgayArPSAxKSB7XG5cdFx0bGV0IHJvdyA9IFtdO1xuXHRcdGRhdGEucHVzaChyb3cpO1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgY29sTjsgaSArPTEpe1xuXHRcdFx0aWYgKHQgPT09ICBuZXh0RXZlbnQpe1xuXHRcdFx0XHQvLyBqdW1wIG92ZXIgMCBjb2xvciBlbnRyaWVzXG5cdFx0XHRcdHRtcCA9IGNvbCsxOyAvLyBibGFjayBoYXMgaW5kZXggMFxuXHRcdFx0XHQvLyBpZiBzb21ldGhpbmcgaXMgemVybyBnbyBmdXJ0aGVyXG5cdFx0XHRcdHdoaWxlIChpbnBbKGNvbCsxKSVpbnAubGVuZ3RoXSA8IDEpe1xuXHRcdFx0XHRcdGNvbCA9IChjb2wrMSklaW5wLmxlbmd0aDtcblx0XHRcdFx0fVxuXHRcdFx0XHRuZXh0RXZlbnQgKz0gaW5wWyhjb2wrMSklaW5wLmxlbmd0aF07XG5cdFx0XHRcdGNvbCA9IChjb2wrMSklaW5wLmxlbmd0aDsgLy8gbmV4dCBjb2xvclxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dG1wID0gMDtcblx0XHRcdH1cblx0XHRcdC8vIGp1c3QgYXJyYXlcblx0XHRcdHJvdy5wdXNoKHRtcCk7XG5cdFx0XHQvL3Jvdy5wdXNoKFt0LCB0bXBdKTtcblx0XHRcdHQgPSB0ICsgMTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIGRhdGE7XG59O1xuXG4vL1RPRE8gRklYIFRBQkxFU1xuY29uc3QgaGlnaGxpZ2h0RWwgID0gKGVsLGNvbCx0aW1lLGhvdmVyKSA9PntcbiAgICQoZWwpLmF0dHIoIFwiZmlsbFwiLCBob3Zlcik7XG4gICBzZXRUaW1lb3V0KCgpID0+IHskKGVsKS5hdHRyKCBcImZpbGxcIiwgY29sKTt9LHRpbWUqMTAwMCk7XG5cbn07XG5cbi8vQ0hBTkdFIG9uIFRPTiBJbnB1dCBpcyBhcHBsaWVkXG5jb25zdCByZWdpc3RlcklucHV0T25DaGFuZ2UgPSAocm93LHN2Zyxsb29rdXApID0+IHtcblx0bGV0IGlkcyA9IFtdO1xuXHQvLyBUT0RPIHVzZSBhcyBwYXJhbWV0ZXIgbGF0ZXJcblx0Ly8gbGV0IHJvdyA9IDE7XG5cdGxldCBzPScnO1xuXHRmb3IgKGxldCBpID0gMTsgaSA8IDQ7IGkrKyl7XG5cdFx0cyA9ICcjYnRuLXJvdycrcm93KyctJytpO1xuXHRcdGlkcy5wdXNoKHMpO1xuXHR9IFxuXG5cdGZvciAobGV0IGkgaW4gaWRzKSB7XG5cdFx0JChpZHNbaV0pXG5cdFx0XHQucGFyZW50KClcblx0XHRcdC5wYXJlbnQoKVxuXHRcdFx0LmNoaWxkcmVuKCdpbnB1dC5mb3JtLWNvbnRyb2wnKVxuXHRcdFx0LmNoYW5nZSgoKSA9PiB7XG5cdFx0XHRcdGxldCBuZXdkYXRhID0gcmVkcmF3KHJlYWRJbnB1dChyb3cpKTtcblx0XHRcdFx0dXBkYXRlR3JhcGgobmV3ZGF0YSxzdmcsbG9va3VwLGZhbHNlKTtcblx0XHRcdFx0bGV0IG15ZGF0YSA9IHJlZHJhdyhyZWFkSW5wdXQoMSkpO1xuXHRcdFx0XHRsZXQgbXlkYXRhR3JlZW4gPSByZWRyYXcocmVhZElucHV0KDIpKTtcblx0XHRcdFx0bGV0IG15ZGF0YVJlZCA9IHJlZHJhdyhyZWFkSW5wdXQoMykpO1xuXHRcdFx0XHRsZXQgbmV3ZGF0YTIgPSByZWR1Y2UzZGF0YShteWRhdGFbMF0sbXlkYXRhR3JlZW5bMF0sbXlkYXRhUmVkWzBdKTtcblx0XHRcdFx0dXBkYXRlR3JhcGgobmV3ZGF0YTIsZDMuc2VsZWN0KCcjY2hhcnQtc3VtJyksXG5cdFx0XHRcdFx0WzAsMSwyLDMsNCw1LDYsNyw4LDldLm1hcCgoaSkgPT4gdG9uZXNbaV0uY29sb3IpLHRydWUpO1xuXHRcdFx0fSk7XG5cdH1cbn07XG5cbi8vIFJlZ2lzdGVyIGNvdW50IEJ1dHRvblxuY29uc3QgcmVnaXN0ZXJCdXR0b24gPSAocm93KSA9PiB7XG5cdGxldCBpZHMgPSBbXTtcblx0Ly8gVE9ETyB1c2UgYXMgcGFyYW1ldGVyIGxhdGVyXG5cdC8vbGV0IHJvdyA9IDE7XG5cdGxldCBzPScnO1xuXHRmb3IgKGxldCBpID0gMTsgaSA8IDQ7IGkrKyl7XG5cdFx0cyA9ICcjYnRuLXJvdycrcm93KyctJytpO1xuXHRcdGlkcy5wdXNoKHMpO1xuXHR9IFxuXHRsZXQgZWMgPSBqUXVlcnkuRXZlbnQoICdjaGFuZ2UnICk7XG4gICAgZm9yIChsZXQgaSBpbiBpZHMpIHtcbiAgICBcdCQoaWRzW2ldKVxuXHRcdFx0LnBhcmVudCgpXG5cdFx0XHQuY2hpbGRyZW4oJ3VsLmRyb3Bkb3duLW1lbnUnKVxuXHRcdFx0Lm9uKCdjbGljaycsIChlKSA9PiB7XG5cdFx0XHRcdCQoaWRzW2ldKVxuXHRcdFx0XHQucGFyZW50KClcblx0XHRcdFx0LnBhcmVudCgpXG5cdFx0XHRcdC5jaGlsZHJlbignaW5wdXQuZm9ybS1jb250cm9sOmZpcnN0Jylcblx0XHRcdFx0LmF0dHIoJ3ZhbHVlJyxlLnRhcmdldC50ZXh0KVxuXHRcdFx0XHQvL3NlbmQgY2hhbmdlIGV2ZW50XG5cdFx0XHRcdC50cmlnZ2VyKGVjKTtcblx0XHR9KTtcdFxuICAgIH1cbn07XG5cblxuLy8gUmVnaXN0ZXIgVG9uIGJ1dHRvblxuY29uc3QgcmVnaXN0ZXJUb25CdXR0b24gPSAocm93KSA9PiB7XG5cdGxldCBpZHMgPSBbXTtcblx0bGV0IHM9Jyc7XG5cblx0Zm9yIChsZXQgaSA9IDE7IGkgPCA0OyBpKyspe1xuXHRcdHMgPSAnI2J0bi1yb3cnK3JvdysnLScraSsnLXRvbic7XG5cdFx0aWRzLnB1c2gocyk7XG5cdH0gXG4gICAgZm9yIChsZXQgaSBpbiBpZHMpIHtcbiAgICBcdCQoaWRzW2ldKVxuXHRcdFx0LnBhcmVudCgpXG5cdFx0XHQuY2hpbGRyZW4oJ3VsLmRyb3Bkb3duLW1lbnUnKVxuXHRcdFx0Lm9uKCdjbGljaycsIChlKSA9PiB7XG5cdFx0XHRcdC8vIGluZGV4IGhhdmUgdG8gc3Vydml2ZSA6KVxuXHRcdFx0ICAgIGxldCBuciA9IHBhcnNlSW50KGUudGFyZ2V0LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5nZXRBdHRyaWJ1dGUoJ25yJykpO1xuXHRcdFx0XHR0b25lc1tucl0uaW5zdHJ1bWVudCA9IGUudGFyZ2V0LnRleHQ7XG5cdFx0XHRcdHVwZGF0ZUlucHV0KHRvbmVzLG5yKTtcblx0XHR9KTtcdFxuICAgIH1cbn07XG4vL1JlZ2lzdGVyIGZpcnN0IEJsYWNrIEJ1dHRvblxuY29uc3QgcmVnaXN0ZXJCbGFja1RvbkJ1dHRvbiA9ICgpID0+IHtcblx0bGV0IGlkcyA9IFtdO1xuXHRsZXQgcm93ID0gMTtcblx0bGV0IHMgPSAnI2J0bi1yb3cxLTAtdG9uJztcblx0aWRzLnB1c2gocyk7XG4gICAgZm9yIChsZXQgaSBpbiBpZHMpIHtcbiAgICBcdCQoaWRzW2ldKVxuXHRcdFx0LnBhcmVudCgpXG5cdFx0XHQuY2hpbGRyZW4oJ3VsLmRyb3Bkb3duLW1lbnUnKVxuXHRcdFx0Lm9uKCdjbGljaycsIChlKSA9PiB7XG5cdFx0XHRcdHRvbmVzWzBdLmluc3RydW1lbnQgPSBlLnRhcmdldC50ZXh0O1xuXHRcdFx0XHR1cGRhdGVJbnB1dCh0b25lcywwKTtcblx0XHR9KTtcdFxuICAgIH1cbn07XG4vLyBSZWdpc3RlciBWb2x1bWVuIGJ1dHRvblxuY29uc3QgcmVnaXN0ZXJWb2x1bWVCdXR0b24gPSAocm93KSA9PiB7XG5cdGxldCBpZHMgPSBbXTtcblx0bGV0IHM9Jyc7XG5cdGZvciAobGV0IGkgPSAxOyBpIDwgNDsgaSsrKXtcblx0XHRzID0gJyNidG4tcm93Jytyb3crJy0nK2krJy12b2x1bWUnO1xuXHRcdGlkcy5wdXNoKHMpO1xuXHR9IFxuXHRsZXQgZWMgPSBqUXVlcnkuRXZlbnQoICdjaGFuZ2UnICk7XG4gICAgZm9yIChsZXQgaSBpbiBpZHMpIHtcbiAgICBcdCQoaWRzW2ldKVxuXHRcdFx0LnBhcmVudCgpXG5cdFx0XHQuY2hpbGRyZW4oJ3VsLmRyb3Bkb3duLW1lbnUnKVxuXHRcdFx0Lm9uKCdjbGljaycsIChlKSA9PiB7XG5cdFx0XHRcdGxldCBuciA9cGFyc2VJbnQoZS50YXJnZXQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LmdldEF0dHJpYnV0ZSgnbnInKSk7XG5cdFx0XHRcdHRvbmVzW25yXS52b2wgPSBlLnRhcmdldC50ZXh0O1xuXHRcdFx0XHR0b25lc1tucl0uZ2FpbiA9IHBhcnNlSW50KGUudGFyZ2V0LnRleHQpKjEuMC8xMDA7XG5cdFx0XHRcdHVwZGF0ZUlucHV0KHRvbmVzLG5yKTtcblx0XHR9KTtcdFxuICAgIH1cbn07XG4vLyBSZWdpc3RlciBGaXJzdCBHcmF5IEJ1dHRvblxuY29uc3QgcmVnaXN0ZXJCbGFja1ZvbHVtZUJ1dHRvbiA9ICgpID0+IHtcblx0bGV0IGlkcyA9IFtdO1xuXHRsZXQgcm93ID0gMTtcblx0bGV0IHMgPSAnI2J0bi1yb3cxLTAtdm9sdW1lJztcblx0aWRzLnB1c2gocyk7XG4gICAgZm9yIChsZXQgaSBpbiBpZHMpIHtcbiAgICBcdCQoaWRzW2ldKVxuXHRcdFx0LnBhcmVudCgpXG5cdFx0XHQuY2hpbGRyZW4oJ3VsLmRyb3Bkb3duLW1lbnUnKVxuXHRcdFx0Lm9uKCdjbGljaycsIChlKSA9PiB7XG5cdFx0XHRcdHRvbmVzWzBdLnZvbCA9IGUudGFyZ2V0LnRleHQ7XG5cdFx0XHRcdHRvbmVzWzBdLmdhaW4gPSBwYXJzZUludChlLnRhcmdldC50ZXh0KSoxLjAvMTAwO1xuXHRcdFx0XHR1cGRhdGVJbnB1dCh0b25lcywwKTtcblx0XHR9KTtcdFxuICAgIH1cbn07XG5jb25zdCB1cGRhdGVJbnB1dCA9IChvYmosbnIpID0+IHtcblx0bGV0IGllbCA9ICQoJyMnK29ialtucl0uaWQpLmNoaWxkcmVuKCdpbnB1dCcpO1xuXHRpZiAobnI+MCkge1xuXHRcdGllbFsxXS52YWx1ZSA9IG9ialtucl0uaW5zdHJ1bWVudDtcblx0XHRpZWxbMl0udmFsdWUgPSBvYmpbbnJdLnZvbDtcblx0fSBlbHNlIHtcblx0XHRpZWxbMF0udmFsdWUgPSBvYmpbbnJdLmluc3RydW1lbnQ7XG5cdFx0aWVsWzFdLnZhbHVlID0gb2JqW25yXS52b2w7XG5cdH1cbn07XG5jb25zdCBzeW5jRm9ybURpc3BsYXkgPSAob2JqKSA9PiB7XG5cdGZvciAobGV0IGkgPSAwOyBpIDwgb2JqLmxlbmd0aDsgaSsrKXtcblx0XHR1cGRhdGVJbnB1dChvYmosaSk7XG5cdH1cbn07XG5jb25zdCByZWdpc3RlclBsYXlCdXR0b24gPSAoKSA9PiB7XG5cdCQoJyNwbGF5bXVzaWNidG4nKS5vbignY2xpY2snLCAoZSkgPT4ge1xuXHRcdC8vIGlwaG9uZSBoYWNrXG5cdFx0Ly8gaWYgKGF1ZGlvQ29udGV4dCA9PT0gbnVsbCl7XG5cdFx0Ly8gXHR0cnkge1xuICAvLyAgIFx0XHRcdHdpbmRvdy5BdWRpb0NvbnRleHQgPSB3aW5kb3cuQXVkaW9Db250ZXh0IHx8IHdpbmRvdy53ZWJraXRBdWRpb0NvbnRleHQ7XG4gIC8vICAgXHRcdFx0YXVkaW9Db250ZXh0ID0gbmV3IHdpbmRvdy5BdWRpb0NvbnRleHQoKTtcblx0XHQvLyBcdH0gY2F0Y2ggKGUpIHtcbiAgLy8gICBcdFx0XHRjb25zb2xlLmxvZyhcIk5vIFdlYiBBdWRpbyBBUEkgc3VwcG9ydFwiKTtcblx0XHQvLyBcdH1cblx0XHQvLyBcdGxldCBvc2NpbGxhdG9yID0gYXVkaW9Db250ZXh0LmNyZWF0ZU9zY2lsbGF0b3IoKTtcbiBcdC8vIFx0XHRcdG9zY2lsbGF0b3IuZnJlcXVlbmN5LnZhbHVlID0gNDAwO1xuIFx0Ly8gXHRcdFx0b3NjaWxsYXRvci5jb25uZWN0KGF1ZGlvQ29udGV4dC5kZXN0aW5hdGlvbik7XG4gXHQvLyBcdFx0XHRvc2NpbGxhdG9yLnN0YXJ0KDApO1xuIFx0Ly8gXHRcdFx0b3NjaWxsYXRvci5zdG9wKC41KVxuXHRcdC8vIH1cblx0XHRydW5TZXEgPSB0cnVlO1xuXHRcdHBsYXlNdXNpYygpO1xuXHRcdC8vYWxlcnQoJ2hlcmUnKTtcblx0fSk7XG5cdC8vICQoJyNwbGF5bXVzaWNidG4nKS5vbigndG91Y2hlbmQnLCAoZSkgPT4ge1xuXG5cdC8vIFx0cnVuU2VxID0gdHJ1ZTtcblx0Ly8gXHRwbGF5TXVzaWMoKTtcblx0Ly8gXHQvL2FsZXJ0KCdoZXJlJyk7XG5cdC8vIH0pO1xufTtcblxuY29uc3QgcmVnaXN0ZXJTdG9wQnV0dG9uID0gKCkgPT4ge1xuXHQkKCcjc3RvcG11c2ljYnRuJykub24oJ2NsaWNrJywgKGUpID0+IHtcblx0XHRydW5TZXEgPSBmYWxzZTtcblx0XHQvL2FsZXJ0KCdoZXJlJyk7XG5cdH0pO1xuXHQvLyAkKCcjc3RvcG11c2ljYnRuJykub24oJ3RvdWNoZW5kJywgKGUpID0+IHtcblx0Ly8gXHRydW5TZXEgPSBmYWxzZTtcblx0Ly8gXHQvL2FsZXJ0KCdoZXJlJyk7XG5cdC8vIH0pO1xufTtcblxuLy8gY29uc3QgcmVnaXN0ZXJQYXJhbWV0ZXJCdXR0b24gPSAoKSA9PiB7XG4vLyBcdCQoJyNwYXJhbWV0ZXJidG4nKS5vbignY2xpY2snLCAoZSkgPT4ge1xuLy8gXHRcdGxldCBlbCA9IGQzLnNlbGVjdEFsbCgncmVjdCcpWzBdWzRdO1xuLy8gXHRcdGxldCB0aW1lID0gMC45O1xuLy8gXHRcdGhpZ2hsaWdodEVsKGVsLDAsdGltZSk7XG4vLyBcdH0pO1xuLy8gfTtcblxuXG4vLyBQYXJhbWV0ZXIgd2VydGUgZWlubGVzZW5cbi8vICQoJyNwYXJhT3N6YnRuJykub24oJ2NsaWNrJywgKGUpID0+IHtcbi8vIFx0bGV0IHMyID0gJCgnaW5wdXRbbmFtZT1zcGVlZF06Y2hlY2tlZCcsICcjcGFyYW1ldGVyTW9kYWwnKS52YWwoKTtcbi8vIFx0bGV0IHMgPSAkKCdpbnB1dFtuYW1lPW9zemZvcm1dOmNoZWNrZWQnLCAnI3BhcmFtZXRlck1vZGFsJykudmFsKCk7XG4vLyBcdC8vaWYgKCEgdHlwZW9mIHMgPT09IFwidW5kZWZpbmVkXCIgJiYgISB0eXBlb2YgczIgID09PSBcInVuZGVmaW5lZFwiKXtcbi8vIFx0aWYgKCEgZmFsc2Upe1xuLy8gXHRcdG9zY2lsbGF0b3JUeXBlID0gcztcbi8vIFx0XHRzb3VuZFNwZWVkID0gcGFyc2VGbG9hdChzMik7XG4vLyBcdFx0JCgnI3BhcmFtZXRlck1vZGFsJykubW9kYWwoJ2hpZGUnKTtcbi8vIFx0fVxuLy8gfSk7XG5cblxuXG4vLyBTb3VuZCBEZWZpbml0aW9uXG5cblxuY29uc3QgcGxheVNvdW5kID0gKHN0YXJ0VGltZSwgcGl0Y2hOciwgZHVyYXRpb24sIGdhaW5PbGQpID0+IHtcblx0Ly9sZXQgc3RhcnRUaW1lID0gYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lICsgZGVsYXk7XG4gIFx0bGV0IGVuZFRpbWUgPSBzdGFydFRpbWUgKyBkdXJhdGlvbjtcbiAgXHQvL2xldCBwaXRjaCA9IHRvbmVzW3BpdGNoTnJdLmluc3RydW1lbnQ7IFxuICBcdGxldCBnYWluID0gdG9uZXNbcGl0Y2hOcl0uZ2FpbjtcblxuICBcdGxldCBvdXRnYWluID0gYXVkaW9Db250ZXh0LmNyZWF0ZUdhaW4oKTtcbiAgXHRvdXRnYWluLmdhaW4udmFsdWUgPSBnYWluO1xuICBcdG91dGdhaW4uY29ubmVjdChhdWRpb0NvbnRleHQuZGVzdGluYXRpb24pOyBcdFxuXG4gIFx0bGV0IGVudmVsb3BlID0gYXVkaW9Db250ZXh0LmNyZWF0ZUdhaW4oKTtcbiAgXHRlbnZlbG9wZS5jb25uZWN0KG91dGdhaW4pO1xuICBcdGVudmVsb3BlLmdhaW4udmFsdWUgPSAwO1xuICBcdFxuICBcdGVudmVsb3BlLmdhaW4uc2V0VGFyZ2V0QXRUaW1lKDEsIHN0YXJ0VGltZSwgZW52ZWxvcGVTdGFydEVuZFRpbWVbMF0pO1xuICBcdGVudmVsb3BlLmdhaW4uc2V0VGFyZ2V0QXRUaW1lKDAsIGVuZFRpbWUsIGVudmVsb3BlU3RhcnRFbmRUaW1lWzFdKTtcblxuICBcdGxldCBvc2NpbGxhdG9yID0gYXVkaW9Db250ZXh0LmNyZWF0ZU9zY2lsbGF0b3IoKTtcbiAgXHRvc2NpbGxhdG9yLmNvbm5lY3QoZW52ZWxvcGUpO1xuXG4gIFx0b3NjaWxsYXRvci50eXBlID0gb3NjaWxsYXRvclR5cGU7XG4gIFx0b3NjaWxsYXRvci5kZXR1bmUudmFsdWUgPSBub3Rlc1t0b25lc1twaXRjaE5yXS5pbnN0cnVtZW50XS5kZXR1bmU7XG4gIFx0b3NjaWxsYXRvci5mcmVxdWVuY3kudmFsdWUgPSAyNDA7XG5cblx0bGV0IHZpYnJhdG8gPSBhdWRpb0NvbnRleHQuY3JlYXRlR2FpbigpO1xuXHR2aWJyYXRvLmdhaW4udmFsdWUgPSB2aWJyYXRvZ2Fpbjtcblx0dmlicmF0by5jb25uZWN0KG9zY2lsbGF0b3IuZGV0dW5lKTtcblxuXHRsZXQgbGZvID0gYXVkaW9Db250ZXh0LmNyZWF0ZU9zY2lsbGF0b3IoKTtcblx0bGZvLmNvbm5lY3QodmlicmF0byk7XG5cdGxmby5mcmVxdWVuY3kudmFsdWUgPWxmb2ZyZXE7IFxuXG5cdG9zY2lsbGF0b3Iuc3RhcnQoc3RhcnRUaW1lKTtcbiAgXHRsZm8uc3RhcnQoc3RhcnRUaW1lKTtcbiAgXHRvc2NpbGxhdG9yLnN0b3AoZW5kVGltZSArMiApO1xuICBcdGxmby5zdG9wKGVuZFRpbWUgKzIpO1xuXG59O1xuXG4vLy8gUGxheSBMb29wXG5jb25zdCBydW5TZXF1ZW5jZXJzID0gKCkgPT4ge1xuXHRpZiAoIXJ1blNlcSB8fCBzb3VuZFF1ZXVlLmxlbmd0aCA9PT0gMCl7Y29uc29sZS5sb2coXCJzdG9wXCIpO3JldHVybjt9XG5cdGxldCBjdCA9IGF1ZGlvQ29udGV4dC5jdXJyZW50VGltZTtcblx0d2hpbGUgKHNvdW5kUXVldWUubGVuZ3RoPjAgJiYgc291bmRRdWV1ZVswXVswXTwgY3QrMC4xNSl7XG5cdFx0Ly9jb25zb2xlLmxvZygnY3Q6JytjdCsncGxhbmVkIHRpbWU6Jytzb3VuZFF1ZXVlWzBdWzBdKTtcblx0XHRsZXQgaXRlbSA9IHNvdW5kUXVldWUuc3BsaWNlKDAsMSk7XG5cdFx0Ly8gcGxheXNvdW5kIChzdGFydHRpbWUsIHBpdGNoLCBkdXJhdGlvbiwgICAgICAgICAgICAgZ2FpaW4pXG5cdFx0Ly9wbGF5U291bmQoaXRlbVswXVswXSxzb3VuZHNbaXRlbVswXVsxXV1bMF0saXRlbVswXVsyXSx0b25lc1tpdGVtWzBdWzFdXS5nYWluKTtcdFx0XG5cdFxuXHRcdHBsYXlTb3VuZChpdGVtWzBdWzBdLGl0ZW1bMF1bMV0saXRlbVswXVsyXSx0b25lc1tpdGVtWzBdWzFdXS5nYWluKTtcdFx0XG5cdFx0Ly8gZWxlbWVudCAgICAgICAgICAgICAgY29sb3IgICAgICAgZHVyYXRpb24gICAgICAgICAgICAgICAgIGhvdmVyY29sb3Jcblx0XHRoaWdobGlnaHRFbChpdGVtWzBdWzNdLHRvbmVzW2l0ZW1bMF1bMV1dLmNvbG9yLGl0ZW1bMF1bMl0sdG9uZXNbaXRlbVswXVsxXV0uaG92ZXIpO1xuXHR9XG5cdHNldFRpbWVvdXQocnVuU2VxdWVuY2Vycyw5MCk7XG59XG5cbi8vLyBzb3VuZHMgc3RhcnQgaGVyZVxuLy8vIFNvdW5kIHZhclxubGV0IHJ1blNlcSA9IHRydWU7XG5sZXQgc291bmRRdWV1ZSA9IFtdO1xuXG52YXIgYXVkaW9Db250ZXh0ID0gbnVsbDtcblxudHJ5IHtcbiAgIHdpbmRvdy5BdWRpb0NvbnRleHQgPSB3aW5kb3cuQXVkaW9Db250ZXh0fHx3aW5kb3cud2Via2l0QXVkaW9Db250ZXh0O1xuICAgdmFyIGF1ZGlvQ29udGV4dCA9IG5ldyBBdWRpb0NvbnRleHQoKTtcbn0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLmxvZyhcIk5vIFdlYiBBdWRpbyBBUEkgc3VwcG9ydFwiKTtcbn1cblxuXG4vL0lPUyBTdGFydCBJT1NIQUNLXG4kKCdib2R5Jykub24oJ3RvdWNoZW5kJywgKGUpID0+IHtcblx0Ly9hbGVydCgnc3RhcnQgc291bmRcblx0Ly8gY3JlYXRlIGVtcHR5IGJ1ZmZlclxuXHR2YXIgYnVmZmVyID0gYXVkaW9Db250ZXh0LmNyZWF0ZUJ1ZmZlcigxLCAxLCAyMjA1MCk7XG5cdHZhciBzb3VyY2UgPSBhdWRpb0NvbnRleHQuY3JlYXRlQnVmZmVyU291cmNlKCk7XG5cdHNvdXJjZS5idWZmZXIgPSBidWZmZXI7XG5cblx0Ly8gY29ubmVjdCB0byBvdXRwdXQgKHlvdXIgc3BlYWtlcnMpXG5cdHNvdXJjZS5jb25uZWN0KGF1ZGlvQ29udGV4dC5kZXN0aW5hdGlvbik7XG5cblx0Ly8gcGxheSB0aGUgZmlsZVxuXHRpZiAodHlwZW9mIHNvdXJjZS5ub3RlT24gIT09ICd1bmRlZmluZWQnKXtcblx0XHRzb3VyY2Uubm90ZU9uKDApO1xuXHR9XG5cdFxuXHR2YXIgc3JjID0gbnVsbDtcblx0c3JjID0gYXVkaW9Db250ZXh0LmNyZWF0ZU9zY2lsbGF0b3IoKTtcblx0c3JjLnR5cGUgPSAnc3F1YXJlJztcblx0c3JjLmZyZXF1ZW5jeS52YWx1ZSA9IDQ0MDtcblx0c3JjLmNvbm5lY3QoYXVkaW9Db250ZXh0LmRlc3RpbmF0aW9uKTtcblx0bGV0IGN0ID0gYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lO1xuXHRzcmMuc3RhcnQoY3QrMC41KTtcblx0c3JjLnN0b3AoY3QrMC45KTtcbn0pO1xuLy9JT1MgRU5EXG5cblxuLy8gU291bmQgY29uc3RhbnN0cyBwcmVzZXRzXG5sZXQgdG9uZXMgPSBbe1xuXHQnbnInOjAsXG5cdCdnYWluJzowLjEsXG5cdCd2b2wnOicxMCUnLFxuICAgICdjb2xvcic6JyM3NTc1NzUnLFxuXHQnaG92ZXInOicjMDAwMDAwJyxcblx0J2luc3RydW1lbnQnOidEMycsXG5cdCdpZCc6J2lnLXJvdzEtMCcsXG5cdCd2aXNpYmxlJzp0cnVlXG59LFxuXG57XG5cdCducic6MSxcblx0J2dhaW4nOjAuOCxcblx0J3ZvbCc6JzgwJScsXG5cdCdjb2xvcic6JyMyOTZFQUEnLFxuXHQnaG92ZXInOicjMDk0RThBJyxcblx0J2luc3RydW1lbnQnOidFMycsXG5cdCdpZCc6J2lnLXJvdzEtMScsXG5cdCd2aXNpYmxlJzp0cnVlXG59LFxue1xuXHQnbnInOjIsXG5cdCdnYWluJzowLjAsXG5cdCd2b2wnOicwJScsXG5cdCdjb2xvcic6JyM1NDkxQjUnLFxuXHQnaG92ZXInOicjMzQ2MTc1Jyxcblx0J2luc3RydW1lbnQnOidGMycsXG5cdCdpZCc6J2lnLXJvdzEtMicsXG5cdCd2aXNpYmxlJzpmYWxzZVxufSxcbntcblx0J25yJzozLFxuXHQnZ2Fpbic6MC4wLFxuXHQndm9sJzonMCUnLFxuXHQnY29sb3InOicjNzlCRUZBJyxcblx0J2hvdmVyJzonIzU5OUVCQScsXG5cdCdpbnN0cnVtZW50JzonRzMnLFxuXHQnaWQnOidpZy1yb3cxLTMnLFxuXHQndmlzaWJsZSc6ZmFsc2Vcbn0sXG5cbntcblx0J25yJzo0LFxuXHQnZ2Fpbic6MC41LFxuXHQndm9sJzonNTAlJyxcblx0J2NvbG9yJzonIzRCQTg0QicsXG5cdCdob3Zlcic6JyMyQjg4MkInLFxuXHQnaW5zdHJ1bWVudCc6J0E0Jyxcblx0J2lkJzonaWctcm93Mi0xJyxcblx0J3Zpc2libGUnOnRydWVcbn0sXG57XG5cdCducic6NSxcblx0J2dhaW4nOjAuMCxcblx0J3ZvbCc6JzAlJyxcblx0J2NvbG9yJzonIzU0NzI0OScsXG5cdCdob3Zlcic6JyMyNDUyMTknLFxuXHQnaW5zdHJ1bWVudCc6J0I0Jyxcblx0J2lkJzonaWctcm93Mi0yJyxcblx0J3Zpc2libGUnOmZhbHNlXG59LFxue1xuXHQnbnInOjYsXG5cdCdnYWluJzowLjAsXG5cdCd2b2wnOicwJScsXG5cdCdjb2xvcic6JyMxRjYyNDEnLFxuXHQnaG92ZXInOicjMUY2MjQxJyxcblx0J2luc3RydW1lbnQnOidDNCcsXG5cdCdpZCc6J2lnLXJvdzItMycsXG5cdCd2aXNpYmxlJzpmYWxzZVxufSxcbntcblx0J25yJzo3LFxuXHQnZ2Fpbic6MC4zLFxuXHQndm9sJzonMzAlJyxcblx0J2NvbG9yJzonI0RCMzgzMycsXG5cdCdob3Zlcic6JyNBQjE4MTMnLFxuXHQnaW5zdHJ1bWVudCc6J0Q0Jyxcblx0J2lkJzonaWctcm93My0xJyxcblx0J3Zpc2libGUnOnRydWVcbn0sXG57XG5cdCducic6OCxcblx0J2dhaW4nOjAuMCxcblx0J3ZvbCc6JzAlJyxcblx0J2NvbG9yJzonI0IzMEIwQicsXG5cdCdob3Zlcic6JyM1MzBCMEInLFxuXHQnaW5zdHJ1bWVudCc6J0U0Jyxcblx0J2lkJzonaWctcm93My0yJyxcblx0J3Zpc2libGUnOmZhbHNlXG59LFxue1xuXHQnbnInOjksXG5cdCdnYWluJzowLjAsXG5cdCd2b2wnOicwJScsXG5cdCdjb2xvcic6JyNBMTEyM0YnLFxuXHQnaG92ZXInOicjNTEwMjFGJyxcblx0J2luc3RydW1lbnQnOidGNCcsXG5cdCdpZCc6J2lnLXJvdzMtMycsXG5cdCd2aXNpYmxlJzpmYWxzZVxufV07XG5cbi8vIHNvdW5kc1xubGV0IG5vdGVzID0ge1xuXHQnRDMnOiB7XG5cdFx0J2ZyZXEnOiA0NDAsXG5cdFx0J2RldHVuZSc6IC03MDBcblx0fSxcblx0J0UzJzoge1xuXHRcdCdmcmVxJzogNDQwLFxuXHRcdCdkZXR1bmUnOiAtNTAwXG5cdH0sIFxuXHQnRjMnOiB7XG5cdFx0J2ZyZXEnOiA0NDAsXG5cdFx0J2RldHVuZSc6IC00MDBcblx0fSxcblx0J0czJzoge1xuXHRcdCdmcmVxJzogNDQwLFxuXHRcdCdkZXR1bmUnOiAtMjAwXG5cdH0sXG5cdCdBNCc6IHtcblx0XHQnZnJlcSc6IDQ0MCxcblx0XHQnZGV0dW5lJzogMFxuXHR9LFxuXHQnQjQnOiB7XG5cdFx0J2ZyZXEnOiA0NDAsXG5cdFx0J2RldHVuZSc6IDIwMFxuXHR9LFxuXHQnQzQnOiB7XG5cdFx0J2ZyZXEnOiA0NDAsXG5cdFx0J2RldHVuZSc6IDMwMFxuXHR9LFxuXHQnRDQnOiB7XG5cdFx0J2ZyZXEnOiA0NDAsXG5cdFx0J2RldHVuZSc6IDUwMFxuXHR9LFxuXHQnRTQnOiB7XG5cdFx0J2ZyZXEnOiA0NDAsXG5cdFx0J2RldHVuZSc6IDcwMFxuXHR9LFxuXHQnRjQnOiB7XG5cdFx0J2ZyZXEnOiA0NDAsXG5cdFx0J2RldHVuZSc6IDgwMFxuXHR9LFxuXHQnRzQnOiB7XG5cdFx0J2ZyZXEnOiA0NDAsXG5cdFx0J2RldHVuZSc6IDEwMDBcblx0fVxufTtcblxuXG5cbmxldCBzb3VuZFNwZWVkID0gMC41O1xubGV0IHRvbmVkdXJhdGlvbiA9IDAuMztcbmxldCB2aWJyYXRvZ2FpbiA9IDAuMztcbmxldCBlbnZlbG9wZVN0YXJ0RW5kVGltZSA9IFswLjAxLDAuMV07XG5sZXQgbGZvZnJlcSA9IDY7ICAvLzVcbi8vIFBhcmFtZXRyaXphdGlvbiBvZiB0aGUgNSB0b25lcyAgUGl0Y2ggZHVyYXRpb24gdm9sdW1lIGdhaW5cbi8vIERlYnJpY2F0ZWQgdG8gYmUgcmVtb3ZlZFxuLy8gZmlyc3QgaXN0IGJsYWNrIHNvdW5kXG5jb25zdCBzb3VuZHMgPSBbWy0xMCwgMC41LDAuMV0sWzMsIDAuNSwwLjldLFsxMCwgMC41LDAuOV0sWzE1LCAwLjUsMC45XSxbMCwgMC41LDAuOV1dO1xubGV0IG9zY2lsbGF0b3JUeXBlID0gJ3Nhd3Rvb3RoJzsgLy8nc2luZSc7IC8vICdzYXd0b290aCdcblxuLy8vIE5hdmlnYXRpb25cblxuY29uc3QgZGlzcE5hdkVsZW1lbnRzID0gKG9iaikgPT4ge1xuXHRvYmoubWFwKChvKSA9PiB7XG5cdFx0aWYgKG8udmlzaWJsZSl7XG5cdFx0XHQkKCcjJytvLmlkKS5zaG93KCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGxldCBlbD0kKCcjJytvLmlkKTtcblx0XHRcdGVsLmhpZGUoKTtcblx0XHRcdGVsLmNoaWxkcmVuKCdpbnB1dCcpWzBdLnZhbHVlPScwJztcblx0XHRcdC8vY29uc29sZS5sb2coZWwuY2hpbGRyZW4oJ2lucHV0JylbMF0udmFsdWUpO1xuXHRcdH1cblx0fSk7XG59O1xuXG4vLy8gU291bmQgTWV0aG9kc1xuY29uc3QgcGxheU11c2ljID0gKCkgPT4ge1xuXHQvLyBmaWxsIHNvdW5kUXVldWVcdFxuXHRsZXQgajtcblx0bGV0IHJlY3RhcnIgPSBkMy5zZWxlY3QoJyNjaGFydC1zdW0nKS5zZWxlY3QoJ2cnKS5zZWxlY3RBbGwoJ2cnKS5kYXRhKCk7XG5cdGxldCBlbGFyciA9IGQzLnNlbGVjdCgnI2NoYXJ0LXN1bScpLnNlbGVjdCgnZycpLnNlbGVjdEFsbCgnZycpWzBdO1xuICAgIGxldCBzdGFydFRpbWUgPSBhdWRpb0NvbnRleHQuY3VycmVudFRpbWU7XG4gICAgLy9jb25zb2xlLmxvZygnU3RhcnQnK3N0YXJ0VGltZSk7XG4gICAgc291bmRRdWV1ZSA9W107XG5cdGZvciAobGV0IGk9MDsgaSA8IHJlY3RhcnIubGVuZ3RoOyBpKyspIHtcblx0XHRsZXQgdiA9IHJlY3RhcnJbaV07XG5cdFx0XHRmb3IgKGo9MDtqPHYubGVuZ3RoO2orKyl7XG5cdFx0XHRcdC8vcGxheVNvdW5kKGksc291bmRzW3ZdWzBdLHNvdW5kc1t2XVsxXSxzb3VuZHNbdl1bMl0pO1xuXHRcdFx0XHQvL2FsZXJ0KGkpO1xuXHRcdFx0XHRsZXQgdG1wID0gW107XG5cdFx0XHRcdHRtcC5wdXNoKGkqc291bmRTcGVlZCtzdGFydFRpbWUraiowLjAwMDEpO1xuXHRcdFx0XHR0bXAucHVzaCh2W2pdKTtcblx0XHRcdFx0dG1wLnB1c2godG9uZWR1cmF0aW9uKTtcblx0XHRcdFx0dG1wLnB1c2goZDMuc2VsZWN0KGVsYXJyW2ldKS5zZWxlY3RBbGwoJ3JlY3QnKVswXVtqXSk7XG5cdFx0XHRcdHNvdW5kUXVldWUucHVzaCh0bXApO1xuXG5cdFx0XHR9XG5cdFx0XG5cdH1cblx0Ly9jb25zb2xlLmxvZygnc3RhcnRzZXF1ZW5jZXInK2F1ZGlvQ29udGV4dC5jdXJyZW50VGltZSk7XG4gICAgcnVuU2VxdWVuY2VycygpO1xufTtcblxuLy8gSW5pdCBTY3JlZW5cbmNvbnN0IGluaXRkM2pzID0gKGVsSWQpID0+IHtcblx0Y29uc3Qgd2lkdGggPSAxMjgwLFxuICAgIGhlaWdodCA9IDQ1O1xuICAgIGxldCBzcl92aWV3cG9ydCA9ICcwIDAgJysod2lkdGgrNzApKycgJytoZWlnaHQ7XG4gICAgY29uc3QgZGl2ID0gZDMuc2VsZWN0KGVsSWQpLFxuXHRzdmcgPSBkaXYuYXBwZW5kKCdzdmcnKVxuICAgICAgICAuYXR0cignd2lkdGgnLCB3aWR0aClcbiAgICAgICAgLmF0dHIoJ2hlaWdodCcsIGhlaWdodClcbiAgICAgICAgLmF0dHIoJ3ZpZXdCb3gnLCBzcl92aWV3cG9ydClcbiAgICAgICAgLmF0dHIoJ3ByZXNlcnZlQXNwZWN0UmF0aW8nLCAneE1pZFlNaWQgbWVldCcpO1xuXG4gICAgcmV0dXJuIHN2Zztcbn07XG5cblxuICAgIC8vIENvbnN0YW50c1xuXG4gICAgY29uc3QgcncgPSAyMCxcbiAgICByaCA9IDIwLFxuICAgIHJvd04gPTEsXG4gICAgY29sTiA9NDg7XG4gICAgLy8gaGxvb2t1cCA9IFsnIzAwMDAwMCcsJyMwOTRFOEEnLCcjMDk0RThBJywnIzA5NEU4QSddO1xuICAgIFxuXG4gICAgLy8gY29uZmlndXJlIGRpc3BsYXlcbiAgICBkaXNwTmF2RWxlbWVudHModG9uZXMpO1xuICAgIHN5bmNGb3JtRGlzcGxheSh0b25lcyk7XG5cbiAgICAvLyBiaW5kIGRhdGEgYW5kIHJlbmRlciBkM2pzXG4gICAgY29uc3Qgc3ZnID0gaW5pdGQzanMoJyNjaGFydCcpO1xuICAgIGxldCBsb29rdXBibHVlID0gWzAsMSwyLDNdLm1hcCgoaSkgPT4gdG9uZXNbaV0uY29sb3IpOyAgIFxuICAgIGxldCBteWRhdGEgPSByZWRyYXcocmVhZElucHV0KDEpKTtcblx0cmVuZGVyR3JhcGgobXlkYXRhLHN2Zyxsb29rdXBibHVlLGZhbHNlKTtcblxuICAgIGNvbnN0IHN2Z2dyZWVuID0gaW5pdGQzanMoJyNjaGFydC0yJyk7XG4gICAgbGV0IGxvb2t1cGdyZWVuID0gWzAsNCw1LDZdLm1hcCgoaSkgPT4gdG9uZXNbaV0uY29sb3IpOyBcbiAgICBsZXQgbXlkYXRhR3JlZW4gPSByZWRyYXcocmVhZElucHV0KDIpKTtcblx0cmVuZGVyR3JhcGgobXlkYXRhR3JlZW4sc3ZnZ3JlZW4sbG9va3VwZ3JlZW4sZmFsc2UpO1xuXG4gICAgY29uc3Qgc3ZncmVkID0gaW5pdGQzanMoJyNjaGFydC0zJyk7XG4gICAgbGV0IGxvb2t1cHJlZCA9IFswLDcsOCw5XS5tYXAoKGkpID0+IHRvbmVzW2ldLmNvbG9yKTsgXG4gICAgbGV0IG15ZGF0YVJlZCA9IHJlZHJhdyhyZWFkSW5wdXQoMykpO1xuXHRyZW5kZXJHcmFwaChteWRhdGFSZWQsc3ZncmVkLGxvb2t1cHJlZCxmYWxzZSk7XHRcblxuXHQvLyBzdW0gIHRoZSBkYXRhICBcblx0Y29uc3Qgc3Znc3VtID0gaW5pdGQzanMoJyNjaGFydC1zdW0nKTtcblx0bGV0IGxvb2t1cGFsbCA9IFswLDEsMiwzLDQsNSw2LDcsOCw5XS5tYXAoKGkpID0+IHRvbmVzW2ldLmNvbG9yKTsgXG5cdGxldCBteWRhdGFzdW0gPSByZWR1Y2UzZGF0YShteWRhdGFbMF0sbXlkYXRhR3JlZW5bMF0sbXlkYXRhUmVkWzBdKTtcblx0cmVuZGVyR3JhcGgobXlkYXRhc3VtLHN2Z3N1bSxsb29rdXBhbGwsdHJ1ZSk7XG5cblx0Ly8gcmVzcG9uc2l2ZSBjaGFuZ2VcbiAgICBkMy5zZWxlY3Qod2luZG93KVxuICAgIFx0Lm9uKCdyZXNpemUnLCAoKSA9PiB7XG5cdFx0ICAgIC8vbGV0IHRhcmdldFdpZHRoID0gc3ZnLm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aDtcblx0XHQgICAgbGV0IHdpbldpZHRoID0gJCh3aW5kb3cpLndpZHRoKCk7XG5cdFx0ICAgIHN2Zy5hdHRyKFwid2lkdGhcIiwgd2luV2lkdGgpO1xuXHRcdCAgICBzdmdncmVlbi5hdHRyKFwid2lkdGhcIiwgd2luV2lkdGgpO1xuXHRcdCAgICBzdmdyZWQuYXR0cihcIndpZHRoXCIsIHdpbldpZHRoKTtcblx0XHQgICAgc3Znc3VtLmF0dHIoXCJ3aWR0aFwiLCB3aW5XaWR0aCk7XG4gIFx0XHR9KTtcbiAgICAvL1RyaWdlciByZXNpemUgRXZlbnRcbiAgXHRsZXQgdG1wdyA9ICQod2luZG93KS53aWR0aCgpO1xuXHRzdmcuYXR0cignd2lkdGgnLCB0bXB3KTtcblx0c3ZnZ3JlZW4uYXR0cignd2lkdGgnLCB0bXB3KTtcblx0c3ZncmVkLmF0dHIoJ3dpZHRoJywgdG1wdyk7XG5cdHN2Z3N1bS5hdHRyKFwid2lkdGhcIiwgdG1wdyk7XG5cblx0XG5cblx0Ly8gbGV0IHN2Z3Rlc3QgPSBpbml0ZDNqcygnI2NoYXJ0LXRlc3QnKTtcblx0Ly8gbGV0IG15ZGF0YXRlc3QgPSBbW1sxLDIsM10sWzAsNCw1XSxbMSw0XSxbNCw5XSxbMSw0LDddLFswXSxbMF0sWzBdLFswXSxbMF0sWzBdLFswXSxbMF0sWzBdLFswXV1dO1xuXHQvLyByZW5kZXJHcmFwaChteWRhdGF0ZXN0LHN2Z3Rlc3QsbG9va3VwYWxsKTtcblxuXHQvLyBSZWdpc3RlciBCdXR0b25zXG5cdC8vIGJsYWNrYnV0dG9uIG9ubHkgb25lIHJlZ2lzdHJhdGlvblxuXHRyZWdpc3RlckJsYWNrVm9sdW1lQnV0dG9uKCk7XG5cdHJlZ2lzdGVyQmxhY2tUb25CdXR0b24oKTtcblxuXHQvLyBSZWdpc3RlciAzIHJvd3MgViBCdXR0b25cblx0Ly8gVE9ETyBDaGVjayBSRWdpc3RlciBCdXR0b25cblx0WzEsMiwzXS5tYXAocmVnaXN0ZXJCdXR0b24pO1xuXHRbMSwyLDNdLm1hcChyZWdpc3RlclRvbkJ1dHRvbik7XG5cdFsxLDIsM10ubWFwKHJlZ2lzdGVyVm9sdW1lQnV0dG9uKTtcblxuXHRyZWdpc3RlcklucHV0T25DaGFuZ2UoMSxzdmcsbG9va3VwYmx1ZSk7XG5cdHJlZ2lzdGVySW5wdXRPbkNoYW5nZSgyLHN2Z2dyZWVuLGxvb2t1cGdyZWVuKTtcblx0cmVnaXN0ZXJJbnB1dE9uQ2hhbmdlKDMsc3ZncmVkLGxvb2t1cHJlZCk7XG5cblxuXHRyZWdpc3RlclBsYXlCdXR0b24oKTtcblx0cmVnaXN0ZXJTdG9wQnV0dG9uKCk7XG5cdC8vcmVnaXN0ZXJQYXJhbWV0ZXJCdXR0b24oKTtcblxuLy9pb3MgaGFja1xuLy8gXHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCBmdW5jdGlvbigpIHtcblxuLy8gXHQvLyBjcmVhdGUgZW1wdHkgYnVmZmVyXG4vLyBcdHZhciBidWZmZXIgPSBhdWRpb0NvbnRleHQuY3JlYXRlQnVmZmVyKDEsIDEsIDIyMDUwKTtcbi8vIFx0dmFyIHNvdXJjZSA9IGF1ZGlvQ29udGV4dC5jcmVhdGVCdWZmZXJTb3VyY2UoKTtcbi8vIFx0c291cmNlLmJ1ZmZlciA9IGJ1ZmZlcjtcblxuLy8gXHQvLyBjb25uZWN0IHRvIG91dHB1dCAoeW91ciBzcGVha2Vycylcbi8vIFx0c291cmNlLmNvbm5lY3QoYXVkaW9Db250ZXh0LmRlc3RpbmF0aW9uKTtcblxuLy8gXHQvLyBwbGF5IHRoZSBmaWxlXG4vLyBcdHNvdXJjZS5ub3RlT24oMCk7XG5cbi8vIH0sIGZhbHNlKTtcblxuXG5cbi8vIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hzdGFydFwiLCBmdW5jdGlvbiAoKXtcdFxuLy8gXHRcdGlmIChoYWRfdG91Y2gpXHRcdHJldHVybjtcdFx0XG4vLyBcdFx0Ly8gcGxheSBlbXB0eSBidWZmZXIgdG8gdW5tdXRlIGF1ZGlvXHRcbi8vIFx0XHR2YXIgYnVmZmVyID0gYXVkaW9Db250ZXh0LmNyZWF0ZUJ1ZmZlcigxLCAxLCAyMjA1MCk7XHRcbi8vIFx0XHR2YXIgc291cmNlID0gYXVkaW9Db250ZXh0LmNyZWF0ZUJ1ZmZlclNvdXJjZSgpO1x0XG4vLyBcdFx0c291cmNlLmJ1ZmZlciA9IGJ1ZmZlcjtcdFxuLy8gXHRcdHNvdXJjZS5jb25uZWN0KGF1ZGlvQ29udGV4dC5kZXN0aW5hdGlvbik7XHRcbi8vIFx0XHRzb3VyY2Uuc3RhcnQoMCk7XHRcbi8vIFx0XHRoYWRfdG91Y2ggPSB0cnVlO1xuLy8gXHRcdGFsZXJ0KFwibWlzdFwiKTtcbi8vIFx0fSk7XG5cblxuXG5cblxufSk7XG5cblxuXG4iXX0=
