var express = require('express');
var app = express();
var body_parser = require('body-parser');

app.use(express.static('public'));
app.use(body_parser.json());

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