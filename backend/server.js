const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors'); 

const app = express();

// Enable CORS for http://127.0.0.1:5500
app.use(cors({
    origin: 'http://127.0.0.1:5500',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());
app.use(cookieParser());

// Import API's
const authRoutes = require('./api/login-logout'); 
const taskRoutes = require('./api/task'); 

// Use rAPI's
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);

// Serve index.html
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Starting server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});