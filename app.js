const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const bot = require('./bot'); 

const app = express();
const port = 3000;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));


app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});
