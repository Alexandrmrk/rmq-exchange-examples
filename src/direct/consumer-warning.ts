import * as amqp from 'amqplib';
import { RMQ_URL } from '../common/constants';
import { EXCHANGE_NAME, EXCHANGE_TYPE } from './constants';

const QUEUE_NAME = 'warning-q';

(async () => {
  try {
    const connection = await amqp.connect(RMQ_URL);
    const channel = await connection.createChannel();

    channel.assertExchange(EXCHANGE_NAME, EXCHANGE_TYPE);
    channel.assertQueue(QUEUE_NAME, { durable: false });

    channel.bindQueue(QUEUE_NAME, EXCHANGE_NAME, 'warning');

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
