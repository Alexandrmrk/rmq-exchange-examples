import * as amqp from 'amqplib';

export function getPayment(msg: amqp.ConsumeMessage) {
  return Number(msg.content.toString().split(' ').pop() ?? 0);
}
