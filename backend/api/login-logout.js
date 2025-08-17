const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");
require("dotenv").config();
//imports zod schema from validation file
const { registerSchema, loginSchema} = require("./validation");


const router = express.Router();

// Register new user
router.post("/register", async (req, res) => {
    const { username, password } = req.body;
    try {
        const parsed = registerSchema.parse(req.body); //zod validation in registering a new user 
        const hashedpass = await bcrypt.hash(parsed.password, 10);
        await pool.query(
            "INSERT INTO task.users (username, password) VALUES ($1, $2)", 
            [parsed.username, hashedpass]
        );
        res.json({ message: "Welcome! Registered successfully" });
    } catch (err) {
        if(err.name ==="ZodError"){
            return res.status(404).json({errors: err.errors.map(e=>e.message) }); // thorws error 
        }
        res.status(500).json({ error: err.message });
    }
});

// Login user
router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        const parsed = loginSchema.parse(req.body); //zod validation for login user 
        const userResult = await pool.query(
            "SELECT * FROM task.users WHERE username = $1", 
            [parsed.username]
        );
        if (userResult.rows.length === 0) {
            return res.status(400).json({ error: "User not found" });
        }

        const user = userResult.rows[0];
        const isMatch = await bcrypt.compare(parsed.password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Password is Invalid" }); //password validation

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token });
    } catch (err) {
        if(err.name === "ZodError"){
            return res.status(400).json({errors: err.errors.map(e=> e.message)}); //throws error 
        }
        res.status(500).json({ error: err.message });
    }
});

// Logout user
router.post("/logout", (req, res) => {
    res.json({ message: "User logged out (token deleted on client side)" });
});

module.exports = router;