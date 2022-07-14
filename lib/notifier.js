const Adapters = require('./adapters')
const getConfig = require('./utils').getConfig
const path = require('path')
const logger = require('./Logger').instance;

module.exports = class Notifier {
  constructor(config) {
    this.config = getConfig(typeof config == 'string' ? path.resolve(config) : config)
    this.transports = {}
    // Intentionally not in a try-catch block because I want the require to fail if bad configuration
    let availableAdapters = this.availableAdapters()
    for ( let transport of Object.keys(this.config) ) {
      this.transports[transport] = {
        options: this.config[transport].options || {}
      }
      if ( !this.transports[transport].options.defaults ) this.transports[transport].options.defaults = {}
      let adapters = this.config[transport].adapters;
      if ( !adapters || adapters.length == 0 ) logger.warn('No adapters specified for',transport);
      else {
        this.transports[transport].adapters = [];
        for ( let adapterConfig of adapters ) {
          let adapterName = adapterConfig.name
          if ( !availableAdapters.includes(adapterName)) throw new Error(`Adapter ${adapterName} is not supported`)
          if ( !adapterConfig.credentials )
            throw new Error(`Malformed specification for adapter ${adapterName}- each adapter requires a credentials object`)
          this.transports[transport].adapters.push( new Adapters[adapterName](adapterConfig) )
        }
      }
    }
  }

  availableAdapters() {
    return Object.keys(Adapters)
  }

  /**
   * Return the list of available transports based upon what notifier supports
   * @returns {string[]} - array of transport names
   */
  supportedTransports() {
    return Object.keys(this.config)
  }

  /**
   * Send a notification via the indicated service (e.g.email, sms) with indicated parameters
   * The parameters will be specific to the service, for example, for mail they may include
   * from, to, subject, cc, bcc, message ...
   * @param {string} sendChannel - service to use, e.g. sms or email or slack - you can also use the formalism of transport:provider to indicate which specific provider to use, e.g. sms:aws
   * @param {Object} params - service-dependent parameters
   * @param {object} [params.adapter] - if specified, will use the indicated adapter name instead of default
   * @returns {Promise<string>} - promise that resolves to a message ID
   */
  send(sendChannel, params) {
    if ( typeof params == 'string' ) {
      params = {text: params}
    }
    let [transport,provider] = sendChannel.split(':')
    if ( !this.transports[transport] ) throw new Error(`Transport ${transport} is not supported.  Available options are ${this.supportedTransports()}`)
    let adapter;
    if ( !params.adapter ) {
      if ( provider ) {
        adapter = this.transports[transport].adapters.find( adapter => adapter.provider == provider)
        if ( !adapter ) throw new Error(`Did not find adapter for provider ${provider}`)
      }
    }
    // If we didn't find the adapter through the specified provider
    if ( !adapter ) {
      let adapterName = params.adapter || this.transports[transport].options.defaults.adapter
      adapter = adapterName ? this.transports[transport].adapters.find( (adapter) => adapter.name == adapterName) : this.transports[transport].adapters && this.transports[transport].adapters[0]
    }
    if ( !adapter )
      throw new Error(`Notifier missing adapter for transport ${transport}`)

    logger.debug(`Notifier posting to ${transport} via ${adapter.name}: ${params.text}`)
    return adapter.send(params,this.transports[transport].options)
    .catch(err => {
      logger.error(`Notifier error - ${err}`);
      throw err
    });
  }

}