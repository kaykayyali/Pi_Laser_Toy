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
  setTimeout("mjpeg_img.src = 'cam_pic.php?time=' + new Date().getTime();", 100);
}
function init() {
  mjpeg_img.onload = reload_img;
  mjpeg_img.onerror = error_img;
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
		Updater.handle_update(delta_x, delta_y);
		var update 	= ''
			+ ' dx:'+delta_x
			+ ' dy:'+delta_y
			+ (joystick.right()	? ' right'	: '')
			+ (joystick.up()	? ' up'		: '')
			+ (joystick.left()	? ' left'	: '')
			+ (joystick.down()	? ' down' 	: '')	
			// console.log(update)
	}, 1/20 * 1000);
};


var Updater = function() {
	this.last_x = 0;
	this.last_y = 0;
	this.buffer = 1;
	this.end_point = 'joystick_update';
};

Updater.prototype.handle_update = function(delta_x, delta_y) {
	if (delta_x != this.last_x || delta_y != this.last_y) {
		console.log("Handling Change");
		this.last_x = delta_x;
		this.last_y = delta_y;
		var new_update = {
			x: this.last_x,
			y: this.last_y
		}	
		$.ajax({
			type: "POST",
			url: this.end_point,
			data: JSON.stringify(new_update),
			contentType: 'application/json; charset=utf-8',
			dataType: 'json'
		});
		// $.post(this.end_point, new_update);
	}
	else {
		// No change
		console.log("Not Handling");
		return;
	}
};