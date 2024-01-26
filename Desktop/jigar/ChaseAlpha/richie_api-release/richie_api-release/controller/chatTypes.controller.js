const ChatType = require("../model/chatTypes.model");

const getAllTypes = async (req, res, next) => {
  try {
    const chatTypes = await ChatType.find();
    return res.status(200).send({
      success: true,
      message: "messages types",
      data: chatTypes,
    });
  } catch (e) {
    console.log(e);
    next(e);
  }
};

const createType = async (req, res, next) => {
  const chatTypeBody = req.body;
  try {
    const chatType = new ChatType(chatTypeBody);
    chatType.save();
    return res.status(200).send({
      success: true,
      message: "messages types created successfully",
      data: chatType,
    });
  } catch (e) {
    console.log(e);
    next(e);
  }
};

module.exports = {
  getAllTypes: getAllTypes,
  createType: createType,
};
