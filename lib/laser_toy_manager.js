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
	this.multiplier = 20;
	this.pan_servo = new Servo({
		position: 0,
		channel: 0,
		name: "pan",
		min: 0,
		max: 600,
		center: 350,
		multiplier: this.multiplier
	});
	  // Higher means lower 350 center is lower than 250
	this.tilt_servo =  new Servo({
		position: 0,
		channel: 1,
		name: "tilt",
		min: 150,
		max: 375,
		center: 200,
		multiplier: this.multiplier
	});
};

Laser_Toy_Manager.prototype.set_defaults = function(options) {
	options = options || {};
	var self = this;
	this.tilt_servo.center_self();
	this.pan_servo.center_self();
	this.stop_random();
	if (options.laser) {
		gpio.setup(this.laser_pin, gpio.DIR_OUT, _.bind(self.start_laser, this));
	}
};

Laser_Toy_Manager.prototype.update_servos = function(x, y) {
	this.stop_random();
	this.tilt_servo.increment_position(y);
	this.pan_servo.increment_position(x);
};

Laser_Toy_Manager.prototype.start_random = function() {
	var self = this;
	this.interval = setInterval(_.bind(self.random, this), 500);
};

Laser_Toy_Manager.prototype.stop_random = function() {
	if (this.interval) {
		var self = this;
		clearInterval(this.interval);
		delete this.interval;
	}
};

Laser_Toy_Manager.prototype.random = function() {
	this.tilt_servo.increment_position(Math.floor((Math.random() * this.tilt_servo.max) + 1));
	this.pan_servo.increment_position(Math.floor((Math.random() * this.pan_servo.max) + 1));
};

Laser_Toy_Manager.prototype.start_laser = function() {
	gpio.write(this.laser_pin, 1, function() {
		console.log("Laser Prepped.");
	});
};

Laser_Toy_Manager.prototype.stop_laser = function() {
	gpio.write(this.laser_pin, 0, function() {
		console.log("Laser Stopped.");
	});
};

Laser_Toy_Manager.prototype.shut_down = function() {
	this.stop_laser();
	this.set_defaults();
};
module.exports = Laser_Toy_Manager;