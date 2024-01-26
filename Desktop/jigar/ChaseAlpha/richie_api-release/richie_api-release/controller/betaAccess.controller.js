const BetaAcessModel = require('../model/betaAccess.model');
const { validationResult } = require('express-validator');
const { getGoogleSheet } = require('../service/google_spreadsheet');

const registerForAccess = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Check errors below',
      errors: errors.array(),
    });
  }
  const { email, mobile } = req.body;
  try {
    const userExists = await BetaAcessModel.findOne({
      $or: [{ email }, { mobile }],
    });

    if (userExists) {
      return next({
        message: 'User already registered for beta',
        status: 409,
      });
    }
    await BetaAcessModel.create(req.body);
    res.status(200).send({ message: 'Registration for beta successful' });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getAllRegisteredUsers = async (req, res, next) => {
  let query = res.locals.query || {};
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const search = req.query.search;
  try {
    const count = await BetaAcessModel.countDocuments(query);
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
      const accessIds = await BetaAcessModel.find(filter, '_id');
      query._id = { $in: accessIds.map((access) => access._id) };
    }
    const sort = { _id: -1 };
    const options = { sort };
    if (!isNaN(page) && !isNaN(limit)) {
      options.skip = (page - 1) * limit;
      options.limit = limit;
    }
    const users = await BetaAcessModel.find(query)
      .sort(options.sort)
      .limit(options.limit)
      .skip(options.skip);

    const totalPages = Math.ceil(count / limit);

    const result = {
      page: page,
      size: users.length,
      total: count,
      pageTotal: totalPages,
      items: users,
    };
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const updateUserBetaAccess = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Check errors below',
      errors: errors.array(),
    });
  }
  const { id: userId } = req.params;
  const { enable } = req.body;
  try {
    const user = await BetaAcessModel.findById(userId);
    if (!user) {
      return next({
        status: 404,
        message: 'No registered user found',
      });
    }
    user.enable = enable;
    await user.save();
    res.status(200).send({ message: 'User beta access updated' });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const deleteBetaAccess = async (req, res, next) => {
  const { id: userId } = req.params;
  try {
    const user = await BetaAcessModel.findById(userId);
    if (!user) {
      return next({
        status: 404,
        message: 'No registered user found',
      });
    }
    await user.remove();
    res.status(200).send({ message: 'User access deleted successfully' });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const updateBetaAccessEntries = async (req, res, next) => {
  try {
    const lastEntry = await BetaAcessModel.findOne().sort({ row: -1 });
    const rows = await getGoogleSheet(process.env.SPREAD_SHEET_ID);
    let srNo = 1;
    if (lastEntry && lastEntry.srNo) {
      srNo = +lastEntry.srNo + 1;
    }
    const newUsers = rows.filter((row) => {
      return lastEntry && lastEntry.row
        ? row._rowNumber > lastEntry.row
        : row._rowNumber > 1;
    });
    const userDetails = newUsers.map((row) => {
      const [
        registeredAt,
        email,
        firstName,
        lastName,
        mobile,
        device,
        interests,
        tradingCapital,
        brokerAccounts,
      ] = row._rawData;
      const userRequestData = {
        srNo,
        registeredAt,
        email,
        firstName,
        lastName,
        mobile,
        tradingCapital,
        device,
        interests: interests?.split(','),
        brokerAccounts: brokerAccounts?.split(','),
        row: row._rowNumber,
      };
      srNo++;
      return userRequestData;
    });
    await BetaAcessModel.create(userDetails);
    res.status(200).send({
      message: 'Updated successfully',
      lastEntry,
      userDetails,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const bulkAccess = async (req, res, next) => {
  const { enable } = req.body;
  try {
    await BetaAcessModel.updateMany({
      enable,
    });
    res.status(200).send({
      message: `Beta access ${enable ? 'enabled' : 'disabled'}`,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = {
  registerForAccess,
  getAllRegisteredUsers,
  updateUserBetaAccess,
  deleteBetaAccess,
  updateBetaAccessEntries,
  bulkAccess,
};
