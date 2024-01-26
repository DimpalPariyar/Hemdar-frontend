const { getGSTInfo } = require('../service/digio_service');

const getGSTDetails = async (req, res, next) => {
  const { gstNo } = req.query;
  if (!gstNo) {
    next({
      message: 'Please provide valid GST',
      status: 400,
    });
  }
  try {
    const gstDetails = await getGSTInfo(gstNo);
    res.status(200).send({ data: gstDetails });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = { getGSTDetails };
