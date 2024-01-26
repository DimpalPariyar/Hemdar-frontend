const axios = require('axios');
require('dotenv').config();

const sendNotification = async (userIds, title, body, dataId,url,
  notificationImage,chat, next) => {

  if (userIds && userIds.length > 0) {
    const notificationdata = {}
    notificationdata.adviceId = dataId
    if(chat !== undefined){
      notificationdata.chat = true
    }
    const options = {
      method: 'POST',
      url: 'https://onesignal.com/api/v1/notifications',
      headers: {
        accept: 'application/json',
        Authorization: 'Basic ' + process.env.ONE_SIGNAL_KEY,
        'content-type': 'application/json',
      },
      data: {
        app_id: '2207c981-f639-4b8c-8316-f579c1be0182',
        include_external_user_ids: userIds,
        data: notificationdata,
        url:url,
        big_picture:notificationImage,
        large_icon:notificationImage,
        android_accent_color: "3856EE",
        contents: {
          en: body,
        },
        headings: {
          en: title,
        },
      },
    };

    try {
      
      return await axios.request(options);
    } catch (error) {
      if (error.response.status === 400) {
        // handle error response with status code 400
        console.error(error.response.data);
      } else {
        // handle other error responses
        console.error(error.message);
      }
      if (next) {
        return next(error);
      } else {
        throw new Error(error);
      }
    }
  } else {
    return null;
  }
};

module.exports = {
  sendNotification,
};
