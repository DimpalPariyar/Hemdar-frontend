const moment = require('moment/moment');
const {
  instrument: InstrumentModel,
} = require('../model/genericSingleValue.model');
const LotSize = require('../model/fnoLot.model');

module.exports = () => {
  return async (req, res, next) => {
    const advice = req.body;
    if (!advice.strategy || advice.strategy.length === 0) {
      return next();
    }
    const strategy = advice.strategy[0];
    const instrument = await InstrumentModel.findById(advice.instrumentId);
    let trueDataSymbol;
    let kiteSymbol;
    let angelOneSymbol;
    let lotQty;

    if (instrument.hasExpiry && instrument.hasStrikePrice) {
      const date = moment(strategy.expiry, 'DD-MMM-YYYY').format('YYMMDD');
      trueDataSymbol = `${strategy.name}${date}${strategy.strike}${strategy.optionType}`;
    } else if (instrument.hasExpiry && !instrument.hasStrikePrice) {
      const date =
        strategy.expiry &&
        moment(strategy.expiry, 'DD-MMM-YYYY').format('YYMMM').toUpperCase();
      trueDataSymbol = `${strategy.name}${date}FUT`;
    } else {
      trueDataSymbol = strategy.name;
    }

    const DD = moment(strategy.expiry, 'DD-MMM-YYYY').format('DD');
    const MM = moment(strategy.expiry, 'DD-MMM-YYYY').format('MM');
    const MMM = moment(strategy.expiry, 'DD-MMM-YYYY')
      .format('MMM')
      .toUpperCase();
    const YY = moment(strategy.expiry, 'DD-MMM-YYYY').format('YY');

    switch (instrument.name) {
      case 'EQ': {
        kiteSymbol = strategy.name;
        angelOneSymbol = `${strategy.name}-EQ`;
        break;
      }

      case 'OPTIDX': {
        kiteSymbol = `${strategy.name}${YY}${+MM}${DD}${strategy.strike}${
          strategy.optionType
        }`;
        for (let i = 1 ; i<=12;i++){
          const nextMonth = moment().add(i,'month');
          const lastThrusday = nextMonth.endOf('month').day(4).format('DD-MMM-YYYY');
          if(strategy.expiry === lastThrusday){
            kiteSymbol = `${strategy.name}${YY}${MMM}${strategy.strike}${strategy.optionType}`;
          }
        }
        angelOneSymbol = `${strategy.name}${DD}${MMM}${YY}${strategy.strike}${strategy.optionType}`;
        break;
      }

      case 'OPTSTK': {
        kiteSymbol = `${strategy.name}${YY}${MMM}${strategy.strike}${strategy.optionType}`;
        angelOneSymbol = `${strategy.name}${DD}${MMM}${YY}${strategy.strike}${strategy.optionType}`;
        break;
      }

      case 'FUTSTK': {
        kiteSymbol = `${strategy.name}${YY}${MMM}FUT`;
        angelOneSymbol = `${strategy.name}${DD}${MMM}${YY}FUT`;
        break;
      }

      case 'FUTIDX': {
        kiteSymbol = `${strategy.name}${YY}${MMM}FUT`;
        angelOneSymbol = `${strategy.name}${YY}${MMM}FUT`;
        break;
      }
    }

    const expiryForLot = moment(strategy.expiry, 'DD-MMM-YYYY')
      .format('MMM-YY')
      .toUpperCase();
    lotQty = await LotSize.findOne({
      symbol: strategy.name,
      expiry: expiryForLot,
    });

    res.locals.body = res.locals.body || advice;
    res.locals.body.action = strategy.action || advice.action;
    res.locals.body.strategy[0].trueDataSymbol = trueDataSymbol;
    res.locals.body.strategy[0].kiteSymbol = kiteSymbol;
    res.locals.body.strategy[0].angelOneSymbol = angelOneSymbol;
    if (lotQty) {
      res.locals.body.strategy[0].minQty = lotQty.lotSize;
    }
    next();
  };
};
