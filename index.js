var	express = require('express'),
 	app = express(),
 	body_parser = require('body-parser'),
 	Manager = require('./lib/laser_toy_manager.js');

app.use(express.static('public'));
app.use(body_parser.json());
 	
var manager = new Manager();
manager.set_defaults();


app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

app.post('/joystick_update', function (request, response) {
  if (!request.body) {
  	return response.sendStatus(400);
  }
  console.log(request.body);
  response.sendStatus(200);
});

app.listen(3000, function () {
  console.log('Server Running on port 3000');
});




process.on('SIGINT', function () {
  console.log("SIGINT");
  process.exit(1);
});