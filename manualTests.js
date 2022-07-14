const Notifier = require('./lib/notifier');

const params = {
  email: {
    to: ['ff@onebeat.com','ff@newsunroad.com'],
    subject: 'Testing Mailer',
    text: `This is just a notifier test - ignore.`
  },
  sms: {
    text: 'rut roh - no data',
    // to: 'admin',
  },
  slack: {
    text: 'Ignore this message please',
    to: 'ops-status'
  },
}

const notifier = new Notifier('config.js')
console.log('Available transports = ',notifier.supportedTransports())
console.log('Available adapters = ',notifier.availableAdapters())

let tspec = process.argv[2] || 'slack'
let [transport] = tspec.split(':')
notifier.send(tspec,params[transport])
.then( r => console.log(r) )
.catch( e => console.log(e))

// notifier.send('slack',{text: 'This is a first programmatic post'})

