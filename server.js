const express = require('express');
const app = express();
const mysql = require('mysql');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

// Import the `debug` module
const debug = require('debug');

// Create a debug log for the server module
const serverDebug = debug('server');

// Enable debugging by setting the DEBUG environment variable
// to the name of the debug log (in this case, "server")
process.env.DEBUG = 'server';
process.env.DEBUG = 'express:*';

// Print the debug log messages to the console
debug.log = console.info.bind(console);

// create a connection to the MySQL database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'admin',
  database: 'jwdb'
});

app.use(cors({ origin: 'http://localhost:8081' }));

// Middleware to parse request body
app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Use the express.static middleware to serve static files
// app.use(express.static(path.join(__dirname, 'dist')));

// Use the catch-all route to serve the index.html file
// for any other requests that don't match the defined routes
// app.use((req, res) => {
//   res.sendFile(path.join(__dirname, 'dist', 'index.html'));
// });

// create a route to fetch the list of textboxes from the database
app.get('/api/textboxes', (req, res) => {
  const query = 'SELECT * FROM textboxes';
  connection.query(query, (err, rows) => {
    if (err) {
      return res.status(500).send({ error: err });
    }

    // Map the rows to an array of textbox objects
    const textboxes = rows.map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      bible_text: row.bible_text,
      category: row.category,
    }));

    // Return the array of textboxes
    res.send({ data: textboxes });
  });
});


// create a route to add a new textbox to the database
app.post('/api/textboxes', (req, res) => {
  const query = 'INSERT INTO textboxes (title, description, bible_text, category) VALUES (?, ?, ?, ?)';
  const data = [req.body.title, req.body.description, req.body.bible_text, req.body.category];

  connection.query(query, data, (err, result) => {
    if (err) {
      return res.status(500).send({ error: err });
    }
    res.send({ data: result });
  });
});

// create a route to delete a textbox from the database
app.delete('/api/textboxes/:id', (req, res) => {
  const query = 'DELETE FROM textboxes WHERE id = ?';
  const data = [req.params.id];

  connection.query(query, data, (err, result) => {
    if (err) {
      return res.status(500).send({ error: err });
    }
    res.send({ data: result });
  });
});


// Upvote endpoint
app.put('/api/textboxes/:id/upvote', (req, res) => {
    // Increment upvotes count
    const { id } = req.params;
    connection.query(
      'UPDATE textboxes SET upvotes = upvotes + 1 WHERE id = ?',
      [id],
      (error, results) => {
        if (error) {
          res.status(500).json({ error });
        } else {
          res.json({ success: true });
        }
      }
    );
  });
  
  // Downvote endpoint
  app.put('/api/textboxes/:id/downvote', (req, res) => {
    // Decrement upvotes count
    const { id } = req.params;
    connection.query(
      'UPDATE textboxes SET upvotes = upvotes - 1 WHERE id = ?',
      [id],
      (error, results) => {
        if (error) {
          res.status(500).json({ error });
        } else {
          res.json({ success: true });
        }
      }
    );
  });

  app.get('/', (req, res) => {
    res.send('Welcome to the Textbox API');
  });
  
  app.use((req, res) => {
    res.status(404).send({ error: 'URL not found' });
  });  

   // Connect to the database and start the server
connection.connect((err) => {
  if (err) {
    console.error('An error occurred while connecting to the database');
    throw err;
  }

  const port = 8080;
  app.listen(port, () => {
    serverDebug(`Listening on port ${port}`);
    });
  });
  
module.exports = app;
  