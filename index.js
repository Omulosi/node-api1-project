// implement your API here
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const port = 5000;

const server = express(); // creates the server
server.use(bodyParser.json());
server.use(cors());

const db =  require('./data/db.js');

server.post('/api/users', (req, res) => {
  const { name, bio } = req.body;
  if (!(name) || !(bio)) {
    res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user." })
  }

  db.insert({name, bio})
    .then(user => {
      res.status(201).json({success: true, user});
    })
    .catch(error => {
      res
        .status(500)
        .json({ error: "There was an error while saving the user to the database" })
    })

});

server.get('/api/users', (req, res) => {
  db.find()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: "The users information could not be retrieved." })
    })
});

server.get('/api/users/:id', (req, res) => {
  db.findById(id)
    .then(user => {
      if (user) {
        res.status(200).json({success: true, user})
      } else {
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist." })
      }
    })
    .catch(err => {
      res.status(500).json({ error: "The user information could not be retrieved." })
    })
});

server.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;
  db.remove(id)
    .then(deleted => {
      if (deleted) {
        res.status(204).end();
      } else {
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist." })
      }
    })
    .catch(err => {
      res.status(500).json({ error: "The user could not be removed." })
    })
});

server.put('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const user = req.body;
  const { name, bio } = user;

  if (!(name) || !(bio)) {
    res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user." })
  }
  db.update(id, user)
    .then(updated => {
      if (updated) {
        res.status(200).json({success: true, user: updated})
      } else {
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist." })
      }
    })
    .catch(err => {
      res.status(500).json({ error: "The user information could not be modified." })
    })
});

// watch for connections on port 5000
server.listen(5000, () =>
  console.log('Server running on http://localhost:5000')
);
