const express = require('express');
const cors = require('cors'); // Add this line to import the cors middleware
const app = express();
const profile = require('./profile');

// Use CORS middleware without specifying allowed origins (allows all origins)
app.use(cors());

app.use('/profile', profile);

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});