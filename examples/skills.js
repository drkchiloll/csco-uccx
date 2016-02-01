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

// Add Skills
var skills = [
  'expert', 'intermediate', 'beginner'
];
Promise.each(skills, (skill) => {
  return uccx.skill({
    skill: skill
  });
}).then((results) => {
  console.log(results);
})

// Get Configured Skills
uccx.skill({}).then((resp) => {
  var skills = resp.skill;
  // Modify Skills
  var newSkill = ['experter', 'intermediater', 'beginnier'];
  return Promise.map(skills, (skill, idx) => {
    return uccx.skill({id: skill.skillId, skill: newSkill[idx]}).then((resp) => {
      console.log(resp);
      return;
    });
  });
})

// Get All Skills and Delete Them
uccx.skill({}).then((resp) => {
  var skills = resp.skill;
  Promise.map(skills, (skill) => {
    uccx.skill({id: skill.skillId}).then((resp) => {
      console.log(`${skill.skillName} was deleted`);
    })
  })
})
