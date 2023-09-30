import * as amqp from 'amqplib';
import { RMQ_URL } from '../common/constants';
import { EXCHANGE_NAME, EXCHANGE_TYPE } from './constants';
import { getPayment } from './helpers';

const QUEUE_NAME = 'tax-q';

(async () => {
  try {
    let totalHold = 0;
    const connection = await amqp.connect(RMQ_URL);
    const channel = await connection.createChannel();

    channel.assertExchange(EXCHANGE_NAME, EXCHANGE_TYPE);
    channel.assertQueue(QUEUE_NAME, { durable: false });

    channel.bindQueue(QUEUE_NAME, EXCHANGE_NAME, '');

    channel.consume(
      QUEUE_NAME,
      msg => {
        if (msg) {
          const payment = getPayment(msg);
          totalHold += payment * 0.01;

          console.log(
            `[${new Date().toLocaleTimeString()}] Payment received for the amount of $${payment}. ` +
              `($${totalHold.toFixed(2)} held from this person)`,
          );
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
