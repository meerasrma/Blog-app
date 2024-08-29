// routes/posts.js
const express = require('express');
const db = require('../db');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', (req, res) => {
  db.all('SELECT * FROM posts', (err, rows) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(rows);
  });
});

router.post('/', authenticateToken, (req, res) => {
  const { title, content } = req.body;
  db.run(`INSERT INTO posts (title, content, author_id) VALUES (?, ?, ?)`,
    [title, content, req.user.id], function (err) {
      if (err) return res.status(500).json({ message: err.message });
      res.status(201).json({ id: this.lastID });
    });
});

// Add to routes/posts.js
router.get('/search', (req, res) => {
    const { query } = req.query;
    db.all(`SELECT * FROM posts WHERE title LIKE ? OR content LIKE ?`,
      [`%${query}%`, `%${query}%`], (err, rows) => {
        if (err) return res.status(500).json({ message: err.message });
        res.json(rows);
      });
  });

module.exports = router;
