const path = require('path');
const fs = require('fs');

// Resolve sqlite3 correctly in both dev and packaged (exe) mode
let sqlite3;
try {
    // In packaged mode, sqlite3 is in backend/node_modules next to the .exe
    const exeDir = path.dirname(process.execPath);
    const packedSqlitePath = path.join(exeDir, 'backend', 'node_modules', 'sqlite3');
    if (fs.existsSync(packedSqlitePath)) {
        sqlite3 = require(packedSqlitePath).verbose();
    } else {
        // In dev mode, use local backend/node_modules
        sqlite3 = require(path.join(__dirname, 'node_modules', 'sqlite3')).verbose();
    }
} catch (e) {
    console.error('Failed to load sqlite3:', e.message);
    // Last resort fallback
    sqlite3 = require('sqlite3').verbose();
}


let dbPath;

try {
    const { app } = require('electron');
    const userDataPath = app ? app.getPath('userData') : (require('electron').app || require('electron').remote.app).getPath('userData');
    dbPath = path.join(userDataPath, 'database.sqlite');
} catch (e) {
    dbPath = path.resolve(__dirname, 'database.sqlite');
}

console.log('Database path:', dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        
        // Create Users table
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            username TEXT UNIQUE,
            password TEXT,
            role TEXT
        )`);

        // Create Complainants table
        db.run(`CREATE TABLE IF NOT EXISTS complainants (
            id TEXT PRIMARY KEY,
            name TEXT,
            address TEXT,
            contact TEXT,
            gender TEXT,
            age INTEGER
        )`);

        // Create Respondents table
        db.run(`CREATE TABLE IF NOT EXISTS respondents (
            id TEXT PRIMARY KEY,
            name TEXT,
            address TEXT,
            contact TEXT,
            gender TEXT,
            age INTEGER
        )`);

        // Create Cases table
        db.run(`CREATE TABLE IF NOT EXISTS cases (
            id TEXT PRIMARY KEY,
            docketNo TEXT,
            officialReceipt TEXT,
            complainantId TEXT,
            complainantName TEXT,
            complainantAddress TEXT,
            complainantAge TEXT,
            complainantContact TEXT,
            respondentId TEXT,
            respondentName TEXT,
            respondentAddress TEXT,
            respondentAge TEXT,
            respondentContact TEXT,
            complaintType TEXT,
            description TEXT,
            incidentLocation TEXT,
            dateFiled TEXT,
            timeFiled TEXT,
            dispositionDate TEXT,
            remarksComplainant TEXT,
            remarksRespondent TEXT,
            status TEXT,
            luponMember TEXT
        )`);

        // Create Hearings table
        db.run(`CREATE TABLE IF NOT EXISTS hearings (
            id TEXT PRIMARY KEY,
            caseId TEXT,
            hearingDate TEXT,
            hearingTime TEXT,
            luponMember TEXT,
            notes TEXT
        )`);

        // Create Settlements table
        db.run(`CREATE TABLE IF NOT EXISTS settlements (
            id TEXT PRIMARY KEY,
            caseId TEXT,
            agreementDetails TEXT,
            settlementDate TEXT,
            result TEXT
        )`);
        
        // Add default admin if users table is empty
        db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
            if (row && row.count === 0) {
                db.run('INSERT OR IGNORE INTO users (id, username, password, role) VALUES (?, ?, ?, ?)', 
                    ['1', 'admin', 'password', 'admin']);
            }
        });
    }
});

module.exports = db;
