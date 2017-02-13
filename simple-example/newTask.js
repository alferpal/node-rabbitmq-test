'use strict'

const amqp = require('amqplib/callback_api')

amqp.connect('amqp://test:test@localhost', function (errConnect, conn) {
  if (errConnect) {
    console.error(errConnect)
    process.exit(1)
  }

  conn.createChannel(function (errChannel, ch) {
    if (errChannel) {
      console.error(errChannel)
      process.exit(1)
    }

    const q = 'task_queue'
    const msg = process.argv.slice(2).join(' ') || 'Hello World!'

    ch.assertQueue(q, {durable: true})
    ch.sendToQueue(q, new Buffer(msg), {persistent: true})
    console.log(" [x] Sent '%s'", msg)
  })
  setTimeout(function () {
    conn.close()
    process.exit(0)
  }, 500)
})
