const express = require('express');
const _ = require('lodash');
const programSessionModel = require('../model/programSession.model');
const { deleteWebinar } = require('../service/zoom_meeting');
const SubscriptionModel = require('../model/subscription.model')
const UserModel = require('../model/user.model')
require('dotenv').config();
const moment = require('moment');
const { checkUpdateAdvicePermission } = require('../utils/checkAuth');
const { createMessage } = require('./chat.controller');


module.exports = (Collection) => {
  // ======
  // Create
  // ======
  const create = (req, res) => {
    const newEntry = res.locals.body || req.body;
    Collection.create(newEntry, (e, newEntry) => {
      if (e) {
        console.log(e);
        res.status(500).send({
          success: false,
          message: e.message,
        });
      } else {
        Collection.findById(newEntry._id, (e, result) => {
          if (e) {
            res.send(newEntry);
          } else if (!result) {
            res.send(newEntry);
          } else {
            if(Collection.modelName === 'advice'){
                  const description = `${result?.nameOfUnderlying} ${
                    result.strategy[0]?.expiry === null
                      ? ""
                      : result.strategy[0]?.expiry
                  } ${result.strategy[0]?.strike === null?'':result.strategy[0]?.strike} ${
                    result.strategy[0]?.optionType === null?'':result.strategy[0]?.optionType
                  } Entry ${result.entryLowerRange} - ${
                    result.entryUpperRange
                  } SL${result.stopLoss} Target ${result?.target1?result?.target1:""} - ${
                    result?.target2?result?.target2:''
                  } - ${result?.target3?result?.target3:''}`;
                  const chatmessage = {
                    messageTypeId: "65014f94337000118fe8ec05",
                    messageType: "advice",
                    title: result.advisoryId.productTitle,
                    description: description,
                    adviceId: result._id,
                    adviceType: result.advisoryId.productTitle,
                    productId: [result.advisoryId._id.toString()],
                    productType: [result.advisoryId.productTitle],
                    subscription: true,
                  };
                  createMessage(chatmessage)
                    .then()
                    .catch((err) => {
                      console.log("error:", err);
                    });
            }
            res.send(result);
          }
        });
      }
    });
  };

  // =========
  // Read many
  // =========
  const readMany = async(req, res) => {
    let query = res.locals.query || {};
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const fieldsToPopulate = _.join(res.locals.fieldsToPopulate, ',');
    const purchased = res.locals.purchased;
    const sort = res.locals.sort || { _id: -1 };
    try {
      const userId = res.locals.user?._id
      const researchAdmin = await UserModel.findOne({_id:userId})
      if(researchAdmin?.createAccess?.product){
        query = 
        { productTitle: { $in: researchAdmin.createAccess?.product } }
      }
      if(researchAdmin?.createAccess?.product?.length === 0){
        query = {productTitle:{$in:[]}}
      }
      
    } catch (error) {
      console.log(error)
    }



   
    if (!isNaN(page) && !isNaN(limit)) {
      Collection.find(query, null, {
        sort,
        skip: (page - 1) * limit,
        limit: limit,
      })
        .populate(fieldsToPopulate)
        .lean()
        .exec((e, result) => {
          if (e) {
            res.status(500).send(e);
            console.log(e.message);
          } else {
            if (purchased) { 
              result = _.map(result, (item) => {
                item.purchased = purchased.includes(item._id.toString());
                return item;
              });
              res.send(result);
            } else {        
              res.send(result);
            }
          }
        });
    } else {
      Collection.find(query, null, { sort })
        .populate(fieldsToPopulate)
        .lean()
        .exec(async(e, result) => {
          
          if(sort.expiryDate === 'asc'){
                result = _.filter(result, (item)=>{
                  const date = moment(item.expiryDate,'YYYY-MM-DDTHH:mm:ss.SSSZ')
                  return date.isSameOrAfter(moment(),'day')
                })
              }

                if(Collection.modelName ==="advice"){
                const id = res.locals.user._id
                try{
                  const subscriptions = await SubscriptionModel.find({userId:id})
                    result = _.filter(result,(item)=>{
                      return _.some(subscriptions,(time)=>{
                        if(item.status !== 'open')return moment(item.createdAt).isAfter(time.startTime) // need to change the date with time.startTime
                        if(item.status === 'open') return true
                         })
                         })
                  if(subscriptions.length === 0){
                    return res.status(408).send({message:'There is not Active subscription'})
                  }
                }catch(e){
                  console.log(e)
                }
                
              }
          if (e) {
            res.status(500).send(e);
            console.log(e.message);
          } else {
            if (purchased) {
              result = _.map(result, (item) => {
                item.purchased = purchased.includes(item._id.toString());
                return item;
              });         
              res.send(result)
            } else {
             if(result.length === 0){
              return res.status(400).send({
                message:'There is no advice to Show'
              })
             }
              res.send(result);
            }
          }
        });
    }
  };

  // ========
  // Read one
  // ========
  const readOne = async(req, res) => {
    const { _id } = req.params;
    try {
      const researchAdmin = await UserModel.findById(res.locals.user?._id)
      
        if(researchAdmin?.updateAccess){
          let response = await checkUpdateAdvicePermission(_id,res.locals.user?._id)
          if(researchAdmin.type.includes(0)){
            response=true
          }
          if(response){
            Collection.findById(_id, (e, result) => {
              if (e) {
                res.status(500).send(e);
                console.log(_id + ' failed: ' + e.message);
              } else if (!result) {
                console.log(_id + ' is Not found');
                res.status(404).send({
                  success: false,
                  message: _id + ' Not Found',
                });
              } else {
                res.send(result);
              }
            });
          }else{
            res.status(403).send({message:'Ask Admin to Grant Permission'})
          }
        }else{
          res.status(404).send({message:'User Not found'})
        }
    } catch (error) {
      console.log(error)
    }

    
  };

  // ======
  // Update
  // ======
  const update = (req, res) => {
    const changedEntry = req.body;
    Collection.findOneAndUpdate(
      { _id: req.params._id },
      { $set: changedEntry },
      { new: true },
      (e, data) => {
        if (e) res.sendStatus(500);
        else if (!data) {
          res.status(404).send({
            success: true,
            message: req.params._id + ' is not found',
          });
        } else {
          res.status(200).send(data);
        }
      }
    );
  };

  // ======
  // Remove
  // ======
  const remove = async (req, res) => {
    try {
      await programSessionModel
        .findById(req.params._id)
        .select('webinarId')
        .then((data) => {
          data && deleteWebinar(data.webinarId);
        });
    } catch (e) {
      console.log(e);
    }
    try {
      Collection.deleteOne({ _id: req.params._id }, (e) => {
        if (e) {
          console.log(e);
          res.status(500).send(e);
        } else {
          res.status(200).send({
            success: true,
            message: req.params._id + ' is removed',
          });
        }
      });
    } catch (e) {
      console.log(e);
    }
  };

  // ======
  // Routes
  // ======

  let router = express.Router();

  router.post('/', create);
  router.get('/', readMany);
  router.get('/:_id', readOne);
  router.put('/:_id', update);
  router.delete('/:_id', remove);

  return router;
};
