var redis = require('redis')
var multer  = require('multer')
var express = require('express')
var fs      = require('fs')
var app = express()
// REDIS


var blue_client = redis.createClient(7777, '127.0.0.1', {})
var green_client = redis.createClient(8888, '127.0.0.1', {})
////
var curr_client = 'blue'
var client = blue_client
///////////// WEB ROUTES

// Add hook to make it easier to get all visited URLS.
app.use(function(req, res, next)
{
	console.log(req.method, req.url);
	client.lpush("visits",req.url);
	// ... INSERT HERE.

	next(); // Passing the request to the next handler in the stack.
});

app.get('/switch',function(req,res){

		if(curr_client == 'blue')
		{
			console.log('Current: Redis Blue')
			client = green_client  // switch client to green redis
			curr_client = 'green'
			console.log('Toggled to: Redis Green')
		}
		else
		{
			console.log('Current: Redis Green')
			client = blue_client  // switch client to blue redis
			curr_client = 'blue'
			console.log('Toggled to: Redis Blue')
		}

		res.send('')
});


app.post('/upload',[ multer({ dest: './uploads/'}), function(req, res){
   console.log(req.body) // form fields
   console.log(req.files) // form files

   if( req.files.image )
   {
	   fs.readFile( req.files.image.path, function (err, data) {
	  		if (err) throw err;
	  		var img = new Buffer(data).toString('base64');
	  		console.log(img);
				client.lpush('images',img)
		});
	}

    res.status(204).end()
 }]);

app.get('/meow', function(req, res) {

		client.lpop('images',function(err,imagedata){

			if (err) res.send('')

			res.writeHead(200, {'content-type':'text/html'});
			//items.forEach(function (imagedata)
			//{
				res.write("<h1>\n<img src='data:my_pic.jpg;base64,"+imagedata+"'/>");
			//});
			res.end();

		})

		// client.lpop('images',function(err,value){
		// 			res.send(value)
		// })


})

// HTTP SERVER
var server = app.listen(3000, function () {

	  var host = server.address().address
	  var port = server.address().port

   	console.log('Example app listening at http://%s:%s', host, port)
})


// Handling Requests


app.get('/', function(req, res) {
  res.send('hello world: Port 3000')
})

app.get('/set',function(req,res){
client.set("msg_key", "this message will destruct in 10 sec");
client.expire("msg_key",10);
res.send('Key was added succsessfully');
})

app.get('/get',function(req,res){

client.get("msg_key",function(err,value){
res.send(value)
})

})

app.get('/recent',function(req,res){
client.lrange("visits",0,5,function(err,value){
res.send(value);
})
});
