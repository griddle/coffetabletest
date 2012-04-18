


var coffee_table = function(){
	
	var issue_id;
	var meta_json = null;
	var product_json = null;
	
	var rect_draw = null;
	
	var e_page_img = document.getElementById("page_img");
	
	
	// pull down json
	var remote_api = {
		get_meta_data_for_issue : function(_issue_id, _async, _on_finish){
			var async = _async || false;
			var on_finish = _on_finish || function(){};
			if (!meta_json){
				$.ajax({
					url: g_ct.url_meta(_issue_id),
					async: async,
					dataType: "json",
					success: function(data) {
						meta_json = data;
						on_finish();
					},
					error: function(data) {
						warn("failure loading json in get_meta_for_issue");
						log(data);
						on_finish();
					}
				});
			}
			return meta_json;
		},
		get_product_data_for_issue : function(_issue_id, _async, _on_finish){
			var async = _async || false;
			var on_finish = _on_finish || function(){};
			if (!product_json){
				$.ajax({
					url: g_ct.url_product(_issue_id),
					async: async,
					dataType: "json",
					success: function(data) {
						product_json = data;
						on_finish();
					},
					error: function(data) {
						warn("failure loading json in product_json");
						log(data);
						on_finish();
					}
				});
			}
			return product_json;
		},
		get_both_async : function(_issue_id, _callback){
			var ncalls = 2;
			var finish_count = 0;
			var check_finished = function(){
				++finish_count;
				if (finish_count == ncalls){
					_callback();
				}
			};
			this.get_meta_data_for_issue(_issue_id, true, check_finished);
			this.get_product_data_for_issue(_issue_id, true, check_finished);			
		}
	};
	
	
	var iform = function() {
		// supports one input form at a time
		var that = {};
		var form;
		var coords, curr_prod_id;
		
		that.get_input_form = function(_for_coords){
			coords = _for_coords;
			var new_div = $("#input_form_template").clone();
			form = new_div[0];
			return form;
		};
		that.get_close_box = function(){
			return $(form).find(".close_box")[0];
		};
		that.get_select = function(){
			return $(form).find(".input_select")[0]
		};
		that.get_body = function(){
			return $(form).find(".product_info")[0];
		};
		
		that.populate_product_info = function(_id, _on_submit){
			var form_body = that.get_body();
			var submit_handler = _on_submit;
			curr_prod_id = _id;
			
			if (!curr_prod_id) {
				form_body.style.display = "none";
				return;
			}
			
			var product = product_json.data[curr_prod_id];
			$(form_body).empty();
			form_body.style.display = "block";
			
			var title = product.title || "?";
			var brand = product.brand || "?";
			var category = product.category || "?";
			var r_prod_id = product.retailer_product_id || "?";
			var img_url = product.medium_img_url || "http://save-time.org/wp-content/uploads/2011/10/pink-question-mark.jpg";
			var description = product.description || "?";
			var submit_btn = $("<input type='submit' id='' name='' value='submit' />");
			
			$(form_body).append($("<h4>" + title + "</h4>"));
			$(form_body).append($("<p><b>brand:</b> " + brand + "</p>"));
			$(form_body).append($("<p><b>category:</b> " + category + "</p>"));
			$(form_body).append($("<p><b>retailer product id:</b> " + r_prod_id + "</p>"));
			$(form_body).append($("<a href='" + img_url + "' target='_blank'><img src='" + img_url + "' alt='' /></a>"));
			$(form_body).append($("<p><b>description:</b> " + description + "</p>"));
			$(form_body).append(submit_btn);
			
			$(submit_btn).click(function(e){
				that.on_submit();
			});
		};
		that.populate_select = function(){
			var select = that.get_select();
			var product_data = product_json.data;
			
			var autofill_data = [];
			for (var k=0; k<product_data.length; ++k){
				autofill_data.push(product_data[k]["title"]);
			}
			
			$(select).typeahead({
				source : autofill_data,
				items : 20
			});
			
		};

		that.remove = function(){
			$(form).remove();
			$("ul.typeahead").each(function(){
				$(this).remove();
			});
		};
		that.close = function(){
			that.remove();
			rect_draw.hide_rect();
		};
		that.get_select_val = function(){
			var sel = that.get_select();
			var val = $(sel).val();
			var selected = null;
			
			var product_data = product_json.data;
			for (var k=0; k<product_data.length; ++k){
				if (val == product_data[k]["title"]){
					selected = k
				}
			}
			
			return selected;
		};
		
		that.on_submit = function(){
			var output_str = "x: " + coords.x + ", y: " + coords.y + ", width: " + coords.w + ", height: " + coords.h;
			output_str += "\n\n";
			output_str += "for issue id: " + issue_id;
			output_str += "\n";
			output_str += "for product id: " + curr_prod_id;
			alert(output_str);
			
			that.close();
		};
		
		return that;
	}();

	
	
	// rect_draw event callbacks
	var handle_start_draw = function(){
		iform.remove();
	};
	var handle_draw = function(_coords, _rect){
		iform.remove();
		var input_form = iform.get_input_form(_coords);
		document.body.appendChild(input_form);
		input_form.style.top = _coords.y + "px";
		input_form.style.left = _coords.x + _coords.w + 5 + "px";
		$(input_form).hide().fadeIn(300);
		iform.populate_select();

		var close_box = iform.get_close_box();
		$(close_box).click(function(e){
			iform.close();
		});
		
		$(iform.get_select()).change(function(e){
			var prod_id = iform.get_select_val();
			iform.populate_product_info(prod_id);
		});
		
	};
	

	
	var init = function(){
		// populate and setup UI
		var populate_ui = function(){
			var img_url = meta_json.data.cover_image_url;
			if (!img_url) {throw('no image');}
			e_page_img.src = img_url;
			
			e_page_img.onload = function() {
				// init rectangle drawer
				rect_draw = rect_drawer(e_page_img);
				rect_draw.on_draw = handle_draw;
				rect_draw.on_start_draw = handle_start_draw;
			};
			
			// issue data
			var issue_data = meta_json.data;
			var issue_meta = document.getElementById("issue_meta_info");
			
			var pub_date = issue_data.published_at ? issue_data.published_at.substr(0,10) : null;
			
			$(issue_meta).append("<h3>" + issue_data.name || "" + "</h4>");
			$(issue_meta).append("<p><b>pages:</b> " + (issue_data.pages || "?") + "</p>");
			$(issue_meta).append("<p><b>pub date:</b> " + (pub_date || "?") + "</p>");
			$(issue_meta).append("<p><b>catalog:</b> " + (issue_data.catalog_name || "?") + "</p>");
		};
		
		
		// ----------- INIT ----------- //
		
		// make sure have an issue to show
		if (!g_has_issue()) {
			warn("missing issue_id");
			return;
		}
		issue_id = g_issue_id;
		
		// get all data from server
		remote_api.get_both_async(issue_id, function(){
			if (!meta_json) {throw('no meta_json');}
			if (!product_json) {throw('no product_json');}
			
			// populate and setup UI
			populate_ui();
		});
		
		
		
	}();
}();


