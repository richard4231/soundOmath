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
	let width = 700,
	    height = 400,
	    div = d3.select('#chart'),
	    svg = div.append('svg')
	        .attr('width', width)
	        .attr('height', height),
	    rw = 20,
	    rh = 20,
	    rowN = 4,
	    colN =27,
	    lookup = ['red','blue','green','black','yellow','purple','cian'],
	    rrange = 7;

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
	var grp = svg.selectAll('g')
	    .data(data)
	    .enter()
	    .append('g')
	    .attr('transform', function(d, i) {
	        return 'translate(0, ' + 24 * i + ')';
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
	        


});



