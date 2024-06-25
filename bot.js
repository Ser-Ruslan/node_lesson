const TelegramBot = require('node-telegram-bot-api');


const token = '7363437148:AAHecv5tqcoTEvhMuFS1swyj1BfatGmHpGs';


const bot = new TelegramBot(token, { polling: true });

const fs = require('fs');

const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ChatBotTests'
});

db.connect((err) => {
    if (err) {
        console.error('Ошибка подключения к базе данных:', err);
        return;
    }
    console.log('Подключено к базе данных');
});

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Привет, октагон!');
});

let userState = {};

bot.setMyCommands([
    { command: '/start', description: 'Приветствие от бота' },
    { command: '/help', description: 'Список команд' },
    { command: '/site', description: 'Ссылка на сайт Октагона' },
    { command: '/creator', description: 'Автор бота' },
    { command: '/randomitem', description: 'Получить случайную строку из бд' },
    { command: '/deleteitem', description: 'Удалить строку по ID' },
    { command: '/getitembyid', description: 'Получить строку по ID' }
]);

bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    const helpMessage = `
Список команд:
- /start: Приветствие от бота
- /help: Показать этот список команд
- /site: Получить ссылку на сайт Октагона
- /creator: Узнать автора бота
- /randomitem: Получить случайную строку из бд
- /deleteitem: Удалить строку по ID
- /getitembyid: Получить строку по ID
`;
    bot.sendMessage(chatId, helpMessage);
});


bot.onText(/\/site/, (msg) => {
    const chatId = msg.chat.id;
    const siteUrl = 'https://students.forus.ru'; 
    bot.sendMessage(chatId, `Перейдите на сайт Октагона по этой ссылке: ${siteUrl}`);
});


bot.onText(/\/creator/, (msg) => {
    const chatId = msg.chat.id;

    
    fs.readFile('package.json', (err, data) => {
        if (err) {
            bot.sendMessage(chatId, 'Произошла ошибка при чтении данных.');
            return console.error(err);
        }

        const packageJson = JSON.parse(data);
        const authorName = packageJson.author.name;
        const authorLastName = packageJson.author['last name'];
        const authorFullName = `${authorName} ${authorLastName}`;
        
        bot.sendMessage(chatId, `Автор бота: ${authorFullName}`);
    });
});

bot.onText(/\/randomitem/, (msg) => {
    const chatId = msg.chat.id;
    const query = 'SELECT * FROM Items ORDER BY RAND() LIMIT 1';

    db.query(query, (err, results) => {
        if (err) {
            bot.sendMessage(chatId, 'Произошла ошибка при выполнении запроса.');
            return console.error(err);
        }

        if (results.length > 0) {
            const item = results[0];
            const response = `(${item.id}) - ${item.name}: ${item.desc}`;
            bot.sendMessage(chatId, response);
        } else {
            bot.sendMessage(chatId, 'Нет доступных предметов.');
        }
    });
});

bot.onText(/\/deleteitem/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Пожалуйста, введите ID строки, который вы хотите удалить:');
    userState[chatId] = 'awaiting_delete_id';
});

bot.onText(/\/getitembyid/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Пожалуйста, введите ID строки, который вы хотите получить:');
    userState[chatId] = 'awaiting_get_id';
});

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (userState[chatId] === 'awaiting_delete_id') {
        const itemId = parseInt(text, 10);
        if (isNaN(itemId)) {
            bot.sendMessage(chatId, 'Пожалуйста, введите правильный ID.');
        } else {
            const query = 'DELETE FROM Items WHERE id = ?';
            db.query(query, [itemId], (err, results) => {
                if (err) {
                    bot.sendMessage(chatId, 'Произошла ошибка при выполнении запроса.');
                    return console.error(err);
                }

                if (results.affectedRows > 0) {
                    bot.sendMessage(chatId, 'Удачно');
                } else {
                    bot.sendMessage(chatId, 'Ошибка: предмет не найден.');
                }
            });
        }
        delete userState[chatId];
    } else if (userState[chatId] === 'awaiting_get_id') {
        const itemId = parseInt(text, 10);
        if (isNaN(itemId)) {
            bot.sendMessage(chatId, 'Пожалуйста, введите правильный ID.');
        } else {
            const query = 'SELECT * FROM Items WHERE id = ?';
            db.query(query, [itemId], (err, results) => {
                if (err) {
                    bot.sendMessage(chatId, 'Произошла ошибка при выполнении запроса.');
                    return console.error(err);
                }

                if (results.length > 0) {
                    const item = results[0];
                    const response = `(${item.id}) - ${item.name}: ${item.desc}`;
                    bot.sendMessage(chatId, response);
                } else {
                    bot.sendMessage(chatId, 'Предмет не найден.');
                }
            });
        }
        delete userState[chatId];
    }
});

module.exports = bot;
