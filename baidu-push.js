'use strict';

var assert = require('assert'),
    crypto = require('crypto'),
    http = require('http'),
    os = require('os'),
    singKey = require('./singKey.js');

function Push(options) {
    this.apiKey = options.apiKey;
    this.secretKey = options.secretKey;
    this.host = options.host || 'api.tuisong.baidu.com';
    this.path = options.path || '/rest/3.0/';

    if (options.hasOwnProperty('agent')) {
        this.agent = options.agent;
    } else {
        var agent = new http.Agent();
        agent.maxSockets = 20;
        this.agent = agent;
    }
}

Push.prototype.request = function (path, bodyParams, callback) {
    var secretKey = this.secretKey,
        timeout = this.timeout,
        host = this.host;
        
    var url = 'http://' + host + path;
    var http_method = 'POST'
    
    bodyParams.apikey = this.apiKey;
    bodyParams.secretKey = this.secretKey;
    bodyParams.device_type = 3;
    bodyParams.timestamp = getTimestamp();
    bodyParams.expires = 300;
    bodyParams.sign = singKey.generate(http_method, url, bodyParams, secretKey);

    var bodyArgsArray = [];

    for (var i in bodyParams) {
        bodyArgsArray.push(i + '=' + fullEncodeURIComponent(bodyParams[i]));
    }

    var bodyString = bodyArgsArray.join('&');

    var reqParam = {
        host: host,
        path: path,
        method: 'POST',
        headers: {
            'Content-Length': bodyString.length,
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
            'User-Agent': 'BCCS_SDK/3.0 (' + os.type() + ') node/' + process.versions.node + ' (Baidu Push Server SDK V3.0.0) cli/Unknown',
            'Referer': url
        }
    };

    var req = http.request(reqParam, function (res) {
        var chunks = [],
            size = 0;

        res.on('data', function (chunk) {
            chunks.push(chunk);
            size += chunk.length;
        });

        res.on('end', function () {
            var data;

            try {
                data = JSON.parse(Buffer.concat(chunks, size));
            } catch (e) {
                e.status = res.statusCode;
                e.code = 'JSON Parse Error';

                return callback(e);
            }

            if (res.statusCode !== 200) {
                var err = new Error();

                err.code = data.error_code;
                err.status = res.statusCode;
                err.message = data.error_msg;
                err.request_id = data.request_id;

                return callback(err);
            }

            callback(null, data);
        });
    });

    req.on('socket', function (socket) {
        socket.setTimeout(timeout);
        socket.on('timeout', function () {
            req.abort();
        });
    });

    req.on('error', function (e) {
        callback(e);
    });

    req.end(bodyString);
};


Push.prototype.pushMsgToSingleDevice = function (options, callback) {
    options = options || {};
    callback = callback || noop;
    var path = this.path + 'push/single_device';
    options.msg = JSON.stringify(options.msg);

    this.request(path, options, callback);
};

module.exports = Push;

function noop() { }

function getTimestamp() {
    return Math.floor(new Date().getTime() / 1000);
}

// 兼容php的urlencode
function fullEncodeURIComponent(str) {
    var rv = encodeURIComponent(str).replace(/[!'()*~]/g, function (c) {
        return '%' + c.charCodeAt(0).toString(16).toUpperCase();
    });
    return rv.replace(/\%20/g, '+');
}
