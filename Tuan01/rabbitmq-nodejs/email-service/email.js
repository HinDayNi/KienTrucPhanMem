const amqp = require("amqplib");

const RABBITMQ_URL = "amqp://user:password@rabbitmq:5672";
const QUEUE_PAYMENT= "payment_queue";
const DLQ_PAYMENT = "payment_queue.dlq";

let channel;

async function connectWithRetry() {
  try {
    console.log("Consumer connecting...");
    const conn = await amqp.connect(RABBITMQ_URL);
    channel = await conn.createChannel();

    await channel.assertQueue(DLQ_PAYMENT, { durable: true });
    await channel.bindQueue(DLQ_PAYMENT, "amq.direct", DLQ_PAYMENT);

    await channel.assertQueue(QUEUE_PAYMENT, {
      durable: true,
      deadLetterExchange: "amq.direct",
      deadLetterRoutingKey: DLQ_PAYMENT,
    });

    console.log("Waiting for messages...");

    channel.consume(
      QUEUE_PAYMENT,
      async (msg) => {
        if (!msg) return;

        const body = msg.content.toString();
        console.log("Đã nhận thông tin từ Payment: ", body);

        try {
          const data = JSON.parse(body);

          if (!data.orderId) {
            throw new Error("Missing orderId");
          }

          await new Promise(resolve => setTimeout(resolve, 3000));

          console.log("Đã gửi mail đến Customer");
          channel.ack(msg);

        } catch (err) {
          console.log("Send to DLQ");
          channel.nack(msg, false, false);
        }
      },
      { noAck: false }
    );

  } catch (err) {
    console.log("Consumer failed, retry in 3s...");
    setTimeout(connectWithRetry, 3000);
  }
}

connectWithRetry();
