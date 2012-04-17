var rect_drawer = function( _relative_ele ){
	var that = {};
	
	var rect;
	var rect_id = null;
	
	
	// override this!  or else...
	that.on_draw = function(_coords, _rect){
		log("x: " + _coords.x + " y: " + _coords.y + " w: " + _coords.w + " h: " + _coords.h); 
	};
	that.on_start_draw = function(){};
	
	
	that.hide_rect = function(){
		$(rect).remove();
	};
	
	var init_event_listeners = function(){
		var moved;
		
		var start_loc = [0,0];
		var curr_loc = [0,0];
		var rect_info = {
			x: 0,
			y: 0,
			w: 0,
			h: 0
		};
		
		$(screen_div).mousedown(function(e){
			handleMouseDown(e);
		}).mouseup(function(e){
			handleMouseUp(e);
		});
	
		var handleMouseDown = function(e){
			moved = false;
			start_loc = [e.offsetX, e.offsetY];
			
			$(rect).remove();
			
			rect = document.createElement("div");
			rect.setAttribute("id", rect_id);
			rect.setAttribute("class", "rect_selector");
			rect.style.position = "absolute";
			document.body.appendChild(rect);
		
			$(screen_div).bind('mousemove', function(e){
				handleMouseMove(e, this);
			});
			
			// for any listeners
			that.on_start_draw();
		};
		var handleMouseMove = function(e){
			moved = true;
			curr_loc = [e.offsetX, e.offsetY];
			
			var diff_loc = {
				width : -1 * (start_loc[0] - curr_loc[0]),
				height : -1 * (start_loc[1] - curr_loc[1])
			};
			
			rect_info = {
				x : (diff_loc["width"] < 0) ? start_loc[0] + diff_loc["width"] : start_loc[0],
				y : (diff_loc["height"] < 0) ? start_loc[1] + diff_loc["height"] : start_loc[1],
				w : Math.abs(diff_loc["width"]),
				h : Math.abs(diff_loc["height"])
			};
			
			rect.style.left = ((diff_loc["width"] < 0) ? start_loc[0] + diff_loc["width"] : start_loc[0]) + "px";
			rect.style.width = Math.abs(diff_loc["width"]) + "px";
			
			rect.style.top = ((diff_loc["height"] < 0) ? start_loc[1] + diff_loc["height"] : start_loc[1]) + "px";
			rect.style.height = Math.abs(diff_loc["height"]) + "px";
		};
		var handleMouseUp = function(e){
			$(screen_div).unbind('mousemove');
			if (!moved) return;
			that.on_draw(rect_info, rect);
		};
	};
	
	
	// get unique rect id
	var unique_num = 0;
	while( document.getElementById("rect" + String(unique_num)) ){
		++unique_num;
	}
	rect_id = "rect" + String(unique_num);

	
	// add layer on top of img
	var screen_div = document.createElement("div");
	screen_div.setAttribute("class", "screen_div");
	screen_div.style.width = _relative_ele.width + "px";
	screen_div.style.height = _relative_ele.height + "px";
	screen_div.style.position = "absolute";
	screen_div.style.top = findPos(_relative_ele)[1] + "px";
	screen_div.style.left = findPos(_relative_ele)[0] + "px";
	screen_div.style.zIndex = 99;
	document.body.appendChild(screen_div);
	
	
	
	init_event_listeners();
	
	return that;
};
