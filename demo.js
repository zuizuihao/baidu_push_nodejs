var Push   = require('./baidu-push');
var userId = '931092786827930646';

var pushOption = {
  apiKey: 'T0bqE6dFIlb6vgp39Oprqg6g',
  secretKey: '6cldgRS2piLcH3UfiaueGrcmRrwfGK5b',
  // timeout: 2000, // optional - default is: 5000
  // agent: false   // optional - default is: maxSockets = 20
};

var client = new Push(pushOption);

var option = {
  push_type: 1,
  user_id: userId,
  messages: ["hello"],
  msg_keys: ["title"]
};

client.pushMsg(option, function(error, result) {
    console.log(result);
    console.log(error);
});