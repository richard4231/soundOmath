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
    	alert(idArr[i]);
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


});



