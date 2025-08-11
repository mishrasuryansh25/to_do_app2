const express = require("express");
const pool = require("../db");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Verify token
function authenticate(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No token" });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: "Invalid token" });
        req.user = user;
        next();
    });
}

//(C-post)Create new task
router.post("/", authenticate, async (req, res) => {
    const { title, description } = req.body;
    try {
        const result = await pool.query(
            "INSERT INTO task.tasks (user_id, title, description) VALUES ($1, $2, $3) RETURNING *",
            [req.user.id, title, description] 
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//(R-get) Get tasks
router.get("/", authenticate, async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM task.tasks WHERE user_id = $1",
            [req.user.id]); // Use req.user.id
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//(U-put)Update task
router.put("/:id", authenticate, async (req, res) => {
    const { title, description, completed } = req.body;
    try {
        const result = await pool.query(
            "UPDATE task.tasks SET title = $1, description = $2, completed = $3 WHERE id = $4 AND user_id = $5 RETURNING *",
            [title, description, completed, req.params.id, req.user.id] // Fix req.params.id
        );
        if (result.rows.length === 0)
            return res.status(404).json({ error: "Task not found" });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//(D-delete)Delete task
router.delete("/:id", authenticate, async (req, res) => {
    try {
        const result = await pool.query(
            "DELETE FROM task.tasks WHERE id = $1 AND user_id = $2 RETURNING *",
            [req.params.id, req.user.id]
        );
        if (result.rows.length === 0)
            return res.status(404).json({ error: "Task not found" });
        res.json({ message: "Your task is deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;