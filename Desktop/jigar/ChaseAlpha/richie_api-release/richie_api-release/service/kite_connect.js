const KiteConnect = require('kiteconnect').KiteConnect;

const generateLoginUrl = ({ apiKey }) => {
  const options = {
    api_key: apiKey,
  };
  const kc = new KiteConnect(options);

  return kc.getLoginURL();
};
const generateAccessToken = async ({ apiKey, apiSecret, requestToken }) => {
  const options = {
    api_key: apiKey,
  };
  const kc = new KiteConnect(options);

  try {
    const { access_token } = await kc.generateSession(requestToken, apiSecret);
    return access_token;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getZerodhaUserProfile = async(apiKey,accessToken)=>{
  const options = {
    api_key: apiKey,
    access_token: accessToken,
  };
  const kc = new KiteConnect(options)
  try {
    const userProfile = await kc.getProfile()
    const userHolding = await kc.getHoldings()
    const getPositions = await kc.getPositions()
    const getMargin = await kc.getMargins()
    const getOrders = await kc.getOrders()
    const getTradebook = await kc.getTrades()
    return {userProfile,userHolding,getPositions,getMargin,getOrders,getTradebook} 
  } catch (error) {
    console.log(error)
  }
}
// const getZerodhaUserPosition = async (apiKey, accessToken)=>{
//   const options = {
//     api_key: apiKey,
//     access_token: accessToken,
//   };
//   const kc = new KiteConnect(options)
//   try {
//     const userHolding = await kc.getHoldings()
//     const getPositions = await kc.getPositions()
//     const getMargin = await kc.balance
//     return {userProfile,userHolding,getPositions,getMargin} 
//   } catch (error) {
//     console.log(error)
//   }
// }
const PlaceZerodhaTradeOrder = async (apiKey,accessToken,OrderDetails)=>{
  const options = {
    api_key: apiKey,
    access_token: accessToken,
  };
  const kc = new KiteConnect(options)
  try {
  const {
    tradingsymbol,
    exchange,
    transaction_type,
    order_type,
    quantity,
    product,
    validity,
  } = OrderDetails;
   const orderID = await kc.placeOrder(
    variety="regular"
    ,{
      tradingsymbol,
    exchange,
    transaction_type,
    order_type,
    quantity,
    product,
    validity
  }
   )
   return orderID
 } catch (error) {
  console.log(error)
 }
}
module.exports = { generateLoginUrl, generateAccessToken,getZerodhaUserProfile,PlaceZerodhaTradeOrder};
