var log = function(str){
	try {
		console.log(str);
	}catch(e){};
};
var warn = function(str){
	log("<<warning>> " + str);
}


function findPos(obj) {
	var curleft = curtop = 0;
	if (obj.offsetParent) {
		do {
			curleft += obj.offsetLeft;
			curtop += obj.offsetTop;
		} while (obj = obj.offsetParent);
		
		return [curleft,curtop];
	}
	return null;
}
		
		
		