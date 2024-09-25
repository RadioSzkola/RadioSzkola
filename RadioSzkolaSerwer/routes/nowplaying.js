const express = require('express');
const axios = require('axios');
const router = express.Router();
const cors = require('cors');
require('dotenv').config();

router.use(cors({
    origin: ['http://localhost:8080', 'http://192.168.55.119:8080', 'http://192.168.68.131:8080', 'http://localhost:5173/'],
    methods: ['GET'],
    allowedHeaders: ['Content-Type']
}));

router.get('/', async (req, res) => {
    try {
        const userName = process.env.LFMUSERNAME;
        const apiKey = process.env.LFMAPIKEY;

        const lastfmResponse = await axios.get(`https://ws.audioscrobbler.com/2.0/?method=user.getRecentTracks&user=${userName}&api_key=${apiKey}&limit=1&nowplaying=true&format=json`);

        if (lastfmResponse.status === 200) {
            res.status(200).json(lastfmResponse.data);
        } else {
            res.status(500).json({ error: 'Last.fm API request failed' });
        }
    } catch (error) {
        console.error('Error in / route:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router;
