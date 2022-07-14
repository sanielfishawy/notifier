// A very generic adaptor to be subclassed
const getConfig = require('../utils').getConfig

module.exports = class AbstractAdapter {
  constructor(config) {
    this.config = getConfig(config);
    let {name,credentials,provider} = config;
    if ( !name || !credentials || !provider ) throw new Error('You must supply each adapter specification with a name, provier, and credentials')
    this.name = config.name;
    this.credentials = config.credentials
    this.provider = config.provider
  }

}
