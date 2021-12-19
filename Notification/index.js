const amqp = require("amqplib/callback_api");
const twilio = require("twilio");

async function sendMessage(name, number) {
  const accountSid = process.env.TWILIO_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioNumber = process.env.TWILIO_PHONE_NUMBER;

  const client = twilio(accountSid, authToken);

  client.messages
    .create({
      body: `Hello ${name}, your item is ready. From Tech products`,
      to: `+977${number}`, // Text this number
      from: twilioNumber, // From a valid Twilio number
    })
    .then((message) => console.log(message));

  console.log(`SMS sent to ${name} at +977${number}`);
}

const rabbitMQHost = process.env.RABBIT_MQ_HOST;
const rabbitMQPort = process.env.RABBIT_MQ_PORT;
const rabbitMQUser = process.env.RABBIT_MQ_USER;
const rabbitMQPassword = process.env.RABBIT_MQ_PASSWORD;

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

      console.log("Waiting for message");

      channel.consume(
        queue,
        async (msg) => {
          const obj = JSON.parse(msg.content.toString());
          try {
            await sendMessage(obj.name, obj.phone);
          } catch (e) {
            console.log(e);
          }
        },
        {
          noAck: true,
        }
      );
    });
  }
);
