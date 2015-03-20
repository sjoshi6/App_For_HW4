var redis = require('redis')
var multer  = require('multer')
var express = require('express')
var fs      = require('fs')
var request = require('request')
var app = express()
// REDIS
var client = redis.createClient(6379, '127.0.0.1', {})
var visit_server='3000'
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
   	console.log('Example app listening at http://%s:%s', host, port)
})


// Handling Requests


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

		request('http://localhost:'+visit_server+'/recent', function (error, response, body) {
			if (!error && response.statusCode == 200) {
				res.send(body) // Show the HTML for the Google homepage.
			}
		})
	})
})
