var Pwm_Driver = require('./PWM_DRIVER.js'),
	Async = require('async'),
 	Pwm_Controller = new Pwm_Driver(0x40, '/dev/i2c-1'),
 	_ = require('underscore'),
 	Servo = require('./servo.js').Servo,
 	gpio = require('rpi-gpio');

var Laser_Toy_Manager = function(servos) {
	this.servos = servos;
	this.default_PWM_FREQ = 60;
	this.laser_pin = 7;
	this.pan_servo = new Servo({
		position: 0,
		channel: 0,
		name: "pan",
		min: 0,
		max: 350,
		center: 200
	});
	  // Higher means lower 350 center is lower than 250
	this.tilt_servo =  new Servo({
		position: 0,
		channel: 1,
		name: "tilt",
		min: 150,
		max: 400,
		center: 300
	});
};

Laser_Toy_Manager.prototype.set_defaults = function() {
	var self = this;
	this.tilt_servo.center_self();
	this.pan_servo.center_self();
	gpio.setup(this.laser_pin, gpio.DIR_OUT, _.bind(self.start_laser, this));
};

Laser_Toy_Manager.prototype.start_laser = function() {
	gpio.write(this.laser_pin, 1, function() {
		console.log("Laser Prepped.");
	});
}

Laser_Toy_Manager.prototype.stop_laser = function() {
	gpio.write(this.laser_pin, 0, function() {
		console.log("Laser Stopped.");
	});
}


module.exports = Laser_Toy_Manager;