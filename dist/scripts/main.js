(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

// import TweenMax from 'TweenMax'
// import View from './views/view'

// const g = 9.81;

// Register Listeners

$(document).ready(function () {

	//    $('#btn-row1-1').on('click', () => {
	//    var $btn = $(this).button('loading')

	//    $btn.button('reset')
	// });

	// Listen on Menu entry
	var idArr = ['#btn-row1-1', '#btn-row1-2', '#btn-row1-3', '#btn-row1-4'];

	var _loop = function _loop(i) {
		$(idArr[i]).parent().children('ul.dropdown-menu').on('click', function (e) {
			$(idArr[i]).parent().parent().children('input.form-control').attr('value', e.target.text);
		});
	};

	for (var i in idArr) {
		_loop(i);
	}

	// Draw so stuff
	var width = 1230,
	    height = 400,
	    div = d3.select('#chart'),
	    svg = div.append('svg').attr('width', width).attr('height', height),
	    rw = 20,
	    rh = 20,
	    rowN = 4,
	    colN = 40,
	    lookup = ['black', '#296EAA', '#D43F3A', '#5CB85C', '#46B0CF'],
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
	var data = [];
	for (var k = 0; k < rowN; k += 1) {
		var row = [];
		data.push(row);
		for (var i = 0; i < colN; i += 1) {
			row.push([i, Math.trunc(Math.random() * rrange)]);
		}
	}

	// Create a group for each row in the data matrix and
	// translate the group vertically
	var grp = svg.selectAll('g').data(data).enter().append('g').attr('transform', function (d, i) {
		return 'translate(5, ' + 54 * i + ')';
	});

	// For each group, create a set of rectangles and bind
	// them to the inner array (the inner array is already
	// binded to the group)
	grp.selectAll('rect').data(function (d) {
		return d;
	}).enter().append('rect').attr('x', function (d, i) {
		return 28 * i;
	}).attr('fill', function (d, i) {
		return lookup[d[1]];
	}).attr('width', rw).attr('height', rh);

	//Modulo 10 ticks       
	grp.selectAll('line').data(function (d) {
		return d;
	}).enter().append('line').filter(function (d, i) {
		return i % 10 === 0;
	}).attr('x1', function (d, i) {
		return 280 * i + 1;
	}).attr('y1', 20).attr('x2', function (d, i) {
		return 280 * i + 1;
	}).attr('y2', 40).style('stroke', 'black').style('stroke-width', '2px');

	// Text
	grp.selectAll('text').data(function (d) {
		return d;
	}).enter().append('text').filter(function (d, i) {
		return i % 10 === 0;
	}).attr('x', function (d, i) {
		return 280 * i + 5;
	}).attr('y', '38').attr('font-family', 'sans-serif').text(function (d, i, k) {
		return k * 40 + i * 10 + 1;
	});
});

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvc2NyaXB0cy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7O0FDT0EsRUFBRSxRQUFGLEVBQVksS0FBWixDQUFrQixZQUFVOzs7Ozs7Ozs7QUFXM0IsS0FBSSxRQUFRLENBQUMsYUFBRCxFQUFlLGFBQWYsRUFBNkIsYUFBN0IsRUFBMkMsYUFBM0MsQ0FBUixDQVh1Qjs7NEJBWWY7QUFDUixJQUFFLE1BQU0sQ0FBTixDQUFGLEVBQ0QsTUFEQyxHQUVELFFBRkMsQ0FFUSxrQkFGUixFQUdELEVBSEMsQ0FHRSxPQUhGLEVBR1csVUFBQyxDQUFELEVBQU87QUFDbkIsS0FBRSxNQUFNLENBQU4sQ0FBRixFQUNDLE1BREQsR0FFQyxNQUZELEdBR0MsUUFIRCxDQUdVLG9CQUhWLEVBSUMsSUFKRCxDQUlNLE9BSk4sRUFJYyxFQUFFLE1BQUYsQ0FBUyxJQUFULENBSmQsQ0FEbUI7R0FBUCxDQUhYO0dBYnVCOztBQVl4QixNQUFLLElBQUksQ0FBSixJQUFTLEtBQWQsRUFBcUI7UUFBWixHQUFZO0VBQXJCOzs7QUFad0IsS0EwQnZCLFFBQVEsSUFBUjtLQUNBLFNBQVMsR0FBVDtLQUNBLE1BQU0sR0FBRyxNQUFILENBQVUsUUFBVixDQUFOO0tBQ0EsTUFBTSxJQUFJLE1BQUosQ0FBVyxLQUFYLEVBQ0QsSUFEQyxDQUNJLE9BREosRUFDYSxLQURiLEVBRUQsSUFGQyxDQUVJLFFBRkosRUFFYyxNQUZkLENBQU47S0FHQSxLQUFLLEVBQUw7S0FDQSxLQUFLLEVBQUw7S0FDQSxPQUFPLENBQVA7S0FDQSxPQUFNLEVBQU47S0FDQSxTQUFTLENBQUMsT0FBRCxFQUFTLFNBQVQsRUFBbUIsU0FBbkIsRUFBNkIsU0FBN0IsRUFBdUMsU0FBdkMsQ0FBVDtLQUNBLFNBQVMsT0FBTyxNQUFQOzs7Ozs7Ozs7Ozs7O0FBckNjLEtBa0R2QixPQUFPLEVBQVAsQ0FsRHVCO0FB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bEIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy8gaW1wb3J0IFR3ZWVuTWF4IGZyb20gJ1R3ZWVuTWF4J1xuLy8gaW1wb3J0IFZpZXcgZnJvbSAnLi92aWV3cy92aWV3J1xuXG4vLyBjb25zdCBnID0gOS44MTtcblxuLy8gUmVnaXN0ZXIgTGlzdGVuZXJzXG5cbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG5cbiAgICBcblxuIC8vICAgICQoJyNidG4tcm93MS0xJykub24oJ2NsaWNrJywgKCkgPT4ge1xuIC8vICAgIHZhciAkYnRuID0gJCh0aGlzKS5idXR0b24oJ2xvYWRpbmcnKVxuICAgXG4gLy8gICAgJGJ0bi5idXR0b24oJ3Jlc2V0Jylcblx0Ly8gfSk7XG5cbi8vIExpc3RlbiBvbiBNZW51IGVudHJ5XG5cdGxldCBpZEFyciA9IFsnI2J0bi1yb3cxLTEnLCcjYnRuLXJvdzEtMicsJyNidG4tcm93MS0zJywnI2J0bi1yb3cxLTQnXTtcbiAgICBmb3IgKGxldCBpIGluIGlkQXJyKSB7XG4gICAgXHQkKGlkQXJyW2ldKVxuXHRcdFx0LnBhcmVudCgpXG5cdFx0XHQuY2hpbGRyZW4oJ3VsLmRyb3Bkb3duLW1lbnUnKVxuXHRcdFx0Lm9uKCdjbGljaycsIChlKSA9PiB7XG5cdFx0XHRcdCQoaWRBcnJbaV0pXG5cdFx0XHRcdC5wYXJlbnQoKVxuXHRcdFx0XHQucGFyZW50KClcblx0XHRcdFx0LmNoaWxkcmVuKCdpbnB1dC5mb3JtLWNvbnRyb2wnKVxuXHRcdFx0XHQuYXR0cigndmFsdWUnLGUudGFyZ2V0LnRleHQpO1xuXHRcdH0pO1x0XG4gICAgfVxuXG5cdC8vIERyYXcgc28gc3R1ZmZcblx0bGV0IHdpZHRoID0gMTIzMCxcblx0ICAgIGhlaWdodCA9IDQwMCxcblx0ICAgIGRpdiA9IGQzLnNlbGVjdCgnI2NoYXJ0JyksXG5cdCAgICBzdmcgPSBkaXYuYXBwZW5kKCdzdmcnKVxuXHQgICAgICAgIC5hdHRyKCd3aWR0aCcsIHdpZHRoKVxuXHQgICAgICAgIC5hdHRyKCdoZWlnaHQnLCBoZWlnaHQpLFxuXHQgICAgcncgPSAyMCxcblx0ICAgIHJoID0gMjAsXG5cdCAgICByb3dOID0gNCxcblx0ICAgIGNvbE4gPTQwLFxuXHQgICAgbG9va3VwID0gWydibGFjaycsJyMyOTZFQUEnLCcjRDQzRjNBJywnIzVDQjg1QycsJyM0NkIwQ0YnXSxcblx0ICAgIHJyYW5nZSA9IGxvb2t1cC5sZW5ndGg7XG5cbi8vIFJhbmRvbSBEYXRhXG5cdC8vIGxldCBkYXRhID0gW107XG5cdC8vIGZvciAobGV0IGsgPSAwOyBrIDwgcm93TjsgayArPSAxKSB7XG5cdC8vIFx0bGV0IHJvdyA9IFtdO1xuXHQvLyBcdGRhdGEucHVzaChyb3cpO1xuXHQvLyBcdGZvciAobGV0IGkgPSAwOyBpIDwgY29sTjsgaSArPTEpe1xuXHQvLyBcdFx0cm93LnB1c2goW2ksIE1hdGgudHJ1bmMoTWF0aC5yYW5kb20oKSpycmFuZ2UpXSlcblx0Ly8gXHR9XG5cdC8vIH1cblxuLy8gUm93IGNhbGN1bGF0aW9uXG5cdGxldCBkYXRhID0gW107XG5cdGZvciAobGV0IGsgPSAwOyBrIDwgcm93TjsgayArPSAxKSB7XG5cdFx0bGV0IHJvdyA9IFtdO1xuXHRcdGRhdGEucHVzaChyb3cpO1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgY29sTjsgaSArPTEpe1xuXHRcdFx0cm93LnB1c2goW2ksIE1hdGgudHJ1bmMoTWF0aC5yYW5kb20oKSpycmFuZ2UpXSlcblx0XHR9XG5cdH1cblxuXG5cblxuXG5cdC8vIENyZWF0ZSBhIGdyb3VwIGZvciBlYWNoIHJvdyBpbiB0aGUgZGF0YSBtYXRyaXggYW5kXG5cdC8vIHRyYW5zbGF0ZSB0aGUgZ3JvdXAgdmVydGljYWxseVxuXHRsZXQgZ3JwID0gc3ZnLnNlbGVjdEFsbCgnZycpXG5cdCAgICAuZGF0YShkYXRhKVxuXHQgICAgLmVudGVyKClcblx0ICAgIC5hcHBlbmQoJ2cnKVxuXHQgICAgLmF0dHIoJ3RyYW5zZm9ybScsIGZ1bmN0aW9uKGQsIGkpIHtcblx0ICAgICAgICByZXR1cm4gJ3RyYW5zbGF0ZSg1LCAnICsgNTQgKiBpICsgJyknO1xuXHQgICAgfSk7XG5cblx0Ly8gRm9yIGVhY2ggZ3JvdXAsIGNyZWF0ZSBhIHNldCBvZiByZWN0YW5nbGVzIGFuZCBiaW5kIFxuXHQvLyB0aGVtIHRvIHRoZSBpbm5lciBhcnJheSAodGhlIGlubmVyIGFycmF5IGlzIGFscmVhZHlcblx0Ly8gYmluZGVkIHRvIHRoZSBncm91cClcblx0Z3JwLnNlbGVjdEFsbCgncmVjdCcpXG5cdCAgICAuZGF0YShmdW5jdGlvbihkKSB7IHJldHVybiBkOyB9KVxuXHQgICAgLmVudGVyKClcblx0ICAgIC5hcHBlbmQoJ3JlY3QnKVxuXHQgICAgICAgIC5hdHRyKCd4JywgZnVuY3Rpb24oZCwgaSkgeyByZXR1cm4gMjggKiBpOyB9KVxuXHQgICAgICAgIC5hdHRyKCdmaWxsJywgZnVuY3Rpb24oZCxpKSB7IHJldHVybiBsb29rdXBbZFsxXV07fSlcblx0ICAgICAgICAuYXR0cignd2lkdGgnLCBydylcblx0ICAgICAgICAuYXR0cignaGVpZ2h0JywgcmgpO1xuXG5cdC8vTW9kdWxvIDEwIHRpY2tzICAgICAgICBcblx0Z3JwLnNlbGVjdEFsbCgnbGluZScpXG5cdCAgICAuZGF0YSggKGQpID0+IGQpXG5cdCAgICAuZW50ZXIoKS5hcHBlbmQoJ2xpbmUnKVxuXHQgICAgLmZpbHRlcigoZCxpKSA9PiBpJTEwPT09MClcbiAgXHRcdFx0LmF0dHIoJ3gxJywgIChkLCBpKSA9PiB7IHJldHVybiAyODAgKiBpKzE7IH0pXG4gIFx0XHRcdC5hdHRyKCd5MScsIDIwKVxuICBcdFx0XHQuYXR0cigneDInLCAoZCwgaSkgPT4geyByZXR1cm4gMjgwICogaSsxOyB9KVxuICBcdFx0XHQuYXR0cigneTInLDQwKVxuICBcdFx0XHQuc3R5bGUoJ3N0cm9rZScsICdibGFjaycpXG4gIFx0XHRcdC5zdHlsZSgnc3Ryb2tlLXdpZHRoJywnMnB4Jyk7ICAgICAgXG5cbiAgXHQvLyBUZXh0IFxuICBcdGdycC5zZWxlY3RBbGwoJ3RleHQnKVxuXHQgICAgLmRhdGEoIChkKSA9PiBkKVxuXHQgICAgLmVudGVyKCkuYXBwZW5kKCd0ZXh0Jylcblx0ICAgIC5maWx0ZXIoKGQsaSkgPT4gaSUxMD09PTApXG5cdCAgICBcdC5hdHRyKCd4JywgKGQsIGkpID0+IHsgcmV0dXJuIDI4MCAqIGkrNTsgfSlcblx0ICAgIFx0LmF0dHIoJ3knLCAnMzgnKSAgXG5cdCAgICBcdC5hdHRyKCdmb250LWZhbWlseScsICdzYW5zLXNlcmlmJykgXG5cdCAgICBcdC50ZXh0KCAoZCwgaSxrKSA9PiBrKjQwK2kqMTArMSk7IFxufSk7XG5cblxuXG4iXX0=
