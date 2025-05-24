
//After npm install --save-dev nodemon, you can run the server with nodemon by using the command:
//npx nodemon src/server.js
//because we defined npx nodemon src/server.js in the scripts for dev, we can just use npm run dev
// This is a simple Express server that listens on port 8000
const articleInfo = [
    {name: 'learn-node', upvotes: 0, comments: []},
    {name: 'learn-react', upvotes: 0, comments: []},
    {name: 'mongodb', upvotes: 0, comments: []}
]

import express from 'express';
const app = express();

app.use(express.json()); // If request sees a json request, process it in req.body.name

// This post request will return message with upvoted counts from in memory
app.post('/api/articles/:name/upvote', (req, res) => {
    const article = articleInfo.find(a => a.name === req.params.name);
    article.upvotes += 1;

    res.json(article);
});

app.post('/api/articles/:name/comments', (req, res) => {
    // Extracting the article name from the request parameters
    const { name } = req.params;
    //destructuring the request body to get postedBy and text
    const {postedBy, text} = req.body;

    //find the article with the name
    const article = articleInfo.find(a => a.name === name);

    //pushes the requested comment to the article's comments array
    article.comments.push({postedBy,text});

    //used to send back json response
    res.json(article)
});
//listening on port 8000
app.listen(8000, function() {
    console.log('Server is listening on port 8000');
});