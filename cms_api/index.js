
const express = require('express'); // Import the Express library
const { MongoClient } = require('mongodb'); // Import MongoClient
const cors = require('cors');


const app = express(); //Create an instance of an Express application

// Define the port number the server will run on
const PORT = 4000; //We choose a port for our server. Your React app is likely running on port 3000, so we'll use a different one, like 4000, for the backend to avoid a conflict.


// ---1) MIDDLEWARE ---
app.use(cors());
app.use(express.json()); //his parses incoming requests with JSON payloads. //It's what allows us to use `req.body`

// ---2) Database Connection ---

const MONGO_URI = "";
const client = new MongoClient(MONGO_URI);

let db; // Variable to hold the database connection

async function connectToDb() {
  try {
    await client.connect(); // 1. Connect to the cluster
    db = client.db('cms_project'); // 2. Get your specific database
    console.log('Successfully connected to MongoDB!');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1); // Exit if connection fails
  }
}


// ---3) API ROUTES ---


// Create a basic "route" for the homepage
app.get('/', (req, res) => {  //(req, res) => { ... } is a function that runs when someone visits that path. It always receives two objects:
  res.send('Welcome to the CMS API!');
});
/*
req (Request): An object containing all information about the incoming request (e.g., headers, URL parameters).
res (Response): An object with methods you use to send a response back to the client. Here, res.send(...) sends a simple text response.
*/


// GET a specific page by its slug
app.get('/api/pages/:slug', async (req, res) => {  //The colon : means that slug is a URL parameter. Whatever a user types there will be captured.

  try {
    const slug = req.params.slug; // 1. Get the slug from the URL

    // 2. Find the document in the 'pages' collection
    const page = await db.collection('pages').findOne({ slug: slug });

    if (page) {
      // 3a. If found, send the page data back
      res.status(200).json(page);
    } else {
      // 3b. If not found, send a 404 error
      res.status(404).json({ message: 'Page not found' });
    }
  } catch (err) {
    // 4. Handle any server errors
    res.status(500).json({ message: 'Server error', error: err });
  }
});



// POST a new document to the content_items collection
app.post('/api/content_items', async (req, res) => {
  try {
    
    const newItemData = req.body; //The data sent from the frontend will be in `req.body`

    newItemData.created_at = new Date(); //We can add server-side data, like a creation date

    const result = await db.collection('content_items').insertOne(newItemData); //Insert the new document into the collection
 
    const newDocument = { ...newItemData, _id: result.insertedId }; //Create the new document to send back, including the new _id
    
    res.status(201).json(newDocument); //Send a "201 Created" response with the newly created document

  }
  catch (err) {
    console.error("Failed to create content item:", err);
    res.status(500).json({ message: 'Failed to create content item' });
  }
});


// ---4) Start Server ---

// Start the server only AFTER the database is connected
connectToDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
//Finally, we wrap app.listen inside the .then() of our connectToDb function. This is critical: it ensures we do not start accepting requests until we have successfully connected to the database.

/* app.listen() is the command that actually starts the server. It "listens" on the specified port for any
 incoming network requests. The function inside it is a callback that runs once the server has successfully started.*/














 //node index.js