/* /////////////////////////////
 * 
 * Author: Patrick Hollstein
 * Author-URL: me-and-the-media.com
 * 
 * Project: rdmGrid
 * Project-URL: https://me-and-the-media.com/work/rdmgrid.html
 * Version: 1.0.0
 *
 * License: https://github.com/patrick-hlt/rdm-grid/blob/master/LICENSE
 *
 * /////////////////////////////
*/

$.fn.rdmGrid = function(options){
	
	/* /////////////////////////////
	 * 
	 * INIT: Settings
	 * 
	 * /////////////////////////////
	*/
	
	const SETTINGS = $.extend({
		animationSpeed:	350,
		breakPoint:		800,
		btns:			'rg_btn',
		columns:			3,
		fadeInSpeed:	350,
		initialShuffle:	true,
		responsive:		true
	}, options);
	
	/* /////////////////////////////
	 * 
	 * INIT: Variables & Constants
	 * 
	 * /////////////////////////////
	*/
	
	const	plugin = this,
			grids = $(this);
	let		btns;
	
	/* /////////////////////////////
	 * 
	 * INIT: Default CSS
	 * 
	 * /////////////////////////////
	*/
	
	grids
		.css({
			'position': 'relative',
			'box-sizing': 'border-box'
		})
		.children()
		.css({
			'display': 'none',
			'position': 'absolute',
			'box-sizing': 'border-box'
		});
	
	/* /////////////////////////////
	 * 
	 * INIT: Button
	 * 
	 * /////////////////////////////
	*/
	
	// get the matching buttons
	if (grids.length === 1) {
		btns = $('.' + SETTINGS.btns).filter('[data-rg=' + $(grids[0]).attr('id') + ']');
	} else {
		let ids = [];
		grids.each(function(){
			ids.push($(this).attr('id'));
		});
		
		btns = $('.' + SETTINGS.btns).filter(function(){
			if (ids.indexOf($(this).attr('data-rg')) !== -1) {
				return this;
			}
		});
	}
	
	// assign click event to buttons
	btns.click(function(e){
		// prevent <a> from navigating
		e.preventDefault();
		plugin.trigger($('#' + $(this).attr('data-rg')));
	});
	
	/* /////////////////////////////
	 * 
	 * INIT: Resonsiveness
	 * 
	 * /////////////////////////////
	*/
	
	if (SETTINGS.responsive === true && $(window).width() < SETTINGS.breakPoint) {
		SETTINGS.columns = 1;
	} // if
	
	/* /////////////////////////////
	 * 
	 * FUNC: trigger()
	 * 
	 * - Assign CSS to the items
	 * 
	 * /////////////////////////////
	*/
	
	plugin.trigger = function(elem, init = false) {
		
		// get the right grid, no matter if jQuery object or string is passed
		var grid;
		
		if (elem instanceof jQuery) {
			grid = elem;
		} else if (typeof elem === "string") {
			grid = $('#' + elem);
		} else if (!elem) {
			grid = $(this);
		} else {
			console.error("ERROR in jQuery plugin 'rdmGrid' inside 'trigger()': Can't detect type of element.");
		}
		
		// INIT: Constants
		const	items		= grid.children(),
				gridWidth	= grid.innerWidth(),
				itemWidth	= gridWidth / SETTINGS.columns;
		
		// INIT: Variables
		let	gridHeight	= 0,
			itemsLength	= items.length,
			rowsTotal	= itemsLength / SETTINGS.columns,
			rowHeights	= [];
		
		grid.children().css({
			'width': itemWidth
		});
		
		// Bring the items into a random order
		if ((init === true && SETTINGS.initialShuffle === true) || init === false) {
			shuffle(items);
		} // if
		
		// Reset heights of items
		// Important for row heights
		$(items).each(function(){$(this).height('initial');});
		
		// Assign data-attributes to the items (row & column)
		// Importent to assign CSS values "top" & "left"
		let n = 0; // Iterates through the items
		
		for (let i = 0; i < rowsTotal; ++i) {
			for (let k = 0; k < SETTINGS.columns; ++k) {
				$(items[n]).attr({
					'rg-row': i,
					'rg-col': k
				});
				
				n++;
			} // for k
		} // for i
		
		// get heights of rows
		for (let i = 0; i < rowsTotal; ++i){
			let itemsFiltered = [];
			let itemsHeights = [];
			
			for (let k = 0; k < itemsLength; ++k){
				if ($(items[k]).attr('rg-row') == i) {
					itemsFiltered.push(items[k]);
					itemsHeights.push($(items[k]).outerHeight(true));
				} // if
			} // for k
			
			// Assign the biggest height to all items of the row
			let heightRow = Math.max.apply(null, itemsHeights);
			$(itemsFiltered).each(function(){
				$(this).height(heightRow + 'px');
			});
			
			rowHeights.push(gridHeight);
			gridHeight += heightRow;
		} // for i
		
		// Assign CSS to grid
		if (init === true) { // at page load
			grid.height(gridHeight);
		} else {
			grid.animate({height: gridHeight}, SETTINGS.animationSpeed);
		}
		
		// Assign CSS to items
		$(items).each(function() {
			if (init === true) { // at page load => .fadeIn
				$(this)
					.css({
						left: $(this).attr('rg-col') * itemWidth,
						top: rowHeights[$(this).attr('rg-row')]
					})
					.fadeIn(SETTINGS.fadeInSpeed);
			} else {
				$(this).animate({
					left: $(this).attr('rg-col') * itemWidth,
					top: rowHeights[$(this).attr('rg-row')]
				}, SETTINGS.animationSpeed);
			}
		});
	}; // trigger()
	
	/* /////////////////////////////
	 * 
	 * FUNC: shuffle()
	 * 
	 * - Brings the items into a random order
	 * 
	 * /////////////////////////////
	*/
	
	function shuffle(items) {
		let j, x, l = items.length;
		for (let i = l - 1; i > 0; --i) {
			j = Math.floor(Math.random() * (i + 1));
			x = items[i];
			items[i] = items[j];
			items[j] = x;
		} // for
	} // shuffle()
	
	/* /////////////////////////////
	 * 
	 * Initial Function @ pageload
	 * 
	 * /////////////////////////////
	*/
	
	grids.each(function(){
		plugin.trigger($(this), true);
	});
	
	return plugin;
};