import * as amqp from 'amqplib';
import { RMQ_URL } from '../common/constants';

const ExchangeName = 'direct-log';
const QueueName = 'info-q';
(async () => {
  const connection = await amqp.connect(RMQ_URL);

  try {
    const channel = await connection.createChannel();

    channel.assertExchange(ExchangeName, 'direct');
    channel.assertQueue(QueueName, { durable: false });
    channel.bindQueue(QueueName, ExchangeName, 'info');

    channel.consume(
      QueueName,
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
