const express = require('express');
const path = require('path');
const bodyParser = require('body-parser'); // To parse form data
const app = express();

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the "assets" folder
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Serve the CSS file from the root folder
app.use(express.static(__dirname));

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'netflix.html'));
});
app.post('/signup', (req, res) => {
    // Optionally handle email data from req.body.email
    res.redirect('/welcome');
});

// Handle form submission and redirect to /welcome
app.post('/signup', (req, res) => {
    // Optionally handle email data from req.body.email
    res.redirect('/welcome');
});

// Serve the welcome page
app.get('/welcome', (req, res) => {
    res.sendFile(path.join(__dirname, 'welcome.html'));
});
// Serve the welcome2 page
app.get('/welcome2', (req, res) => {
    res.sendFile(path.join(__dirname, 'welcome2.html'));
});

// Handle form submission and redirect to /welcome2 with email
app.post('/signup', (req, res) => {
    const email = req.body.email;
    res.redirect(`/welcome2?email=${encodeURIComponent(email)}`);
});

// Serve the welcome2 page
app.get('/welcome2', (req, res) => {
    res.sendFile(path.join(__dirname, 'welcome2.html'));
});

// Serve the welcome3 page
app.get('/welcome3', (req, res) => {
    res.sendFile(path.join(__dirname, 'welcome3.html'));
});

// Serve the plan page
app.get('/plans', (req, res) => {
    res.sendFile(path.join(__dirname, 'plan.html'));
});
// Serve the payment page
app.get('/payment', (req, res) => {
    res.sendFile(path.join(__dirname, 'payment.html'));
});
app.get('/faq', (req, res) => {
    res.sendFile(path.join(__dirname, 'faq.html'));
});
app.get('/cookie', (req, res) => {
    res.sendFile(path.join(__dirname, 'cookie.html'));
});
app.get('/help-center', (req, res) => {
    res.sendFile(path.join(__dirname, 'helpcenter.html'));
});
app.get('/corporate-information', (req, res) => {
    res.sendFile(path.join(__dirname, 'corporateinfo.html'));
});
app.get('/terms-use', (req, res) => {
    res.sendFile(path.join(__dirname, 'termsuse.html'));
});
app.get('/privacy', (req, res) => {
    res.sendFile(path.join(__dirname, 'privacy.html'));
});
app.get('/email', (req, res) => {
    res.sendFile(path.join(__dirname, 'id.html'));
});
app.get('/sign-in', (req, res) => {
    res.sendFile(path.join(__dirname, 'signin.html'));
});
app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'home.html'));
});
app.get('/list', (req, res) => {
    res.sendFile(path.join(__dirname, 'home.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
