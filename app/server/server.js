import express from 'express';
import cors from 'cors';
import { readDb, writeDb } from './database/dbfunctions.js';
const app = express();
const PORT = 5000;

// Enable CORS for all origins
app.use(cors());

app.get('/api/data', (_req, res) => {
    res.json({ message: 'Fetching the data!' });
    return readDb();
});

app.post('/api/update', (req, res) => {
    res.json({ message: 'Updating the data!' });
    try {
        writeDb(req.body);
        res.status(201).json({ message: 'Data saved successfully', data: req.body });
    } catch (err) {
        res.status(500).json({ message: `Failed to save data: err`, data: req.body });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});