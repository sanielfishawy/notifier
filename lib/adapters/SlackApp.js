// The preferred way for slack to connect to systems is via an App instead of a webhook

const {WebClient} = require('@slack/web-api')
const constants = require('../constants')
const AbstractAdapter = require('./AbstractAdapter')

module.exports = class SlackApp extends AbstractAdapter {
  static get transport() {
    return constants.transports.slack
  }

  send(args,options={}) {
    let {to:channel,text} = args;
    if ( !channel) channel = options.defaults.to;
    let client = new WebClient(this.config.credentials.token);
    if ( !text ) throw new Error('No message provided!')
    if ( !channel ) throw new Error('No target (to field) provided!')
    return client.chat.postMessage({ channel, text })

  }
}
