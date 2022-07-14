/**
 * Logger class - temporary logger instances
 *
 * @class Logger
 */
let LoggerDefaults = {level:'debug',addDate:true};
const AllowedLevels = ['error','info','warn','debug'];

module.exports = class Logger {

  constructor(options) {
    let o = Object.assign({},options,Logger.config,LoggerDefaults)
    this.level = o.level
    this.addDate = o.addDate;
  }

  static get _defaultConfig() {
    return {
      level: 'debug',
      addDate: true,
    }
  }

  set level (value) {
    value = value.toLowerCase();
    if ( !AllowedLevels.includes(value) )
      throw new Error(`Debug level ${value} not recognized.  Only allowed level values are ${AllowedLevels}`);
    this._level = value;
  }

  /**
   * This can be used to set the instance for the logger.
   *
   * @static
   */
  static set instance( logger ) {
    this._instance = logger;
  }

  static get instance() {
    if ( !this._instance ) {
      // console.log('Created a new default logger instance')
      this._instance = new Logger()
    }
    return this._instance
  }

  log(...args) {
    console.log(this._addDate(),...args);
  }

  verbose(...args) {
    if ( ['debug','info','warn','error','verbose'].includes(this._level) )
      console.log('VERBOSE',this._addDate(),...args);
  }

  debug(...args) {
    if ( ['debug'].includes(this._level) ) {
      console.log('DEBUG',this._addDate(),...args);
    }
  }
  info(...args) {
    if ( ['debug','info'].includes(this._level) )
      console.log('INFO',this._addDate(),...args);
  }
  warn(...args) {
    if ( ['debug','info','warn'].includes(this._level) )
      console.log('WARN',this._addDate(),...args);
  }
  error(...args) {
    if ( ['debug','info','warn','error'].includes(this._level) )
      console.log('ERROR',this._addDate(),...args);
  }

  _addDate() {
    return this.addDate ? new Date().toLocaleString() + ':' : ''
  }
}
