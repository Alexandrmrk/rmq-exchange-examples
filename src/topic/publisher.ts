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
      const routingKey =
        counter % 4 === 0
          ? 'Tesla.red.fast.ecological'
          : counter % 5 === 0
          ? 'Mercedes.exclusive.expensive.ecological'
          : generateRoutingKey();

      const msg = `Message type [${routingKey}] from publisher`;

      channel.publish(EXCHANGE_NAME, routingKey, Buffer.from(msg));
      console.log(
        `[${new Date().toLocaleTimeString()}]  Message type [${routingKey}] is sent ${EXCHANGE_NAME} exchange`,
      );

      counter++;
    } while (true);
  } catch (error) {
    console.log(`error: (${error})`);
  }
})();

function generateRoutingKey() {
  const cars = ['BMW', 'Audi', 'Tesla', 'Mercedes'];
  const colors = ['white', 'red', 'black'];

  const carIndex = random(0, cars.length - 1);
  const colorIndex = random(0, colors.length - 1);

  return `${cars[carIndex]}.${colors[colorIndex]}`;
}
