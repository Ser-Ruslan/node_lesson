const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); 


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: '', 
    database: 'ChatBotTests'
});


db.connect(err => {
    if (err) {
        console.error('Ошибка подключения к базе данных:', err);
    } else {
        console.log('Соединение с базой данных успешно установлено');
    }
});


app.use(express.static(path.join(__dirname, 'public')));


app.get('/getAllItems', (req, res) => {
    db.query('SELECT * FROM Items', (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Ошибка при получении данных' });
        } else {
            res.json(results);
        }
    });
});


app.post('/addItem', (req, res) => {
    const { name, desc } = req.body;
    if (!name || !desc) {
        return res.json(null);
    }

    const sql = 'INSERT INTO Items (name, `desc`) VALUES (?, ?)';
    db.query(sql, [name, desc], (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Ошибка при добавлении данных' });
        } else {
            res.json({ id: result.insertId, name: name, desc: desc });
        }
    });
});

app.post('/deleteItem', (req, res) => {
    const { id } = req.body;
    if (!id || isNaN(id)) {
        return res.json(null);
    }

    const sql = 'DELETE FROM Items WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Ошибка при удалении данных' });
        } else if (result.affectedRows === 0) {
            res.json({});
        } else {
            res.json({ id: id });
        }
    });
});


app.post('/updateItem', (req, res) => {
    const { id, name, desc } = req.body;
    if (!id || isNaN(id) || !name || !desc) {
        return res.json(null);
    }

    const sql = 'UPDATE Items SET name = ?, `desc` = ? WHERE id = ?';
    db.query(sql, [name, desc, id], (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Ошибка при обновлении данных' });
        } else if (result.affectedRows === 0) {
            res.json({});
        } else {
            res.json({ id: id, name: name, desc: desc });
        }
    });
});


app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});
