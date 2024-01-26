
const cartModel = require('../model/cart.model');
const CouponModel = require('../model/coupon.model')
const moment = require('moment');
const userModel = require('../model/user.model');

const CreateCoupon= async(req,res,next)=>{
    const {couponCode} = req.body

  try{
     const couponExist = await CouponModel.findOne({
      $or:[{couponCode}]
     })
   
      if(couponExist){
        return next({
            message:'coupon already exist please try another coupon code',
            status:409
        })
      }
      await CouponModel.create(req.body);
      res.status(200).send({message:'coupon created successfully'})


  }catch(error){
    console.log(error);
    next(error)
  }

}

const getAllCoupon = async(req,res,next)=>{
  let query = res.locals.query || {};
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const search = req.query.search;
  try{
    const count = await CouponModel.countDocuments(query);
    if (search) {
      const regex = new RegExp(search, 'i');
      const filter = {
        $or: [
          { email: regex },
          { mobile: regex },
          { firstName: regex },
          { lastName: regex },
        ],
      };
      const accessIds = await CouponModel.find(filter, '_id');
       query._id = { $in: accessIds.map((access) => access._id) };
    }
    const sort = { _id: -1 };
    const options = { sort };
    if (!isNaN(page) && !isNaN(limit)) {
      options.skip = (page - 1) * limit;
      options.limit = limit;
    }
    const totalPages = Math.ceil(count / limit);
      const data = await CouponModel.find({ ...query})
      .sort(options.sort)
      .limit(options.limit)
      .skip(options.skip);
      const result = {
      page: page,
      size: data.length,
      total: count,
      pageTotal: totalPages,
      items: data,
    };
    res.status(200).send(result);
      if(!data){
        res.status(404).send({message:'coupon list not found'})
      }
  }catch(e){
    console.log(e);
    next(e)
  }
}

const getUserCoupon = async (req, res, next) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  let user = res.locals.user;
  if(req.query.userId){
    user = await userModel.findById(req.query.userId)
  }
  try {
    const count = await CouponModel.countDocuments()
    const sort = { _id: -1 };
    const options = { sort };
    if (!isNaN(page) && !isNaN(limit)) {
      options.skip = (page - 1) * limit;
      options.limit = limit;
    }
     const totalPages = Math.ceil(count / limit);
    const pipeline = [
      {
        $match: {
          $or: [
            { allowedEmail: { $in: [user?._id] } },
            { allowedEmail: { $exists: false } },
            { allowedEmail: { $size: 0 } },
            {listOfProduct: {
              $elemMatch: {
                $in: user?.subscribedAdvisories?.map(advice => advice._id)
              }
            }}
          ]
        }
      },
      {
        $match: {
          $and: [
            { couponExpiry: { $gt: new Date() } },
            { enableCoupon: true }
          ]
        }
      }
    
    ];
    const filteredCoupons = await CouponModel.aggregate(pipeline)
      .sort(options.sort)
      .limit(options.limit)
      .skip(options.skip);
      const result = {
      page: page,
      size: filteredCoupons.length,
      total: count,
      pageTotal: totalPages,
      items: filteredCoupons,
    };
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
};


const getSingleCoupon = async (req, res, next) => {
  let id = req.params.id;
  try {
    if (id) {
      const data = await CouponModel.findById(id);
      res.status(200).send(data);
    }
  } catch (e) {
    res.status(400).send(e);
  }
};


const UpdateCoupon = async (req, res, next) => {
  let id = req.params.id;
  const data = req.body;
  try {
    CouponModel.findByIdAndUpdate(id, data).then((data) => {
      if (!data) {
        res.status(400).send({
          message: 'cannot update OrderModel',
        });
      } else res.status(200).send(data);
    });
  } catch (e) {
    res.status(500).send({ message: 'server error' });
  }
};

const ApplyCoupon = async(req,res,next)=>{
  const couponcode = req.body.couponcode
  const cartId = req.body.cartId
  const userId = res.locals.user._id
  try {
    const Coupon = await CouponModel.findOne({couponCode:couponcode})
    const CouponExpiry = Coupon.couponExpiry
    if(!Coupon){
      return res.status(400).send({
        message:'No such Coupon to apply'
      })
    }
    if(Coupon.redeemUserId.includes(userId)){
      return res.status(404).send({
        message:'This coupon is redeemed already'
      })
    }
    if(!moment(CouponExpiry, moment.ISO_8601).isAfter(moment())){
      res.status(401).send({
        message:'Coupon has expired'
      })
    }else{
      const cart = await cartModel.findById(cartId)
      if(!(cart.amount >= Coupon.minSpend)){
        res.status(404).send({
          message:`'Your Cart Amount must be greater than ${Coupon.minSpend}'`
        })
      }else{
       
        let discountedPrice
        if(Coupon.percentage){
          discountedPrice = (cart.subscriptionPlanId.discountedPrice ??
            cart.subscriptionPlanId.actualPrice)*(Coupon.percentage/100)
            console.log(cart.subscriptionPlanId.discountedPrice,cart.subscriptionPlanId.actualPrice)
        }
        if(Coupon.amount){
          discountedPrice = Coupon.amount
        }
        cart.amount = ((cart.subscriptionPlanId.discountedPrice ?? cart.subscriptionPlanId.actualPrice) - discountedPrice)
        cart.couponId = Coupon._id
        cart.save()
        let  gst9percent = cart.amount * 0.09
        res.status(200).send({
          message:'Coupon applied successfully',
          billTotal:cart.amount+gst9percent+gst9percent,
          igst:gst9percent,
          cgst:gst9percent,
          Coupondiscount:discountedPrice,
          CouponCode:Coupon.couponCode   
        })
      }
    }
  } catch (error) {
  }
}
const RemoveCoupon = async(req,res,next)=>{
  const couponcode = req.body.couponcode
  const cartId = req.body.cartId
  const userId = res.locals.user._id
  try {
    const Coupon = await CouponModel.findOneAndUpdate({couponCode:couponcode},{$pull:{redeemUserId:userId}})
    const existingCart = await cartModel.findOneAndUpdate( {_id:cartId}, {$unset:{couponId:1}}).populate('subscriptionPlanId')
    if(existingCart.couponId){
      let gst9percent
      let billTotal
      gst9percent =
      ((existingCart.subscriptionPlanId.discountedPrice ??
        existingCart.subscriptionPlanId.actualPrice) *
        9) /
      100;
    billTotal =
      (existingCart.subscriptionPlanId.discountedPrice ??
        existingCart.subscriptionPlanId.actualPrice) +
      gst9percent * 2;
       existingCart.amount = billTotal
       existingCart.save()
      if(existingCart){
        res.status(200).send({
          message:'coupons removed successfully',
          billTotal,
          igst:gst9percent,
          cgst:gst9percent
        })
      }else{
        res.status(400).send({
          message:'something went wrong'
        })
      }
      }else{
        res.status(401).send({message:'There is no coupon to remove'})
      }
  } catch (error) {
    console.log(error)
  }
}
module.exports={
    CreateCoupon,
    getAllCoupon,
    getSingleCoupon,
    UpdateCoupon,
    ApplyCoupon,
    RemoveCoupon,
    getUserCoupon
}

