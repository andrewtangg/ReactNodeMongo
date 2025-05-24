//Use node src/server.js to run the server
// This is a simple Express server that listens on port 8000

import express from 'express';
const app = express();

app.use(express.json()); // If request sees a json request, process it in req.body.name

//when putting localhost:8000/hello in the browser as a get request, it will return "Hello from a GET endpoint!"
app.get('/hello', function(req, res) {
    res.send('Hello, ' +req.body.name+ ' from a GET endpoint!');
});

app.get('/hello/:name', function(req, res) {
    res.send('Hello, ' +req.params.name);
});

//when putting localhost:8000/hello in the browser as a post request, it will return "Hello from a POST endpoint!"
app.post('/hello', function(req, res) {
    res.send('Hello, ' +req.body.name+ ' from a POST endpoint!');
});

//listening on port 8000
app.listen(8000, function() {
    console.log('Server is listening on port 8000');
});