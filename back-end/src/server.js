
//After npm install --save-dev nodemon, you can run the server with nodemon by using the command:
//npx nodemon src/server.js
//because we defined npx nodemon src/server.js in the scripts for dev, we can just use npm run dev
// This is a simple Express server that listens on port 8000
const articleInfo = [
    {name: 'learn-node', upvotes: 0},
    {name: 'learn-react', upvotes: 0},
    {name: 'mongodb', upvotes: 0}
]

import express from 'express';
const app = express();

app.use(express.json()); // If request sees a json request, process it in req.body.name

// This post request will return message with upvoted counts from in memory
app.post('/api/articles/:name/upvote', (req, res) => {
    const article = articleInfo.find(a => a.name === req.params.name);
    article.upvotes += 1;

    res.send('Success! The article ' + req.params.name + ' now has ' + article.upvotes + ' upvotes!');
});

//listening on port 8000
app.listen(8000, function() {
    console.log('Server is listening on port 8000');
});