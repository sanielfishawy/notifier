const AWS = require('aws-sdk');
const MailerNotifier = require('./MailerNotifier')

module.exports = class AwsMailer extends MailerNotifier {
  constructor(config) {
    super(config)
    AWS.config=new AWS.Config(this.config.credentials)
    this.transporter = new AWS.SES({
      apiVersion: '2010-12-01',
    })
  }

  translateParams(args) {
    return {
      Destination: {
        CcAddresses: args.cc,
        ToAddresses: args.to,
        BccAddresses: args.bcc,
      },
      Message: {
        Body: {
          Text: {
            Charset: 'UTF-8',
            Data: args.text
          }
        },
        Subject: {
          Charset: 'UTF-8',
          Data: args.subject
        }
      },
      Source: args.from
    }
  }
  /**
   *
   * @param {Object} args - email arguments including keys to,from,subject,text
   * @param {string|Object} [args.from] - The information for sender - can be a string or an object of form {name,email}
   * @param {string|string[]} [args.to] - The list of recipients, either as comma-separated list or as an array of strings
   * @param {string} [args.subject] - The subject of the email.
   * @param {string} [args.text] - The body of the email (NO html).
   * @param {string} [args.html] - HTML version of the email
   * @param {object} [options] - specification for groups and templates
   * @returns {Promise} - returns a promise with the results
   */
  send(args,options={}) {
    let params = this.setMailParams(args,options)
    return this.transporter.sendEmail(this.translateParams(params)).promise()
    .then( response => response.MessageId)
  }
}