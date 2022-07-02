import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.API_PORT;

app.get('/', (req, res) => {
  console.log(req.headers);
  res.send('Hello world!');
});

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
