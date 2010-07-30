$.fn.easy_slider = function(obj, selector) {
	if (!obj)				obj				= { page: 1, per_page: 5, nextText: 'Next', backText: 'Back', firstText: 'First', lastText: 'last', indicatorText: 'page [n] of [m]', indicator: true, indicatorPosition: 'bottom' }
	if (!selector)	selector 	= '.paggeable';
	
	// Fix values in case client do not send them
	obj.page								= ( obj.page								== undefined )	? 1									: obj.page;
	obj.per_page						= ( obj.per_page 						== undefined )	? 5									: obj.per_page;
	obj.nextText 						= ( obj.nextText 						== undefined ) 	? 'Next' 						: obj.nextText;
	obj.backText 						= ( obj.backText 						== undefined ) 	? 'Back' 						: obj.backText;
	obj.firstText						= ( obj.firstText		 				== undefined ) 	? 'First'						: obj.firstText;
	obj.lastText						= ( obj.lastText						== undefined ) 	? 'Last'						: obj.lastText;
	obj.indicatorText				= ( obj.indicatorText 			== undefined )	? 'page [n] of [m]'	: obj.indicatorText;	
	obj.indicator						= ( obj.indicator 					== undefined )	? true							: obj.indicator;
	obj.inidicatorPosition	= ( obj.indicatorPosition 	== undefined )	? 'bottom'					: obj.indicatorPosition;
	
	var total_number_records 	= $(selector).length;
	var more_pages 				= null;
	
	// We get the total number of pages
	var pages = ( total_number_records / obj.per_page );
	pages = ( isFloat(pages) ) ? parseInt(pages) + 1 : pages;
	
	clean_document();

	$(selector).hide();
	
	$(selector).each(function(index, value) {
		/* 
			When paginating the algorithm used is:
			The first item will be the current page - 1 multiplied by the rows per page
			and the last item will be the curren page multiplied by the total rows per page
		*/
		
		if ( ( index + 1 ) > ( obj.page - 1 ) * obj.per_page && ( index + 1 ) <= obj.page * obj.per_page )
		{
			$(value).animate({ opacity: 'toggle' }, "slow");
			more_pages = ( index == total_number_records - 1 ) ? false : true;
		}
	});

	// Add pagination links to the plugin
	if ( pages > 1 )
		if (more_pages)
		{
			move_direction('forward', obj, selector);
							
			if ( obj.indicator ) current_page(selector, obj.page, pages, obj.indicatorText, obj.indicatorPosition);
			
			if ( obj.page == 1 )
				move_direction('last', obj, selector, pages);
			else
				move_direction('backward', obj, selector);
				
		}	else {
			move_direction('first', obj, selector);							
			if ( obj.indicator ) current_page(selector, obj.page, pages, obj.indicatorText, obj.indicatorPosition);
			move_direction('backward', obj, selector);
		}
		
		$(".current_page-top").after($("#easy_slider_move_forward-top"));
		$(".current_page-top").before($("#easy_slider_move_backward-top"));
		$(".current_page-top").after($("#easy_slider_move_first-top"));
		$(".current_page-top").before($("#easy_slider_move_last-top"));
}

// Creates the current page legend
function current_page(selector, value, pages, display, position)
{
	indicatorText = display.replace('[n]', value).replace('[m]', pages);
	if ( position == 'both')
	{
		$(selector).parent().after('<span id="current_page" class="current_page-bottom">' + indicatorText + '</span>');
		$(selector).parent().before('<span id="current_page" class="current_page-top">' + indicatorText + '</span>');
	}
	if ( position == 'bottom' ) $(selector).parent().after('<span class="current_page-bottom" >' + indicatorText + '</span>');
	if ( position == 'top' )  	$(selector).parent().before('<span class="current_page-top" >' + indicatorText + '</span>');
}

// Create the movement links
function move(obj, original_paginate_obj)
{
	var css_selectors = new Array();
	var position 			= original_paginate_obj.indicatorPosition;
	
	if ( position == 'both' )
	{
		css_selectors[0] = obj.cssId + '-bottom';
		css_selectors[1] = obj.cssId + '-top';
		
		$(obj.selector).parent().after('<a id="' + css_selectors[0] + '" href="#' + obj.href + '" class="' + obj.cssClass + '" >' 	+ obj.text + '</a>');
		$(obj.selector).parent().before('<a id="' + css_selectors[1] + '" href="#' + obj.href + '" class="' + obj.cssClass + '" >' 	+ obj.text + '</a>');
	}
	
	if ( position == 'bottom' ) $(obj.selector).parent().after('<a id="' + obj.cssId + '" href="#' + obj.href + '" class="' + obj.cssClass + '" >' + obj.text + '</a>');
	if ( position == 'top' ) 	$(obj.selector).parent().before('<a id="' + obj.cssId + '" href="#' + obj.href + '" class="' + obj.cssClass + '" >' + obj.text + '</a>');

	if ( position != 'both' )
	{
		$("#" + obj.cssId).click(function() {
			$(obj.selector).parent().easy_slider({ 	page: 							obj.page, 
																							per_page: 					obj.per_page, 
																							indicatorText: 			obj.indicatorText, 
																							indicatorPosition: 	position,
																							nextText:						original_paginate_obj.nextText,
																							backText:						original_paginate_obj.backText,
																							firstText:					original_paginate_obj.firstText,
																							lastText:						original_paginate_obj.lastText
																						}, obj.selector);
			return false;
		});
	} else {
		for ( i = 0; i < css_selectors.length; i++ )
			$("#" + css_selectors[i]).click(function() {
			$(obj.selector).parent().easy_slider({ 	page: 							obj.page, 
																							per_page: 					obj.per_page, 
																							indicatorText: 			obj.indicatorText, 
																							indicatorPosition: 	position,
																							nextText:						original_paginate_obj.nextText,
																							backText:						original_paginate_obj.backText,
																							firstText:					original_paginate_obj.firstText,
																							lastText:						original_paginate_obj.lastText
																						}, obj.selector);
			return false;
		});
	}
}


// This function validates if a value is a number and if this number is float
function isFloat (value) {
	if (isNaN(value) || value.toString().indexOf(".") < 0)
		return false;
	else
		if (parseFloat(value))
			return true;
		else
			return false;
}

// This function removes unused/unwanted elements from our document
function clean_document()
{
	$("#easy_slider_move_forward").remove();
	$("#easy_slider_move_backward").remove();
	$("#easy_slider_move_first").remove();
	$("#easy_slider_move_last").remove();
	$("#easy_slider_move_forward-top").remove();
	$("#easy_slider_move_backward-top").remove();
	$("#easy_slider_move_first-top").remove();
	$("#easy_slider_move_last-top").remove();
	$("#easy_slider_move_forward-bottom").remove();
	$("#easy_slider_move_backward-bottom").remove();
	$("#easy_slider_move_first-bottom").remove();
	$("#easy_slider_move_last-bottom").remove();
	$(".current_page-bottom").remove();
	$(".current_page-top").remove();
}

// This function calls the move function in the direction desired
function move_direction(direction, obj, selector, pages)
{
	switch(direction)
	{
		case 'forward':
			move({ 	cssId: 					'easy_slider_move_forward', 
							href:						'move_forward', 
							text: 					obj.nextText, 
							selector: 			selector, 
							page: 					obj.page + 1, 
							per_page: 			obj.per_page, 
							cssClass: 			'slide',
							indicatorText:  obj.indicatorText }, obj);
		break;
		
		case 'backward':
			move({ 	cssId: 					'easy_slider_move_backward', 
							href:						'move_backward', 
							text: 					obj.backText, 
							selector: 			selector, 
							page: 					obj.page - 1, 
							per_page: 			obj.per_page, 
							cssClass: 			'slide',
							indicatorText:  obj.indicatorText }, obj);
		break;
		
		case 'first':
			move({ 	cssId: 					'easy_slider_move_first', 
							href:						'move_first', 
							text: 					obj.firstText, 
							selector: 			selector, 
							page: 					1, 
							per_page: 			obj.per_page, 
							cssClass: 			'slide',
							indicatorText:  obj.indicatorText }, obj);
		break;
		
		case 'last':
			move({ 	cssId: 					'easy_slider_move_last', 
							href: 					'move_last', 
							text: 					obj.lastText, 
							selector: 			selector, 
							page: 					pages, 
							per_page: 			obj.per_page, 
							cssClass: 			'slide',
							indicatorText:  obj.indicatorText  }, obj);
		break;
	}
}