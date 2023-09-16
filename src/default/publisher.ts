import amqp from 'amqplib';
import { random } from '../common/random';
import { RMQ_URL } from '../common/constants';
import { setTimeout } from 'timers/promises';

const QUEUE_NAME = 'default';

(async () => {
  const connection = await amqp.connect(RMQ_URL);
  try {
    const channel = await connection.createChannel();

    channel.assertQueue(QUEUE_NAME, { durable: false });
    let counter = 0;

    do {
      const delay = random(1000, 3000);
      await setTimeout(delay);
      const msg = `Message-${counter++} is sent default exchange`;

      channel.sendToQueue(QUEUE_NAME, Buffer.from(msg));

      console.log(`  [${new Date().toLocaleTimeString()}] Sent %s`, msg);
    } while (true);
  } catch (error) {
    console.log(`error: (${error})`);
  } finally {
    await connection.close();
  }
})();
