var	express = require('express'),
 	app = express(),
 	body_parser = require('body-parser'),
 	Manager = require('./lib/laser_toy_manager.js');

app.use(express.static('public'));
app.use(body_parser.json());
 	
var manager = new Manager();
var options = {
	laser: true
};
manager.set_defaults(options);


app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/center', function(request, response) {
	manager.set_defaults();
	response.sendStatus(200);
});

app.get('/start_random', function(request, response) {
  manager.start_random();
  response.sendStatus(200);
});

app.get('/stop_random', function(request, response) {
  manager.stop_random();
  response.sendStatus(200);
});

app.post('/joystick_update', function (request, response) {
  if (!request.body) {
  	return response.sendStatus(400);
  }
  console.log(request.body);
  if (request.body) {
  	  manager.update_servos(request.body.x, request.body.y);
  	  response.sendStatus(200);
  }
  else {
    response.sendStatus(400);
  }
});

app.listen(3000, function () {
  console.log('Server Running on port 3000');
});




process.on('SIGINT', function () {
  console.log("SIGINT");
  manager.shut_down();
  setTimeout(function() {
  	process.exit(1);
  }, 5000);
});