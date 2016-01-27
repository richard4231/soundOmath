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

	grp.selectAll('line').data(function (d, i) {
		if (i > 10) {
			return d;
		} else {
			return [];
		}
	}).enter().append("line").attr("x1", function (d, i) {
		return 28 * i + 19;
	}).attr("y1", 20).attr("x2", function (d, i) {
		return 28 * i + 19;
	}).attr("y2", 30).style("stroke", "black").style("stroke-width", "2px");
});

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvc2NyaXB0cy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7O0FDT0EsRUFBRSxRQUFGLEVBQVksS0FBWixDQUFrQixZQUFVOzs7Ozs7Ozs7QUFXM0IsS0FBSSxRQUFRLENBQUMsYUFBRCxFQUFlLGFBQWYsRUFBNkIsYUFBN0IsRUFBMkMsYUFBM0MsQ0FBUixDQVh1Qjs7NEJBWWY7QUFDUixJQUFFLE1BQU0sQ0FBTixDQUFGLEVBQ0QsTUFEQyxHQUVELFFBRkMsQ0FFUSxrQkFGUixFQUdELEVBSEMsQ0FHRSxPQUhGLEVBR1csVUFBQyxDQUFELEVBQU87QUFDbkIsS0FBRSxNQUFNLENBQU4sQ0FBRixFQUNDLE1BREQsR0FFQyxNQUZELEdBR0MsUUFIRCxDQUdVLG9CQUhWLEVBSUMsSUFKRCxDQUlNLE9BSk4sRUFJYyxFQUFFLE1BQUYsQ0FBUyxJQUFULENBSmQsQ0FEbUI7R0FBUCxDQUhYO0dBYnVCOztBQVl4QixNQUFLLElBQUksQ0FBSixJQUFTLEtBQWQsRUFBcUI7UUFBWixHQUFZO0VBQXJCOzs7QUFad0IsS0EwQnZCLFFBQVEsR0FBUjtLQUNBLFNBQVMsR0FBVDtLQUNBLE1BQU0sR0FBRyxNQUFILENBQVUsUUFBVixDQUFOO0tBQ0EsTUFBTSxJQUFJLE1BQUosQ0FBVyxLQUFYLEVBQ0QsSUFEQyxDQUNJLE9BREosRUFDYSxLQURiLEVBRUQsSUFGQyxDQUVJLFFBRkosRUFFYyxNQUZkLENBQU47S0FHQSxLQUFLLEVBQUw7S0FDQSxLQUFLLEVBQUw7S0FDQSxPQUFPLENBQVA7S0FDQSxPQUFNLEVBQU47S0FDQSxTQUFTLENBQUMsT0FBRCxFQUFTLFNBQVQsRUFBbUIsU0FBbkIsRUFBNkIsU0FBN0IsRUFBdUMsU0FBdkMsQ0FBVDtLQUNBLFNBQVMsT0FBTyxNQUFQLENBckNjOztBQXVDM0IsS0FBSSxPQUFPLEVBQVAsQ0F2Q3VCO0FBd0MzQixNQUFLLElBQUksSUFBSSxDQUFKLEVBQU8sSUFBSSxJQUFKLEVBQVUsS0FBSyxDQUFMLEVBQVE7QUFDakMsTUFBSSxNQUFNLEVBQU4sQ0FENkI7QUFFakMsT0FBSyxJQUFMLENBQVUsR0FBVixFQUZpQztBQUdqQyxPQUFLLElBQUksSUFBSSxDQUFKLEVBQU8sSUFBSSxJQUFKLEVBQVUsS0FBSSxDQUFKLEVBQU07QUFDL0IsT0FBSSxJQUFKLENBQVMsQ0FBQyxDQUFELEVBQUksS0FBSyxLQUFMLENBQVcsS0FBSyxNQUFMLEtBQWMsTUFBZCxDQUFmLENBQVQsRUFEK0I7R0FBaEM7RUFIRDs7OztBQXhDMkIsS0FtRHZCLE1BQU0sSUFBSSxTQUFKLENBQWMsR0FBZCxFQUNMLElBREssQ0FDQSxJQURBLEVBRUwsS0FGSyxHQUdMLE1BSEssQ0FHRSxHQUhGLEVBSUwsSUFKSyxDQUlBLFdBSkEsRUFJYSxVQUFTLENBQVQsRUFBWSxDQUFaLEVBQWU7QUFDOUIsU0FBTyxrQkFBa0IsS0FBSyxDQUFMLEdBQVMsR0FBM0IsQ0FEdUI7RUFBZixDQUpuQjs7Ozs7QUFuRHVCLElBOEQzQixDQUFJLFNBQUosQ0FBYyxNQUFkLEVBQ0ssSUFETCxDQUNVLFVBQVMsQ0FBVCxFQUFZO0FBQUUsU0FBTyxDQUFQLENBQUY7RUFBWixDQURWLENBRUssS0FGTCxHQUdLLE1BSEwsQ0FHWSxNQUhaLEVBSVMsSUFKVCxDQUljLEdBSmQsRUFJbUIsVUFBUyxDQUFULEVBQVksQ0FBWixFQUFlO0FBQUUsU0FBTyxLQUFLLENBQUwsQ0FBVDtFQUFmLENBSm5CLENBS1MsSUFMVCxDQUtjLE1BTGQsRUFLc0IsVUFBUyxDQUFULEVBQVcsQ0FBWCxFQUFjO0FBQUUsU0FBTyxPQUFPLEVBQUUsQ0FBRixDQUFQLENBQVAsQ0FBRjtFQUFkLENBTHRCLENBTVMsSUFOVCxDQU1jLE9BTmQsRUFNdUIsRUFOdkIsRUFPUyxJQVBULENBT2MsUUFQZCxFQU93QixFQVB4QixFQTlEMkI7O0FBdUUzQixLQUFJLFNBQUosQ0FBYyxNQUFkLEVBQ0ssSUFETCxDQUNVLFVBQVMsQ0FBVCxFQUFXLENBQVgsRUFBYztBQUNuQixNQUFJLElBQUksRUFBSixFQUFRO0FBQ1gsVUFBTyxDQUFQLENBRFc7R0FBWixNQUVPO0FBQ04sVUFBTyxFQUFQLENBRE07R0FGUDtFQURLLENBRFYsQ0FTSyxLQVRMLEdBVUcsTUFWSCxDQVVVLE1BVlYsRUFXTSxJQVhOLENBV1csSUFYWCxFQVdpQixVQUFTLENBQVQsRUFBWSxDQUFaLEVBQWU7QUFBRSxTQUFPLEtBQUssQ0FBTCxHQUFPLEVBQVAsQ0FBVDtFQUFmLENBWGpCLENBWU0sSUFaTixDQVlXLElBWlgsRUFZaUIsRUFaakIsRUFhTSxJQWJOLENBYVcsSUFiWCxFQWFnQixVQUFTLENBQVQsRUFBWSxDQUFaLEVBQWU7QUFBRSxTQUFPLEtBQUssQ0FBTCxHQUFPLEVBQVAsQ0FBVDtFQUFmLENBYmhCLENBY00sSUFkTixDQWNXLElBZFgsRUFjZ0IsRUFkaEIsRUFlTSxLQWZOLENBZVksUUFmWixFQWVzQixPQWZ0QixFQWdCTSxLQWhCTixDQWdCWSxjQWhCWixFQWdCMkIsS0FoQjNCLEVBdkUyQjtDQUFWLENBQWxCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vIGltcG9ydCBUd2Vlbk1heCBmcm9tICdUd2Vlbk1heCdcbi8vIGltcG9ydCBWaWV3IGZyb20gJy4vdmlld3MvdmlldydcblxuLy8gY29uc3QgZyA9IDkuODE7XG5cbi8vIFJlZ2lzdGVyIExpc3RlbmVyc1xuXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuXG4gICAgXG5cbiAvLyAgICAkKCcjYnRuLXJvdzEtMScpLm9uKCdjbGljaycsICgpID0+IHtcbiAvLyAgICB2YXIgJGJ0biA9ICQodGhpcykuYnV0dG9uKCdsb2FkaW5nJylcbiAgIFxuIC8vICAgICRidG4uYnV0dG9uKCdyZXNldCcpXG5cdC8vIH0pO1xuXG4vLyBMaXN0ZW4gb24gTWVudSBlbnRyeVxuXHRsZXQgaWRBcnIgPSBbJyNidG4tcm93MS0xJywnI2J0bi1yb3cxLTInLCcjYnRuLXJvdzEtMycsJyNidG4tcm93MS00J107XG4gICAgZm9yIChsZXQgaSBpbiBpZEFycikge1xuICAgIFx0JChpZEFycltpXSlcblx0XHRcdC5wYXJlbnQoKVxuXHRcdFx0LmNoaWxkcmVuKCd1bC5kcm9wZG93bi1tZW51Jylcblx0XHRcdC5vbignY2xpY2snLCAoZSkgPT4ge1xuXHRcdFx0XHQkKGlkQXJyW2ldKVxuXHRcdFx0XHQucGFyZW50KClcblx0XHRcdFx0LnBhcmVudCgpXG5cdFx0XHRcdC5jaGlsZHJlbignaW5wdXQuZm9ybS1jb250cm9sJylcblx0XHRcdFx0LmF0dHIoJ3ZhbHVlJyxlLnRhcmdldC50ZXh0KTtcblx0XHR9KTtcdFxuICAgIH1cblxuXHQvLyBEcmF3IHNvIHN0dWZmXG5cdGxldCB3aWR0aCA9IDcwMCxcblx0ICAgIGhlaWdodCA9IDQwMCxcblx0ICAgIGRpdiA9IGQzLnNlbGVjdCgnI2NoYXJ0JyksXG5cdCAgICBzdmcgPSBkaXYuYXBwZW5kKCdzdmcnKVxuXHQgICAgICAgIC5hdHRyKCd3aWR0aCcsIHdpZHRoKVxuXHQgICAgICAgIC5hdHRyKCdoZWlnaHQnLCBoZWlnaHQpLFxuXHQgICAgcncgPSAyMCxcblx0ICAgIHJoID0gMjAsXG5cdCAgICByb3dOID0gNCxcblx0ICAgIGNvbE4gPTI3LFxuXHQgICAgbG9va3VwID0gWydibGFjaycsJyMyOTZFQUEnLCcjRDQzRjNBJywnIzVDQjg1QycsJyM0NkIwQ0YnXSxcblx0ICAgIHJyYW5nZSA9IGxvb2t1cC5sZW5ndGg7XG5cblx0bGV0IGRhdGEgPSBbXTtcblx0Zm9yIChsZXQgayA9IDA7IGsgPCByb3dOOyBrICs9IDEpIHtcblx0XHRsZXQgcm93ID0gW107XG5cdFx0ZGF0YS5wdXNoKHJvdyk7XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBjb2xOOyBpICs9MSl7XG5cdFx0XHRyb3cucHVzaChbaSwgTWF0aC50cnVuYyhNYXRoLnJhbmRvbSgpKnJyYW5nZSldKVxuXHRcdH1cblx0fVxuXG5cblx0Ly8gQ3JlYXRlIGEgZ3JvdXAgZm9yIGVhY2ggcm93IGluIHRoZSBkYXRhIG1hdHJpeCBhbmRcblx0Ly8gdHJhbnNsYXRlIHRoZSBncm91cCB2ZXJ0aWNhbGx5XG5cdGxldCBncnAgPSBzdmcuc2VsZWN0QWxsKCdnJylcblx0ICAgIC5kYXRhKGRhdGEpXG5cdCAgICAuZW50ZXIoKVxuXHQgICAgLmFwcGVuZCgnZycpXG5cdCAgICAuYXR0cigndHJhbnNmb3JtJywgZnVuY3Rpb24oZCwgaSkge1xuXHQgICAgICAgIHJldHVybiAndHJhbnNsYXRlKDAsICcgKyA1NCAqIGkgKyAnKSc7XG5cdCAgICB9KTtcblxuXHQvLyBGb3IgZWFjaCBncm91cCwgY3JlYXRlIGEgc2V0IG9mIHJlY3RhbmdsZXMgYW5kIGJpbmQgXG5cdC8vIHRoZW0gdG8gdGhlIGlubmVyIGFycmF5ICh0aGUgaW5uZXIgYXJyYXkgaXMgYWxyZWFkeVxuXHQvLyBiaW5kZWQgdG8gdGhlIGdyb3VwKVxuXHRncnAuc2VsZWN0QWxsKCdyZWN0Jylcblx0ICAgIC5kYXRhKGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQ7IH0pXG5cdCAgICAuZW50ZXIoKVxuXHQgICAgLmFwcGVuZCgncmVjdCcpXG5cdCAgICAgICAgLmF0dHIoJ3gnLCBmdW5jdGlvbihkLCBpKSB7IHJldHVybiAyOCAqIGk7IH0pXG5cdCAgICAgICAgLmF0dHIoJ2ZpbGwnLCBmdW5jdGlvbihkLGkpIHsgcmV0dXJuIGxvb2t1cFtkWzFdXTt9KVxuXHQgICAgICAgIC5hdHRyKCd3aWR0aCcsIHJ3KVxuXHQgICAgICAgIC5hdHRyKCdoZWlnaHQnLCByaCk7XG5cdFx0XHRcblx0Z3JwLnNlbGVjdEFsbCgnbGluZScpXG5cdCAgICAuZGF0YShmdW5jdGlvbihkLGkpIHsgXG5cdCAgICBcdGlmIChpID4gMTApIHtcblx0ICAgIFx0XHRyZXR1cm4gZDtcblx0ICAgIFx0fSBlbHNlIHtcblx0ICAgIFx0XHRyZXR1cm4gW107XG5cdCAgICBcdH1cblx0ICAgIFx0IFxuXHQgICAgfSlcblx0ICAgIC5lbnRlcigpXG5cdFx0XHQuYXBwZW5kKFwibGluZVwiKVxuICBcdFx0XHRcdC5hdHRyKFwieDFcIiwgZnVuY3Rpb24oZCwgaSkgeyByZXR1cm4gMjggKiBpKzE5OyB9KVxuICBcdFx0XHRcdC5hdHRyKFwieTFcIiwgMjApXG4gIFx0XHRcdFx0LmF0dHIoXCJ4MlwiLGZ1bmN0aW9uKGQsIGkpIHsgcmV0dXJuIDI4ICogaSsxOTsgfSlcbiAgXHRcdFx0XHQuYXR0cihcInkyXCIsMzApXG4gIFx0XHRcdFx0LnN0eWxlKFwic3Ryb2tlXCIsIFwiYmxhY2tcIilcbiAgXHRcdFx0XHQuc3R5bGUoXCJzdHJva2Utd2lkdGhcIixcIjJweFwiKTsgICAgICAgIFxuXHQgICAgICAgIFxuXG5cbn0pO1xuXG5cblxuIl19
