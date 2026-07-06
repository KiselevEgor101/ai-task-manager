const express = require("express");
const router = express.Router();

const pool = require("../db/db");

// GET — получить все задачи
router.get("/", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM tasks ORDER BY id DESC"
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;