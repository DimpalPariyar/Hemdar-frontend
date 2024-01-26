const axios = require("axios");
const jwt = require("jsonwebtoken");
require("dotenv").config();

function generateZoomToken() {
    const zoomApiKey = process.env.ZOOM_KEY;
    const zoomApiSecret = process.env.ZOOM_SECRET;
    const payload = {
        iss: zoomApiKey,
        exp: ((new Date()).getTime() + 5000)
    };
    return  jwt.sign(payload, zoomApiSecret);
}
async function getMeetingLink(meeting) {
    const requestBody = {
        topic: meeting.name,
        type: 5,
        start_time: meeting.dateTime,
        duration: 60,
        timezone: "IN"
    };
    
    const headers = {
        "Authorization": "Bearer " + generateZoomToken(),
        "Content-Type": "application/json"
    };

    try {
        const response = await axios.post("https://api.zoom.us/v2/users/me/webinars", requestBody, { headers });
        return {link:response.data.join_url,id:response.data.id}
        
    } catch (error) {
        console.error(error);
    }
}


async function deleteWebinar(webinarId){
    const headers = {
        "Authorization": "Bearer " + generateZoomToken(),
        "Content-Type": "application/json"
    };
    try{
       axios.delete(`https://api.zoom.us/v2/webinars/${webinarId}`, { headers });
    }catch(e){
        console.log(e);
    }

}
module.exports = {getMeetingLink,deleteWebinar}