const twilio = require('twilio');
const expandGroups = require('../utils').expandGroups
const constants = require('../constants')
const AbstractAdapter = require('./AbstractAdapter')

module.exports = class TwilioTexter extends AbstractAdapter{

  static get transport() {
    return constants.transports.sms;
  }

  constructor(config) {
    super(config)
    let {accountSid,authToken,phoneNumber} = this.config.credentials
    this.sourcePhoneNumber = phoneNumber
    this.client = twilio(accountSid, authToken);
    this.transporter = this.client.messages
  }

  send(args,options={}) {
    let recipients = expandGroups(options.groups, args.to || options.defaults.to);

    return Promise.all( recipients.map( r => {
      return this.transporter.create({
        to:r,
        from: this.sourcePhoneNumber,
        body: args.text
      })
      .then( response => response.sid )
    }))
  }
}