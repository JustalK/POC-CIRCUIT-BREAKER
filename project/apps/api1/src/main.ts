/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import * as express from 'express';
import * as path from 'path';
import axios from 'axios';

const app = express();
let counter = 0;
let date_last_fail = null;
const CIRCUIT_BREAKER_CLOSED_THRESHOLD = 3;
const CIRCUIT_BREAKER_HALF_OPEN_THRESHOLD_IN_SECOND = 5;

const SERVER_API2_URL = `${process.env.NX_API_PROTOCOL}://${process.env.NX_API_HOST}:${process.env.NX_API_2_PORT}`;

app.use('/assets', express.static(path.join(__dirname, 'assets')));

const callApi2 = async (isOpen = true) => {
  try {
    const rsl = await axios.get(SERVER_API2_URL);
    const { data } = rsl;
    const { message } = data;
    counter = isOpen ? Math.max(counter - 1, 0) : 0;
    return message;
  } catch {
    counter++;
    date_last_fail = new Date();
    return isOpen
      ? `CIRCUIT OPEN (fail: ${counter})`
      : `CIRCUIT HALF-OPEN (fail: ${counter})`;
  }
};

app.get('/api', async (req, res) => {
  if (counter < CIRCUIT_BREAKER_CLOSED_THRESHOLD) {
    const message = await callApi2();
    return res.send({ message });
  } else {
    const now = new Date();
    const diffNowAndLastFail = now.getTime() - date_last_fail.getTime();
    if (
      diffNowAndLastFail >
      CIRCUIT_BREAKER_HALF_OPEN_THRESHOLD_IN_SECOND * 1000
    ) {
      const message = await callApi2(false);
      return res.send({ message });
    }

    return res.send({ message: 'CIRCUIT CLOSED' });
  }
});

const port = process.env.NX_API_1_PORT;
const server = app.listen(port, () => {
  console.log(
    `Listening at ${process.env.NX_API_PROTOCOL}://${process.env.NX_API_HOST}:${port}`
  );
});
server.on('error', console.error);
