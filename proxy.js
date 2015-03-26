var redis = require('redis')
var multer  = require('multer')
var express = require('express')
var fs      = require('fs')
var request = require('request')
var app = express()
// REDIS
var client = redis.createClient(6379, '127.0.0.1', {})
var visit_server='3000'
var served_by_3000=0
var served_by_3001=0
///////////// WEB ROUTES

// Add hook to make it easier to get all visited URLS.
app.use(function(req, res, next)
{
	console.log(req.method, req.url);
	// ... INSERT HERE.

	next(); // Passing the request to the next handler in the stack.
});

// HTTP SERVER
var server = app.listen(3002, function () {

	  var host = server.address().address
	  var port = server.address().port
		client.set('lastvisited','3000') // Initializing the first server
		client.set('served_by_3000',0)
		client.set('served_by_3001',0)
   	console.log('Example app listening at http://%s:%s', host, port)
})


// Handling Requests



app.get('/request_status',function(req,res){

client.get('served_by_3000',function(err,value){

	served_by_3000 = value
	client.get('served_by_3001',function(err,value1){
			served_by_3001 = value1
			res.send('served_by_3000:'+served_by_3000+'   served_by_3001:'+served_by_3001)
	})
})



})


app.get('/', function(req, res) {

		  client.get('lastvisited',function(err,value){
				if(value == '3000')
				{
					  visit_server='3001'
						client.set('lastvisited','3001')
				}
				else
				{
					visit_server='3000'
					client.set('lastvisited','3000')
				}

				var txt = 'served_by_'+visit_server
				client.incr(txt) // increment when visited

				request('http://localhost:'+visit_server+'/', function (error, response, body) {
					if (!error && response.statusCode == 200) {
						res.send(body) // Show the HTML for the Google homepage.
					}
				})
			})

})


app.get('/set',function(req,res){


			 client.get('lastvisited',function(err,value){
					if(value == '3000')
					{
						  visit_server='3001'
							client.set('lastvisited','3001')
					}
					else
					{
						visit_server='3000'
						client.set('lastvisted','3000')
					}

					var txt = 'served_by_'+visit_server
					client.incr(txt) // increment when visited

					request('http://localhost:'+visit_server+'/set', function (error, response, body) {
						if (!error && response.statusCode == 200) {
							res.send(body) // Show the HTML for the Google homepage.
						}
					})


				})

})


app.get('/get',function(req,res){

	client.get('lastvisited',function(err,value){
		if(value == '3000')
		{
				visit_server='3001'
				client.set('lastvisited','3001')
		}
		else
		{
			visit_server='3000'
			client.set('lastvisited','3000')
		}

		var txt = 'served_by_'+visit_server
		client.incr(txt) // increment when visited

		request('http://localhost:'+visit_server+'/get', function (error, response, body) {
			if (!error && response.statusCode == 200) {
				res.send(body) // Show the HTML for the Google homepage.
			}
		})
	})




})

app.get('/recent',function(req,res){

	client.get('lastvisited',function(err,value){
		if(value == '3000')
		{
				visit_server='3001'
				client.set('lastvisited','3001')
		}
		else
		{
			visit_server='3000'
			client.set('lastvisited','3000')
		}

		var txt = 'served_by_'+visit_server
		client.incr(txt) // increment when visited

		request('http://localhost:'+visit_server+'/recent', function (error, response, body) {
			if (!error && response.statusCode == 200) {
				res.send(body) // Show the HTML for the Google homepage.
			}
		})
	})
})


app.get('/meow',function(req,res){

	client.get('lastvisited',function(err,value){
		if(value == '3000')
		{
				visit_server='3001'
				client.set('lastvisited','3001')
		}
		else
		{
			visit_server='3000'
			client.set('lastvisited','3000')
		}

		var txt = 'served_by_'+visit_server
		client.incr(txt) // increment when visited

		request('http://localhost:'+visit_server+'/meow', function (error, response, body) {
			if (!error && response.statusCode == 200) {
				res.send(body) // Show the HTML for the Google homepage.
			}
		})
	})

})


app.get('/upload',function(req,res){

	client.get('lastvisited',function(err,value){
		if(value == '3000')
		{
				visit_server='3001'
				client.set('lastvisited','3001')
		}
		else
		{
			visit_server='3000'
			client.set('lastvisited','3000')
		}

		var txt = 'served_by_'+visit_server
		client.incr(txt) // increment when visited

		request('http://localhost:'+visit_server+'/upload', function (error, response, body) {
			if (!error && response.statusCode == 200) {
				res.send('') // Show the HTML for the Google homepage.
			}
		})
	})
})
