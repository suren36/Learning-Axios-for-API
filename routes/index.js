var express = require('express');
var router = express.Router();
const axios = require("axios");

/* GET home page. */
router.get('/', async function(req, res, next) {
  const idVal = req.query.id;
  try {
    const response = await axios.get("https://jsonplaceholder.typicode.com/todos/", { 
      params: { id: idVal } 
    });
    res.json(response.data);
  } catch (error) {
    console.log(error);
    res.status(500).send('Error fetching data');
  }
});

/* POST route */
router.post('/', async function(req, res) {
  try {
    const response = await axios.post("https://jsonplaceholder.typicode.com/todos", {
      title: "Learn Node.js",
      userId: 1,
      completed: false
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error creating todo');
  }
});
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { title, userId, completed } = req.body;

    // Simulate updating a user
    const updatedUser = {
      title,
     userId,
     completed
    };

    res.json({ message: 'User updated successfully', data: updatedUser });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params; // Extract the ID from the URL

    // Perform the deletion using Axios
    const response = await axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`);

    // Send a success response
    res.json({ message: `User ${id} deleted successfully`, data: response.data });
  } catch (error) {
    console.error('Error deleting user:', error);

    // Handle Axios errors
    if (error.response) {
      // The request was made and the server responded with a status code
      res.status(error.response.status).json({ error: error.response.data });
    } else if (error.request) {
      // The request was made but no response was received
      res.status(500).json({ error: 'No response received from the server' });
    } else {
      // Something happened in setting up the request
      res.status(500).json({ error: 'Error setting up the request' });
    }
  }
});
module.exports = router;