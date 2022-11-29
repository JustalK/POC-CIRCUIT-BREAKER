/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import * as express from 'express';
import * as path from 'path';
import axios from 'axios';

const app = express();
let counter = 0;

const SERVER_API2_URL = `${process.env.NX_API_PROTOCOL}://${process.env.NX_API_HOST}:${process.env.NX_API_2_PORT}`;

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/api', async (req, res) => {
  try {
    const rsl = await axios.get(SERVER_API2_URL);
    const { data } = rsl;
    console.log(data);
  } catch {
    console.log('error');
  }
  res.send({ message: counter });
});

const port = process.env.NX_API_1_PORT;
const server = app.listen(port, () => {
  console.log(
    `Listening at ${process.env.NX_API_PROTOCOL}://${process.env.NX_API_HOST}:${port}`
  );
});
server.on('error', console.error);
