const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Witaj na stronie głównej');
});

router.get('/about', (req, res) => {
  res.send('Informacje o aplikacji');
});

module.exports = router;
