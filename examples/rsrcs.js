var UCCX = require('../index');
var Promise = require('bluebird');
/*
 * Add a Config File to your Directory
 * module.exports = { uri: '', user: '', pass: ''};
 * Or Fill out Proper API URI, Admin, Password
 */
var config;
try {config = require('../config')}
catch(err){
  config = {uri:'',user:'',pass:''};
}
var uccx = UCCX({
  uri: config.uri || 'API URI',
  user: config.user || 'Admin',
  pass: config.pass || 'Password'
});

// Add Skill(s) to Agent
uccx.rsrcSkill({
  agent: 'agent1',
  skills: [{name: 'expert', competence: 5}, {name: 'intermediate', competence: 2}]
}).then((results) => {
  // console.log(results);
})

// Get Resource by ID
uccx.listRsrc('agent1').then((rsrc) => {
  var rsrc = rsrc;
  // Add Skill to Resource
  rsrc.skillMap = {
    skillCompetency: [{
      competencelevel: 3,
      skillNameUriPair: {
        '@name': 'expert',
        refURL: 'https://192.168.1.31/adminapi/skill/16'
      }
    }]
  };
  uccx.rsrcSkill(rsrc).then((resp) => {
    console.log(resp);
  }).catch((err) => { console.log(err) });
})

uccx.rsrcSkill().then((res) => {
  console.log(res)
}).catch((err) => { console.log(err) });
