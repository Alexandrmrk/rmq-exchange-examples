import * as amqp from 'amqplib';
import { RMQ_URL } from '../common/constants';

const QUEUE_NAME = 'default';

(async () => {
  const connection = await amqp.connect(RMQ_URL);

  try {
    const channel = await connection.createChannel();

    channel.assertQueue(QUEUE_NAME, { durable: false });

    channel.consume(
      QUEUE_NAME,
      msg => {
        if (msg) {
          console.log(`[${new Date().toLocaleTimeString()}] Received: [%s]`, msg.content.toString());
        }
      },
      {
        noAck: true,
      },
    );
  } catch (error) {
    console.log(`error: (${error})`);
  }
})();
