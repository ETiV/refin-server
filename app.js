/**
 * Created by ETiV on 2014/5/26.
 */

process.on("uncaughtException", function (e) {
  console.log('uncaughtException', e);
});

var config = require('./config');
var io = require('socket.io').listen(config.server.port);

var agent_pool = {};

var EVENT = {
  eIdentify: 'REFIN_IDENTIFY'
};

var KEYS = {
  kMode: 'MODE',
  kSocketMode: 'kSocketMode'
};

var CONST = {
  AGENT: 'AGENT',
  CLIENT: 'CLIENT'
};

io.sockets.on('connection', function (socket) {

  socket.on('disconnect', function () {
    console.log('========', 'IN disconnect', socket.id);
  });

  socket.on('error', function (err) {
    console.log('========', 'IN error', err);
  });

  // 0.5 秒内如果客户端不主动发 identify 包, 则直接断开连接
  var identify_timeout = setTimeout(function () {
    socket.disconnect();
    identify_timeout = null;
  }, 500);

  socket.on(EVENT.eIdentify, function (data) {

    switch (data[ KEYS.kMode ]) {
      case CONST.AGENT:
      {
        // 客户端类型符合, 设置 socket mode
        socket.set(KEYS.kSocketMode, CONST.AGENT);
        if (identify_timeout) {
          clearTimeout(identify_timeout);
          identify_timeout = null;
        }
      }
        break;
      case CONST.CLIENT:
      {
        // 客户端类型符合, 设置 socket mode
        socket.set(KEYS.kSocketMode, CONST.CLIENT);
        if (identify_timeout) {
          clearTimeout(identify_timeout);
          identify_timeout = null;
        }
      }
        break;
      default:
        // go to hell mother fucker
        // socket.end();
        return;
    }

    console.log('==========', 'IN EVENT.eIdentify, ', data, socket.id);

  });


});
