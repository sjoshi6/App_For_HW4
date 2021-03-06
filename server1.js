var redis = require('redis')
var multer  = require('multer')
var express = require('express')
var fs      = require('fs')
var app = express()

//Setting Ports via Command Line
var args = process.argv.slice(2);
var PORT = args[0];
var REDIS_PORT = args[1];

// REDIS
var client = redis.createClient(REDIS_PORT, '127.0.0.1', {})

app.use(function(req, res, next)
{
	console.log(req.method, req.url);
	client.lpush("visits",req.url);
	// ... INSERT HERE.

	next(); // Passing the request to the next handler in the stack.
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

})

// HTTP SERVER
var server = app.listen(PORT, function () {

	  var host = server.address().address
	  var port = server.address().port

   	console.log('Example app listening at http://%s:%s', host, port)
})


// Handling Requests


app.get('/', function(req, res) {

  res.send('hello world: Port '+PORT)

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
