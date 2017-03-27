$(document).ready(function() {
	init_joystick();
});



function init_joystick() {
	console.log("touchscreen is", VirtualJoystick.touchScreenAvailable() ? "available" : "not available");
	var joystick	= new VirtualJoystick({
		container	: document.getElementById('container'),
		mouseSupport	: true,
	});
	joystick.addEventListener('touchStart', function(){
		console.log('down');
	});
	joystick.addEventListener('touchEnd', function(){
		console.log('up');
	});
	joystick.addEventListener('mousedown', function(){
		console.log('down');
	});
	joystick.addEventListener('mouseup', function(){
		console.log('up');
	});
	setInterval(function(){
		var outputEl	= document.getElementById('position');
		outputEl.innerHTML	= ''
			+ ' dx:'+joystick.deltaX()
			+ ' dy:'+joystick.deltaY()
			+ (joystick.right()	? ' right'	: '')
			+ (joystick.up()	? ' up'		: '')
			+ (joystick.left()	? ' left'	: '')
			+ (joystick.down()	? ' down' 	: '')	
	}, 1/30 * 1000);
};