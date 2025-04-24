const fs = require('fs');
const path = require('path');
const dbPath = path.join(__dirname, '../db.json');

// Middleware to add ID automatically
const addID = (req, res, next) => {
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
    const lastHero = db.heroes[db.heroes.length - 1];
    const newID = lastHero ? lastHero.id + 1 : 1;
    req.body.id = newID;
    next();
};

module.exports = { addID };
