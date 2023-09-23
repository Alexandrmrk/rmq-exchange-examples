import amqp from 'amqplib';
import { random } from '../common/random';
import { RMQ_URL } from '../common/constants';
import { setTimeout } from 'timers/promises';
import { QUEUE_NAME } from './constants';

(async () => {
  try {
    const connection = await amqp.connect(RMQ_URL);
    const channel = await connection.createChannel();

    channel.assertQueue(QUEUE_NAME, { durable: false });
    let counter = 0;

    do {
      const delay = random(1000, 3000);
      await setTimeout(delay);
      const msg = `Message-${counter++} from default exchange`;

      channel.sendToQueue(QUEUE_NAME, Buffer.from(msg));

      console.log(`  [${new Date().toLocaleTimeString()}] Message-${counter++} is sent default exchange`);
    } while (true);
  } catch (error) {
    console.log(`error: (${error})`);
  }
})();
