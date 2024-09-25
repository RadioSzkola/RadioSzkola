const express = require('express');
const { MongoClient } = require("mongodb");
const router = express.Router();
const axios = require("axios");
const cors = require('cors');
const cron = require('node-cron');
require('dotenv').config();

const mongoUrl = `mongodb+srv://${process.env.MONGODBUSERNAME}:${process.env.MONGODBPASSWORD}@radiowezel.7ws5evf.mongodb.net/radiowezel?retryWrites=true&w=majority`;
const client = new MongoClient(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });

let db, collection;

router.use('/addUser', cors({
  origin: ['http://localhost:8080/', 'http://192.168.55.119:8080/', 'http://192.168.68.131:8080/', 'http://localhost:5173/'],
  methods: ['POST'],
  allowedHeaders: ['Content-Type', 'login', 'password', 'id']
}));

client.connect()
    .then(() => {
        db = client.db(process.env.MONGODBDATABASE);
        console.log("Connected to MongoDB");
    })
    .catch(err => console.error('MongoDB connection error', err));

router.post('/addUser', async (req, res) => {
    try {
      const userIDsCollection = db.collection(process.env.MONGODBUSERIDSCOLLECTION);
      const usersCollection = db.collection(process.env.MONGODBUSERSCOLLECTION);
      const userId = req.body.id;

      const userIdDocument = await userIDsCollection.findOne({ userId: userId });
      if (!userIdDocument) {
        res.status(404).json({ message: 'Podany identyfikator nie istnieje w systemie.' });
        return;
      }

      console.log(userIdDocument.isUsed, typeof(userIdDocument.isUsed));

      if (userIdDocument.isUsed) {
        res.status(422).json({ message: 'Podany identyfikator jest już w użyciu.' });
        return;
      }

      const isUserExisting = await checkUser(req.body.login);
      if (isUserExisting === true) {
        res.status(409).json({ message: 'Użytkownik z tym loginem już istnieje' });
        return;
      }

      await usersCollection.insertOne({
        userId: userId,
        login: req.body.login,
        password: req.body.password,
      });

      await userIDsCollection.updateOne(
        { userId: userId },
        { $set: { isUsed: true } }
      );

      res.status(201).json({ message: 'Użytkownik został dodany' });
    } catch (error) {
      console.error('Error adding user', error);
      res.status(500).json({ error: 'Błąd podczas dodawania użytkownika' });
    }
});
    
    

router.post('/logUser', async (req, res) => {
    try{
      collection = db.collection(process.env.MONGODBUSERSCOLLECTION);
      const isUserExisting = await checkUser(req.body.login);
      if(isUserExisting === false){
        res.status(404).json({ message: 'Użytkownik nie istnieje' });
        return;
      } else {
        const mongodbUsers = await collection.find({login: req.body.login, password: req.body.password}).toArray();
        if(mongodbUsers.length > 0){
          res.status(200).json({ message: 'Użytkownik został zalogowany', userId: mongodbUsers[0].userId });
        } else {
          res.status(401).json({ message: 'Niepoprawne hasło' });
        }
      }
    } catch (error){
      console.error('Error adding user', error);
      res.status(500).json({ error: 'Error adding user' });
    } 
});

router.post('/IDChecker', async (req, res) => {
    try{
      collection = db.collection(process.env.MONGODBUSERIDSCOLLECTION);
      const mongodbUsers = await collection.find({userId: req.body.id}).toArray();
      if(mongodbUsers.length > 0 && mongodbUsers[0].isUsed === true){
        res.status(200).json({ message: true });
      } else {
        res.status(404).json({ message: false });
      }
    } catch (error){
      console.error('Error checking ID', error);
      res.status(500).json({ error: 'Error checking ID' });
    }

});

async function checkUser(login){
  collection = db.collection('users');
  const mongodbUsers = await collection.find({login: login}).toArray();
  return mongodbUsers.length > 0; 
};

async function deleteExpiredUserIds() {
  const userIDsCollection = db.collection(process.env.MONGODBUSERIDSCOLLECTION);
  const usersCollection = db.collection(process.env.MONGODBUSERSCOLLECTION);
  const currentDate = new Date();

  const userIds = await userIDsCollection.find({}).toArray();

  const expiredUserIds = userIds.filter(user => new Date(user.expiresAt) < currentDate);

  if (expiredUserIds.length > 0) {
    const idsToDelete = expiredUserIds.map(user => user.userId);
    
    const usersToDelete = await usersCollection.find({ userId: { $in: idsToDelete } }).toArray();
    if (usersToDelete.length > 0) {
      const userIdsToDelete = usersToDelete.map(user => user.userId);
      await usersCollection.deleteMany({ userId: { $in: userIdsToDelete } });
      console.log(`Usunięto ${getUserCountMessage(usersToDelete.length)}`);
    } else {
      console.log('Brak użytkowników z wygasłymi identyfikatorami.');
    }
    await userIDsCollection.deleteMany({ userId: { $in: idsToDelete } });
    console.log(`Usunięto ${getIdCountMessage(expiredUserIds.length)}`);
  } else {
    console.log('Brak wygasłych identyfikatorów.');
  }
}

function getIdCountMessage(count) {
  if (count === 1) return '1 identyfikator.';
  if (count > 1 && count < 5) return `${count} identyfikatory.`;
  return `${count} identyfikatorów.`;
}

function getUserCountMessage(count) {
  if (count === 1) return '1 użytkownik.';
  if (count > 1 && count < 5) return `${count} użytkowników.`;
  return `${count} użytkowników.`;
}

cron.schedule('0 12 * * *', async () => {
  console.log('Usuwanie wygasłych identyfikatorów...');
  await deleteExpiredUserIds();
});

module.exports = router;
