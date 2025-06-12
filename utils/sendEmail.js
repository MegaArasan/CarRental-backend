const nodemailer = require("nodemailer");
const {google} = require("googleapis");
//require("dotenv").config();

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
)

oAuth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

module.exports = async (email, link, username) => {
  try {
    const access_token = await oAuth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.MY_GMAIL,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: access_token.token,
      },
    });

    await transporter.sendMail({
      from: "King Cars",
      to: email,
      subject: "Link to reset password",
      html: `<h1>Hello ${username}</h1>
          <p>You are requested to change password</p>
          <p>Please click on the following link or paste this in your browser to complete the process of reset password</p>
            <a href=${link} target=_parent>Click to reset password</a>
            <p>Automatically it redirected you to resetpassword page</p>`,
    });
  } catch (error) {
    console.log(Error);
  }
};
