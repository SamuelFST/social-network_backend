import * as path from 'path';

import express from 'express';

const app = express();

app.use('/file', express.static(path.join(__dirname + '/static')));

app.listen(4000, () => {
    console.log('server running on port 4000');
})