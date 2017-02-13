'use strict'

const amqp = require('amqplib/callback_api')

amqp.connect('amqp://test:test@localhost', function (errConnect, conn) {
  if (errConnect) {
    console.error(errConnect)
    process.exit(1)
  }

  conn.createChannel(function (errChannel, ch) {
    const q = 'task_queue'

    if (errChannel) {
      console.error(errChannel)
      process.exit(1)
    }

    ch.assertQueue(q, {durable: true})
    ch.prefetch(64)

    console.log(' [*] Waiting for messages in %s. To exit press CTRL+C', q)

    ch.consume(q, function (msg) {
      const secs = msg.content.toString().split('.').length - 1

      console.log(' [x] Received %s', msg.content.toString())
      setTimeout(function () {
        console.log(' [x] Done')
        ch.ack(msg)
      }, secs * 1000)
    }, {noAck: false})
  })
})
