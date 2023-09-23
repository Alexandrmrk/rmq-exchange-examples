import amqp from 'amqplib';
import { random } from '../common/random';
import { RMQ_URL } from '../common/constants';
import { setTimeout } from 'timers/promises';
import { EXCHANGE_NAME } from './constants';

(async () => {
  try {
    const connection = await amqp.connect(RMQ_URL);
    const channel = await connection.createChannel();

    channel.assertExchange(EXCHANGE_NAME, 'direct');

    const levels = ['error', 'warning', 'info'];

    do {
      const delay = random(1000, 3000);
      const index = random(0, levels.length - 1);

      await setTimeout(delay);
      const routingKey = levels[index];
      const msg = `Message type ${routingKey} is sent direct exchange`;

      channel.publish(EXCHANGE_NAME, routingKey, Buffer.from(msg));
      console.log(`[${new Date().toLocaleTimeString()}]  ${msg}`);
    } while (true);
  } catch (error) {
    console.log(`error: (${error})`);
  }
})();
