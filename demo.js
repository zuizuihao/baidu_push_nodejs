var Push   = require('./baidu-push');
var channelId = '4099091116498016469';

var pushOption = {
  apiKey: 'T0bqE6dFIlb6vgp39Oprqg6g',
  secretKey: '6cldgRS2piLcH3UfiaueGrcmRrwfGK5b',
  // timeout: 2000, // optional - default is: 5000
  // agent: false   // optional - default is: maxSockets = 20
};

var client = new Push(pushOption);

var options = {
  channel_id: channelId,
  msg_type: 1,
  msg: {
     title: 'Message from Push',
     description: 'hello world'
  }
};

client.pushMsgToSingleDevice(options, function(error, result) {
    if(error){
        console.log(error);
       return; 
    }
    console.log(result);
});