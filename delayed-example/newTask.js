'use strict'

const amqp = require('amqplib/callback_api')
const chance = require('chance').Chance()

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

    const q = 'task_queue_delayed'
    const msg = process.argv.slice(2).join(' ') || 'Hello World!'

    ch.assertExchange(q, 'x-delayed-message', {
      autoDelete: false,
      durable: true,
      passive: true,
      arguments: {
        'x-delayed-type': 'direct'
      }
    })

    ch.bindQueue('jobs', q, 'jobs')

    for (let i = 0; i < 100; i++) {
      let tag = `${msg} * ${i}`
      ch.publish(q, 'jobs', new Buffer(tag), {
        headers: {
          'x-delay': chance.integer({
            min: 10000,
            max: 20000
          })
        },
        persistent: true
      })

      console.log(" [x] Sent '%s'", tag)
    }

    setTimeout(function () {
      conn.close()
      process.exit(0)
    }, 200)
  })
})
