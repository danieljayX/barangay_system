const express = require('express');
const cors = require('cors');
const db = require('./database.cjs');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

// --- API for USERS ---
app.get('/api/users', (req, res) => {
    db.all('SELECT * FROM users', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/users', (req, res) => {
    const users = req.body;
    // Simple overwrite for now based on localDb.ts save pattern
    db.run('DELETE FROM users', (err) => {
        if (err) return res.status(500).json({ error: err.message });
        const stmt = db.prepare('INSERT OR REPLACE INTO users (id, username, password, role) VALUES (?, ?, ?, ?)');
        users.forEach(u => stmt.run([u.id, u.username, u.password, u.role]));
        stmt.finalize();
        res.json({ message: 'Users updated successfully' });
    });
});


// --- API for COMPLAINANTS ---
app.get('/api/complainants', (req, res) => {
    db.all('SELECT * FROM complainants', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/complainants', (req, res) => {
    const data = req.body;
    db.run('DELETE FROM complainants', (err) => {
        if (err) return res.status(500).json({ error: err.message });
        const stmt = db.prepare('INSERT INTO complainants (id, name, address, contact, gender, age) VALUES (?, ?, ?, ?, ?, ?)');
        data.forEach(d => stmt.run([d.id, d.name, d.address, d.contact, d.gender, d.age]));
        stmt.finalize();
        res.json({ message: 'Complainants updated successfully' });
    });
});


// --- API for RESPONDENTS ---
app.get('/api/respondents', (req, res) => {
    db.all('SELECT * FROM respondents', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/respondents', (req, res) => {
    const data = req.body;
    db.run('DELETE FROM respondents', (err) => {
        if (err) return res.status(500).json({ error: err.message });
        const stmt = db.prepare('INSERT INTO respondents (id, name, address, contact, gender, age) VALUES (?, ?, ?, ?, ?, ?)');
        data.forEach(d => stmt.run([d.id, d.name, d.address, d.contact, d.gender, d.age]));
        stmt.finalize();
        res.json({ message: 'Respondents updated successfully' });
    });
});


// --- API for CASES ---
app.get('/api/cases', (req, res) => {
    db.all('SELECT * FROM cases', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/cases', (req, res) => {
    const data = req.body;
    db.run('DELETE FROM cases', (err) => {
        if (err) return res.status(500).json({ error: err.message });
        const stmt = db.prepare(`
            INSERT INTO cases (id, docketNo, officialReceipt, complainantId, complainantName, complainantAddress, complainantAge, complainantContact, respondentId, respondentName, respondentAddress, respondentAge, respondentContact, complaintType, description, incidentLocation, dateFiled, timeFiled, dispositionDate, remarksComplainant, remarksRespondent, status, luponMember) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        data.forEach(d => stmt.run([d.id, d.docketNo, d.officialReceipt, d.complainantId, d.complainantName, d.complainantAddress, d.complainantAge, d.complainantContact, d.respondentId, d.respondentName, d.respondentAddress, d.respondentAge, d.respondentContact, d.complaintType, d.description, d.incidentLocation, d.dateFiled, d.timeFiled, d.dispositionDate, d.remarksComplainant, d.remarksRespondent, d.status, d.luponMember]));
        stmt.finalize();
        res.json({ message: 'Cases updated successfully' });
    });
});


// --- API for HEARINGS ---
app.get('/api/hearings', (req, res) => {
    db.all('SELECT * FROM hearings', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/hearings', (req, res) => {
    const data = req.body;
    db.run('DELETE FROM hearings', (err) => {
        if (err) return res.status(500).json({ error: err.message });
        const stmt = db.prepare('INSERT INTO hearings (id, caseId, hearingDate, hearingTime, luponMember, notes) VALUES (?, ?, ?, ?, ?, ?)');
        data.forEach(d => stmt.run([d.id, d.caseId, d.hearingDate, d.hearingTime, d.luponMember, d.notes]));
        stmt.finalize();
        res.json({ message: 'Hearings updated successfully' });
    });
});


// --- API for SETTLEMENTS ---
app.get('/api/settlements', (req, res) => {
    db.all('SELECT * FROM settlements', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/settlements', (req, res) => {
    const data = req.body;
    db.run('DELETE FROM settlements', (err) => {
        if (err) return res.status(500).json({ error: err.message });
        const stmt = db.prepare('INSERT INTO settlements (id, caseId, agreementDetails, settlementDate, result) VALUES (?, ?, ?, ?, ?)');
        data.forEach(d => stmt.run([d.id, d.caseId, d.agreementDetails, d.settlementDate, d.result]));
        stmt.finalize();
        res.json({ message: 'Settlements updated successfully' });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
