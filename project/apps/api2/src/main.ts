/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import * as express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.send({ message: 'Welcome to api2!' });
});

const port = process.env.NX_API_2_PORT;
const server = app.listen(port, () => {
  console.log(
    `Listening at ${process.env.NX_API_PROTOCOL}://${process.env.NX_API_HOST}:${port}`
  );
});
server.on('error', console.error);
