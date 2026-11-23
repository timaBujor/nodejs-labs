const http = require('http');

function formatDate(date) {
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()} ` +
           `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

const server = http.createServer((req, res) => {
    console.log(`${req.method} | ${req.url} | ${formatDate(new Date())}`);

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');

    if (req.method === 'GET' && req.url === '/') {
        res.end('Welcome! Hello from Node.js server!');
    }
    else if (req.method === 'GET' && req.url === '/about') {
        res.end('About: simple HTTP server on Node.js (Lab 1)');
    }
    else if (req.method === 'GET' && req.url === '/student') {
        res.end('Student: Bujor Timofei, group: IAFR2302');
    }
    else if (req.method === 'GET' && req.url === '/api/student') {
        const student = {
            name: 'Bujor Timofei',
            group: 'IAFR2302',
            speciality: 'Imformatica'
        };
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(student));
    }
    else if (req.method === 'GET' && req.url === '/time') {
        res.end('Current date and time: ' + formatDate(new Date()));
    }
    else if (req.method === 'GET' && req.url === '/api/courses') {
        const courses = [
            { title: 'Web Programming', teacher: 'Ion Popescu', credits: 5 },
            { title: 'Databases', teacher: 'Maria Rusu', credits: 4 },
            { title: 'Operating Systems', teacher: 'Andrei Ciobanu', credits: 6 }
        ];
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(courses));
    }
    else if (req.method === 'GET' && req.url === '/random') {
        const number = Math.floor(Math.random() * 100) + 1;
        res.end('Random number: ' + number);
    }
    else {
        res.statusCode = 404; 
        res.end('404 - Page not found');
    }
});

server.listen(3000, () => {
    console.log('Server is running at http://localhost:3000');
});