const express = require('express');
const app = express();
const port = 3000;


app.get('/static', (req, res) => {
    res.json({ header: "Hello", body: "Octagon NodeJS Test" });
});


app.get('/dynamic', (req, res) => {
    const { a, b, c } = req.query;

   
    if (!isNaN(a) && !isNaN(b) && !isNaN(c)) {
        const result = (Number(a) * Number(b) * Number(c)) / 3;
        res.json({ header: "Calculated", body: String(result) });
    } else {
        res.json({ header: "Error" });
    }
});


app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});
