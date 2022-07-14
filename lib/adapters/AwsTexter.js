const AWS = require('aws-sdk');
const {getConfig,expandGroups,normalizePhone} = require('../utils')
const constants = require('../constants')
const AbstractAdapter = require('./AbstractAdapter')

module.exports = class AwsTexter extends AbstractAdapter {

  static get transport() {
    return constants.transports.sms;
  }

  constructor(config) {
    super(config)
    AWS.config=new AWS.Config(this.config.credentials)
    this.transporter = new AWS.SNS({
      apiVersion: '2010-03-31',
    })
  }

  send(args,options={}) {
    let recipients = expandGroups(options.groups, args.to || options.defaults.to);

    let params = {
      Message: args.text,
      MessageStructure: 'string',
    }
    return Promise.all( recipients.map( r => {
      params.PhoneNumber = normalizePhone(r)
      return this.transporter.publish(params).promise()
      .then( response => response.MessageId )
    }))
  }
}