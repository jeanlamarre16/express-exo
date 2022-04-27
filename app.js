const express = require('express');
const connection = require('./db_config');
const serverPort = process.env.PORT || 3000;
const app = express();

app.use(express.json())
app.listen(serverPort);

connection.connect((err) => {
    err ? console.error('Problème de connection à la base') : console.log('Connexion à la base REUSSIE');
});

app.get('/heros', (req, res) => {
    let sqlStatement = "SELECT * FROM heros";
    let {genre} = req.query;
    let filter = [];

    if(genre) {
        sqlStatement += " WHERE genre = ? "; 
        filter.push(genre);
    }
    
    connection.promise()
    .query(sqlStatement, [filter])
    .then (([results]) => {
        res.status(200).json(results);
    })
    .catch(error => {
        res.status(500).json(error);
    })
});

app.get('/heros/:id', (req, res) => {
    const {id} = req.params;
    const sqlStatement = 'SELECT * FROM heros WHERE id= ?';

    connection.promise().query(sqlStatement, [id])
    .then(([results]) => {
        res.status(200).send(results);
    })
    .catch(error => {
        res.status(400).json(error);
    });
});

app.post('/heros', (req, res) => {
    const {nom, genre, pouvoir, couleur} = req.body;
    const sqlStatement = 'INSERT INTO heros (nom, genre, pouvoir, couleur) VALUES (?, ?, ?, ?)';
    
    connection.promise().query(sqlStatement,  [nom, genre, pouvoir, couleur])
    .then(([results]) => {
        results.affectedRows > 0 ? res.status(200).json(results) : res.status(400).json('Echec enregistrement !');
    })
    .catch(err => {
        res.status(500).json(err)
    })
});

app.put('/heros/:id', (req, res) => {
    const {id} = req.params;
    const {nom, genre, pouvoir, couleur} = req.body;
    const sqlStatement = 'UPDATE heros SET nom = ?, genre = ?, pouvoir = ?, couleur = ? WHERE id= ?';
    
    connection.promise().query(sqlStatement, [nom, genre, pouvoir, couleur, id])
    .then(([results]) => {
        results.affectedRows > 0 ? res.status(200).json(results.affectedRows): res.status(400).json('modification échouée !');
    }) 
    .catch(err => {
        res.status(500).json(err);
    })
})

app.delete('/heros/:id', (req, res) => {
    const sqlStatement = "DELETE FROM heros WHERE id= ?";
    const id = req.params.id;
    
    connection.promise().query(sqlStatement, [id])
    .then(([results]) => {
        results.affectedRows > 0 ? res.status(200).json(results) : res.status(404).json("Suppression échouée");
    })
    .catch(error => {
        res.status(500).json(error);
    })
});