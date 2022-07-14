const expandGroups = require('../utils').expandGroups
const constants = require('../constants')
const AbstractAdapter = require('./AbstractAdapter')

module.exports = class MailerNotifier extends AbstractAdapter {

  static get transport() {
    return constants.transports.email;
  }

  /**
   * Fills in the email params based upon default template values and what is passed in, and normalizes
   * arrays of recipients to be comma-separated strings
   * @param {Object} params - email parameters
   * @param {string|Object} [params.from] - The information for sender - can be a string or an object of form {name,email}
   * @param {string|string[]} [params.to] - The list of recipients, either as comma-separated list or as an array of strings
   * @param {string} [params.subject] - The subject of the email.
   * @param {string} [params.text] - The body of the email (NO html).
   * @param {object} [options] - specification for groups and templates
   * @returns {object} - an object that is normalized with following properties: {from,to,subject,text}, each of which is a string
   */
  setMailParams( params, options={} ){
    const templateName = params.template || options.defaults.template
    let templateParams={}
    if ( options.templates ) {
    templateParams = templateName ? options.templates.find( t => t.name == templateName ) : options.templates[0]
    }
    params = Object.assign({},options.defaults,templateParams,params)
    params.from = typeof params.from == 'string' ? params.from : typeof params.from == 'Object' ? `"${params.from.name}" <${params.from.email}>` : null;
    if ( !Array.isArray(params.to) ) params.to = params.to.split(',')
    params.to = expandGroups(options.groups,params.to)
    return params;
  }

  send() {
    throw new Error('The send function has to be overridden by the mail notifier implementation')
  }
}