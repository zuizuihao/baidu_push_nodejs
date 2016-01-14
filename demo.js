var Push   = require('./baidu-push');
var channelId = '4099091116498016469';

var pushOption = {
  apiKey: 'T0bqE6dFIlb6vgp39Oprqg6g',
  secretKey: '6cldgRS2piLcH3UfiaueGrcmRrwfGK5b',
};

var client = new Push(pushOption);

// var singKey = require('./singKey.js');
// var bodyParams = {
//     apikey: 'T0bqE6dFIlb6vgp39Oprqg6g', 
//     msg_type: 1, 
//     timestamp: 1452687433, 
//     expires: 300, 
//     secretKey: '6cldgRS2piLcH3UfiaueGrcmRrwfGK5b', 
//     channel_id: '4099091116498016469', 
//     device_type: '3', 
//     msg: '{"title":"Message from Push","description":"hello world"}'
// };
// var secretKey = '6cldgRS2piLcH3UfiaueGrcmRrwfGK5b';
// var singkey = singKey.generate('POST', 'http://api.tuisong.baidu.com/rest/3.0/push/single_device'
//         , bodyParams, secretKey);


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