const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// ספרייה סטטית
app.use(express.static(path.join(__dirname, 'public')));

// התחברות למסד הנתונים SQLite
const db = new sqlite3.Database('contacts.db', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the contacts.db database.');

    db.run(`CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        timestamp TEXT NOT NULL
    )`);
});

// body-parser
app.use(bodyParser.json());

// GET ל-index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// POST לשמירת נתונים
app.post('/submit_form', (req, res) => {
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) {
        return res.status(400).json({ success: false, message: 'כל השדות נדרשים.' });
    }
    const timestamp = new Date().toISOString();
    db.run(
        `INSERT INTO contacts (name, email, phone, timestamp) VALUES (?, ?, ?, ?)`,
        [name, email, phone, timestamp],
        function (err) {
            if (err) {
                console.error(err.message);
                return res.status(500).json({ success: false, message: 'אירעה שגיאה בשרת.' });
            }
            console.log(`A row has been inserted with rowid ${this.lastID}`);
            res.status(200).json({ success: true, message: 'תודה! הפרטים נשמרו בהצלחה.' });
        }
    );
});

// הפעלת השרת
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
