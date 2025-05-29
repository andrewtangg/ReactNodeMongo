import express from 'express';
import { MongoClient, ServerApiVersion } from 'mongodb';
//After npm install --save-dev nodemon, you can run the server with nodemon by using the command:
//npx nodemon src/server.js
//because we defined npx nodemon src/server.js in the scripts for dev, we can just use npm run dev
// This is a simple Express server that listens on port 8000

const app = express();

app.use(express.json()); // If request sees a json request, process it in req.body.name

let db;

async function connrectToDb() {
    const uri = 'mongodb://127.0.0.1:27017';

    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });

    await client.connect();

    db = client.db('full-stack-react-db');
}

app.get('/api/articles/:name', async (req, res) => {
    const { name } = req.params;



    const article = await db.collection('articles').findOne({ name });

    res.json(article);

});


// This post request will return message with upvoted counts from in memory
app.post('/api/articles/:name/upvote', async (req, res) => {
    const { name } = req.params
    const updatedArticle = await db.collection('articles').findOneAndUpdate(
        { name }, 
        {$inc: {upvotes: 1 }
    });

    res.json(updatedArticle);
});

app.post('/api/articles/:name/comments', async (req, res) => {
    // Extracting the article name from the request parameters
    const { name } = req.params;
    //destructuring the request body to get postedBy and text
    const {postedBy, text} = req.body;
    //Grabs the postedBy and text from the request body
    const newComment = { postedBy, text};

    //Inserts the new comment into the comments array of the article with the specified name
    const updatedArticle = await db.collection('articles').findOneAndUpdate({ name }, 
            {$push: { comments: newComment}},
            {
                // This option ensures that the updated document is returned after the update operation
                returnDocument: 'after',
            }
    );

    res.json(updatedArticle);
});

async function start() {
        await connrectToDb();
        //listening on port 8000
    app.listen(8000, function() {
    console.log('Server is listening on port 8000');
});
    }

start();
