import express from 'express';

const app = express();

app.get('/', function (req, res) {
    console.log(req.headers);
    res.send('Hello world!');
})

app.listen(4000, () => {
    console.log('server running on port 4000');
})