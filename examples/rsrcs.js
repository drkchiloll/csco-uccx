var UCCX = require('../index');

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

uccx.listRsrcs().then((res) => console.log(res));
