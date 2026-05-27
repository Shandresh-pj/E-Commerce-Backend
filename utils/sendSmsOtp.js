const axios = require("axios");

const sendSmsOtp = async (mobile, otp) => {

  try {

    console.log("Mobile:", mobile);
    console.log("OTP:", otp);

    const response = await axios.post(
      "https://www.fast2sms.com/dev/bulkV2",
      {
        route: "otp",
        variables_values: otp,
        numbers: mobile,
      },
      {
        headers: {
          authorization: "2GFtIQvemJB1z8ZT9EOqK7CAfu0kPw3XgRSsa6rnxpo4cyWhNY1TyxEF7oGOhnpi5fdLJvBUsQcIt3eN",
          "Content-Type": "application/json"
        }
      }
    );

    console.log(response.data);

  } catch (err) {

    console.log(
      "FAST2SMS ERROR:",
      err.response?.data || err.message
    );

    throw err;

  }

};

module.exports = sendSmsOtp;