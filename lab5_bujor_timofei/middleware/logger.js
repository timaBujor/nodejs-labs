const fs = require('fs');
const path = require('path');
const morgan = require('morgan');

// 23.11.2026 14:35
function formatDate(date = new Date()) {
    const d = new Date(date);
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()} ` +
           `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// Файл logs/requests.log (папка создаётся, если её нет)
const logDir = path.join(__dirname, '..', 'logs');
fs.mkdirSync(logDir, { recursive: true });
const logStream = fs.createWriteStream(path.join(logDir, 'requests.log'), { flags: 'a' });

// Свой токен для даты в нужном формате
morgan.token('date-ru', () => formatDate());

// POST /login | 200 | 15 ms | 18.11.2026 14:35
const fileFormat = ':method :url | :status | :response-time[0] ms | :date-ru';

const requestLogger = [
    morgan('dev'),                              // цветной вывод в терминал
    morgan(fileFormat, { stream: logStream })   // запись в файл
];

// ADMIN ACTION | admin@example.com | DELETE COURSE | Course ID: 5 | 23.11.2026 14:35
function logAdminAction(req, action, entity, id) {
    const email = req.session.user ? req.session.user.email : 'unknown';
    console.log(`ADMIN ACTION | ${email} | ${action} ${entity.toUpperCase()} | ${entity} ID: ${id} | ${formatDate()}`);
}

module.exports = { formatDate, requestLogger, logAdminAction };
