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
	var width = 700,
	    height = 400,
	    div = d3.select('#chart'),
	    svg = div.append('svg').attr('width', width).attr('height', height),
	    rw = 20,
	    rh = 20,
	    rowN = 4,
	    colN = 27,
	    lookup = ['black', '#296EAA', '#D43F3A', '#5CB85C', '#46B0CF'],
	    rrange = lookup.length;

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
		return 'translate(0, ' + 54 * i + ')';
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

	grp.selectAll('line').data(function (d) {
		return d;
	}).enter()
	//.filter(function(d,i) {return i > 5; })
	.append("line").attr("x1", function (d, i) {
		return 28 * i + 19;
	}).attr("y1", 20).attr("x2", function (d, i) {
		return 28 * i + 19;
	}).attr("y2", 30).style("stroke", "black").style("stroke-width", "2px");
});

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvc2NyaXB0cy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7O0FDT0EsRUFBRSxRQUFGLEVBQVksS0FBWixDQUFrQixZQUFVOzs7Ozs7Ozs7QUFXM0IsS0FBSSxRQUFRLENBQUMsYUFBRCxFQUFlLGFBQWYsRUFBNkIsYUFBN0IsRUFBMkMsYUFBM0MsQ0FBUixDQVh1Qjs7NEJBWWY7QUFDUixJQUFFLE1BQU0sQ0FBTixDQUFGLEVBQ0QsTUFEQyxHQUVELFFBRkMsQ0FFUSxrQkFGUixFQUdELEVBSEMsQ0FHRSxPQUhGLEVBR1csVUFBQyxDQUFELEVBQU87QUFDbkIsS0FBRSxNQUFNLENBQU4sQ0FBRixFQUNDLE1BREQsR0FFQyxNQUZELEdBR0MsUUFIRCxDQUdVLG9CQUhWLEVBSUMsSUFKRCxDQUlNLE9BSk4sRUFJYyxFQUFFLE1BQUYsQ0FBUyxJQUFULENBSmQsQ0FEbUI7R0FBUCxDQUhYO0dBYnVCOztBQVl4QixNQUFLLElBQUksQ0FBSixJQUFTLEtBQWQsRUFBcUI7UUFBWixHQUFZO0VBQXJCOzs7QUFad0IsS0EwQnZCLFFBQVEsR0FBUjtLQUNBLFNBQVMsR0FBVDtLQUNBLE1BQU0sR0FBRyxNQUFILENBQVUsUUFBVixDQUFOO0tBQ0EsTUFBTSxJQUFJLE1BQUosQ0FBVyxLQUFYLEVBQ0QsSUFEQyxDQUNJLE9BREosRUFDYSxLQURiLEVBRUQsSUFGQyxDQUVJLFFBRkosRUFFYyxNQUZkLENBQU47S0FHQSxLQUFLLEVBQUw7S0FDQSxLQUFLLEVBQUw7S0FDQSxPQUFPLENBQVA7S0FDQSxPQUFNLEVBQU47S0FDQSxTQUFTLENBQUMsT0FBRCxFQUFTLFNBQVQsRUFBbUIsU0FBbkIsRUFBNkIsU0FBN0IsRUFBdUMsU0FBdkMsQ0FBVDtLQUNBLFNBQVMsT0FBTyxNQUFQLENBckNjOztBQXVDM0IsS0FBSSxPQUFPLEVBQVAsQ0F2Q3VCO0FBd0MzQixNQUFLLElBQUksSUFBSSxDQUFKLEVBQU8sSUFBSSxJQUFKLEVBQVUsS0FBSyxDQUFMLEVBQVE7QUFDakMsTUFBSSxNQUFNLEVBQU4sQ0FENkI7QUFFakMsT0FBSyxJQUFMLENBQVUsR0FBVixFQUZpQztBQUdqQyxPQUFLLElBQUksSUFBSSxDQUFKLEVBQU8sSUFBSSxJQUFKLEVBQVUsS0FBSSxDQUFKLEVBQU07QUFDL0IsT0FBSSxJQUFKLENBQVMsQ0FBQyxDQUFELEVBQUksS0FBSyxLQUFMLENBQVcsS0FBSyxNQUFMLEtBQWMsTUFBZCxDQUFmLENBQVQsRUFEK0I7R0FBaEM7RUFIRDs7OztBQXhDMkIsS0FtRHZCLE1BQU0sSUFBSSxTQUFKLENBQWMsR0FBZCxFQUNMLElBREssQ0FDQSxJQURBLEVBRUwsS0FGSyxHQUdMLE1BSEssQ0FHRSxHQUhGLEVBSUwsSUFKSyxDQUlBLFdBSkEsRUFJYSxVQUFTLENBQVQsRUFBWSxDQUFaLEVBQWU7QUFDOUIsU0FBTyxrQkFBa0IsS0FBSyxDQUFMLEdBQVMsR0FBM0IsQ0FEdUI7RUFBZixDQUpuQjs7Ozs7QUFuRHVCLElBOEQzQixDQUFJLFNBQUosQ0FBYyxNQUFkLEVBQ0ssSUFETCxDQUNVLFVBQVMsQ0FBVCxFQUFZO0FBQUUsU0FBTyxDQUFQLENBQUY7RUFBWixDQURWLENBRUssS0FGTCxHQUdLLE1BSEwsQ0FHWSxNQUhaLEVBSVMsSUFKVCxDQUljLEdBSmQsRUFJbUIsVUFBUyxDQUFULEVBQVksQ0FBWixFQUFlO0FBQUUsU0FBTyxLQUFLLENBQUwsQ0FBVDtFQUFmLENBSm5CLENBS1MsSUFMVCxDQUtjLE1BTGQsRUFLc0IsVUFBUyxDQUFULEVBQVcsQ0FBWCxFQUFjO0FBQUUsU0FBTyxPQUFPLEVBQUUsQ0FBRixDQUFQLENBQVAsQ0FBRjtFQUFkLENBTHRCLENBTVMsSUFOVCxDQU1jLE9BTmQsRUFNdUIsRUFOdkIsRUFPUyxJQVBULENBT2MsUUFQZCxFQU93QixFQVB4QixFQTlEMkI7O0FBdUUzQixLQUFJLFNBQUosQ0FBYyxNQUFkLEVBQ0ssSUFETCxDQUNVLFVBQVMsQ0FBVCxFQUFZO0FBQUUsU0FBTyxDQUFQLENBQUY7RUFBWixDQURWLENBRUssS0FGTDs7RUFJRyxNQUpILENBSVUsTUFKVixFQUtNLElBTE4sQ0FLVyxJQUxYLEVBS2lCLFVBQVMsQ0FBVCxFQUFZLENBQVosRUFBZTtBQUFFLFNBQU8sS0FBSyxDQUFMLEdBQU8sRUFBUCxDQUFUO0VBQWYsQ0FMakIsQ0FNTSxJQU5OLENBTVcsSUFOWCxFQU1pQixFQU5qQixFQU9NLElBUE4sQ0FPVyxJQVBYLEVBT2dCLFVBQVMsQ0FBVCxFQUFZLENBQVosRUFBZTtBQUFFLFNBQU8sS0FBSyxDQUFMLEdBQU8sRUFBUCxDQUFUO0VBQWYsQ0FQaEIsQ0FRTSxJQVJOLENBUVcsSUFSWCxFQVFnQixFQVJoQixFQVNNLEtBVE4sQ0FTWSxRQVRaLEVBU3NCLE9BVHRCLEVBVU0sS0FWTixDQVVZLGNBVlosRUFVMkIsS0FWM0IsRUF2RTJCO0NBQVYsQ0FBbEIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy8gaW1wb3J0IFR3ZWVuTWF4IGZyb20gJ1R3ZWVuTWF4J1xuLy8gaW1wb3J0IFZpZXcgZnJvbSAnLi92aWV3cy92aWV3J1xuXG4vLyBjb25zdCBnID0gOS44MTtcblxuLy8gUmVnaXN0ZXIgTGlzdGVuZXJzXG5cbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG5cbiAgICBcblxuIC8vICAgICQoJyNidG4tcm93MS0xJykub24oJ2NsaWNrJywgKCkgPT4ge1xuIC8vICAgIHZhciAkYnRuID0gJCh0aGlzKS5idXR0b24oJ2xvYWRpbmcnKVxuICAgXG4gLy8gICAgJGJ0bi5idXR0b24oJ3Jlc2V0Jylcblx0Ly8gfSk7XG5cbi8vIExpc3RlbiBvbiBNZW51IGVudHJ5XG5cdGxldCBpZEFyciA9IFsnI2J0bi1yb3cxLTEnLCcjYnRuLXJvdzEtMicsJyNidG4tcm93MS0zJywnI2J0bi1yb3cxLTQnXTtcbiAgICBmb3IgKGxldCBpIGluIGlkQXJyKSB7XG4gICAgXHQkKGlkQXJyW2ldKVxuXHRcdFx0LnBhcmVudCgpXG5cdFx0XHQuY2hpbGRyZW4oJ3VsLmRyb3Bkb3duLW1lbnUnKVxuXHRcdFx0Lm9uKCdjbGljaycsIChlKSA9PiB7XG5cdFx0XHRcdCQoaWRBcnJbaV0pXG5cdFx0XHRcdC5wYXJlbnQoKVxuXHRcdFx0XHQucGFyZW50KClcblx0XHRcdFx0LmNoaWxkcmVuKCdpbnB1dC5mb3JtLWNvbnRyb2wnKVxuXHRcdFx0XHQuYXR0cigndmFsdWUnLGUudGFyZ2V0LnRleHQpO1xuXHRcdH0pO1x0XG4gICAgfVxuXG5cdC8vIERyYXcgc28gc3R1ZmZcblx0bGV0IHdpZHRoID0gNzAwLFxuXHQgICAgaGVpZ2h0ID0gNDAwLFxuXHQgICAgZGl2ID0gZDMuc2VsZWN0KCcjY2hhcnQnKSxcblx0ICAgIHN2ZyA9IGRpdi5hcHBlbmQoJ3N2ZycpXG5cdCAgICAgICAgLmF0dHIoJ3dpZHRoJywgd2lkdGgpXG5cdCAgICAgICAgLmF0dHIoJ2hlaWdodCcsIGhlaWdodCksXG5cdCAgICBydyA9IDIwLFxuXHQgICAgcmggPSAyMCxcblx0ICAgIHJvd04gPSA0LFxuXHQgICAgY29sTiA9MjcsXG5cdCAgICBsb29rdXAgPSBbJ2JsYWNrJywnIzI5NkVBQScsJyNENDNGM0EnLCcjNUNCODVDJywnIzQ2QjBDRiddLFxuXHQgICAgcnJhbmdlID0gbG9va3VwLmxlbmd0aDtcblxuXHRsZXQgZGF0YSA9IFtdO1xuXHRmb3IgKGxldCBrID0gMDsgayA8IHJvd047IGsgKz0gMSkge1xuXHRcdGxldCByb3cgPSBbXTtcblx0XHRkYXRhLnB1c2gocm93KTtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGNvbE47IGkgKz0xKXtcblx0XHRcdHJvdy5wdXNoKFtpLCBNYXRoLnRydW5jKE1hdGgucmFuZG9tKCkqcnJhbmdlKV0pXG5cdFx0fVxuXHR9XG5cblxuXHQvLyBDcmVhdGUgYSBncm91cCBmb3IgZWFjaCByb3cgaW4gdGhlIGRhdGEgbWF0cml4IGFuZFxuXHQvLyB0cmFuc2xhdGUgdGhlIGdyb3VwIHZlcnRpY2FsbHlcblx0bGV0IGdycCA9IHN2Zy5zZWxlY3RBbGwoJ2cnKVxuXHQgICAgLmRhdGEoZGF0YSlcblx0ICAgIC5lbnRlcigpXG5cdCAgICAuYXBwZW5kKCdnJylcblx0ICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBmdW5jdGlvbihkLCBpKSB7XG5cdCAgICAgICAgcmV0dXJuICd0cmFuc2xhdGUoMCwgJyArIDU0ICogaSArICcpJztcblx0ICAgIH0pO1xuXG5cdC8vIEZvciBlYWNoIGdyb3VwLCBjcmVhdGUgYSBzZXQgb2YgcmVjdGFuZ2xlcyBhbmQgYmluZCBcblx0Ly8gdGhlbSB0byB0aGUgaW5uZXIgYXJyYXkgKHRoZSBpbm5lciBhcnJheSBpcyBhbHJlYWR5XG5cdC8vIGJpbmRlZCB0byB0aGUgZ3JvdXApXG5cdGdycC5zZWxlY3RBbGwoJ3JlY3QnKVxuXHQgICAgLmRhdGEoZnVuY3Rpb24oZCkgeyByZXR1cm4gZDsgfSlcblx0ICAgIC5lbnRlcigpXG5cdCAgICAuYXBwZW5kKCdyZWN0Jylcblx0ICAgICAgICAuYXR0cigneCcsIGZ1bmN0aW9uKGQsIGkpIHsgcmV0dXJuIDI4ICogaTsgfSlcblx0ICAgICAgICAuYXR0cignZmlsbCcsIGZ1bmN0aW9uKGQsaSkgeyByZXR1cm4gbG9va3VwW2RbMV1dO30pXG5cdCAgICAgICAgLmF0dHIoJ3dpZHRoJywgcncpXG5cdCAgICAgICAgLmF0dHIoJ2hlaWdodCcsIHJoKTtcblx0XHRcdFxuXHRncnAuc2VsZWN0QWxsKCdsaW5lJylcblx0ICAgIC5kYXRhKGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQgOyB9KVxuXHQgICAgLmVudGVyKClcblx0ICAgIC8vLmZpbHRlcihmdW5jdGlvbihkLGkpIHtyZXR1cm4gaSA+IDU7IH0pXG5cdFx0XHQuYXBwZW5kKFwibGluZVwiKVxuICBcdFx0XHRcdC5hdHRyKFwieDFcIiwgZnVuY3Rpb24oZCwgaSkgeyByZXR1cm4gMjggKiBpKzE5OyB9KVxuICBcdFx0XHRcdC5hdHRyKFwieTFcIiwgMjApXG4gIFx0XHRcdFx0LmF0dHIoXCJ4MlwiLGZ1bmN0aW9uKGQsIGkpIHsgcmV0dXJuIDI4ICogaSsxOTsgfSlcbiAgXHRcdFx0XHQuYXR0cihcInkyXCIsMzApXG4gIFx0XHRcdFx0LnN0eWxlKFwic3Ryb2tlXCIsIFwiYmxhY2tcIilcbiAgXHRcdFx0XHQuc3R5bGUoXCJzdHJva2Utd2lkdGhcIixcIjJweFwiKTsgICAgICAgIFxuXHQgICAgICAgIFxuXG5cbn0pO1xuXG5cblxuIl19
