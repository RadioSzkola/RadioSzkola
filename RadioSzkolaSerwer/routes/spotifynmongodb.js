const express = require("express");
const { MongoClient } = require("mongodb");
const fs = require("fs");
const router = express.Router();
const axios = require("axios");
const cors = require('cors');
require('dotenv').config();

const mongoUrl = `mongodb+srv://${process.env.MONGODBUSERNAME}:${process.env.MONGODBPASSWORD}@radiowezel.7ws5evf.mongodb.net/radiowezel?retryWrites=true&w=majority`;
const client = new MongoClient(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });

let db, collection;

let tracks = [];
let nextcounter = 0;
let nextuserSkipCounter = [];
let previoususerSkipCounter = [];
let previouscounter = 0;

router.use('/fetchnupload', cors({
    origin: ['http://localhost:8080/', 'http://192.168.55.119:8080/', 'http://192.168.68.131:8080/', 'http://localhost:5173/'],
    methods: ['GET'],
    allowedHeaders: ['Content-Type']
}));

router.use('/nextsong', cors({
    origin: ['http://localhost:8080/', 'http://192.168.55.119:8080/', 'http://192.168.68.131:8080/', 'http://localhost:5173/'],
    methods: ['POST'],
    allowedHeaders: ['Content-Type', 'id']
}));

client.connect()
    .then(() => {
        db = client.db(process.env.MONGODBDATABASE);
        collection = db.collection(process.env.MONGODBTRACKSCOLLECTION);
        console.log("Connected to MongoDB");
    })
    .catch(err => console.error('MongoDB connection error', err));

router.get('/fetchnupload', async (req, res) => {
    try {
        const accessToken = await getAccessToken();
        const axios_res = await axios.get('https://api.spotify.com/v1/playlists/132h2BMTZWy0VH4gqLWeVD/tracks', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        const dataTracks = axios_res.data.items;
        const downloadedTracks = [];
        
        dataTracks.forEach(element => {
            let trc = element.track.uri;
            let duration_in_mins = Math.round((element.track.duration_ms * 0.001) / 60.0 * 100)/100
            const downloadedTrack = {
                "song_id": trc.replace("spotify:track:", ""),
                "name": element.track.name,
                "track_link": element.track.external_urls.spotify,
                "artist": element.track.artists[0].name,
                "artist_link": element.track.artists[0].external_urls.spotify,
                "album": element.track.album.name,
                "album_link": element.track.album.external_urls.spotify,
                "popularity": element.track.popularity,
                "duration_in_mins": duration_in_mins,
                "album_img_link": element.track.album.images[0].url,
                "likes": 0,
                "dislikes": 0
            };

            downloadedTracks.push(downloadedTrack);
        });


        const mongodbTracks = await collection.find({}).toArray();

        downloadedTracks.forEach(track => {
            if (!mongodbTracks.some(mongoTrack => mongoTrack.song_id === track.song_id)) {
                collection.insertOne(track);
            }
        });

        mongodbTracks.forEach(mongoTrack => {
            if (!downloadedTracks.some(track => track.song_id === mongoTrack.song_id)) {
                collection.deleteOne({ song_id: mongoTrack.song_id });
            }
        });

        if (tracks.length === 0) {
            tracks = downloadedTracks;
        };

        mongodbTracks.forEach(mongoTrack => {
            if (!tracks.some(track => track.song_id === mongoTrack.song_id)) {
                tracks.push(mongoTrack);
            }
        });

        tracks = tracks.filter(track => mongodbTracks.some(mongoTrack => mongoTrack.song_id === track.song_id));

        fs.writeFile('valid_data.json', JSON.stringify(tracks), (err) => {
            if (err) {
                console.error('Błąd podczas zapisywania pliku:', err);
            } else {
                console.log('Plik "valid_data.json" został zapisany');
            }
        });
        res.status(200).json(tracks);
    } catch (error) {
        console.error('Error fetching tracks', error);
        res.status(500).json({ error: 'Error fetching tracks' });
    }
});

async function getAccessToken() {
    const refresh_token = process.env.REFRESH_TOKEN;

    const authOptions = {
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + (Buffer.from(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64'))
        },
        data: new URLSearchParams({
            'grant_type': 'refresh_token',
            'refresh_token': refresh_token
        })
    };

    try {
        const response = await axios(authOptions);
        if (response.status === 200) {
            return response.data.access_token;
        } else {
            throw new Error(`Error fetching access token: ${response.status} - ${JSON.stringify(response.data)}`);
        }
    } catch (error) {
        console.error('Request error:', error);
        throw error;
    }
}

router.post('/nextsong', async (req, res) => {
    try{
        const loginId = req.body.id;
        console.log(loginId);
        if(loginId === undefined || loginId === null || loginId === "" || typeof(loginId) !== 'string') {
            res.status(400).json({ message: 'Something went wrong' });
            return;
        } 

        if(nextcounter === 20){
            const accessToken = await getAccessToken();

            await axios.post('https://api.spotify.com/v1/me/player/next', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            nextcounter = 0;
            let userSkipCounterLength = nextuserSkipCounter.length;
            nextuserSkipCounter.splice(0, userSkipCounterLength);
        } else if (loginId && nextuserSkipCounter.includes(loginId)) {
            res.status(429).json({ error: 'Too many requests' });
            return;
        } else if (loginId && !nextuserSkipCounter.includes(loginId)) {
            console.log(req.body);
            console.log(nextuserSkipCounter.includes(loginId));
            nextuserSkipCounter.push(loginId);
            userCounter = 20 - nextuserSkipCounter.length;
            res.status(200).json({ message: 'Success', userCount: userCounter });
            return;
        }
        res.status(200);
    } catch(error) {
        console.error('Error skipping song', error);
        res.status(500).json({ error: 'Error skipping song' });
    }
});

router.post('/previoussong', async (req, res) => {
    try{
        const loginId = req.body.id;
        if(loginId === undefined || loginId === null || loginId === "" || typeof(loginId) !== 'string') {
            res.status(400).json({ message: 'Something went wrong' });
            return;
        } 

        if(previouscounter === 20){
            const accessToken = await getAccessToken();

            await axios.post('https://api.spotify.com/v1/me/player/previous', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            previouscounter = 0;
            let userSkipCounterLength = previoususerSkipCounter.length;
            previoususerSkipCounter.splice(0, userSkipCounterLength);
        } else if (loginId && previoususerSkipCounter.includes(loginId)) {
            res.status(429).json({ error: 'Too many requests' });
            return;
        } else if (loginId && !previoususerSkipCounter.includes(loginId)) {
            previoususerSkipCounter.push(loginId);
            userCounter = 20 - previoususerSkipCounter.length;
            res.status(200).json({ message: 'Success', userCount: userCounter });
            return;
        }
        res.status(200);
    } catch(error) {
        console.error('Error skipping song', error);
        res.status(500).json({ error: 'Error skipping song' });
    }
});

module.exports = router