const TelegramBot = require('node-telegram-bot-api');


const token = '7363437148:AAHecv5tqcoTEvhMuFS1swyj1BfatGmHpGs';


const bot = new TelegramBot(token, { polling: true });

const fs = require('fs');


bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Привет, октагон!');
});

bot.setMyCommands([
    { command: '/start', description: 'Приветствие от бота' },
    { command: '/help', description: 'Список команд' },
    { command: '/site', description: 'Ссылка на сайт Октагона' },
    { command: '/creator', description: 'Автор бота' }
]);

bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    const helpMessage = `
Список команд:
- /start: Приветствие от бота
- /help: Показать этот список команд
- /site: Получить ссылку на сайт Октагона
- /creator: Узнать автора бота
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

module.exports = bot;
