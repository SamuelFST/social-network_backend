import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.API_PORT;

import bodyParser from 'body-parser';
import routes from './src/routes/routes';

app.use(bodyParser.json());
app.use(routes);

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
