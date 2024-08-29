// routes/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../db');

const router = express.Router();
const SECRET_KEY = 'your_secret_key';

router.post('/register', (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  db.run(`INSERT INTO users (username, password) VALUES (?, ?)`,
    [username, hashedPassword], function (err) {
      if (err) return res.status(500).json({ message: err.message });
      const token = jwt.sign({ id: this.lastID }, SECRET_KEY);
      res.json({ token });
    });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, user) => {
    if (err || !user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id }, SECRET_KEY);
    res.json({ token });
  });
});

module.exports = router;
