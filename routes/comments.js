// routes/comments.js
const express = require('express');
const db = require('../db');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/:postId', authenticateToken, (req, res) => {
  const { content } = req.body;
  const { postId } = req.params;
  db.run(`INSERT INTO comments (content, post_id, author_id) VALUES (?, ?, ?)`,
    [content, postId, req.user.id], function (err) {
      if (err) return res.status(500).json({ message: err.message });
      res.status(201).json({ id: this.lastID });
    });
});

// Additional routes for fetching comments, moderation, etc.

module.exports = router;
