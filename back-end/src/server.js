//After npm install --save-dev nodemon, you can run the server with nodemon by using the command:
//npx nodemon src/server.js
//because we defined npx nodemon src/server.js in the scripts for dev, we can just use npm run dev
// This is a simple Express server that listens on port 8000

//1. npm install express
//2. npm install --save-dev nodemon
//3. add npx nodemon src/server.js in scripts jsonks
//3. npm install firebase-admin
//4. create a <root>/data/db directory when installing mongodb
//5. install mongosh as a separate installation from mongodb to allow for CRUD operations

import express from 'express';
import { MongoClient, ServerApiVersion } from 'mongodb';
import admin from 'firebase-admin'; //used for protection on API endpoints
import fs from 'fs';
import path from 'path';

import {fileURLToPath} from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const credentials = JSON.parse(
    fs.readFileSync('./credentials.json')
);

admin.initializeApp({
  credential: admin.credential.cert(credentials)
});



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

//Once dist folder is under back-end need to have these two
//When running npm run dev in backend then the front end code will be running
//thru the back-end because of dist folder after npm run build
app.use(express.static(path.join(__dirname, '../dist')))

app.get(/^(?!\/api).+/, (req,res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.get('/api/articles/:name', async (req, res) => {
    const { name } = req.params;
    const article = await db.collection('articles').findOne({ name });
    res.json(article);
});

//want the app to use the firebase admin to verify the user for any post requests but not for get requests
app.use(async function(req,res,next){
    const {authtoken} = req.headers;
    if (authtoken){
        const user = await admin.auth().verifyIdToken(authtoken);
        req.user = user;
        next();
    }else {
        res.sendStatus(400);
    }
});


// This post request will return message with upvoted counts from in memory
app.post('/api/articles/:name/upvote', async (req, res) => {
    const { name } = req.params
    const { uid } = req.user;

    const article = await db.collection('articles').findOne({ name });

    const upvoteIds = article.upvoteIds || [];
    
    const canUpvote = uid && !upvoteIds.includes(uid);


    if (canUpvote){
    const updatedArticle = await db.collection('articles').findOneAndUpdate({ name }, { 
        $inc: { upvotes: 1 },
        $push: { upvoteIds: uid},
    }, {
        returnDocument: 'after', // This option ensures that the updated document is returned after the update operation
    });


    res.json(updatedArticle);
    } else {
        res.sendStatus(403); // Forbidden
    }
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


const PORT = process.env.PORT || 8000;


async function start() {
        await connrectToDb();
        //listening on port 8000
    app.listen(PORT, function() {
    console.log('Server is listening on port '+ PORT);
});
    }

start();
