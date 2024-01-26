const { GoogleSpreadsheet } = require('google-spreadsheet');

const getGoogleSheet = async (sheetId) => {
  try {
    const doc = new GoogleSpreadsheet(sheetId);
    await doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key:
        '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDOA2OjFzfNi0/1\nmgoaxdBExwskbp10kyPiaUlhQ4vTwn8xktKOtJfb7fQ6dcIMC8bF77apmOWzvWiU\n7eEjS3GeR1DLW/g/qyDDq1yRjdStI3882/Yt9foaEl7H1GOeMku6wU/DHvn2EEyd\nv79n1VryKROAQbpTSwX570hj+zSr0vy/n7wKJW0rujMAnb9rOw+7j5bQp654DYSN\nk6REJ0dfmRESERk7DBHE1KhcXsr+gBiWwSX7Bgyv60gt4mQA76DsfNZVv2urLMHO\nTZPzCxFkza/bXE+QIoRG5bF3euzarDw4zxj/C3PySiwSR3Ayu5lm6YyuvgA5Ojau\nFTT3OwpNAgMBAAECggEAHN1ns/24UWHgIbLkEI0/2asj2gZvpFpLcFk9MVYT/Ocn\nCCyguOL/1g5YpmpCdoqd3rTwHIIySQVUZm2QGnBjKoCmht/LgCw7in7zmOdM8bdk\nCARv0U/CK64APrJ5BLzaVH/qa5XnAv2UppOrv2Iq/HwZ4eITt8DuxO6sb2nOnvZP\n6SBHPkVAIrI28dynbuRlFNFx5BXIrA3ujW+OSQMYlkYTv3wzNFbVZ2HOT9IuBCf9\naeLxkwL+qG8lpKYTFf/Q3Jp3L5Ki/oMBRGPDF3R+6Al7BjGHWxUAdJiqtLEge3b3\n36Ma9N56zAc0yBK5zM2D/k/uoT8XCAjqtuAGrfDxhwKBgQD4xJXXa1AeOSGi3zza\n/AhJxq3fN4LwkdnWntVEBxk/xb5RC36Hq+5sTthHTNhh66omW74YMFYt7R4yf00X\nTYCtYgLvsRWr63p5vO10XQa0Bnxt1BMRWfOe3Wm0qURZ5iUPZ0E54FaMwmGP6lps\nEN9CHiPKtCmF7OS5xG300/sc+wKBgQDUAJv0lHLM1lg6X0Dg/XFASMFbjfH3fPD9\nVgTR/1He6kDXw1RdcBz4b+NvlQZBMnNSZymZDJdfpejreopvJLyj7zG94gQadpyA\nCcN/v7xXxxquztRUn5WLxyed7EHxoU9r3UAEOk8Kxk1tGidCV/4/ZYu6nR+AzfIF\nsYak9qPDVwKBgFN3eiMWMYKCfsOsDToYWBuQ2uPLN1bKSQHWtw2lKBaanXmJ1sFk\nsZGLfsulf/CS5rsKCyUIitHL/lbJGa+Y5HTILt4HV5MgZi6UckOZttcOWg9rmZ43\nxSLnfUENjg5vxr19Uog9uixuR9fGtOIPYylG/ZFUk54I1tFxk8cSnO2jAoGAV04s\n64sav8phqSBDCqS0t+F+Z2LMS7xTTjDXaVe48pELxQ82tggOli0Vv4Tif4T0QvIj\nCllKGWSsyBS938mEOgquNGFYiUFhb8UVko12Vbuz/FtGy9awclDAuuNpwMVKfMQv\nsc4FcQ17IzwLAOJV3OvHoEFGkPe+/KNALL05cZ8CgYA4+r6+l2fr8K13MnZDvLzH\n5rpCjNNK5xDGsubrjx6jphebOee/al/v8Q6tHXu64DvqGCvTQViJqS/nWlSGzj/c\nHno9nC85LcSMt7s+dIAXJeZOKOe8EmucqdJW1AnLTvY/BH76egwEkXUs849waHbU\namwHEUCLBN/FSl901DquXw==\n-----END PRIVATE KEY-----\n'
    });

    await doc.loadInfo();
    const worksheet = doc.sheetsByIndex[0];
    return worksheet.getRows();
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = { getGoogleSheet };
