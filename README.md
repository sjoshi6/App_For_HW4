### Homework 3 submission

Following are the details of the homework 3 submission for *Option 2*

1) Completed get and set requests

```
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
```

2) Completed recents

```
app.get('/recent',function(req,res){
client.lrange("visits",0,5,function(err,value){
res.send(value);
})
})
```

3) Completed upload and meow

```
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

```



Cache, Proxies, Queues
=========================

### Setup

* Clone this repo, run `npm install`.
* Install redis and run on localhost:6379

### A simple web server

Use [express](http://expressjs.com/) to install a simple web server.

	var server = app.listen(3000, function () {
	
	  var host = server.address().address
	  var port = server.address().port
	
	  console.log('Example app listening at http://%s:%s', host, port)
	})

Express uses the concept of routes to use pattern matching against requests and sending them to specific functions.  You can simply write back a response body.

	app.get('/', function(req, res) {
	  res.send('hello world')
	})

### Redis

You will be using [redis](http://redis.io/) to build some simple infrastructure components, using the [node-redis client](https://github.com/mranney/node_redis).

	var redis = require('redis')
	var client = redis.createClient(6379, '127.0.0.1', {})

In general, you can run all the redis commands in the following manner: client.CMD(args). For example:

	client.set("key", "value");
	client.get("key", function(err,value){ console.log(value)});

### An expiring cache

Create two routes, `/get` and `/set`.

When `/set` is visited, set a new key, with the value:
> "this message will self-destruct in 10 seconds".

Use the expire command to make sure this key will expire in 10 seconds.

When `/get` is visited, fetch that key, and send value back to the client: `res.send(value)` 


### Recent visited sites

Create a new route, `/recent`, which will display the most recently visited sites.

There is already a global hook setup, which will allow you to see each site that is requested:

	app.use(function(req, res, next) 
	{
	...

Use the lpush, ltrim, and lrange redis commands to store the most recent 5 sites visited, and return that to the client.

### Cat picture uploads: queue

Implement two routes, `/upload`, and `/meow`.
 
A stub for upload and meow has already been provided.

Use curl to help you upload easily.

	curl -F "image=@./img/morning.jpg" localhost:3000/upload

Have `upload` store the images in a queue.  Have `meow` display the most recent image to the client and *remove* the image from the queue.

### Proxy server

Bonus: How might you use redis and express to introduce a proxy server?

See [rpoplpush](http://redis.io/commands/rpoplpush)
