exports.getCurrentDate = function() {
    const currentDate = new Date();
    return currentDate.toLocaleString();
};

exports.getGreetingMessage = function(name = "пользователь") {
    const currentDate = new Date();
    const hour = currentDate.getHours();
    if (hour > 16) {
        return `Добрый вечер, ${name}`;
    } else if (hour > 10) {
        return `Добрый день, ${name}`;
    } else {
        return `Доброе утро, ${name}`;
    }
};
