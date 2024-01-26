const BhavCopy = require("../service/nse_bhav");
const {instrument: InstrumentModel} = require("../model/genericSingleValue.model");
const SymbolModel = require("../model/symbol.model")
const ExpiryDateModel = require("../model/expiryDate.model")
const StrikePriceModel = require("../model/strikePrice.model")
const LotSize = require("../model/fnoLot.model")
const moment = require('moment-timezone');
const {sendService} = require("../service/slack_service");
const _ = require("lodash");
const request = require('request');
const util = require('util');
const csv = require('csvtojson/v2');
const bhavCopyRequestFO = new BhavCopy({
    type: 'json', dir: 'NSE', market: 'FO'
});
const bhavCopyRequestEQ = new BhavCopy({
    type: 'json', dir: 'NSE', market: 'EQ'
});

async function deleteRecordsThatAreNotUpdated() {
    const collections = [InstrumentModel, SymbolModel, ExpiryDateModel, StrikePriceModel]
    _.forEach(collections, collection => {
        deleteCollectionNotUpdatedInTwoDays(collection)
    })
}

async function deleteCollectionNotUpdatedInTwoDays(Collection) {
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 1); // Set the date to 1 day ago
    Collection.find({updatedAt: {$lt: twoDaysAgo}}, (err, docs) => {
        if (err) {
            console.error(err);
            return;
        }
        Collection.deleteMany({_id: {$in: docs.map(doc => doc._id)}}, (err, result) => {
            if (err) {
                console.error(err);
            }
        });
    });
}

async function downloadJson(today, bhavCopy) {
    const jsonData = await bhavCopy
        .download({
            month: today.format('MMM').toUpperCase(), year: today.format('YYYY'), day: today.format('DD')
        })
    const data = jsonData[0];
    if (!Array.isArray(data)) {
        return downloadJson(today.subtract(1, 'days'))
    } else {
        return data
    }
}

async function downloadBhav(today) {
    const data = await downloadJson(today, bhavCopyRequestFO)
    const promiseFOChain = data.reduce((chain, row) => {
        return chain.then(async () => {
            const hasExpiry = row["INSTRUMENT"].includes("FUT") || row["INSTRUMENT"].includes("OPT")
            const hasStrikePrice = row["INSTRUMENT"].includes("OPT")
            const data = {
                name: row["INSTRUMENT"],
                hasExpiry,
                hasStrikePrice
            }      
            const instrument = await InstrumentModel.findOneAndUpdate({name: row["INSTRUMENT"]}, // query
                {
                    $set: data
                }, {
                    upsert: true, new: true
                });
            const symbol = await SymbolModel.findOneAndUpdate({name: row["SYMBOL"]}, // query
                {
                    $set: {name: row["SYMBOL"]}, $addToSet: {instruments: instrument._id}
                }, {
                    upsert: true, new: true
                });
            const expiryDt = await ExpiryDateModel.findOneAndUpdate({name: row["EXPIRY_DT"]}, // query
                {
                    $set: {name: row["EXPIRY_DT"], expiryDate: moment(row["EXPIRY_DT"], 'DD-MMM-YYYY').toDate()},
                    $addToSet: {
                        instruments: instrument._id, symbols: symbol._id,
                    }
                }, {
                    upsert: true, new: true
                });          
            await StrikePriceModel.findOneAndUpdate({name: row["STRIKE_PR"]}, // query
                {
                    $set: {name: row["STRIKE_PR"]}, $addToSet: {
                        instruments: instrument._id, symbols: symbol._id, expiryDates: expiryDt._id,
                    }
                }, {
                    upsert: true, new: true
                });
        });
    }, Promise.resolve());
    const dataEQ = await downloadJson(today, bhavCopyRequestEQ)
    const promiseEQChain = dataEQ.reduce((chain, row) => {
        return chain.then(async () => {
            const data = {
                name: "EQ"
            }
            const instrument = await InstrumentModel.findOneAndUpdate({name: "EQ"}, // query
                {
                    $set: data
                }, {
                    upsert: true, new: true
                });
            if (row["SERIES"] === "EQ") {
                await SymbolModel.findOneAndUpdate({name: row["SYMBOL"]}, // query
                    {
                        $set: {name: row["SYMBOL"]}, $addToSet: {instruments: instrument._id}
                    }, {
                        upsert: true, new: true
                    });
            }
        });
    }, Promise.resolve());
    await promiseFOChain
    await promiseEQChain
    await updateLotSize()
    await deleteRecordsThatAreNotUpdated();
    await sendService("BhavCopy is updated now for the date: " + moment(today).format('DD/MM/YYYY'));
}

const requestPromise = util.promisify(request);

async function updateLotSize() {
    const url = 'https://archives.nseindia.com/content/fo/fo_mktlots.csv';

    try {
        const { body } = await requestPromise(url);
        const json = await csv().fromString(body);

        const promises = json.map(async (row) => {
            const keys = Object.keys(row);
            for (const key of keys) {
                if (key !== "SYMBOL" && key !== "UNDERLYING") {
                    const value = parseInt(row[key]);
                    if (value && typeof value === "number") {
                        await LotSize.findOneAndUpdate({ symbol: row["SYMBOL"], expiry: key }, { $set: { lotSize: value } }, { upsert: true, new: true });
                    }
                }
            }
        });

        await Promise.all(promises);
    } catch (error) {
        console.error(error);
    }
}

const downloadLatestCopy = async (req, res, next) => {
    await sendService("Bhavcopy update started");
    req.setTimeout(300000);
    const IST = 'Asia/Kolkata';
    const latestWeekday = moment.tz(new Date(), IST);
    let hours = new Date().getHours();
    let prevDate = (hours < 20) ? latestWeekday.subtract(1, 'days') : latestWeekday
    while (prevDate.isoWeekday() > 5) {
        prevDate = prevDate.subtract(1, 'days');
    }
    try {
        await downloadBhav(prevDate);
        console.log(prevDate);
        return res.status(200).json({success: true});
    } catch (e) {
        next(e)
    }
}

module.exports = {
    downloadLatestCopy
}