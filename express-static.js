import * as path from 'path';

import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.API_PORT;

app.use('/file', express.static(path.join(`${__dirname}/static`)));

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
