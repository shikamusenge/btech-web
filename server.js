const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve static files from 'pages' directory
app.use(express.static(path.join(__dirname, 'pages')));

// Routes for each page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'home.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'about.html'));
});

app.get('/contactus', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'contactus.html'));
});
app.get('/gallery', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'garelly.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});