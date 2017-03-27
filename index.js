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

app.post('/joystick_update', function (request, response) {
  if (!request.body || request.body.x  || request.body.y) {
  	return response.sendStatus(400);
  }
  if (request.body && request.body.x && request.body.y) {
  	  console.log(request.body);
  	  mananger.update_servos(request.body.x, request.body.y);
  	  response.sendStatus(200);
  }
});

app.listen(3000, function () {
  console.log('Server Running on port 3000');
});




process.on('SIGINT', function () {
  console.log("SIGINT");
  process.exit(1);
});