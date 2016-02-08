var request = require('request-promise');
var Promise = require('bluebird');

/**
 * @param {Object} params - Module Dependencies
 * @param {String} params.uri - UCCX API URI
 * @param {String} params.user - UCCX Admin UserName
 * @param {String} params.pass - UCCX Admin Password
 */
module.exports = (params) => {
  var uri, user, pass;
  if(params && params instanceof Object) {
    uri = params.uri;
    user = params.user;
    pass = params.pass;
  } else {
    throw new Error('Please Follow the API Guidelines');
  }

  // Helper Functions
  var _options = (opts) => ({
    uri: uri + opts.path,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    auth : {user: user, pass: pass},
    strictSSL : false,
    method: opts.method || 'GET',
    json: opts.data || undefined
  });

  var _req = (reqoptions) => {
    return request(reqoptions).then((res) => {
      try {
        return JSON.parse(res);
      } catch(err) {
        return res;
      }
    });
  };

  var _handleReq = () => {

  };

  var uccx = {};

  uccx.getStats = () => {
    return _req(_options({
      path: '/agentstats'
    }));
  }

  uccx.listRsrc = (id) => {
    return _req(_options({
      path: (id) ? `/resource/${id}` : `/resource`,
      method: 'GET'
    }));
  };

  /**
   * @param {Object} rsrc - Agent to Modify
   * @param {String} rsrc.agent - Agent userID
   * @param {Object[]} rsrc.skills - List of Skills to Add to Agent
   * @param {String} rsrc.skills[].name - Skill Name
   * @param {Number} rsrc.skills[].competence - Skill Value
   */
  uccx.rsrcSkill = (rsrc) => {
    var agent;
        skills = rsrc.skills,
        skillMap = {skillCompetency: []};
    return uccx.listRsrc(rsrc.agent).then((agt) => {
      agent = agt;
      // Get All Skills
      return uccx.skill({}).then((resp) => {
        var sysSkills = resp.skill;
        return Promise.reduce(skills, (obj, skill) => {
          var sysSkill = sysSkills.find((sys) => skill.name === sys.skillName);
          if(sysSkill) {
            obj.skillCompetency.push({
              competencelevel: skill.competence,
              skillNameUriPair: {
                '@name': skill.name,
                refURL: sysSkill.self
              }
            });
            return obj;
          }
        }, skillMap).then((res) => res);
      }).then((res) => res)
    }).then((skillComps) => {
      // Attach SkillComps to Agent
      agent.skillMap = skillComps;
      return _req(_options({
        path: `/resource/${rsrc.agent}`,
        method: 'PUT',
        data: agent
      }));
    })
  };

  /**
   * @param {Object} args
   * @param {String} args.id - System Skill ID
   * @param {String} args.skill - Name of Skill
   * @param {String} args.method - GET/POST/PUT/DELETE
   */
  uccx.skill = (args) => {
    return _req(_options({
      path: `${args.id ? `/skill/${args.id}` : `/skill`}`,
      method: args.method,
      data: {skillName: args.skill} || undefined
    }));
  };

  return uccx;
};
