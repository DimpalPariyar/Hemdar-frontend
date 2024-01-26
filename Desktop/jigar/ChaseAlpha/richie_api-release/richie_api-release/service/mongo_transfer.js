// const logger = require('../utils/logger');
let urlSource = process.env.PROD_MONGODB_URI;
let dbSource = process.env.PROD_DB_SOURCE;
let collectionSource = [
  'advice',
  'advice_statuses',
  'articles',
  'betaaccesses',
  'brokers',
  'coupons',
  'exchanges',
  'expirydates',
  'hostprofiles',
  'instruments',
  'languages',
  'levels',
  'links',
  'lotsizes',
  'markets',
  'notifications',
  'prices',
  'privacyagreements',
  'products',
  'producttypes',
  'programsessions',
  'stocks',
  'strategies',
  'strikeprices',
  'supercourses',
  'symbols',
];
let MongoClientSource = require('mongodb').MongoClient;

let urlTarget = process.env.CLONE_MONGODB_URI;
let dbTarget = process.env.CLONE_DB_SOURCE;
let MongoClientTarget = require('mongodb').MongoClient;

async function copyDocumentsInChunks(skip, count, dbProd, dbDev, collection) {
  try {
    if (skip >= count) {
      return;
    }

    const result = await dbProd
      .collection(collection)
      .find({})
      .sort({ _id: 1 })
      .skip(skip)
      .toArray();

    await insertDocuments(result, dbDev, collection);
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}

async function insertDocuments(documents, dbDev, collection) {
  try {
    await dbDev.collection(collection).insertMany(documents);
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}

async function countDocumentsDBSource(callback) {
  try {
    const mongoProd = await MongoClientSource.connect(urlSource, {
      useNewUrlParser: true,
    });
    const mongoDev = await MongoClientTarget.connect(urlTarget, {
      useNewUrlParser: true,
    });
    let dbProd = mongoProd.db(dbSource);
    let dbDev = mongoDev.db(dbTarget);
    for (const collection of collectionSource) {
      const skip = await dbDev.collection(collection).countDocuments();
      const count = await dbProd.collection(collection).countDocuments();

      await callback(skip, count, dbProd, dbDev, collection);
    }
    mongoProd.close();
    mongoDev.close();
    // logger.log('info', 'database transfer successful', {
    //   tags: 'cloning',
    // });
  } catch (error) {
    console.log(error);
    // logger.log('error', 'database transfer error', {
    //   tags: 'cloning',
    //   additionalInfo: { errorMessage: error.message, error },
    // });
    throw new Error(error);
  }
}

module.exports = { countDocumentsDBSource, copyDocumentsInChunks };
