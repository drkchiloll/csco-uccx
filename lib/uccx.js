var request = require('request-promise');

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
    method: opts.method,
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

  uccx.listRsrcs = () => {
    return _req(_options({
      path: '/resource',
      method: 'GET'
    }));
  };

  uccx.skill = (args) => {
    return _req(_options({
      path: `${args.id ? `/skill/${args.id}` : `/skill`}`,
      method: `${!args.id && !args.skill ? `GET` :
        (!args.id) ? `POST` : (args.skill) ? `PUT` : `DELETE`}`,
      data: {skillName: args.skill} || undefined
    }));
  };

  return uccx;
};
