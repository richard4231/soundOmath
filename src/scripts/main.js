// import TweenMax from 'TweenMax'
// import View from './views/view'

// const g = 9.81;

// Register Listeners

$(document).ready(function(){

    

 //    $('#btn-row1-1').on('click', () => {
 //    var $btn = $(this).button('loading')
   
 //    $btn.button('reset')
	// });

// Listen on Menu entry
	let idArr = ['#btn-row1-1','#btn-row1-2','#btn-row1-3','#btn-row1-4'];
    for (let i in idArr) {
    	$(idArr[i])
			.parent()
			.children('ul.dropdown-menu')
			.on('click', (e) => {
				$(idArr[i])
				.parent()
				.parent()
				.children('input.form-control')
				.attr('value',e.target.text);
		});	
    }

	// Draw so stuff
	let width = 1230,
	    height = 400,
	    div = d3.select('#chart'),
	    svg = div.append('svg')
	        .attr('width', width)
	        .attr('height', height),
	    rw = 20,
	    rh = 20,
	    rowN = 4,
	    colN =40,
	    lookup = ['black','#296EAA','#D43F3A','#5CB85C','#46B0CF'],
	    rrange = lookup.length;

// Random Data
	// let data = [];
	// for (let k = 0; k < rowN; k += 1) {
	// 	let row = [];
	// 	data.push(row);
	// 	for (let i = 0; i < colN; i +=1){
	// 		row.push([i, Math.trunc(Math.random()*rrange)])
	// 	}
	// }

// Row calculation
	let data = [];
	for (let k = 0; k < rowN; k += 1) {
		let row = [];
		data.push(row);
		for (let i = 0; i < colN; i +=1){
			row.push([i, Math.trunc(Math.random()*rrange)])
		}
	}





	// Create a group for each row in the data matrix and
	// translate the group vertically
	let grp = svg.selectAll('g')
	    .data(data)
	    .enter()
	    .append('g')
	    .attr('transform', function(d, i) {
	        return 'translate(5, ' + 54 * i + ')';
	    });

	// For each group, create a set of rectangles and bind 
	// them to the inner array (the inner array is already
	// binded to the group)
	grp.selectAll('rect')
	    .data(function(d) { return d; })
	    .enter()
	    .append('rect')
	        .attr('x', function(d, i) { return 28 * i; })
	        .attr('fill', function(d,i) { return lookup[d[1]];})
	        .attr('width', rw)
	        .attr('height', rh);

	//Modulo 10 ticks        
	grp.selectAll('line')
	    .data( (d) => d)
	    .enter().append('line')
	    .filter((d,i) => i%10===0)
  			.attr('x1',  (d, i) => { return 280 * i+1; })
  			.attr('y1', 20)
  			.attr('x2', (d, i) => { return 280 * i+1; })
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
});



