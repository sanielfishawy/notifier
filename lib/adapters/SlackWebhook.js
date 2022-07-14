const {IncomingWebhook} = require('@slack/webhook')
const constants = require('../constants')
const AbstractAdapter = require('./AbstractAdapter')

module.exports = class SlackWebhook extends AbstractAdapter {
  static get transport() {
    return constants.transports.slack
  }

  send(args) {
    let message = args.text;
    let webhook = new IncomingWebhook(this.config.credentials.webhook);

    if ( message ) {
      return webhook.send(args.text)
    } else return Promise.reject('No message provided')
  }
}
