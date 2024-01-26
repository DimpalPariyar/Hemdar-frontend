const {emitDataToSocket} = require("../service/socket_io_service");
const conn = require("../service/mongo.db");
const CartModel = require("../model/cart.model");
const {sendService} = require("../service/slack_service");
require("dotenv").config();

const reset = async (req, res, next) => {
    const isTest = process.env.NODE_ENV !== "production"
    if (isTest) {
        try {
            conn.dropDatabase()
                .then(() => {
                    res.send({"success":true,"message":'Database deleted'});
                })
                .catch(err => {
                    res.status(500).send(err);
                });
        } catch (e) {
            next(e)
        }
    } else {
        return res.status(405).send({"message": "You are trying to reset Development"})
    }
}

const changeOrderDocumentId = async (req, res, next) => {
    const isTest = process.env.NODE_ENV !== "production"
    if (isTest) {
        try {
            const {id, replaceDocId} = req.body
            await CartModel.updateOne({_id: id}, {documentId: replaceDocId});
            return res.status(200).send({
                "success": true, "message": "Changed Document"
            })
        } catch (e) {
            next(e)
        }
    } else {
        return res.status(405).send({"message": "You are trying to reset Development"})
    }
}

const testNotification = async (req, res, next) => {
    emitDataToSocket("TEST",{"message": "Hello Richie app"})
    res.status(200).send({"status": "Notification thrown"})
}

const notifySlack = async (req, res, next) => {
    await sendService("Local postman unit test all passed")
    res.status(200).send({"status": "Notification thrown"})
}

module.exports = {
    reset,
    changeOrderDocumentId,
    testNotification,
    notifySlack
};