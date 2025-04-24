
const express = require('express');
const fs = require('fs');
const path = require('path');



const { addID } = require('./middlewares/addID.middleware');
const { auth } = require('./middlewares/auth.middleware');
const { logger } = require('./middlewares/logger.middleware');


const app = express();


app.use(express.json());


app.use(logger);


const dbPath = path.join(__dirname, 'db.json');

const readDatabase = () => {
    const data = fs.readFileSync(dbPath, 'utf-8');
    return JSON.parse(data);
};


const writeDatabase = (data) => {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
};



app.post('/add/hero', addID, (req, res) => {
    try {
        const db = readDatabase();
        const newHero = req.body;
        db.heroes.push(newHero);
        writeDatabase(db);
        res.status(201).json(db.heroes);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong while adding hero.' });
    }
});

app.get('/heroes', (req, res) => {
    try {
        const db = readDatabase();
        res.status(200).json(db.heroes);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong while fetching heroes.' });
    }
});


app.patch('/update/villain/:hero_id', auth, (req, res) => {
    try {
        const { hero_id } = req.params;
        const villainData = req.body;

        const db = readDatabase();
        const hero = db.heroes.find(h => h.id === Number(hero_id));

        if (!hero) {
            return res.status(404).json({ message: 'Hero not found' });
        }

        hero.villains.push(villainData);
        writeDatabase(db);

        res.status(200).json(hero);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong while updating villain.' });
    }
});


app.delete('/delete/hero/:hero_id', auth, (req, res) => {
    try {
        const { hero_id } = req.params;

        const db = readDatabase();
        const heroIndex = db.heroes.findIndex(h => h.id === Number(hero_id));

        if (heroIndex === -1) {
            return res.status(404).json({ message: 'Hero not found' });
        }

        db.heroes.splice(heroIndex, 1);
        writeDatabase(db);

        res.status(200).json(db.heroes);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong while deleting hero.' });
    }
});


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
