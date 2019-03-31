const sqlite = require('sqlite3');
const pathToDB= './Resources/database.db';

const db = new sqlite.Database(pathToDB);

// db.close();

module.exports = db;