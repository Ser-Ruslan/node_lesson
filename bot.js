const TelegramBot = require('node-telegram-bot-api');


const token = '7363437148:AAHecv5tqcoTEvhMuFS1swyj1BfatGmHpGs';


const bot = new TelegramBot(token, { polling: true });


bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Привет, октагон!');
});
