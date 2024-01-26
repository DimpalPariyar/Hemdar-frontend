const axios = require("axios");
require("dotenv").config();

// async function SendWhatsappMessage(numbers, message) {
//     const baseUrl = 'https://api.authkey.io/request';
//     const authkey = process.env.WHATSAPP_AUTHKEY;
//     const country_code = '91';
//     const wid ='333';
//     for (const number of numbers) {
//       try {
//         const response = await axios.get(baseUrl, {
//           params: {
//             authkey: authkey,
//             mobile: number,
//             country_code: country_code,
//             wid: wid,
//             // name: '', // Add recipient name if needed
//             otp: message, // Use the message parameter to send the OTP
//           },
//         });
  
//         console.log(`Message sent to ${number}: ${response.data}`);
//       } catch (error) {
//         console.error(`Error sending message to ${number}: ${error.message}`);
//       }
//     }
//   }

  async function SendSmsMessage(number, message) {
    const baseUrl = 'https://api.authkey.io/request';
    const authkey = process.env.WHATSAPP_AUTHKEY;
    const country_code = '91';
    const wid ='10139';
      try {
        const response = await axios.get(baseUrl, {
          params: {
            authkey: 'b3700e55f1a8a892',
            mobile: number,
            country_code: country_code,
            sid: wid,
            company: 'Richie', // Add recipient name if needed
            var: message, // Use the message parameter to send the OTP
          },
        });
        console.log(`Message sent to ${number}: ${response.data}`);
        return response.data
      } catch (error) {
        console.error(`Error sending message to ${number}: ${error.message}`);
      }
  }

  async function SendEmailOtp(email, message) {
    const baseUrl = 'https://api.authkey.io/request';
    const authkey = process.env.SMS_AUTHKEY;
    const country_code = '91';
    // const wid ='9410';
      try {
        const response = await axios.get(baseUrl, {
          params: {
            authkey: authkey,
            email: email,
            country_code: country_code,
            mid:1001,
            // company: 'Richie', // Add recipient name if needed
            // otp: message, // Use the message parameter to send the OTP
          },
        });
        console.log(`Message sent to ${email}: ${response.data}`);
        return response.data
      } catch (error) {
        console.error(`Error sending message to ${number}: ${error.message}`);
      }
  }

module.exports ={
    // SendWhatsappMessage,
    SendSmsMessage,
    SendEmailOtp
}
