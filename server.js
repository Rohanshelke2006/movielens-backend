const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Protects your server by allowing your frontend to safely talk to it
app.use(cors());

// The server will look at the Render Environment Variables to grab this key automatically!
const HIDDEN_API_KEY = process.env.TMDB_API_KEY;
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
