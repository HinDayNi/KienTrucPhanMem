const amqp = require("amqplib");

const RABBITMQ_URL = "amqp://user:password@rabbitmq:5672";
const QUEUE_ORDER = "order_queue";
const QUEUE_PAYMENT= "payment_queue";
const DLQ_PAYMENT = "payment_queue.dlq";
const DLQ_ORDER = "order_queue.dlq";

let channel;

async function connectWithRetry() {
  try {
    console.log("Consumer connecting...");
    const conn = await amqp.connect(RABBITMQ_URL);
    channel = await conn.createChannel();

    await channel.assertQueue(DLQ_ORDER, { durable: true });
    await channel.bindQueue(DLQ_ORDER, "amq.direct", DLQ_ORDER);

    await channel.assertQueue(QUEUE_ORDER, {
      durable: true,
      deadLetterExchange: "amq.direct",
      deadLetterRoutingKey: DLQ_ORDER,
    });

    console.log("Waiting for messages...");

    channel.consume(
      QUEUE_ORDER,
      async (msg) => {
        if (!msg) return;

        const body = msg.content.toString();
        console.log("Đã nhận thông tin đơn hàng: ", body);

        try {
          const data = JSON.parse(body);

          if (!data.orderId) {
            throw new Error("Missing orderId");
          }

          console.log("Đang xử lí Payment")
          await new Promise(resolve => setTimeout(resolve, 3000));
          console.log("Đã xử lý thành công!")

          channel.sendToQueue(
            QUEUE_PAYMENT,
            Buffer.from(JSON.stringify(data)),
            {
              persistent: true // Message không bị mất khi RabbitMQ restart
            }
        );

          console.log("Đang gửi qua email...");
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

async function connectRabbitMQ() {
  while (true) {
    try {
      const conn = await amqp.connect(RABBITMQ_URL);
      channel = await conn.createChannel();

      // Queue chính
      await channel.assertQueue(QUEUE_PAYMENT, {
        durable: true,
        deadLetterExchange: "amq.direct",
        deadLetterRoutingKey: DLQ_PAYMENT,
      });

      // Queue DLQ
      await channel.assertQueue(DLQ_PAYMENT, { durable: true });
      await channel.bindQueue(DLQ_PAYMENT, "amq.direct", DLQ_PAYMENT);

      console.log("[Payment] Connected RabbitMQ");
      break;

    } catch (err) {
      console.log("[Payment] Waiting for RabbitMQ...");
      await new Promise((res) => setTimeout(res, 3000));
    }
  }
}

connectRabbitMQ()
connectWithRetry();
