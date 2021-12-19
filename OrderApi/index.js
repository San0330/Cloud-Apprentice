const express = require("express");
const cors = require("cors");
const amqp = require("amqplib/callback_api");

const app = express();
app.use(cors());

const rabbitMQHost = process.env.RABBIT_MQ_HOST;
const rabbitMQPort = process.env.RABBIT_MQ_PORT;
const rabbitMQUser = process.env.RABBIT_MQ_USER;
const rabbitMQPassword = process.env.RABBIT_MQ_PASSWORD;

const queueMessage = async (msg) =>
  amqp.connect(
    `amqp://${rabbitMQUser}:${rabbitMQPassword}@${rabbitMQHost}:${rabbitMQPort}`,
    (err, conn) => {
      if (err) throw err;
      conn.createChannel((err1, channel) => {
        if (err1) throw err1;
        let queue = "orderQueue";

        channel.assertQueue(queue, {
          durable: false,
        });

        channel.sendToQueue(queue, Buffer.from(msg));
        console.log("message sent %s", msg);
      });
      setTimeout(() => conn.close(), 500);
    }
  );

app.get("/orders", async function (req, res) {
  let name = req.query.name;
  let phone = req.query.phone;
  let msg = JSON.stringify({ name, phone });
  await queueMessage(msg);
  return res.json({
    success: true,
    message: "Order placed",
  });
});

app.listen(5001, () => console.log("Listening to order handler on port 5001"));
