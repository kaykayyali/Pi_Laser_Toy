var mjpeg_img;
$(document).ready(function() {
	init_joystick();
	mjpeg_img = document.getElementById("mjpeg_dest");
});
 
function reload_img () {
	var host_name = location.hostname;
 	mjpeg_img.src = "http://"+host_name+"/html/cam_pic.php?time=" + new Date().getTime();
}
function error_img () {
  setTimeout("mjpeg_img.src = 'cam_pic.php?time=' + new Date().getTime();", 500);
}
function init() {
  mjpeg_img.onload = _.debounce(reload_img, 250);
  mjpeg_img.onerror = _.debounce(error_img, 250);
  reload_img();
}


function init_joystick() {
	console.log("touchscreen is", VirtualJoystick.touchScreenAvailable() ? "available" : "not available");
	window.Updater = new Updater();
	var joystick	= new VirtualJoystick({
		container	: document.getElementById('container'),
		mouseSupport	: true,
	});
	joystick.addEventListener('touchStart', function(){
		console.log('Touch down');
	});
	joystick.addEventListener('touchEnd', function(){
		console.log('Touch up');
		$.get('/center');
	});
	setInterval(function(){
		var delta_x = joystick.deltaX();
		var delta_y = joystick.deltaY();
		Updater.handle_update(joystick.up(), joystick.down(), joystick.left(), joystick.right());
		var update 	= ''
			+ ' dx:'+delta_x
			+ ' dy:'+delta_y
			+ (joystick.right()	? ' right'	: '')
			+ (joystick.up()	? ' up'		: '')
			+ (joystick.left()	? ' left'	: '')
			+ (joystick.down()	? ' down' 	: '')	
			// console.log(update)
	}, 1/3 * 1000);
};


var Updater = function() {
	this.last_x = 0;
	this.last_y = 0;
	this.buffer = 1;
	this.end_point = 'joystick_update';
};

Updater.prototype.handle_update = function(up, down, left, right) {
		console.log("Handling Change");
		if (!up && !down && !left && !right) {
			return;
		}
		var x = 0;
		var y = 0;
		if (up) {
			y = -1
		}
		else if (down) {
			y = 1
		}
		if (left) {
			x = -1
		}
		else if (right) {
			x = 1
		}
		var new_update = {
			x: x,
			y: y
		}	
		$.ajax({
			type: "POST",
			url: this.end_point,
			data: JSON.stringify(new_update),
			contentType: 'application/json; charset=utf-8',
			dataType: 'json'
		});
};