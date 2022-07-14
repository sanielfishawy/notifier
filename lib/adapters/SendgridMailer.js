const sgMail = require('@sendgrid/mail');
const MailerNotifier = require('./MailerNotifier')

module.exports = class SendGridMailer extends MailerNotifier {

    constructor (config) {
      super(config)
      this.name = config.name;
      sgMail.setApiKey(this.config.credentials.apiKey)
    }

    /**
     *
     * @param {Object} args - email parameters
     * @param {string|Object} [args.from] - The information for sender - can be a string or an object of form {name,email}
     * @param {string|string[]} [args.to] - The list of recipients, either as comma-separated list or as an array of strings
     * @param {string} [args.subject] - The subject of the email.
     * @param {string} [args.text] - The body of the email (NO html).
     * @param {string} [args.html] - HTML version of the email
     * @param {object} [options] - specification for groups and templates
     * @returns {Promise<string>} message Id
     */
    send (args, options={}) {
      let params = this.setMailParams(args,options)
      if ( !params.to && params.bcc ) params.to = params.bcc;
      return sgMail.send(params)
      .then( responses => {
        let response = responses[0]
        return response.headers && response.headers['x-message-id']
      })
    }
}