$(document).ready(function(){
// create HTML stuff
const createHtmlTonControl = (nr) => {
	const posnr = '1';
	

	let elContainer = 'ton-control-'+nr;
	let elOutDiv = document.createElement("DIV");
	elOutDiv.setAttribute("class", "col-xs-3");
	
	let elinputGroup = document.createElement("DIV");
	elinputGroup.setAttribute("class", "input-group-btn"); 
	elOutDiv.appendChild(elinputGroup);
	// BUTTON
	let textnode = document.createTextNode(" Zahl"); 
	let btn = document.createElement("BUTTON");
	let sid='btn-row'+nr+'-'+posnr;
	btn.setAttribute("id", sid);
	btn.setAttribute("class", "btn btn-info dropdown-toggle");
	btn.appendChild(textnode);
	elinputGroup.appendChild(btn);
	document.getElementById(elContainer).appendChild(elOutDiv);


};

// 
const updateGraph = (data) => {
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

const renderGraph = (data) => {
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
const getButtonIds = () => ['#btn-row1-1','#btn-row1-2','#btn-row1-3','#btn-row1-4'];

const readInput = () => {
	let ids = getButtonIds();
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

const registerInputOnChange = () => {
	let ids = getButtonIds();
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

// Listen on Menu entry
const registerButton = () => {
	let idArr = getButtonIds();
	let ec = jQuery.Event( 'change' );
    for (let i in idArr) {
    	$(idArr[i])
			.parent()
			.children('ul.dropdown-menu')
			.on('click', (e) => {
				$(idArr[i])
				.parent()
				.parent()
				.children('input.form-control')
				.attr('value',e.target.text)
				//send change event
				.trigger(ec);
		});	
    }
};

const registerPlayButton = () => {
	$('#playmusicbtn').on('click', (e) => {

		if (audioContext === null){
			try {
    			window.AudioContext = window.AudioContext || window.webkitAudioContext;
    			audioContext = new window.AudioContext();
			} catch (e) {
    			console.log("No Web Audio API support");
			}
			let oscillator = audioContext.createOscillator();
 				oscillator.frequency.value = 400;
 				oscillator.connect(audioContext.destination);
 				oscillator.start(0);
 				oscillator.stop(.5)
		}
		runSeq = true;
		playMusic();
		//alert('here');
	});
	$('#playmusicbtn').on('touchend', (e) => {

		runSeq = true;
		playMusic();
		//alert('here');
	});
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


const playSound = (startTime, pitch, duration, gain) => {
	//let startTime = audioContext.currentTime + delay;
  	let endTime = startTime + duration;

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
		let tone = soundQueue.splice(0,1);
		// playsound (starttime, pitch, duration,             gaiin)
		playSound(tone[0][0],sounds[tone[0][1]][0],tone[0][2],sounds[tone[0][1]][2]);		
		// element              color       duration
		highlightEl(tone[0][3],tone[0][1],tone[0][2]);
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
let tones = [];
let tone0 = {};
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

let tone1 = {};
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

let tone2 = {};
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

let tone3 = {};
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


let soundSpeed = 0.5;
let toneduration = 0.3;
let vibratogain = 0.3;
let envelopeStartEndTime = [0.01,0.1];
let lfofreq = 6;  //5
// Parametrization of the 5 tones  Pitch duration volume gain
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
	const width = 1280,
    height = 45;
    let sr_viewport = '0 0 '+(width+60)+' '+height;
    const div = d3.select('#chart'),
    svg = div.append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', sr_viewport)
        .attr('preserveAspectRatio', 'xMidYMid meet'),
    //grid    
    rw = 20,
    rh = 20,
    rowN =1,
    colN =48,
    //colordefinition
    lookup = ['#454545','#296EAA','#5491B5','#79BEFA','#46B0CF'],
    hlookup = ['#000000','#094E8A','#094E8A','#094E8A','#2690AF'],
    // lookup = ['#454545','#296EAA','#D43F3A','#5CB85C','#46B0CF'],
    // hlookup = ['#000000','#094E8A','#A41F1A','#3C983C','#2690AF'],
    rrange = lookup.length;

    // responsive change
    d3.select(window)
    	.on("resize", () => {
    //let targetWidth = svg.node().getBoundingClientRect().width;
    let winWidth = $(window).width();
    svg.attr("width", winWidth);
  });

    // Build HTML
    //createHtmlTonControl('1');


	// Register Buttons
	registerButton();
	registerInputOnChange();
	let mydata = redraw(readInput());
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



