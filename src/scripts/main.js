$(document).ready(function(){
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
const updateGraph = (data,svg,lookup) => {
	let grp = svg.selectAll('g')
	    .data(data);

	let selection = grp.selectAll('rect').data((d) => d)
		.attr('fill', (d,i) => lookup[d[1]]);

	selection.enter()
		.append('rect')
	    .attr('x', (d, i) =>  28 * i)
	    .attr('width', rw)
	    .attr('height', rh);

	selection.exit().remove();    
};

const renderGraph = (data,svg,lookup) => {
	// Create a group for each row in the data matrix and
	// translate the group vertically
	let grp = svg.selectAll('g')
	    .data(data)
	    .enter()
	    .append('g')
	    .attr('transform', (d, i) => 'translate(0, ' + 54 * i + ')');

	// For each group, create a set of rectangles and bind 
	// them to the inner array (the inner array is already
	// binded to the group)
	grp.selectAll('rect')
	    .data((d) => d)
	    .enter()
	    .append('rect')
	        .attr('x', (d, i) =>  28 * i)
	        .attr('fill', (d,i) => lookup[d[1]])
	        .attr('width', rw)
	        .attr('height', rh);     

	//Modulo 10 ticks        
	grp.selectAll('line')
	    .data( (d) => d)
	    .enter().append('line')
	    .filter((d,i) => i%10===0)
  			.attr('x1',  (d, i) => 280 * i+1)
  			.attr('y1', 20)
  			.attr('x2', (d, i) => 280 * i+1)
  			.attr('y2',40)
  			.style('stroke', 'black')
  			.style('stroke-width','2px');      

  	// Text 
  	grp.selectAll('text')
	    .data( (d) => d)
	    .enter().append('text')
	    .filter((d,i) => i%10===0)
	    	.attr('x', (d, i) => { return 280 * i+5; })
	    	.attr('y', '38')  
	    	.attr('font-family', 'sans-serif') 
	    	.text( (d, i,k) => k*40+i*10+1); 
};

// get values
//const getButtonIds = () => ['#btn-row1-1','#btn-row1-2','#btn-row1-3','#btn-row1-4'];

// reads Parameter Ton Zahl for row one
const readInput = () => {
	let ids = [];
	// TODO use as parameter later
	let row = 1;
	let s='';
	for (let i = 1; i < 4; i++){
		s = '#btn-row'+row+'-'+i;
		ids.push(s);
	} 

	let out = [];
	for (let i in ids) {
		let elval = $(ids[i])
						.parent()
						.parent()
						.children('input')[0];
		let val = 0;
		if (typeof elval !== 'undefined'){
			val = elval.value;
		}
		out.push(val);
	}
	return out;
};

// Redraw Game
const redraw = (inpstrarr) => {
	let inp = [];
	// parse input
	for (let i = 0; i < inpstrarr.length; i++){
		inp.push(parseInt(inpstrarr[i]));
	};

    // init values
	let t = 1, // cout value
		data = [],
		col,
		nextEvent,
		tmp = 0;

	for (let i = 0; i < inp.length; i++){
		col = i;
		nextEvent = inp[col];
		if (nextEvent > 0){
			break;
		}
	}

	for (let k = 0; k < rowN; k += 1) {
		let row = [];
		data.push(row);
		for (let i = 0; i < colN; i +=1){
			if (t ===  nextEvent){
				// jump over 0 color entries
				tmp = col+1; // black has index 0
				// if something is zero go further
				while (inp[(col+1)%inp.length] < 1){
					col = (col+1)%inp.length;
				}
				nextEvent += inp[(col+1)%inp.length];
				col = (col+1)%inp.length; // next color
			} else {
				tmp = 0;
			}
			row.push([t, tmp]);
			t = t + 1;
		}
	}
	return data;
};


const highlightEl  = (el,col,time) =>{
   $(el).attr( "fill", hlookup[col]);
   setTimeout(() => {$(el).attr( "fill", lookup[col]);},time*1000);

};

//CHANGE on TON Input is applied
const registerInputOnChange = () => {
	let ids = [];
	// TODO use as parameter later
	let row = 1;
	let s='';
	for (let i = 1; i < 4; i++){
		s = '#btn-row'+row+'-'+i;
		ids.push(s);
	} 

	for (let i in ids) {
		$(ids[i])
			.parent()
			.parent()
			.children('input.form-control')
			.change(() => {
				let newdata = redraw(readInput());
				updateGraph(newdata);
			});
	}
};

// Register count Button
const registerButton = () => {
	let ids = [];
	// TODO use as parameter later
	let row = 1;
	let s='';
	for (let i = 1; i < 4; i++){
		s = '#btn-row'+row+'-'+i;
		ids.push(s);
	} 
	let ec = jQuery.Event( 'change' );
    for (let i in ids) {
    	$(ids[i])
			.parent()
			.children('ul.dropdown-menu')
			.on('click', (e) => {
				$(ids[i])
				.parent()
				.parent()
				.children('input.form-control:first')
				.attr('value',e.target.text)
				//send change event
				.trigger(ec);
		});	
    }
};


// Register Ton button
const registerTonButton = () => {
	let ids = [];
	// TODO use as parameter later
	let row = 1;
	let s='';

	for (let i = 1; i < 4; i++){
		s = '#btn-row'+row+'-'+i+'-ton';
		ids.push(s);
	} 
	// let ec = jQuery.Event( 'change' );
    for (let i in ids) {
    	$(ids[i])
			.parent()
			.children('ul.dropdown-menu')
			.on('click', (e) => {
				$(ids[i])
				.parent()
				.parent()
				.children('input.form-control:eq( 1 )')
				.attr('value',e.target.text);
				
				// do parameter change
				// index have to survive :)
			    let tmp = parseInt(e.target.parentElement.parentElement.getAttribute('nr'));
				tones[tmp].instrument = e.target.text;
				//send change event
				//.trigger(ec);
		});	
    }
};

const registerBlackTonButton = () => {
	let ids = [];
	// TODO use as parameter later
	let row = 1;
	let s = '#btn-row1-0-ton';
	ids.push(s);
	
	// let ec = jQuery.Event( 'change' );
    for (let i in ids) {
    	$(ids[i])
			.parent()
			.children('ul.dropdown-menu')
			.on('click', (e) => {
				$(ids[i])
				.parent()
				.parent()
				.children('input.form-control:first')
				.attr('value',e.target.text);

				tones[0].instrument = e.target.text;
				
				// do parameter change

				//send change event
				//.trigger(ec);
		});	

    }
};


// Register Volumen button
const registerVolumeButton = () => {
	let ids = [];
	// TODO use as parameter later
	let row = 1;
	let s='';

	for (let i = 1; i < 4; i++){
		s = '#btn-row'+row+'-'+i+'-volume';
		ids.push(s);
	} 
	// let ec = jQuery.Event( 'change' );
    for (let i in ids) {
    	$(ids[i])
			.parent()
			.children('ul.dropdown-menu')
			.on('click', (e) => {
				$(ids[i])
				.parent()
				.parent()
				.children('input.form-control:eq( 2 )')
				.attr('value',e.target.text);
				
				// do parameter change
				// index have to survive :)
			    let tmp = parseInt(e.target.parentElement.parentElement.getAttribute('nr'));

				tones[tmp].vol = e.target.text;
				tones[tmp].gain = parseInt(e.target.text)*1.0/100;
				//send change event
				//.trigger(ec);
		});	
    }
};

const registerBlackVolumeButton = () => {
	let ids = [];
	// TODO use as parameter later
	let row = 1;
	let s = '#btn-row1-0-volume';
	ids.push(s);
	
	// let ec = jQuery.Event( 'change' );
    for (let i in ids) {
    	$(ids[i])
			.parent()
			.children('ul.dropdown-menu')
			.on('click', (e) => {
				$(ids[i])
				.parent()
				.parent()
				.children('input.form-control:eq( 1 )')
				.attr('value',e.target.text);

				tones[0].vol = e.target.text;
				tones[0].gain = parseInt(e.target.text)*1.0/100;
				
				// do parameter change

				//send change event
				//.trigger(ec);
		});	

    }
};

const registerPlayButton = () => {
	$('#playmusicbtn').on('click', (e) => {
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

const registerStopButton = () => {
	$('#stopmusicbtn').on('click', (e) => {
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


const playSound = (startTime, pitchNr, duration, gainOld) => {
	//let startTime = audioContext.currentTime + delay;
  	let endTime = startTime + duration;
  	let pitch = sounds[pitchNr][0];
  	let gain = tones[pitchNr].gain;

  	let outgain = audioContext.createGain();
  	outgain.gain.value = gain;
  	outgain.connect(audioContext.destination); 	

  	let envelope = audioContext.createGain();
  	envelope.connect(outgain);
  	envelope.gain.value = 0;
  	
  	envelope.gain.setTargetAtTime(1, startTime, envelopeStartEndTime[0]);
  	envelope.gain.setTargetAtTime(0, endTime, envelopeStartEndTime[1]);

  	let oscillator = audioContext.createOscillator();
  	oscillator.connect(envelope);

  	oscillator.type = oscillatorType;
  	oscillator.detune.value = pitch * 100;
  	oscillator.frequency.value = 240;

	let vibrato = audioContext.createGain();
	vibrato.gain.value = vibratogain;
	vibrato.connect(oscillator.detune);

	let lfo = audioContext.createOscillator();
	lfo.connect(vibrato);
	lfo.frequency.value =lfofreq; 

	oscillator.start(startTime);
  	lfo.start(startTime);
  	oscillator.stop(endTime +2 );
  	lfo.stop(endTime +2);

};

/// Play Loop
const runSequencers = () => {
	if (!runSeq || soundQueue.length === 0){console.log("stop");return;}
	let ct = audioContext.currentTime;
	while (soundQueue.length>0 && soundQueue[0][0]< ct+0.15){
		//console.log('ct:'+ct+'planed time:'+soundQueue[0][0]);
		let item = soundQueue.splice(0,1);
		// playsound (starttime, pitch, duration,             gaiin)
		//playSound(item[0][0],sounds[item[0][1]][0],item[0][2],tones[item[0][1]].gain);		
	
		playSound(item[0][0],item[0][1],item[0][2],tones[item[0][1]].gain);		
		// element              color       duration
		highlightEl(item[0][3],item[0][1],item[0][2]);
	}
	setTimeout(runSequencers,90);
}

/// sounds start here
/// Sound var
let runSeq = true;
let soundQueue = [];

var audioContext = null;

try {
   window.AudioContext = window.AudioContext||window.webkitAudioContext;
   var audioContext = new AudioContext();
} catch (e) {
    console.log("No Web Audio API support");
}


//IOS Start IOSHACK
$('body').on('touchend', (e) => {
	//alert('start sound
	// create empty buffer
	var buffer = audioContext.createBuffer(1, 1, 22050);
	var source = audioContext.createBufferSource();
	source.buffer = buffer;

	// connect to output (your speakers)
	source.connect(audioContext.destination);

	// play the file
	if (typeof source.noteOn !== 'undefined'){
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
let tones = [{
	'nr':0,
	'gain':0.1,
	'vol':'10%',
	'color':'#454545',
	'hover':'#000000',
	'instrument':'D3',
	'id':'ig-row1-0',
	'visible':true
},
{
	'nr':1,
	'gain':0.8,
	'vol':'80%',
	'color':'#296EAA',
	'hover':'#094E8A',
	'instrument':'E3',
	'id':'ig-row1-1',
	'visible':true
},
{
	'nr':2,
	'gain':0.0,
	'vol':'0%',
	'color':'#5491B5',
	'hover':'#094E8A',
	'instrument':'F3',
	'id':'ig-row1-2',
	'visible':false
},
{
	'nr':3,
	'gain':0.0,
	'vol':'0%',
	'color':'#5491B5',
	'hover':'#094E8A',
	'instrument':'G3',
	'id':'ig-row1-3',
	'visible':false
}];


// sounds
let notes = {
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



let soundSpeed = 0.5;
let toneduration = 0.3;
let vibratogain = 0.3;
let envelopeStartEndTime = [0.01,0.1];
let lfofreq = 6;  //5
// Parametrization of the 5 tones  Pitch duration volume gain
// Debricated to be removed
// first ist black sound
const sounds = [[-10, 0.5,0.1],[3, 0.5,0.9],[10, 0.5,0.9],[15, 0.5,0.9],[0, 0.5,0.9]];
let oscillatorType = 'sawtooth'; //'sine'; // 'sawtooth'


/// Sound Methods
const playMusic = () => {
	// fill soundQueue	
	let rectarr = d3.selectAll('rect').data();
	let elarr = d3.selectAll('rect')[0];
    let startTime = audioContext.currentTime;
    //console.log('Start'+startTime);
    soundQueue =[];
	for (let i=0; i < rectarr.length; i++) {
		let v = rectarr[i][1];
		//playSound(i,sounds[v][0],sounds[v][1],sounds[v][2]);
		//alert(i);
		let tmp = [];
		tmp.push(i*soundSpeed+startTime);
		tmp.push(v);
		tmp.push(toneduration);
		tmp.push(elarr[i]);
		soundQueue.push(tmp);
	}
	//console.log('startsequencer'+audioContext.currentTime);
    runSequencers();
};

// Init Screen
const initd3js = (elId) => {
	const width = 1280,
    height = 45;
    let sr_viewport = '0 0 '+(width+70)+' '+height;
    const div = d3.select(elId),
	svg = div.append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', sr_viewport)
        .attr('preserveAspectRatio', 'xMidYMid meet');
    // responsive change
    d3.select(window)
    	.on("resize", () => {
	    //let targetWidth = svg.node().getBoundingClientRect().width;
	    let winWidth = $(window).width();
	    svg.attr("width", winWidth);
  	});

    return svg;
};


    // Constants

    const rw = 20,
    rh = 20,
    rowN =1,
    colN =48,
    //colordefinition
    lookupblue = ['#454545','#296EAA','#5491B5','#79BEFA','#46B0CF'],
    hlookup = ['#000000','#094E8A','#094E8A','#094E8A','#2690AF'];
    // lookup = ['#454545','#296EAA','#D43F3A','#5CB85C','#46B0CF'],
    // hlookup = ['#000000','#094E8A','#A41F1A','#3C983C','#2690AF'],
    //rrange = lookup.length;

    // bind data and render d3js
    const svg = initd3js('#chart');
    let mydata = redraw(readInput());
	renderGraph(mydata,svg,lookupblue);

    const svggreen = initd3js('#chart-2');
    let mydataGreen = redraw(readInput());
	renderGraph(mydataGreen,svggreen,lookupblue);

    const svgred = initd3js('#chart-3');
    let mydataRed = redraw(readInput());
	renderGraph(mydataRed,svgred,lookupblue);	


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



