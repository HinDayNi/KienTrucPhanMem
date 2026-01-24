const express = require("express");
const amqp = require("amqplib");

const app = express();
app.use(express.json());

const RABBITMQ_URL = "amqp://user:password@rabbitmq:5672";
const QUEUE_ORDER = "order_queue";
const DLQ_ORDER = "order_queue.dlq";

let channel;

async function connectRabbitMQ() {
  while (true) {
    try {
      const conn = await amqp.connect(RABBITMQ_URL);
      channel = await conn.createChannel();

      // Queue chính
      await channel.assertQueue(QUEUE_ORDER, {
        durable: true,
        deadLetterExchange: "",
        deadLetterRoutingKey: DLQ_ORDER,
      });

      // Queue DLQ
      await channel.assertQueue(DLQ_ORDER, { durable: true });

      console.log("[Order] Connected RabbitMQ");
      break;

    } catch (err) {
      console.log("[Order] Waiting for RabbitMQ...");
      await new Promise((res) => setTimeout(res, 3000));
    }
  }
}

app.post("/order", async (req, res) => {
  const { orderId, total } = req.body;

  if (!orderId || !total) {
    return res.status(400).json({ error: "orderId & total required" });
  }

  const order = {
    event: "ORDER_CREATED",
    orderId,
    total,
    timestamp: new Date()
  };

  channel.sendToQueue(
    QUEUE_ORDER,
    Buffer.from(JSON.stringify(order)),
    { persistent: true } // Message không bị mất khi RabbitMQ restart
  );

  console.log("Đã gửi thông tin đến Payment: ", order);

  res.json({ status: "OK", sent: order });
});

connectRabbitMQ();

app.listen(3000, () => {
  console.log("[Order] API running on 3000");
});
