const {
  rtConnect,
  rtDisconnect,
  rtSubscribe,
  rtUnsubscribe,
  rtFeed,
  historical, 
  formatTime
} = require('truedata-nodejs');
const _ = require('lodash');
const Stock = require('../model/stock.model');
const StrategyModel = require('../model/strategy.model');
const moment = require('moment');
const EventEmitter = require('events');
const { default: axios } = require('axios');
const emitter = new EventEmitter();
require('dotenv').config();

let symbols = [];
let webSocketsSymbols = [];
let isTrueDataRunning = false;

function isNonMarketHours() {
  const currentTime = moment();
  const istTime = moment.utc(currentTime).add(5, "hours").add(30, "minutes");
  const isWeekday = istTime.day() >= 1 && istTime.day() <= 5;

  if (isWeekday) {
    return (
      istTime.hours() < 9 ||
      (istTime.hours() === 9 && istTime.minutes() < 15) ||
      istTime.hours() >= 15 ||
      (istTime.hours() === 15 && istTime.minutes() >= 25)
    );
  } else {
    return true;
  }
}

function cacheLtp(ltpData) {
  const trueDataSymbol = ltpData["Symbol"];
  const ltp = ltpData["LTP"];
  // Stock.updateOne({ trueDataSymbol }, { ltp }, { upsert: true }, (error) => {
  //   if (error) {
  //     console.error(error);
  //   }
  // });
  // StrategyModel.updateOne({ trueDataSymbol }, { ltp }, (error) => {
  //   if (error) {
  //     console.error(error);
  //   }
  // });
  // setTimeout(() => {
  //   StrategyModel.updateOne({ trueDataSymbol }, { ltp }, (error) => {
  //     if (error) {
  //       console.error(error);
  //     }
  //   });
  // }, 1000);
}

function startTrueDataServer() {
  isTrueDataRunning = true;
  const user = process.env.TRUE_DATA_USER_NAME;
  const pwd = process.env.TRUE_DATA_PASSWORD;
  const port = process.env.TRUE_DATA_PORT;

  rtConnect(
    user,
    pwd,
    symbols,
    port,
    (bidask = 0),
    (heartbeat = 1),
    (replay = 0)
  );
  rtFeed.on("touchline", touchlineHandler);
  rtFeed.on("tick", tickHandler);
  rtFeed.on("marketstatus", marketStatusHandler);

  function marketStatusHandler(status) {
    // console.log(status);
  }

  function touchlineHandler(touchline) {
    const ids = Object.keys(touchline);
    for (let j = 0; j < ids.length; j++) {
      const data = touchline[ids[j]];
      const ltpData = {
        Symbol: data["Symbol"],
        LTP: data["LTP"],
        isLive: true,
      };
      emitData(ltpData, true);
    }
  }
  function tickHandler(tick) {
    const ltpData = {
      Symbol: tick["Symbol"],
      LTP: tick["LTP"],
      isLive: true,
    };
    emitData(ltpData, true);
  }
}


function updateSockets(socketsSymbols) {
  webSocketsSymbols = socketsSymbols;
  const symbols = _.flatten(
    _.flatMap(webSocketsSymbols, (webSocketSymbols) => webSocketSymbols.symbols)
  );
  updateSymbols(symbols);
}

function stopTrueDataServer() {
  isTrueDataRunning = false;
  rtDisconnect();
}
function updateSymbols(currentList) {
  const updatedList = _.uniq(currentList);
  replayCachedData(symbols);
  console.log(
    "Status: isTrueDataRunning" +
      isTrueDataRunning +
      " updatedList:" +
      updatedList.toString()
  );
  if (!isTrueDataRunning) {
    console.log(
      "updatedList is not empty starting truedata, isTruedataRunning already running: false",
      +updatedList.toString()
    );
    symbols = updatedList;
    startTrueDataServer();
  } else {
    console.log(
      "server is already running updatedList: ",
      +updatedList.toString()
    );
    const unSubscribeList = _.difference(symbols, updatedList);
    rtSubscribe(updatedList);
    if (unSubscribeList.length > 0) rtUnsubscribe(unSubscribeList);
    symbols = updatedList;
  }
  if (isNonMarketHours()) {
    replayCachedData(updatedList);
  }
}


function replayCachedData(currentList) {
  const user = process.env.TRUE_DATA_USER_NAME;
  const pwd = process.env.TRUE_DATA_PASSWORD;
  historical.auth(user, pwd); // For authentication

from = formatTime(2023, 10, 2, 9, 15); // (year, month, date, hour, minute) // hour in 24 hour format
to = formatTime(2023, 13, 5, 9, 15); // (year, month, date, hour, minute) // hour in 24 hour format

  _.forEach(currentList, (symbol) => {
    historical
  .getLTP(symbol)
  .then((res) => {
    // console.log(`Pre Stock data emitted: ${res.symbol}`);
        const data = {
          Symbol: res.symbol,
          LTP: res?.Records[0]?.ltp,
          isLive: false,
        };
        // console.log(data)
        emitData(data, false);
  })
  .catch((err) => console.log(err));
    // StrategyModel.findOne({ trueDataSymbol: symbol }, (error, stock) => {
    //   if (error) {
    //     console.error(error);
    //   } else if (stock) {
    //     console.log(`Pre Stock data emitted: ${stock}`);
    //     const data = {
    //       Symbol: stock.trueDataSymbol,
    //       LTP: stock.ltp,
    //       isLive: false,
    //     };
    //     emitData(data, false);
    //   } else {
    //     console.log(`Stock data not found for symbol: ${symbol}`);
    //   }
    // });
    // commented by jigar after truedata mohit discussion on 12 Oct 2023
  });
}
function emitData(ltpData, shouldCacheLTP) {
  _.forEach(webSocketsSymbols, (unFlattenWebSocketSymbols) => {
    if (
      _.includes(_.flatten(unFlattenWebSocketSymbols.symbols), ltpData.Symbol)
    ) {
      unFlattenWebSocketSymbols.socket.emit("LTP", ltpData);
    }
  });
  // if (shouldCacheLTP) {
  //   cacheLtp(ltpData);
  // }
}

function getSymbolData(currentList) {
  const updatedList = _.uniq(currentList);
  replayCachedDatawithoutSocket(symbols)
  console.log(
    'Status: isTrueDataRunning' +
      isTrueDataRunning +
      ' updatedList:' +
      updatedList.toString()
  );
  if (!isTrueDataRunning) {
    console.log(
      'updatedList is not empty starting truedata, isTruedataRunning already running: false',
      +updatedList.toString()
    );
    symbols = updatedList;
    startTrueDataServerwithoutSocket();
  } else {
    console.log(
      'server is already running updatedList: ',
      +updatedList.toString()
    );
    const unSubscribeList = _.difference(symbols, updatedList);
    rtSubscribe(updatedList);
    if (unSubscribeList.length > 0) rtUnsubscribe(unSubscribeList);
    symbols = updatedList;
  }
  if (isNonMarketHours()) {
    replayCachedDatawithoutSocket(updatedList);
  }
}

function replayCachedDatawithoutSocket(currentList) {
  _.forEach(currentList, (symbol) => {
    // Stock.findOne({ trueDataSymbol: symbol }, (error, stock) => {
    //   if (error) {
    //     console.error(error);
    //   } else if (stock) {
    //     console.log(`Pre Stock data emitted: ${stock}`);
    //     const data = {
    //       Symbol: stock.trueDataSymbol,
    //       LTP: stock.ltp,
    //       isLive: false,
    //     };
    //     emitDatawithoutSocket(data)
    //   } else {
    //     console.log(`Stock data not found for symbol: ${symbol}`);
    //   }
    // });
  });
}
function startTrueDataServerwithoutSocket() {
  isTrueDataRunning = true;
  const user = process.env.TRUE_DATA_USER_NAME;
  const pwd = process.env.TRUE_DATA_PASSWORD;
  const port = process.env.TRUE_DATA_PORT;

  rtConnect(
    user,
    pwd,
    symbols,
    port,
    (bidask = 0),
    (heartbeat = 1),
    (replay = 0)
  );
  rtFeed.on('touchline', touchlineHandler);
  rtFeed.on('tick', tickHandler);
  rtFeed.on('marketstatus', marketStatusHandler);

  function marketStatusHandler(status) {
    // console.log(status);
  }

  function touchlineHandler(touchline) {
    const ids = Object.keys(touchline);
    for (let j = 0; j < ids.length; j++) {
      const data = touchline[ids[j]];
      const ltpData = {
        Symbol: data['Symbol'],
        LTP: data['LTP'],
        isLive: true,
      };
      emitDatawithoutSocket(ltpData);
    }
  }
  function tickHandler(tick) {
    const ltpData = {
      Symbol: tick['Symbol'],
      LTP: tick['LTP'],
      isLive: true,
    };
    emitDatawithoutSocket(ltpData);
  }
}
function emitDatawithoutSocket(ltpData){
  emitter.emit('livedata',ltpData)
  rtUnsubscribe(ltpData.Symbol)
  stopTrueDataServer()
}

const  getLiveOptionChain = async(nameOfUnderlying,expiry)=>{
  const user = process.env.TRUE_DATA_USER_NAME;
  const pwd = process.env.TRUE_DATA_PASSWORD;
  const base_url = 'https://analytics.truedata.in/api/'
  try {
    const {access_token}=await getTruedataAcessToken(user,pwd)
    console.log(nameOfUnderlying,expiry)
    // Parse the original date with the input format
const parsedDate = moment(expiry, "DD-MMM-YYYY");

// Format the date with the desired format
const formattedDate = parsedDate.format("DD-MM-YYYY");
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${base_url}getoptionchain?symbol=${nameOfUnderlying}&expiry=${formattedDate}`,
      headers: { 
        "Authorization": `Bearer ${access_token}`, 
        'Content-Type': 'application/json'
      }
    };
    const getOptionChain =await axios.request(config);
    return getOptionChain.data
  } catch (error) {
    console.log(error)
  }
}
const getTruedataAcessToken = async (user, pwd) => {
  try {
    const data = `username=${user}&password=${pwd}&grant_type=password`;

    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };

    const response = await axios.post('https://auth.truedata.in/token', data, config);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
const getliveStockRate = async(symbol)=>{
  const user = process.env.TRUE_DATA_USER_NAME;
  const pwd = process.env.TRUE_DATA_PASSWORD;
  historical.auth(user, pwd); // For authentication

from = formatTime(2023, 10, 2, 9, 15); // (year, month, date, hour, minute) // hour in 24 hour format
to = formatTime(2023, 12, 5, 9, 15); // (year, month, date, hour, minute) // hour in 24 hour format
   let stockprice
  try {
    await historical
    .getLTP(symbol)
    .then((res) => {
      stockprice = res.Records[0]
      })
    .catch((err) => console.log(err));
    return stockprice
} catch (error) {
  
}
}
module.exports = { updateSockets ,getSymbolData,emitter,getLiveOptionChain,getliveStockRate};
