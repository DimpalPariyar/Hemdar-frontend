const _ = require("lodash");
const { updateSockets } = require("./true_data_service");
const { default: mongoose } = require("mongoose");
const NotificationModel = require("../model/notification.model");
const util = require("util");
const UserNotifications = require("../model/userNotification.model");

let socketsSymbols = [];
let sockets = [];

const ioSocketConnection = (socket) => {
 
  const data = {
    socket,
    symbols: [],
  };
  socketsSymbols.push(data);
  sockets.push(socket);
  socket.on("LTP", (msgPayload) => {
    const index = _.findIndex(socketsSymbols, (socketSymbols) => {
      return socketSymbols.socket === socket;
    });
    if (msgPayload.unsubscribe === "all") {
      socketsSymbols[index].symbols = [];
    } else {
      socketsSymbols[index].symbols.push(msgPayload.subscribe);
      socketsSymbols[index].symbols = _.flatten(socketsSymbols[index].symbols);
      _.forEach(msgPayload.unsubscribe, (symbol) => {
        socketsSymbols[index].symbols = _.filter(
          socketsSymbols[index].symbols,
          (checkSymbol) => checkSymbol !== symbol
        );
      });
    }
    updateSockets(socketsSymbols);
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
    socketsSymbols = _.filter(socketsSymbols, (socketSymbols) => {
      return socketSymbols.socket !== socket;
    });
    sockets = _.filter(sockets, (currentSocket) => {
      return currentSocket !== socket;
    });
    updateSockets(socketsSymbols);
    // logger.log('info', 'socket disconnected', {
    //   tags: 'socket',
    // });
  });
  socket.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
    // logger.log('error', 'socket connection error', {
    //   tags: 'socket',
    //   additionalInfo: { errorMessage: err.message, err },
    // });
  });
  // logger.log('info', 'new socket connection established', {
  //   tags: 'socket',

  // });
};

const emitDataToSocket = (event, doc) => {
  _.forEach(sockets, (socket) => {
    socket.emit(event, doc);
  });
};

module.exports = {
  emitDataToSocket,
  ioSocketConnection,
};
