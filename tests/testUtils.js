const expect = require('chai').expect;
const expandGroups = require('../lib/utils').expandGroups

module.exports = function () {
  let testConfig = {
    groups: {
      admin: ['joe','blow'],
      support: ['mark','jane']
    }
  }
  describe('ExpandGroup Tests', () => {
    it('should convert groups to names when name missing', () => {
      let name = 'something'
      expect(expandGroups(testConfig.groups,name).join()).to.eql(name);
      expect(expandGroups({},name).join()).to.eql(name);
      expect(expandGroups(null,name).join()).to.eql(name);
    });
    it('should convert groups to names when name matches', () => {
      let name = 'admin'
      expect(expandGroups(testConfig.groups,name)).to.eql(testConfig.groups.admin);
    });
    it('should convert groups to names with multiple names, one group matching', () => {
      let names = ['admin','foo']
      expect(expandGroups(testConfig.groups,names)).to.eql(testConfig.groups.admin.concat(['foo']));
      expect(expandGroups(testConfig.groups,names.join())).to.eql(testConfig.groups.admin.concat(['foo']));
    });
    it('should convert groups to names with multiple names, multiple groups matching', () => {
      let names = ['admin','support','foo']
      expect(expandGroups(testConfig.groups,names)).to.eql(testConfig.groups.admin.concat(testConfig.groups.support.concat(['foo'])));
    });
  })
}
