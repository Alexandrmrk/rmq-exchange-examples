import amqp from 'amqplib';
import { random } from '../common/random';
import { RMQ_URL } from '../common/constants';
import { setTimeout } from 'timers/promises';
import { EXCHANGE_NAME, EXCHANGE_TYPE } from './constants';

(async () => {
  try {
    const connection = await amqp.connect(RMQ_URL);
    const channel = await connection.createChannel();

    channel.assertExchange(EXCHANGE_NAME, EXCHANGE_TYPE);

    let counter = 0;
    do {
      const delay = random(1000, 3000);
      await setTimeout(delay);
      const monies = random(1000, 10_000).toString();

      const msg = `Payment received for the amount of ${monies}`;

      channel.publish(EXCHANGE_NAME, '', Buffer.from(msg));
      console.log(
        `[${new Date().toLocaleTimeString()}]  Payment received for amount of $${monies}. Notifying by '${EXCHANGE_NAME}' Exchange`,
      );

      counter++;
    } while (true);
  } catch (error) {
    console.log(`error: (${error})`);
  }
})();
