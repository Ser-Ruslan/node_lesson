const express = require("express");
const os = require("os");
const path = require("path");
const greeting = require("./greeting");

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));  
app.use(express.static(path.join(__dirname, 'public')));  

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get("/api/greeting", (req, res) => {
    const userName = os.userInfo().username;  
    res.json({
        date: greeting.getCurrentDate(),
        greeting: greeting.getGreetingMessage(userName),
        userName: userName
    });
});

app.post("/", (req, res) => {
    const userName = req.body.name;  
    res.json({
        date: greeting.getCurrentDate(),
        greeting: greeting.getGreetingMessage(userName),
        userName: userName
    });
});

app.listen(port, () => {
    console.log(`Сервер начал прослушивание запросов на порту ${port}`);
});
