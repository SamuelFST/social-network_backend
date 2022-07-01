const http = require('http');

const server = http.createServer((req, res) => {
    if(req.url === '/'){
        res.write('Hello world!');
        res.end();
    }
});

server.on('connection', (stream) => {
    console.log('Some one connected');
});

server.listen(4000);
console.log('server running on port 4000');