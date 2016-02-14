$(document).ready(function(){
// Model
// ----------------------------------------------------------
// Sound constansts presets
let tones = [{
	'nr':0,
	'gain':0.2,
	'vol':'20%',
    'color':'#757575',
	'hover':'#000000',
	'instrument':'D3',
	'id':'ig-row1-0',
	'visible':true
},
{
	'nr':1,
	'gain':0.8,
	'vol':'20%',
	'color':'#296EAA',
	'hover':'#094E8A',
	'instrument':'A4',
	'id':'ig-row1-1',
	'visible':true
},
{
	'nr':2,
	'gain':0.0,
	'vol':'0%',
	'color':'#5491B5',
	'hover':'#346175',
	'instrument':'F3',
	'id':'ig-row1-2',
	'visible':false
},
{
	'nr':3,
	'gain':0.0,
	'vol':'0%',
	'color':'#79BEFA',
	'hover':'#599EBA',
	'instrument':'G3',
	'id':'ig-row1-3',
	'visible':false
},

{
	'nr':4,
	'gain':0.5,
	'vol':'40%',
	'color':'#4BA84B',
	'hover':'#2B882B',
	'instrument':'D4',
	'id':'ig-row2-1',
	'visible':true
},
{
	'nr':5,
	'gain':0.0,
	'vol':'0%',
	'color':'#547249',
	'hover':'#245219',
	'instrument':'B4',
	'id':'ig-row2-2',
	'visible':false
},
{
	'nr':6,
	'gain':0.0,
	'vol':'0%',
	'color':'#1F6241',
	'hover':'#1F6241',
	'instrument':'C4',
	'id':'ig-row2-3',
	'visible':false
},
{
	'nr':7,
	'gain':0.3,
	'vol':'80%',
	'color':'#DB3833',
	'hover':'#AB1813',
	'instrument':'G4',
	'id':'ig-row3-1',
	'visible':true
},
{
	'nr':8,
	'gain':0.0,
	'vol':'0%',
	'color':'#B30B0B',
	'hover':'#530B0B',
	'instrument':'E4',
	'id':'ig-row3-2',
	'visible':false
},
{
	'nr':9,
	'gain':0.0,
	'vol':'0%',
	'color':'#A1123F',
	'hover':'#51021F',
	'instrument':'F4',
	'id':'ig-row3-3',
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

let screenView = {
	'1' : {
		'visible' 	: true,
		'graph'		: 'chart',
		'data'		: true

	},
	'2'	: {
		'visible'  	: true,
		'graph'		: 'chart-2',
		'addrow'	: false,
		'minrow'	: false,
		'data'		: true,
		'changerowid' : 'addrow2'
	}, 
	'3'	: {
		'visible'  	: true,
		'graph'		: 'chart-3',
		'addrow'	: false,
		'redrow'	: false,
		'data'		: true,
		'changerowid' : 'addrow3'
	},
	'4'	: {
		'visible'  	: true,
		'graph'		: 'chart-sum',
		'data'		: true
	},
	'archild' 		: '<div><i class="fa fa-plus-square"></i><span>Ton-Zahlenreihe</span></div>',
	'minrowchild' 	: '<div><i class="fa fa-minus-square"></i><span>Ton-Zahlenreihe</span></div>', 
	'addbttn'		: '<span class="glyphicon glyphicon-plus"></span>',
	'minbttn'		: '<span class="glyphicon glyphicon-minus"></span>'
};


// ----------------------------------------------------------
// Model End

	const range = (begin, end, interval = 1) => {
		let out = [];
		for (let i = begin; i < end; i += interval) {
         	out.push(i);
     	}
     	return out;
	};

// ----------------------------------------------------------
// Visual D3JS Start

// Constants for D3JS
const rw = 20, // rect width
rh = 20, // rect height
rowN =1, // number of rows
colN =48; // number of columns

// Main visual D3 update function
const updateGraph = (data,svg,lookup,checksum) => {
	// draw sumation row
	if (checksum){
		let grp = svg.selectAll('svg g')
	    .data(data);

	    let innergrp = grp.selectAll('g')
	    .data((d) => d);

	    // case 3 -> 2 -> 1 remove g
	    innergrp
	    .exit()
	    .remove();
	    
	    innergrp
	    .enter()
		.append('g')
		.attr('transform', (d, i) => 'translate(' + 28 * i + ',0)');
		
		// select rects
		let rects=innergrp.selectAll('rect')
		.data((d) => d);
		
		// case 3 -> 2 -> 1 remove rects
		rects.exit()
		.remove();

		//update color pos width
		rects.attr('fill', (d,i) => lookup[d])
		.attr('x', (d, i,k) =>  rw/data[0][k].length * i)
		.attr('width', (d,i,k) =>  rw/data[0][k].length)
		.enter()
		.append('rect')
		//add color pos width hight
		.attr('fill', (d,i) => lookup[d])
		.attr('x', (d, i,k) =>  rw/data[0][k].length * i)
		.attr('width', (d,i,k) =>  rw/data[0][k].length)
		.attr('height', rh);

	// draw a single row	
	} else {
		svg.selectAll('svg g rect')
		.data(data[0])
		// update color
		.attr('fill', (d,i) => lookup[d])
		.enter()
		.append('rect')
	    .attr('x', (d, i) =>  28 * i)
	    .attr('width', rw)
	    .attr('height', rh);
	    //.remove();
	}
};

const renderGraph = (data,svg,lookup,checksum) => {
	// Create a group for each row in the data matrix and
	// translate the group vertically
	let grp = svg.selectAll('svg g')
	    .data(data)
	    .enter()
	    .append('g')
	    .attr('transform', (d, i) => 'translate(0, ' + 54 * i + ')');  

	if (checksum){
		//inner structure
		let ingrp = grp.selectAll('g')
		    .data((d) => d)
		    .enter()
		    .append('g')
		    .attr('transform', (d, i) => 'translate(' + 28 * i + ',0)');

		ingrp.selectAll('rect')
		    .data((d) => d)
		    .enter()
		    .append('rect')
		    	.attr('x', (d, i,k) =>  rw/data[0][k].length * i)
		        .attr('fill', (d,i) => lookup[d])
		        .attr('width', (d,i,k) =>  rw/data[0][k].length)
		        .attr('height', rh);  
	} else {
		// For each group, create a set of rectangles and bind 
		// them to the inner array (the inner array is already
		// binded to the group)
		grp.selectAll('rect')
			// .filter( (d,i) => typeof d[i] === 'number')
		    .data((d) => d)
		    .enter()
		    .append('rect')
		        .attr('x', (d, i) =>  28 * i)
		        .attr('fill', (d,i) => lookup[d])
		        .attr('width', rw)
		        .attr('height', rh);     
	}

	//Modulo 10 ticks        
	grp.selectAll('line')
	    .data((d) => {
	    	let tmp = Math.trunc(d.length / 10);
	    	let out = new Array(tmp+1).fill(0);
	    	return out;
	    })
	    .enter().append('line')
  			.attr('x1',  (d, i) => 280 * i+1)
  			.attr('y1', 20)
  			.attr('x2', (d, i) => 280 * i+1)
  			.attr('y2',40)
  			.style('stroke', 'black')
  			.style('stroke-width','2px');
  
  	// Text 
  	grp.selectAll('text')
	    .data((d) => {
	    	let tmp = Math.trunc(d.length / 10);
	    	let out = new Array(tmp+1).fill(0);
	    	return out;
	    })
	    .enter().append('text')
	    //.filter((d,i) => i%10===0)
	    	.attr('x', (d, i) => { return 280 * i+5; })
	    	.attr('y', '38')  
	    	.attr('font-family', 'sans-serif') 
	    	.text( (d, i,k) => k*40+i*10+1);
};
// ----------------------------------------------------------
// Visual D3JS End




// User Interactions
// reads Parameter Ton Zahl for row one
const readInput = (row) => {
	let ids = [];
	// TODO use as parameter later
	if (typeof row === 'undefined'){
		alert ('row is undefined');
	}
	// let row = 1;
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

// Sum all rows together
// Reduce data from 3 arrays to one Array
const reduce3data = (arrB,arrG,arrR) => {
	//console.log(arrB,arrG,arrR);
	let out = [];
	let outer = [];
	outer.push(out);
	let tmp,s;
	for(let i=0; i<arrB.length; i++){
		tmp = [];
		tmp.push(arrB[i]);
		tmp.push(arrG[i]===0 ? 0 : arrG[i] + 3);
		tmp.push(arrR[i]===0 ? 0 : arrR[i] + 6);
		s = new Set(tmp);
		if (s.size > 1 && s.has(0)){
			s.delete(0);
		}
		out.push(Array.from(s));
	}
	return outer;
};

// calculate a numberarray
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

	// determine the start value;
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
			// just array
			row.push(tmp);
			//row.push([t, tmp]);
			t = t + 1;
		}
	}
	return data;
};

//Highlight Element when played
const highlightEl  = (el,col,time,hover) =>{
   $(el).attr( "fill", hover);
   setTimeout(() => {$(el).attr( "fill", col);},time*1000);
};

//React on change of input number
//calculate and redraw row, calculate data for all rows and
//apply reducedata
// TO DO Performance Optimazation
const registerInputOnChange = (row,svg,lookup) => {
	let ids = [];
	// TODO use as parameter later
	// let row = 1;
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
				let newdata = redraw(readInput(row));
				updateGraph(newdata,svg,lookup,false);
				let mydata = redraw(readInput(1));
				let mydataGreen = redraw(readInput(2));
				let mydataRed = redraw(readInput(3));
				let newdata2 = reduce3data(mydata[0],mydataGreen[0],mydataRed[0]);
				updateGraph(newdata2,svgList[3],
					[0,1,2,3,4,5,6,7,8,9].map((i) => tones[i].color),true);
			});
	}
};

// Registration of count Button
const registerButton = (row) => {
	let ids = [];
	// TODO use as parameter later
	//let row = 1;
	let s='';
	let tmpEl;
	for (let i = 1; i < 4; i++){
		s = '#btn-row'+row+'-'+i;
		ids.push(s);
	} 
	
    for (let i in ids) {
    	tmpEl = $(ids[i]).parent().children('ul.dropdown-menu');
    	$(tmpEl).on('click', (e) => {
			let inpEl = e.target.parentElement.parentElement.parentElement.parentElement.children[1];
			inpEl.setAttribute('value',e.target.text);
			$(inpEl).val(e.target.text);
			$(inpEl).trigger(jQuery.Event('change'));
		});	
    }
};

// Register Ton button
const registerTonButton = (row) => {
	let ids = [];
	let s='';

	for (let i = 1; i < 4; i++){
		s = '#btn-row'+row+'-'+i+'-ton';
		ids.push(s);
	} 
    for (let i in ids) {
    	$(ids[i])
			.parent()
			.children('ul.dropdown-menu')
			.on('click', (e) => {
				// index have to survive :)
			    let nr = parseInt(e.target.parentElement.parentElement.getAttribute('nr'));
				tones[nr].instrument = e.target.text;
				updateInput(tones,nr);
		});	
    }
};
//Register first Black Button
const registerBlackTonButton = () => {
    $('#btn-row0-0-ton')
		.parent()
		.children('ul.dropdown-menu')
		.on('click', (e) => {
			tones[0].instrument = e.target.text;
			updateInput(tones,0);
		});	
};
// Register Volumen button
const registerVolumeButton = (row) => {
	let ids = [];
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
				let nr =parseInt(e.target.parentElement.parentElement.getAttribute('nr'));
				tones[nr].vol = e.target.text;
				tones[nr].gain = parseInt(e.target.text)*1.0/100;
				updateInput(tones,nr);
		});	
    }
};

// Register First Gray Button
const registerBlackVolumeButton = () => {
	$('#btn-row0-0-volume')
		.parent()
		.children('ul.dropdown-menu')
		.on('click', (e) => {
			tones[0].vol = e.target.text;
			tones[0].gain = parseInt(e.target.text)*1.0/100;
			updateInput(tones,0);
		});	
};

// Helperclass Add or update a Text in a button
const changeTextInLastSpan = (sEl,txt) => {
	if (sEl.children().length < 2) {
			let el = document.createElement('span');
			el.appendChild(document.createTextNode(txt));
			sEl.append(el);
		} else {
			sEl.children().last().text(txt);
		}
};

// update view if button model changed
const updateInput = (obj,nr) => {
	//let iel = $('#'+obj[nr].id).children('input');
	let rownr,id;
	if (nr<1){
		rownr = 0;
		id = nr;
	} else {
		rownr = Math.trunc((nr-1)/3) + 1;
		id = (nr-1)%3+1;
	}

	let btn = $('#'+'btn-row'+rownr+'-'+id+'-ton');
	let txt = ' '+obj[nr].instrument;
	changeTextInLastSpan(btn,txt);

	btn = $('#'+'btn-row'+rownr+'-'+id+'-volume');
	txt = ' '+obj[nr].vol;
	changeTextInLastSpan(btn,txt);
	// }
};

// update all Button views
const syncFormDisplay = (obj) => {
	for (let i = 0; i < obj.length; i++){
		updateInput(obj,i);
	}
};

// Register Play Button
const registerPlayButton = () => {
	$('#playmusicbtn').on('click', (e) => {
		runSeq = true;
		playMusic();
	});
};

// Register Stop Button
const registerStopButton = () => {
	$('#stopmusicbtn').on('click', (e) => {
		runSeq = false;
	});
};

// Register all ScreenPlusBttns
const registerScreenPlusBttn = () => {
	let s;
	for (let i=1; i<4; i++){
		s = 'btn-row'+i+'-2-add';
		$('#'+s).on('click', (e) => {
			let nr;
			let k = 2;
			let ta = e.target.getAttribute('action');
			if (typeof ta === 'undefined' || ta === null){
				ta = e.target.parentElement.getAttribute('action');
			}
			let tmp = ta.split('');
			nr = (parseInt(tmp[1])-1)*3+k;
			if (tmp[0] === '+'){
				tones[nr].visible = true;
				$('#'+tones[nr].id).show();
			}
			if (tmp[0] === '-'){
				tones[nr].visible = false;
				$('#'+tones[nr].id).hide();
			}
			updateScreenPlusElement();
			
		});
		s = 'btn-row'+i+'-3-add';
		$('#'+s).on('click', (e) => {
			let nr;
			let k = 3;
			let ta = e.target.getAttribute('action');
			if (typeof ta === 'undefined' || ta === null){
				ta = e.target.parentElement.getAttribute('action');
			}
			let tmp = ta.split('');
			nr = (parseInt(tmp[1])-1)*3+k;
			if (tmp[0] === '+'){
				tones[nr].visible = true;
				$('#'+tones[nr].id).show();
			}
			if (tmp[0] === '-'){
				tones[nr].visible = false;
				$('#'+tones[nr].id).hide();
			}
			updateScreenPlusElement();
		});
	}
};

// Sound 
// ----------------------------------------------------------
const playSound = (startTime, pitchNr, duration, gainOld) => {
	//let startTime = audioContext.currentTime + delay;
  	let endTime = startTime + duration;
  	//let pitch = tones[pitchNr].instrument; 
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
  	oscillator.detune.value = notes[tones[pitchNr].instrument].detune;
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
		// element              color       duration                 hovercolor
		highlightEl(item[0][3],tones[item[0][1]].color,item[0][2],tones[item[0][1]].hover);
	}
	setTimeout(runSequencers,90);
}

/// Important Sound Variables !!!
let runSeq = true;
let soundQueue = [];
var audioContext = null;

try {
   window.AudioContext = window.AudioContext||window.webkitAudioContext;
   var audioContext = new AudioContext();
} catch (e) {
    console.log("No Web Audio API support");
}
// TODO Feedback if it is not working with the used device

//IOS Start IOSHACK
$('body').on('touchend', (e) => {
	//alert('start sound
	// create empty buffer
	let buffer = audioContext.createBuffer(1, 1, 22050);
	let source = audioContext.createBufferSource();
	source.buffer = buffer;

	// connect to output (your speakers)
	source.connect(audioContext.destination);

	// play the file
	if (typeof source.noteOn !== 'undefined'){
		source.noteOn(0);
	}
	let src = null;
	src = audioContext.createOscillator();
	src.type = 'square';
	src.frequency.value = 440;
	src.connect(audioContext.destination);
	let ct = audioContext.currentTime;
	src.start(ct+0.05);
	src.stop(ct+0.06);
	// Event onlie once
	$('body').unbind( 'touchend');
});
//IOS END

/// Main Sound Play Method Fill the queue and time the visual
const playMusic = () => {
	// fill soundQueue	
	let j;
	let rectarr = d3.select('#chart-sum').select('g').selectAll('g').data();
	let elarr = d3.select('#chart-sum').select('g').selectAll('g')[0];
    let startTime = audioContext.currentTime;
    //console.log('Start'+startTime);
    soundQueue =[];
	for (let i=0; i < rectarr.length; i++) {
		let v = rectarr[i];
			for (j=0;j<v.length;j++){
				//playSound(i,sounds[v][0],sounds[v][1],sounds[v][2]);
				//alert(i);
				let tmp = [];
				tmp.push(i*soundSpeed+startTime+j*0.0001);
				tmp.push(v[j]);
				tmp.push(toneduration);
				tmp.push(d3.select(elarr[i]).selectAll('rect')[0][j]);
				soundQueue.push(tmp);
			}
	}
	//console.log('startsequencer'+audioContext.currentTime);
    runSequencers();
};
// sound constants
let soundSpeed = 0.5;
let toneduration = 0.3;
let vibratogain = 0.3;
let envelopeStartEndTime = [0.01,0.1];
let lfofreq = 6;  //5
let oscillatorType = 'sawtooth'; //'sine'; // 'sawtooth'
// ----------------------------------------------------------
// Sound End 



// Screen Interaction add und remove mnues
// ----------------------------------------------------------
const nrOfActiveBttnGroup = (nr) => {
	let arr = [1,2,3].map((i) => (nr-1)*3+i);
	let barr = arr.map((i) => tones[i].visible)
	let tarr = barr.filter((i) => i === true)
	return tarr.length;
};
const changeScreenbttn = (id,html,act) => {
	$('#'+id).attr('action',act).children().replaceWith(html);
};

const updateScreen = () => {
	let s = '';
	for (let row in screenView){
		if (!screenView[row].visible){
			// delete all row elements
			s = '#row'+row;
			$(s).hide();
		}
	}
};

const updateScreenPlusElement = () => {
	let nr,s,tmp,el,inpEl;
	for (let i=1; i<4; i++){
		nr = nrOfActiveBttnGroup(i);
		switch(nr){
			case 1:
				s = 'btn-row'+i+'-2-add';
				changeScreenbttn(s,screenView.addbttn,'+'+i);
				$('#'+s).show();
				$('#btn-row'+i+'-3-add').hide();
				tmp = i*3;
				el=$('#'+tones[tmp].id);
				if (typeof el.children('input')[0] !== 'undefined'){
					inpEl = el.children('input')[0];
					inpEl.value=0;
					$(inpEl).trigger(jQuery.Event('change'));
				}
				el=$('#'+tones[tmp-1].id);
				if (typeof el.children('input')[0] !== 'undefined'){
					inpEl = el.children('input')[0];
					inpEl.value=0;
					$(inpEl).trigger(jQuery.Event('change'));
				}
				break;
			case 2:
				s = 'btn-row'+i+'-2-add';
				changeScreenbttn(s,screenView.minbttn,'-'+i);
				$('#'+s).show();
				s = 'btn-row'+i+'-3-add';
				changeScreenbttn(s,screenView.addbttn,'+'+i);
				$('#'+s).show();
				tmp = i*3;
				el=$('#'+tones[tmp].id);
				if (typeof el.children('input')[0] !== 'undefined'){
					inpEl = el.children('input')[0];
					inpEl.value=0;
					$(inpEl).trigger(jQuery.Event('change'));
				}
				break;
			case 3:
				$('#btn-row'+i+'-2-add').hide(); 
				s = 'btn-row'+i+'-3-add';
				changeScreenbttn(s,screenView.minbttn,'-'+i);
				$('#'+s).show();
				break
			default:
		}
	}
};
const dispNavElements = (obj) => {
	obj.map((o) => {
		if (o.visible){
			$('#'+o.id).show();
		} else {
			let el=$('#'+o.id);
			el.hide();
			// TODO reset INPUT
			if (typeof el.children('input')[0] !== 'undefined'){
				el.children('input')[0].value=0;
			}
			
			//console.log(el.children('input')[0].value);
		}
	});
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
    return svg;
};
// Main 
// ----------------------------------------------------------   
    // configure display
    dispNavElements(tones);
    syncFormDisplay(tones);
    updateScreenPlusElement();

    // bind data and render d3js
    let conf = [[1,4],[4,7],[7,10],[1,10]];
    let svgList = [];
    let mydataList = [];
    let svg = null;
    let arr = [];
    let lookup = null;
    let mydata = null;
    let i,j;
    let tmpw = $(window).width();

    for (i = 1; i<5; i++){
    	svg = initd3js('#'+screenView[`${i}`].graph);
    	svg.attr('width', tmpw);
    	svgList.push(svg);
    	arr = [0];
    	for (j of range(conf[i-1][0],conf[i-1][1])){
    		arr.push(j);
    	}
    	lookup = arr.map((i) => tones[i].color);
    	if (i < 4){
    		mydata = redraw(readInput(i));
    		mydataList.push(mydata);
    		registerInputOnChange(i,svg,lookup);
    		renderGraph(mydata,svg,lookup,false);

    	} else {
    		mydata = reduce3data(mydataList[0][0],mydataList[1][0],mydataList[2][0]);
    		renderGraph(mydata,svg,lookup,true);
    	}
    }

	// responsive change
    d3.select(window)
    	.on('resize', () => {
		    let winWidth = $(window).width();
		    for(let i=0; i < svgList.length; i++){
		    	svgList[i].attr("width", winWidth);
		    }
  		});

	// Register Buttons
	// blackbutton only one registration
	registerBlackVolumeButton();
	registerBlackTonButton();

	// Register 3 rows V Button
	// TODO Check REgister Button
	[1,2,3].map(registerButton);
	[1,2,3].map(registerTonButton);
	[1,2,3].map(registerVolumeButton);

	registerScreenPlusBttn();
	registerPlayButton();
	registerStopButton();
	updateScreen();
});



