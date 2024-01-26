const axios = require('axios');
require("dotenv").config();

const sendService = async (message) => {
    const isTest = process.env.NODE_ENV !== "production"
    if (!isTest) {
        axios.post('https://slack.com/api/chat.postMessage', {
            channel: process.env.SLACK_CHANNEL_ID,
            text: message,
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.SLACK_API_TOKEN}`,
            },
        })
            .then((response) => {
                console.log('Slack notification sent:', response.data);
            })
            .catch((error) => {
                console.error('Failed to send Slack notification:', error);
            });
    }else{
        console.log("Not posting since its local, "+message)
    }
}

module.exports = {
    sendService
};