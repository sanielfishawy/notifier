module.exports = {
  awsMail: require('./AwsMailer'),
  awsText: require('./AwsTexter'),
  sendgridMail: require('./SendgridMailer'),
  twilioSms: require('./TwilioTexter'),
  slackWebhook: require('./SlackWebhook'),
  slackApp: require('./SlackApp')
}