const panService = require("../service/digio_service");
const PanModel = require("../model/pan.model");
const {validationResult} = require("express-validator");
const UserModel = require("../model/user.model");

const verifyPan = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            "success": false,
            "message": "Check errors below",
            errors: errors.array()
        });
    }
    const count = await UserModel.countDocuments({panNumber: req.body.panNumber})
    if (count > 0) {
        next({
            status: 409,
            message: "PAN is already used by another User"
        });
    } else {
        try {
            const name = await panService.getPanName(req.body.panNumber)
            if (name) {
                const userId = res.locals.user._id
                await PanModel.deleteOne({user: userId})
                const panCard = new PanModel({
                    user: userId, panNumber: req.body.panNumber, name: name
                })
                await panCard.save();
                res.status(200).send({
                    "success": true, "name": name
                })
            } else {
                res.status(422).send({
                    "success": false, "message": "Pan verification failed",
                })
            }
        } catch (e) {
            console.log(e);
            next(e)
        }
    }
};

module.exports = {
    verifyPan
};