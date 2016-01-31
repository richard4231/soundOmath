$(document).ready(function(){

let updateGraph = (data) =>{
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

let renderGraph = (data) => {
	// Create a group for each row in the data matrix and
	// translate the group vertically
	let grp = svg.selectAll('g')
	    .data(data)
	    .enter()
	    .append('g')
	    .attr('transform', (d, i) => 'translate(5, ' + 54 * i + ')');

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
let getButtonIds = () => ['#btn-row1-1','#btn-row1-2','#btn-row1-3','#btn-row1-4'];

let readInput = () => {
	let ids = getButtonIds();
	let out = [];
	for (let i in ids) {
		let val = $(ids[i])
						.parent()
						.parent()
						.children('input')[0].value;
		out.push(val);
	}
	return out;
};

// Redraw Game
let redraw = (inpstrarr) => {
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
}


let registerInputOnChange = () => {
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
let registerButton = () => {
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

let registerPlayButton = () => {
	$('#playmusicbtn').on('click', (e) => {
		runSeq = true;
		playMusic();
		//alert('here');
	});
};


let registerStopButton = () => {
	$('#stopmusicbtn').on('click', (e) => {
		runSeq = false;
		//alert('here');
	});
};

// Sound Definition
let runSeq = true;

let playSound = (startTime, pitch, duration, gain) => {
	//let startTime = audioContext.currentTime + delay;
  	let endTime = startTime + duration;

  	let outgain = audioContext.createGain();
  	outgain.gain.value = gain;
  	outgain.connect(audioContext.destination);
  	

  	let envelope = audioContext.createGain();
  	envelope.connect(outgain);
  	envelope.gain.value = 0;
  	envelope.gain.setTargetAtTime(1, startTime, 0.1);
  	envelope.gain.setTargetAtTime(0, endTime, 0.2);

  	let oscillator = audioContext.createOscillator();
  	oscillator.connect(envelope);
  
	let vibrato = audioContext.createGain();
	vibrato.gain.value = 30;
	vibrato.connect(oscillator.detune);


	let lfo = audioContext.createOscillator();
	lfo.connect(vibrato);
	lfo.frequency.value =5; 

  	oscillator.type = 'sawtooth';
  	oscillator.detune.value = pitch * 100;
  	oscillator.frequency.value = 100;

  	oscillator.start(startTime);
  	lfo.start(startTime);
  	oscillator.stop(endTime + 2);
  	lfo.stop(endTime + 2);
};

/// Play Loop
let runSequencers = () => {
	if (!runSeq || soundQueue.length === 0){console.log("stop");return;}
	let ct = audioContext.currentTime;
	while (soundQueue.length>0 && soundQueue[0][0]< ct+0.15){
		//console.log('ct:'+ct+'planed time:'+soundQueue[0][0]);
		let tone = soundQueue.splice(0,1);
		playSound(tone[0][0],tone[0][1],tone[0][2],tone[0][3]);

	}
	setTimeout(runSequencers,90);
}


/// sounds start here
/// Sound var
let soundQueue = [];
let audioContext = new AudioContext();
let soundSpeed = 0.3;
let sounds = [[-10, 0.5,0.3],[3, 0.5,0.7],[10, 0.5,0.7],[15, 0.5,0.7],[0, 0.5,0.7]];



/// Sound Methods
let playMusic = () => {

	// fill soundQueue
    
	
	let rectarr = d3.selectAll('rect').data();
    let startTime = audioContext.currentTime;
    //console.log('Start'+startTime);
    soundQueue =[];
	for (let i=0; i < rectarr.length; i++) {
		let v = rectarr[i][1];
		//playSound(i,sounds[v][0],sounds[v][1],sounds[v][2]);
		//alert(i);
		let tmp = [];
		tmp.push(i*soundSpeed+startTime);
		tmp.push(sounds[v][0]);
		tmp.push(0.2);
		tmp.push(sounds[v][2]);
		soundQueue.push(tmp);
	}

	//console.log('startsequencer'+audioContext.currentTime);
    runSequencers();
};



// Init Screen
	let width = 1230,
    height = 400,
    div = d3.select('#chart'),
    svg = div.append('svg')
        .attr('width', width)
        .attr('height', height),
    //grid    
    rw = 20,
    rh = 20,
    rowN =4,
    colN =40,
    //colordefinition
    lookup = ['black','#296EAA','#D43F3A','#5CB85C','#46B0CF'],
    rrange = lookup.length;

	// React on Changes of the input fields

	registerButton();
	registerInputOnChange();
	let mydata = redraw(readInput());
	renderGraph(mydata);
	registerPlayButton();
	registerStopButton();




});



