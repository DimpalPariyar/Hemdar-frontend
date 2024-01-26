const axios = require("axios");
require("dotenv").config();

async function createBranchlink(advicedata) {
    const baseUrl = 'https://api2.branch.io/v1/url';
    const authkey = process.env.BRANCH_IO_KEY;
    const data = {
      data: {
        $canonical_identifier: "content/123",
        $og_title: "Title from Deep Link",
        $og_description: "Description from Deep Link",
        $og_image_url: "http://www.lorempixel.com/400/400/",
        $desktop_url: "http://www.example.com",
        custom_boolean: true,
        custom_integer: 1243,
        custom_string: "everything",
        adviceId: advicedata._id,
        custom_array: [1, 2, 3, 4, 5, 6],
        custom_object: {
          random: "dictionary",
        },
      },
      channel: "facebook",
      feature: "onboarding",
      campaign: "new product",
      stage: "new user",
      tags: ["one", "two", "three"],
      branch_key: authkey,
    };
      try {
        const response = await axios.post(baseUrl, data);
        console.log(`Message sent to ${number}: ${response.data}`);
        return response.data
      } catch (error) {
        console.error(`Error sending message to ${number}: ${error.message}`);
      }
  }

  module.exports ={
    createBranchlink
}