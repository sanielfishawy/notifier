function getConfig(config) {
  let configObject = config;
  if ( typeof config == 'string' ) {
    // Interpret it as a file path
    try {
      configObject = require(config)
    } catch(e) {
      throw new Error(`Unable to find configuration file at path ${config}`)
    }
  }
  if ( !configObject )
    throw new Error('You must pass a configuration object or pathname to configuration file')
  return configObject;
}

/**
 * Expand if any of the recipients are a group
 * @param {object} groups - dictionary of groups, each keyed by group name and pointing to array of targets
 * @param {string|string[]} recipients - array of recipients or comma-separated recipients that may include group names
 * @returns {string[]} - array of targets
 */
function expandGroups(groups, recipients) {
  if ( !Array.isArray(recipients) ) recipients = recipients.split(',')
  groups = groups || {}
  let expanded = recipients.reduce( (a,r) => {
    if ( groups[r] )
      a = a.concat(expandGroups(groups,groups[r]))
    else
      a.push(r)
    return a;
  },[])
  return Array.from(new Set(expanded));
}

function normalizePhone(number) {
  return String(number).replace(/[^\d+]/g,'')
}

module.exports = {
  getConfig,
  expandGroups,
  normalizePhone
}
