// profile.js
const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const { exec } = require('child_process');
const FGLAlgo = path.join(__dirname, "FGLAlgo.py");
const assetsFolder = path.join(__dirname, "assets");
const router = express.Router();

router.use(fileUpload());

// File upload route
router.post('/', async (req, res) => {
    if (req.files == null){
        console.error('Error processing uploaded file:');
        res.status(500).json({ error: 'Internal server error' });
        return;
    }

    const { chatdb } = req.files;
    const filePath = path.join(assetsFolder, chatdb.name);

    try {
        // Move the uploaded file to the assets folder
        chatdb.mv(filePath);

        res.json({ message: 'File uploaded successfully' });
    } catch (e) {
        console.error('Error processing uploaded file:', e);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Run Python script route with user input as a parameter
router.post('/run-python', (req, res) => {
    const userInput = req.query.input;  // Get user input from query parameter

    // Execute the Python script with user input as a parameter
    exec(`python3 ${FGLAlgo} \"${userInput}\"`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing Python script: ${error}`);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            const pythonOutput = stdout.trim();  // Assuming the output is a string
            console.log('Python script output:', pythonOutput);
            res.json({ message: 'Python script executed successfully', output: pythonOutput });
        }
    });
});

module.exports = router;