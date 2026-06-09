const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Protects your server by allowing your frontend to safely talk to it
app.use(cors());

// YOUR HIDDEN API KEY (Safe here because users can't see backend files)
const HIDDEN_API_KEY = 'cfbf2e26010e31d54aefb040ed817236';
const BASE_URL = 'https://api.themoviedb.org/3';

// The Proxy Gateway
app.get('/api/movies', async (req, res) => {
    try {
        // Grab whatever filters/search queries the frontend sent
        const { endpoint, ...otherParams } = req.query;
        const clientUrlParams = new URLSearchParams(otherParams).toString();
        
        // Stitches the hidden key behind the scenes
        const tmdbUrl = `${BASE_URL}/${endpoint}?api_key=${HIDDEN_API_KEY}&${clientUrlParams}`;
        
        const response = await fetch(tmdbUrl);
        const data = await response.json();
        
        // Send clean data back to frontend
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data from TMDb secure channel.' });
    }
});

app.listen(PORT, () => {
    console.log(`Secure proxy server running at http://localhost:${PORT}`);
});
