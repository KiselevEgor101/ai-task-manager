const express = require("express");
const router = express.Router();

const pool = require("../db/db");

const VALID_STATUSES = ["new", "in_progress", "done"];

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

router.post("/", async (req, res) => {
    const { title, description } = req.body;

    if (!title || !title.trim()) {
        return res.status(400).json({ error: "Поле title обязательно" });
    }

    try {
        const result = await pool.query(
            "INSERT INTO tasks (title, description) VALUES ($1, $2) RETURNING *",
            [title.trim(), description?.trim() || ""]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put("/:id", async (req, res) => {
    const { status } = req.body;
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ error: "Некорректный id" });
    }

    if (!VALID_STATUSES.includes(status)) {
        return res.status(400).json({
            error: "Статус должен быть: new, in_progress или done",
        });
    }

    try {
        const result = await pool.query(
            "UPDATE tasks SET status = $1 WHERE id = $2 RETURNING *",
            [status, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Задача не найдена" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete("/:id", async (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ error: "Некорректный id" });
    }

    try {
        const result = await pool.query(
            "DELETE FROM tasks WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Задача не найдена" });
        }

        res.json({ message: "Задача удалена", task: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
