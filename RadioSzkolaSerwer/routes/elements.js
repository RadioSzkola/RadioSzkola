const express = require('express');
const router = express.Router();
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

router.use(cors({
  origin: ['http://localhost:8080/', 'http://192.168.55.119:8080/', 'http://192.168.68.131:8080/', 'http://localhost:5173/'],
  methods: ['GET'],
  allowedHeaders: ['Content-Type']
}));


router.put('/:id', async (req, res) => {
    try {
      await client.connect();
      const database = client.db(process.env.MONGODBDATABASE);
      const collection = database.collection(process.env.MONGODBTRACKSCOLLECTION);
      const data = req.body;
      const itemId = new ObjectId(req.params.id);

      await collection.updateOne({ "_id": itemId }, { $set: data });

      res.json({ message: 'Element został zaktualizowany' });
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Błąd serwera' });
    } finally {
      await client.close();
    }
});

module.exports = router;
