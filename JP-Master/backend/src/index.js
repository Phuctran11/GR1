require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

app.get('/ping', (req, res) => res.json({ ok: true }));

app.get('/users', async (req, res) => {
    const { rows } = await pool.query('SELECT * FROM users LIMIT 100');
    res.json(rows);
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Backend listening on ${port}`));