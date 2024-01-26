const mongoose = require('mongoose');
const HostProfileModel = require('../model/hostProfile.model');

const ishostProfileExists = async (req, res, next) => {
  try {
    const hostProfileId = req.params.hostProfileId;

    const isHostExist = await HostProfileModel.exists({
      hostProfileId: hostProfileId,
    });
    if (!isHostExist) {
      return res.status(422).json({
        success: false,
        message: `No HostProfile found with hostProfileId: ${hostProfileId}`,
      });
    }
    next();
  } catch (e) {
    console.log(e);
    next(e);
  }
};

module.exports = {
  ishostProfileExists,
};
