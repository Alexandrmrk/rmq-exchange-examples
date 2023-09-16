import amqp from 'amqplib';
import { random } from '../common/random';
import { RMQ_URL } from '../common/constants';
import { setTimeout } from 'timers/promises';

const ExchangeName = 'direct-log';

(async () => {
  const connection = await amqp.connect(RMQ_URL);
  try {
    const channel = await connection.createChannel();
    channel.assertExchange(ExchangeName, 'direct');
    const levels = ['error', 'warning', 'info'];

    do {
      const delay = random(1000, 3000);
      const index = random(0, levels.length - 1);

      await setTimeout(delay);
      const routingKey = levels[index];
      const msg = `Message type ${routingKey} is sent direct exchange`;

      channel.publish(ExchangeName, routingKey, Buffer.from(msg));
      console.log(`[${new Date().toLocaleTimeString()}]  ${msg}`);
    } while (true);
  } catch (error) {
    console.log(`error: (${error})`);
  } finally {
    await connection.close();
  }
})();