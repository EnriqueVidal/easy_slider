$.fn.easy_slider = function(obj, selector) {
	if (!obj)				obj				= { page: 1, per_page: 5, nextText: 'Next', backText: 'Back', firstText: 'First', lastText: 'last', indicator: true, indicatorText: 'page [n] of [m]' }
	if (!selector)	selector 	= '.paggeable';
	
	// Fix values in case client do not send them
	obj.page						=	( obj.page			=== undefined )			? 1									: obj.page;
	obj.per_page				=	( obj.per_page 	== undefined  )			? 5									: obj.per_page;
	obj.nextText 				= ( obj.nextText 	== undefined  ) 		? 'Next' 						: obj.nextText;
	obj.backText 				= ( obj.backText 	== undefined  ) 		? 'Back' 						: obj.backText;
	obj.firstText				= ( obj.firstText == undefined  ) 		? 'First'						: obj.firstText;
	obj.lastText				= ( obj.lastText	== undefined  ) 		? 'Last'						: obj.lastText;
	obj.indicatorText		= ( obj.indicatorText == undefined )	? 'page [n] of [m]'	: obj.indicatorText;	
	obj.indicator				= ( obj.indicator == undefined ) 			? true							: false;
	
	var total_number_records 	= $(selector).length;
	var more_pages 						= null;
	
	$("#easy_slider_move_forward").remove();
	$("#easy_slider_move_backward").remove();
	$("#easy_slider_move_first").remove();
	$("#easy_slider_move_last").remove();
	$("#current_page").remove();

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
	
	// We get the total number of pages
	pages = ( total_number_records / obj.per_page );
	pages = ( isFloat(pages) ) ? parseInt(pages) + 1 : pages;

	// Add pagination links to the plugin
	if (more_pages)
	{
		move({ cssId: 					'easy_slider_move_forward', 
						href: 					'move_forward', 
						text: 					obj.nextText, 
						selector: 			selector, 
						page: 					( obj.page + 1 ), 
						per_page: 			obj.per_page, 
						cssClass: 			'slide',
						indicatorText:  obj.indicatorText });
						
		if ( obj.indicator ) current_page(selector, obj.page, pages, obj.indicatorText);
		
		if ( obj.page == 1 )
		{			
			move({ 	cssId: 					'easy_slider_move_last', 
							href: 					'move_last', 
							text: 					obj.lastText, 
							selector: 			selector, 
							page: 					pages, 
							per_page: 			obj.per_page, 
							cssClass: 			'slide',
							indicatorText:  obj.indicatorText  });
		}
		else
			move({ cssId: 					'easy_slider_move_backward', 
							href: 					'move_backward', 
							text: 					obj.backText, 
							selector: 			selector, 
							page: 					( obj.page - 1), 
							per_page: 			obj.per_page, 
							cssClass: 			'slide',
							indicatorText:  obj.indicatorText });
	}	else {
		move({ cssId: 					'easy_slider_move_first', 
						href: 					'move_first', 
						text: 					obj.firstText, 
						selector: 			selector, 
						page: 					1, 
						per_page: 			obj.per_page, 
						cssClass: 			'slide',
	 					indicatorText:  obj.indicatorText });
						
		if ( obj.indicator ) current_page(selector, obj.page, pages, obj.indicatorText);
						
		move({ cssId: 					'easy_slider_move_backward', 
						href: 					'move_backward', 
						text: 					obj.backText, 
						selector: 			selector, 
						page: 					( obj.page - 1 ), 
						per_page: 			obj.per_page, 
						cssClass: 			'slide',
	 					indicatorText:  obj.indicatorText });
	}
}

// Creates the current page legend
function current_page(selector, value, pages, display)
{
	indicatorText = display.replace('[n]', value).replace('[m]', pages);
	$(selector).parent().after('<span id="current_page" >' + indicatorText + '</span>');
}

// Create the movement links
function move(obj)
{
	$(obj.selector).parent().after('<a id="' + obj.cssId + '" href="#' + obj.href + '" class="' + obj.cssClass + '" >' + obj.text + '</a>');
	$("#" + obj.cssId).click(function() {
		$(obj.selector).parent().easy_slider({ page: obj.page, per_page: obj.per_page, indicatorText: obj.indicatorText }, obj.selector);
		return false;
	});
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
